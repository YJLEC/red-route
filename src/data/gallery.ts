import type { GalleryItem } from '../types/tourism'

export function makePlaceholderGallery(prefix: string, label: string): GalleryItem[] {
  return ['空间全景', '重点细节', '现场导览'].map((subject, index) => ({
    id: `${prefix}-${index + 1}`,
    label: `${label} · ${subject}`,
    caption: `${subject}图片待从可授权网络来源补充`,
    alt: `${label}${subject}图片占位`,
  }))
}
