import { useState, useRef } from 'react';
import { Upload, X, Link } from 'lucide-react';

interface ImageInputProps {
  value: string;
  onChange: (url: string) => void;
  onFileSelect?: (file: File) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageInput({ value, onChange, onFileSelect, label, placeholder = 'https://...' }: ImageInputProps) {
  const [mode, setMode] = useState<'url' | 'upload'>(value && !value.startsWith('blob:') ? 'url' : 'url');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    onChange(preview);
    onFileSelect?.(file);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-semibold text-neutral-700 text-xs">{label}</label>}

      {/* Mode toggle */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition ${
            mode === 'url' ? 'bg-neutral-900 text-white' : 'border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-900'
          }`}
        >
          <Link size={11} /> URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition ${
            mode === 'upload' ? 'bg-neutral-900 text-white' : 'border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-900'
          }`}
        >
          <Upload size={11} /> Upload
        </button>
      </div>

      {/* Input area */}
      {mode === 'url' ? (
        <input
          type="url"
          value={value?.startsWith('blob:') ? '' : value}
          onChange={e => onChange(e.target.value)}
          className="p-2.5 border border-neutral-200 rounded-lg outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-mono text-xs"
          placeholder={placeholder}
        />
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 transition hover:border-neutral-900 hover:text-neutral-900"
        >
          <Upload size={14} />
          Choose file
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => handleFile(e.target.files?.[0])}
          />
        </button>
      )}

      {/* Preview */}
      {value && (
        <div className="relative mt-1 h-20 w-28 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
          <img src={value} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" onError={e => { e.currentTarget.style.display = 'none'; }} />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-1 top-1 rounded-full bg-neutral-900/70 p-0.5 text-white transition hover:bg-red-600"
          >
            <X size={10} />
          </button>
        </div>
      )}
    </div>
  );
}
