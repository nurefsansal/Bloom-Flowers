import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(fullName, email, password, phoneNumber);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Bu email adresi zaten kayıtlı.');
      } else {
        setError('Kayıt sırasında bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-layout">
        <section className="auth-intro">
          <span className="auth-eyebrow">BLOOM FLOWERS</span>

          <h1 className="auth-title">
            Bloom
            <br />
            dünyasına
            <br />
            katıl.
          </h1>

          <p className="auth-description">
            Kendi Bloom hesabınızı oluşturarak
            siparişlerinizi kolayca takip edin ve
            özel anlarınız için çiçekleri keşfedin.
          </p>
        </section>

        <section className="auth-form-section">
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <p className="auth-error">
                {error}
              </p>
            )}

            <div className="auth-field">
              <label htmlFor="register-full-name">
                Ad Soyad
              </label>

              <input
                id="register-full-name"
                type="text"
                placeholder="Adınız ve soyadınız"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">
                Email
              </label>

              <input
                id="register-email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">
                Şifre
              </label>

              <input
                id="register-password"
                type="password"
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-phone">
                Telefon
              </label>

              <input
                id="register-phone"
                type="tel"
                placeholder="Telefon numaranız (opsiyonel)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              <span>
                {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
              </span>
              <span>→</span>
            </button>

            <div className="auth-switch">
              <span>Zaten hesabın var mı?</span>
              <Link to="/login">Giriş yap</Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Register;