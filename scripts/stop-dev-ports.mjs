import { execFileSync, execSync } from 'node:child_process';
import os from 'node:os';

const ports = [3000, 3001, 5000];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

if (os.platform() === 'win32') {
  const command = `
    $ports = @(${ports.join(',')});
    $deadline = (Get-Date).AddSeconds(10);

    do {
      $found = $false;

      foreach ($port in $ports) {
        $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue;
        foreach ($connection in $connections) {
          $found = $true;
          if ($connection.OwningProcess) {
            Stop-Process -Id $connection.OwningProcess -Force -ErrorAction SilentlyContinue;
          }
        }
      }

      if ($found) {
        Start-Sleep -Milliseconds 350;
      }
    } while ($found -and (Get-Date) -lt $deadline);

    $remaining = @();
    foreach ($port in $ports) {
      $remaining += Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue;
    }

    if ($remaining.Count -gt 0) {
      $remaining | Select-Object LocalAddress,LocalPort,State,OwningProcess | Format-Table | Out-String | Write-Error;
      exit 1;
    }

    exit 0;
  `;

  try {
    execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', command], {
      stdio: 'inherit'
    });
  } catch {
    // Some Windows process trees return a non-zero status after listeners are killed.
  }
} else {
  const deadline = Date.now() + 10_000;
  let found = false;

  do {
    found = false;

    for (const port of ports) {
      try {
        const pids = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' })
          .split(/\s+/)
          .filter(Boolean);

        for (const pid of pids) {
          found = true;
          process.kill(Number(pid), 'SIGKILL');
        }
      } catch {
        // No process is listening on this port.
      }
    }

    if (found) await sleep(350);
  } while (found && Date.now() < deadline);
}

console.log(`Cleared STORY dev ports: ${ports.join(', ')}`);
