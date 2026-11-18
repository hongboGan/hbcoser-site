import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES, CONTACT, waLink } from '../data/products.js';
import { FacebookIcon, MailIcon, MenuIcon, SearchIcon, WhatsAppIcon } from './icons.jsx';

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
  const [drawer, setDrawer] = useState(false);
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(() => new URLSearchParams(search).get('search') || '');

  useEffect(() => {
    setDrawer(false);
    setSearchInput(new URLSearchParams(search).get('search') || '');
  }, [pathname, search]);

  function submitSearch(event) {
    event.preventDefault();
    const query = searchInput.trim().replace(/\s+/g, ' ');
    setSearchInput(query);
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    navigate(`/shop${query ? `?${params}` : ''}`);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setDrawer(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
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

      <header className="header">
        <div className="shell header__topline">
          <button
            type="button"
            className="header-menu-toggle"
            aria-label="Open menu"
            aria-expanded={drawer}
            onClick={() => setDrawer(true)}
          >
            <MenuIcon />
          </button>
          <Wordmark />
          <form className="header-search" role="search" action="/shop" method="get" onSubmit={submitSearch}>
            <label htmlFor="site-search" className="sr-only">Search products</label>
            <input
              id="site-search"
              name="search"
              type="search"
              placeholder="Search costumes, props and OEM styles"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <button className="header-search__submit" type="submit" aria-label="Search products">
              <SearchIcon />
            </button>
          </form>

        </div>
        <div className="shell header__inner">
          <nav className="nav" aria-label="Primary">
            <NavLink className="nav__link" to="/">
              Home
            </NavLink>
            <NavLink className="nav__link" to="/shop">
              All products
            </NavLink>
            {CATEGORIES.map((c) => (
              <NavLink key={c.slug} className="nav__link" to={`/shop/${c.slug}`}>
                {c.name}
              </NavLink>
            ))}
            <NavLink className="nav__link" to="/custom">
              Custom / OEM
            </NavLink>
            <NavLink className="nav__link" to="/factory">
              Factory
            </NavLink>
          </nav>
 
          <a className="btn btn--primary header__cta" href={waLink('HEADER')}>
            WhatsApp us
          </a>
        </div>
        <nav className="mobile-contact" aria-label="Contact options">
          <Link to="/inquiry">Request a quote</Link>
          <a href={waLink(refForPath(pathname))}><WhatsAppIcon size={18} /> WhatsApp</a>
        </nav>
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
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/shop">All products</Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to={`/shop/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
            <li>
              <Link to="/custom">Custom / OEM</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/factory">Factory</Link>
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


    </>
  );
}
