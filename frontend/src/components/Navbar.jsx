import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, ShoppingBagIcon } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsAccountOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setIsAccountOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        <span>Bloom</span>
        <small>Flowers</small>
      </Link>

      <nav className="navbar-links">
        <Link to="/">Ana Sayfa</Link>
        <Link to="/products">Ürünler</Link>
        <a href="#about">Hakkımızda</a>
        <a href="#contact">İletişim</a>
      </nav>

      <div className="navbar-actions">
        <Link
          to="/cart"
          className="navbar-icon-btn"
          aria-label="Sepet"
          title="Sepet"
        >
          <ShoppingBagIcon size={23} weight="light" />
        </Link>

        <div className="navbar-account" ref={accountRef}>
          <button
            type="button"
            className={`navbar-icon-btn navbar-account-btn ${
              isAccountOpen ? 'is-active' : ''
            }`}
            onClick={() => setIsAccountOpen((prev) => !prev)}
            aria-label="Hesap"
            aria-expanded={isAccountOpen}
            title="Hesap"
          >
            <UserIcon size={23} weight="light" />
          </button>

          {isAccountOpen && (
            <div className="navbar-account-menu">
              {user ? (
                <>
                  <div className="navbar-account-header">
                    <span className="navbar-account-label">
                      HESABIM
                    </span>
                    <span className="navbar-account-email">
                      {user.email}
                    </span>
                  </div>

                  <div className="navbar-account-links">
                    <Link
                      to="/profile"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      Hesabım
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      Siparişlerim
                    </Link>

                    {user.role === 'Admin' && (
                      <>
                        <div className="navbar-account-divider" />

                        <span className="navbar-account-label">
                          YÖNETİM
                        </span>

                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          Dashboard
                        </Link>

                        <Link
                          to="/admin/products"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          Ürünler
                        </Link>

                        <Link
                          to="/admin/categories"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          Kategoriler
                        </Link>

                        <Link
                          to="/admin/orders"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          Siparişler
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="navbar-account-divider" />

                  <button
                    type="button"
                    className="navbar-account-logout"
                    onClick={handleLogout}
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <div className="navbar-account-header">
                    <span className="navbar-account-label">
                      HESABIM
                    </span>
                    <span className="navbar-account-email">
                      Bloom Flowers'a hoş geldiniz.
                    </span>
                  </div>

                  <div className="navbar-account-links">
                    <Link
                      to="/login"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      Giriş Yap
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      Kayıt Ol
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

