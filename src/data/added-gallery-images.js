export const ADDED_FACTORY_IMAGES = [
  { image: '/factory/added-20261118/cutting.webp', width: 1280, height: 719, title: 'Cutting', alt: 'Fabric being laid out on the workshop cutting table' },
  { image: '/factory/added-20261118/ironing.webp', width: 1280, height: 719, title: 'Ironing', alt: 'Workshop staff pressing garment pieces at ironing stations' },
  { image: '/factory/added-20261118/packing.webp', width: 1280, height: 720, title: 'Packing', alt: 'A worker preparing garments beside stacked clothing at the packing table' },
];

export const ADDED_CUSTOM_IMAGES = [
  { image: '/custom/added-20261118/packaging-reference.webp', width: 588, height: 738, title: 'Packaging reference', alt: 'Pink drawstring garment bag with a printed paper band and example dimensions' },
  { image: '/custom/added-20261118/acrylic-badge-concept.webp', width: 883, height: 1280, title: 'AI-generated badge concept', alt: 'AI-generated acrylic-style school badge design illustration, not a manufactured product or completed order', ai: true },
];

export const ADDED_GALLERY_IMAGES = Object.fromEntries(
  [...ADDED_FACTORY_IMAGES, ...ADDED_CUSTOM_IMAGES].map((item) => [item.image, item]),
);
