import { useRef, useState } from 'react'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 2

interface Props {
  currentUrl?: string | null
  onChange: (file: File | null) => void
  error?: string
}

export default function ImageUpload({ currentUrl, onChange, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [localError, setLocalError] = useState('')

  function handleFile(file: File) {
    setLocalError('')
    if (!ALLOWED_TYPES.includes(file.type)) {
      setLocalError('Solo se permiten imágenes JPG, PNG o WEBP')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setLocalError(`La imagen no puede superar ${MAX_SIZE_MB}MB`)
      return
    }
    setPreview(URL.createObjectURL(file))
    onChange(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleRemove() {
    setPreview(null)
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const displayUrl = preview ?? currentUrl

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Imagen del producto</label>

      {displayUrl ? (
        <div className="relative w-full aspect-square max-w-[180px]">
          <img src={displayUrl} alt="Vista previa" className="w-full h-full object-cover rounded-xl border border-gray-200" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm leading-none hover:bg-red-600"
            aria-label="Quitar imagen"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`w-full aspect-video max-h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition
            ${localError || error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
        >
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span className="text-sm text-gray-500">Toca para subir imagen</span>
          <span className="text-xs text-gray-400">JPG, PNG, WEBP · máx. 2MB</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      {(localError || error) && (
        <p className="text-sm text-red-600">{localError || error}</p>
      )}
    </div>
  )
}
