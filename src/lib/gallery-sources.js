import variants from '../data/gallery-variants.json' with { type: 'json' };

export function galleryVisibility(rect, height, width) {
  const horizontal = rect.right > 0 && rect.left < width;
  return {
    near: horizontal && rect.bottom > -600 && rect.top < height + 600,
    visible: horizontal && rect.bottom > 0 && rect.top < height,
  };
}

export function gallerySizes(layout) {
  if (layout === 'custom-home') return '(max-width: 640px) 150px, 220px';
  if (layout === 'custom-page') return '(max-width: 393px) 66vw, (max-width: 640px) 260px, (max-width: 846px) 220px, (max-width: 1230px) 26vw, 320px';
  return '(max-width: 393px) 66vw, (max-width: 640px) 260px, (max-width: 687px) 220px, (max-width: 1218px) 32vw, 390px';
}

export function gallerySources(image, layout) {
  const entries = variants[image];
  return {
    src: image,
    srcSet: entries?.map((entry) => `${entry.src} ${entry.width}w`).join(', '),
    sizes: entries ? gallerySizes(layout) : undefined,
    mobile: entries ? undefined : image.replace(/\.webp$/, '-mobile.webp'),
  };
}
