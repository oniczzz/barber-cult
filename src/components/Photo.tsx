import { useState } from 'react'
import { Scissors } from 'lucide-react'
import { photo } from '../data'

type Props = { id: string; alt: string; className?: string; eager?: boolean; sizes?: string; position?: string }

export default function Photo({ id, alt, className = '', eager = false, sizes = '(max-width: 700px) 100vw, 50vw', position }: Props) {
  const [failed, setFailed] = useState(false)
  return <div className={`photo ${className}`}>
    {failed ? <div className="photo-fallback" role="img" aria-label={alt}><Scissors size={42} strokeWidth={1} /><span>BARBER CULT</span><small>Фотография недоступна</small></div> :
      <img src={photo(id, eager ? 1600 : 900)}
        srcSet={[400, 700, 1000, 1600].map(width => `${photo(id, width)} ${width}w`).join(', ')}
        sizes={sizes} width={1200} height={1400} alt={alt} loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'} decoding="async" style={{ objectPosition: position }}
        onError={() => setFailed(true)} />}
  </div>
}
