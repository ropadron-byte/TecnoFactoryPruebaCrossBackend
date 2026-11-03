import { imgUrl } from '../api/client'

export default function Cover({ imagen, alt = '', className = '' }) {
  if (imagen?.url) {
    return <img className={`tf-cover ${className}`} src={imgUrl(imagen.url)} alt={alt} loading="lazy" />
  }
  return <div className={`tf-cover tf-cover-empty ${className}`} aria-hidden="true">TF</div>
}

export const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
