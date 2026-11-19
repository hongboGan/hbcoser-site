import { ADDED_GALLERY_IMAGES } from '../data/added-gallery-images.js';
import { useGalleryLoading } from './DeferredGallery.jsx';
import { gallerySources } from '../lib/gallery-sources.js';
import './gallery-image.css';

export default function GalleryImage({ image, alt }) {
  const added = ADDED_GALLERY_IMAGES[image];
  const { load, layout } = useGalleryLoading();
  const sources = gallerySources(image, layout);
  const picture = () => (
    <picture>
      {sources.mobile && <source media="(max-width: 640px)" srcSet={sources.mobile} />}
      <img
        src={sources.src}
        srcSet={sources.srcSet}
        sizes={sources.sizes}
        alt={added?.alt || alt}
        width={added?.width}
        height={added?.height}
        loading={load ? 'eager' : 'lazy'}
        decoding="async"
        data-gallery-live=""
      />
    </picture>
  );
  return (
    <span className={`gallery-image${added ? ' gallery-image--added' : ''}`} data-gallery-image={image}>
      {picture()}
      {added?.ai && <span className="gallery-image__ai" title="AI-generated design illustration, not a completed customer order">AI concept</span>}
    </span>
  );
}
