import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Email veya şifre hatalı.');
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
            Çiçeklerin
            <br />
            dünyasına
            <br />
            hoş geldin.
          </h1>

          <p className="auth-description">
            Özel anlarınız için seçtiğiniz çiçekleri
            keşfetmeye ve siparişlerinizi yönetmeye
            devam edin.
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
              <label htmlFor="login-email">Email</label>

              <input
                id="login-email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Şifre</label>

              <input
                id="login-password"
                type="password"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              <span>
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </span>
              <span>→</span>
            </button>

            <div className="auth-switch">
              <span>Henüz hesabın yok mu?</span>
              <Link to="/register">Kayıt ol</Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Login;