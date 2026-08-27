import { ImageOff } from 'lucide-react'

interface PlaceholderImageProps {
  label: string
  compact?: boolean
}

export function PlaceholderImage({ label, compact = false }: PlaceholderImageProps) {
  return (
    <div className={compact ? 'image-placeholder image-placeholder--compact' : 'image-placeholder'} role="img" aria-label={`${label}图片待取得授权`}>
      <ImageOff aria-hidden="true" />
      <span>{label}</span>
      <small>图片待取得授权</small>
    </div>
  )
}
