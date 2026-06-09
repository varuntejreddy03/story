import { Prisma, PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

const retryableDatabaseErrorCodes = new Set(['P1001', 'P1002', 'P1017']);

export const isRetryableDatabaseError = (error) =>
  error instanceof Prisma.PrismaClientKnownRequestError && retryableDatabaseErrorCodes.has(error.code);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

prisma.$use(async (params, next) => {
  const maxAttempts = Number(process.env.PRISMA_RETRY_ATTEMPTS || 3);
  const baseDelayMs = Number(process.env.PRISMA_RETRY_DELAY_MS || 400);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await next(params);
    } catch (error) {
      if (!isRetryableDatabaseError(error) || attempt === maxAttempts) {
        throw error;
      }

      await wait(baseDelayMs * attempt);
    }
  }
});
