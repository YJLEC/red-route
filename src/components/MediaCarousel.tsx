import { ChevronLeft, ChevronRight, ImageOff, Pause, Play } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { GalleryItem } from '../types/tourism'

interface MediaCarouselProps {
  items: GalleryItem[]
  compact?: boolean
  autoPlay?: boolean
  className?: string
}

export function MediaCarousel({ items, compact = false, autoPlay = true, className = '' }: MediaCarouselProps) {
  const [index, setIndex] = useState(0)
  const [manuallyPaused, setManuallyPaused] = useState(false)
  const [interactionPaused, setInteractionPaused] = useState(false)
  const [failedIds, setFailedIds] = useState<string[]>([])
  const rootRef = useRef<HTMLDivElement>(null)
  const labelId = useId()
  const count = items.length
  const paused = manuallyPaused || interactionPaused

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!autoPlay || paused || reduceMotion || count < 2) return undefined
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), 4800)
    return () => window.clearInterval(timer)
  }, [autoPlay, count, paused])

  function select(nextIndex: number) {
    setIndex((nextIndex + count) % count)
  }

  const active = items[index]
  const showSource = Boolean(active?.src && !failedIds.includes(active.id))

  return (
    <div
      ref={rootRef}
      className={`media-carousel ${compact ? 'media-carousel--compact' : ''} ${className}`.trim()}
      aria-labelledby={labelId}
      onMouseEnter={() => setInteractionPaused(true)}
      onMouseLeave={() => setInteractionPaused(false)}
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={(event) => { if (!rootRef.current?.contains(event.relatedTarget)) setInteractionPaused(false) }}
    >
      <span className="sr-only" id={labelId}>{active?.label}图片组，共 {count} 张</span>
      <div className="media-carousel__stack" aria-live={paused ? 'polite' : 'off'}>
        {items.map((item, itemIndex) => (
          <figure
            className={itemIndex === index ? 'media-slide is-active' : 'media-slide'}
            data-variant={(itemIndex % 4) + 1}
            key={item.id}
            aria-hidden={itemIndex !== index}
          >
            {item.src && !failedIds.includes(item.id) ? (
              <img src={item.src} alt={item.alt} onError={() => setFailedIds((ids) => [...ids, item.id])} />
            ) : (
              <div className="media-slide__placeholder" role="img" aria-label={item.alt}>
                <span className="media-slide__line" aria-hidden="true" />
                <ImageOff aria-hidden="true" />
                <strong>{item.label}</strong>
                <small>图片待取得授权</small>
              </div>
            )}
            <figcaption><span>{item.caption}</span>{showSource && active.credit && <small>{active.credit}</small>}</figcaption>
          </figure>
        ))}
      </div>
      {count > 1 && (
        <>
          <button className="carousel-arrow carousel-arrow--prev" type="button" onClick={() => select(index - 1)} aria-label="上一张图片"><ChevronLeft aria-hidden="true" /></button>
          <button className="carousel-arrow carousel-arrow--next" type="button" onClick={() => select(index + 1)} aria-label="下一张图片"><ChevronRight aria-hidden="true" /></button>
          <div className="carousel-controls">
            <div className="carousel-dots" aria-label="选择图片">
              {items.map((item, itemIndex) => <button key={item.id} type="button" className={itemIndex === index ? 'is-active' : ''} aria-label={`查看第 ${itemIndex + 1} 张：${item.label}`} aria-current={itemIndex === index} onClick={() => select(itemIndex)} />)}
            </div>
            <button className="carousel-pause" type="button" onClick={() => setManuallyPaused((value) => !value)} aria-label={manuallyPaused ? '继续自动播放' : '暂停自动播放'}>{manuallyPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}</button>
            <span>{index + 1} / {count}</span>
          </div>
        </>
      )}
    </div>
  )
}
