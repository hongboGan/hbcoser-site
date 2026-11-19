import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { galleryVisibility } from '../lib/gallery-sources.js';

const GalleryContext = createContext({ load: true, layout: 'factory' });
export const useGalleryLoading = () => useContext(GalleryContext);

// Reserve the existing rail dimensions. Load the whole strip just before it enters
// the viewport so horizontal animation cannot outrun native lazy-image loading.
export default function DeferredGallery({ children, className, layout = 'factory', ...props }) {
  const rail = useRef(null);
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = rail.current;
    if (!element) return undefined;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const state = galleryVisibility(element.getBoundingClientRect(), window.innerHeight, window.innerWidth);
      if (state.near) setLoad(true);
      setVisible(state.visible);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(measure); };
    const onVisibility = () => { setPageVisible(!document.hidden); schedule(); };
    onVisibility();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', onVisibility);
    const cleanup = () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    if (!('IntersectionObserver' in window)) {
      measure();
      return cleanup;
    }
    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setLoad(true); preload.disconnect(); }
    }, { rootMargin: '600px 0px' });
    const viewport = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    preload.observe(element);
    viewport.observe(element);
    return () => {
      preload.disconnect(); viewport.disconnect();
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (!load || !rail.current) return undefined;
    const images = [...rail.current.querySelectorAll('img[data-gallery-live]')];
    const checkReady = () => setReady(images.length > 0 && images.every((image) => image.complete && image.naturalWidth > 0));
    for (const image of images) {
      image.addEventListener('load', checkReady);
      image.addEventListener('error', checkReady);
    }
    checkReady();
    return () => {
      for (const image of images) {
        image.removeEventListener('load', checkReady);
        image.removeEventListener('error', checkReady);
      }
    };
  }, [load]);

  return (
    <GalleryContext.Provider value={{ load, layout }}>
      <div {...props} ref={rail} className={`${className} deferred-gallery`} data-gallery-loaded={load} data-gallery-ready={ready} data-gallery-playing={ready && visible && pageVisible}>
        {children}
      </div>
    </GalleryContext.Provider>
  );
}
