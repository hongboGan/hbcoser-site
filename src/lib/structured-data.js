import { ORIGIN } from './route-meta.js';
import { CATEGORIES, getCategory, getProduct } from '../data/products.js';
import { getPost } from '../content/blog.js';

const absolute = (image) => (image?.startsWith('http') ? image : `${ORIGIN}${image}`);

export function structuredDataForPath(pathname) {
  const clean = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const data = [];

  if (clean === '/') {
    data.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'HB Coser',
      url: `${ORIGIN}/`,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${ORIGIN}/shop?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }

  if (clean === '/shop') {
    data.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'HB Coser Catalogue',
      description: 'Kids cosplay, mascot, pet cosplay and party & event products for wholesale and OEM buyers.',
      url: `${ORIGIN}/shop`,
      hasPart: CATEGORIES.map((category) => ({
        '@type': 'CollectionPage',
        name: category.name,
        url: `${ORIGIN}/shop/${category.slug}`,
      })),
    });
  }

  const shop = clean.match(/^\/shop\/([^/]+)$/);
  if (shop) {
    const category = getCategory(shop[1]);
    if (category) data.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: category.name,
      description: category.blurb,
      url: `${ORIGIN}${clean}`,
    });
  }

  const productMatch = clean.match(/^\/product\/([^/]+)$/);
  if (productMatch) {
    const product = getProduct(productMatch[1]);
    if (product) {
      const item = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: [absolute(product.image)],
        sku: product.id,
        category: getCategory(product.category)?.name || product.category,
        brand: { '@type': 'Brand', name: 'HB Coser' },
      };
      data.push(item);
    }
  }

  const postMatch = clean.match(/^\/blog\/([^/]+)$/);
  if (postMatch) {
    const post = getPost(postMatch[1]);
    if (post) data.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      image: [absolute(post.cover)],
      author: { '@type': 'Organization', name: 'HB Coser', url: `${ORIGIN}/` },
      publisher: { '@type': 'Organization', name: 'HB Coser', url: `${ORIGIN}/` },
      mainEntityOfPage: `${ORIGIN}${clean}`,
    });
  }

  return data;
}

export function breadcrumbData(pathname) {
  const clean = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  if (clean === '/') return null;
  const parts = clean.split('/').filter(Boolean);
  const items = [{ name: 'Home', item: `${ORIGIN}/` }];
  if (parts[0] === 'product' && parts[1]) {
    items.push({ name: 'Catalogue', item: `${ORIGIN}/shop` });
    const product = getProduct(parts[1]);
    if (product) items.push({ name: product.title, item: `${ORIGIN}${clean}` });
  } else if (parts[0] === 'blog' && parts[1]) {
    items.push({ name: 'Programme notes', item: `${ORIGIN}/blog` });
    const post = getPost(parts[1]);
    if (post) items.push({ name: post.title, item: `${ORIGIN}${clean}` });
  } else if (parts[0] === 'shop' && parts[1]) {
    const category = getCategory(parts[1]);
    if (category) items.push({ name: category.name, item: `${ORIGIN}${clean}` });
  }
  if (items.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({ '@type': 'ListItem', position: index + 1, ...entry })),
  };
}
