import { ADDED_GALLERY_IMAGES } from '../data/added-gallery-images.js';
import './gallery-image.css';

export default function GalleryImage({ image, alt }) {
  const added = ADDED_GALLERY_IMAGES[image];
  return (
    <span className={`gallery-image${added ? ' gallery-image--added' : ''}`}>
      <picture>
        {!added && <source media="(max-width: 640px)" srcSet={image.replace(/\.webp$/, '-mobile.webp')} />}
        <img
          src={image}
          alt={added?.alt || alt}
          width={added?.width}
          height={added?.height}
          loading={added ? 'eager' : 'lazy'}
          decoding="async"
        />
      </picture>
      {added?.ai && <span className="gallery-image__ai" title="AI-generated design illustration, not a completed customer order">AI concept</span>}
    </span>
  );
}
