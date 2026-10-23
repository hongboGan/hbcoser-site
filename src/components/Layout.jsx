import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { CATEGORIES, CONTACT, countIn, products, waLink } from '../data/products.js';
import { FacebookIcon, MailIcon, WhatsAppIcon } from './icons.jsx';

// Shared chrome is on every page, so the tag has to follow the route rather than be fixed.
function refForPath(pathname) {
  if (pathname === '/') return 'HOME';
  if (pathname.startsWith('/product/')) return `P-${pathname.slice(9)}`;
  if (pathname.startsWith('/blog/')) return `POST-${pathname.slice(6)}`;
  if (pathname === '/blog') return 'BLOG';
  if (pathname === '/shop') return 'SHOP';
  if (pathname.startsWith('/shop/')) return `CAT-${pathname.slice(6)}`;
  if (pathname === '/custom') return 'CUSTOM';
  if (pathname === '/inquiry') return 'INQUIRY';
  if (pathname === '/about') return 'ABOUT';
  if (pathname === '/factory') return 'FACTORY';
  return 'PAGE';
}

function Wordmark() {
  return (
    <Link className="wordmark" to="/">
      HB<span> Coser</span>
    </Link>
  );
}

export default function Layout() {
  const [shopOpen, setShopOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const shopRef = useRef(null);
  const fabRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setShopOpen(false);
    setDrawer(false);
  }, [pathname]);

  // The contact bar is fixed to the bottom corner. On a narrow screen the product title sits
  // low, because the hero image comes first, so the bar can land on top of it and the page
  // reads as broken. Shrink it away only while it actually overlaps the heading — on the
  // pages where there is no collision this changes nothing. Measured on the bar, not on one
  // button, so the pair always hides together and never leaves a stranded half.
  useEffect(() => {
    const bar = fabRef.current;
    if (!bar) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const heading = document.querySelector('main h1');
      if (!heading) {
        bar.classList.remove('fab-bar--hidden');
        return;
      }
      const a = bar.getBoundingClientRect();
      const b = heading.getBoundingClientRect();
      const overlaps =
        b.bottom > a.top && b.top < a.bottom && b.right > a.left && b.left < a.right;
      bar.classList.toggle('fab-bar--hidden', overlaps);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    function onDown(e) {
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        setShopOpen(false);
        setDrawer(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <div className="season-strip" role="note">
        <div className="shell season-strip__inner">
          <span className="season-strip__mark">13</span>
          <strong>Halloween wholesale edit</strong>
          <span>Stock costumes · event props · OEM colourways</span>
          <Link to="/shop/costumes">Shop the seasonal line <span aria-hidden="true">↗</span></Link>
        </div>
      </div>

      <header className="header">
        <div className="shell header__inner">
          <Wordmark />

          <nav className="nav" aria-label="Primary">
            <div ref={shopRef} style={{ position: 'relative' }}>
              <button
                type="button"
                className="nav__link"
                aria-expanded={shopOpen}
                aria-haspopup="true"
                onClick={() => setShopOpen((v) => !v)}
              >
                Shop {shopOpen ? '▴' : '▾'}
              </button>
            </div>
            <NavLink className="nav__link" to="/shop/costumes">
              Halloween edit
            </NavLink>
            <NavLink className="nav__link" to="/custom">
              Custom / OEM
            </NavLink>
            <NavLink className="nav__link" to="/factory">
              Factory
            </NavLink>
            <NavLink className="nav__link" to="/blog">
              Notes
            </NavLink>
            <NavLink className="nav__link" to="/inquiry">
              Inquiry
            </NavLink>
          </nav>

          <Link className="btn btn--primary header__cta" to="/inquiry">
            Get a quote
          </Link>

          <button
            type="button"
            className="burger"
            aria-label="Open menu"
            aria-expanded={drawer}
            onClick={() => setDrawer(true)}
          >
            <span />
          </button>
        </div>

        {shopOpen && (
          <div className="mega">
            <div className="shell mega__grid">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} className="mega__item" to={`/shop/${c.slug}`}>
                  <strong>{c.name}</strong>
                  <em>{countIn(c.slug)} products</em>
                </Link>
              ))}
              <Link className="mega__item" to="/shop">
                <strong>All products</strong>
                <em>{products.length} references</em>
              </Link>
            </div>
          </div>
        )}
      </header>

      {drawer && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer__head">
            <Wordmark />
            <button type="button" className="drawer__close" aria-label="Close menu" onClick={() => setDrawer(false)}>
              ×
            </button>
          </div>
          <ul className="drawer__list">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to={`/shop/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
            <li>
              <Link to="/shop">All products</Link>
            </li>
            <li>
              <Link to="/shop/costumes">Halloween edit</Link>
            </li>
            <li>
              <Link to="/custom">Custom / OEM</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/factory">Factory</Link>
            </li>
            <li>
              <Link to="/blog">Programme notes</Link>
            </li>
            <li>
              <Link to="/inquiry">Inquiry</Link>
            </li>
          </ul>
          <div className="drawer__meta">
            <p>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>
            <p>
              <a href={waLink(refForPath(pathname))}>WhatsApp {CONTACT.whatsappDisplay}</a>
            </p>
            <p>
              <a href={CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer">
                Facebook {CONTACT.facebookName}
              </a>
            </p>
          </div>
        </div>
      )}

      <main id="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="shell footer__grid">
          <div>
            <Wordmark />
            <p className="mt-1" style={{ maxWidth: '32ch', fontSize: '0.92rem' }}>
              Kids, pet and party cosplay, manufactured to order for wholesale and OEM buyers.
            </p>
          </div>
          <div>
            <p className="footer__label">Shop</p>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link to={`/shop/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
              <li>
                <Link to="/shop">All products</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="footer__label">Company</p>
            <ul>
              <li>
                <Link to="/custom">Custom / OEM</Link>
              </li>
              <li>
                <Link to="/about">About us</Link>
              </li>
              <li>
                <Link to="/factory">The factory</Link>
              </li>
              <li>
                <Link to="/blog">Programme notes</Link>
              </li>
              <li>
                <Link to="/inquiry">Request a quote</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="footer__label">Contact</p>
            <ul>
              <li>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
              <li>
                <a href={waLink(refForPath(pathname))}>WhatsApp {CONTACT.whatsappDisplay}</a>
              </li>
              <li>
                <a href={CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer">
                  Facebook {CONTACT.facebookName}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="shell footer__base">
          <span>© {new Date().getFullYear()} HB Coser. All rights reserved.</span>
          <span>Wholesale &amp; OEM · Worldwide shipping</span>
        </div>
      </footer>

      <div className="fab-bar" ref={fabRef}>
        <a
          className="fb"
          href={CONTACT.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Facebook ${CONTACT.facebookName}`}
        >
          <FacebookIcon />
          <span>Facebook</span>
        </a>
        <a
          className="wa"
          href={waLink(refForPath(pathname))}
          aria-label={`WhatsApp ${CONTACT.whatsappDisplay}`}
        >
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </a>
      </div>
    </>
  );
}
