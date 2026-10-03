import { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log('Form gönderildi:', formData);
    setIsSubmitted(true);
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-content">
        <div className="contact-intro">
          <span className="contact-eyebrow">
            Birlikte tasarlayalım
          </span>

          <h2 className="contact-title">
            Bir Çiçek,
            <br />
            Bir Hikâye,
            <br />
            Bir An.
          </h2>

          <p className="contact-text">
            Özel bir gün, kişiye özel bir buket ya da
            sadece içinizden gelen güzel bir jest için
            bize ulaşabilirsiniz.
          </p>

          <div className="contact-details">
            <div className="contact-detail">
              <span className="contact-detail-label">
                E-posta
              </span>

              <span className="contact-detail-value">
                hello@bloomflowers.com
              </span>
            </div>

            <div className="contact-detail">
              <span className="contact-detail-label">
                Telefon
              </span>

              <span className="contact-detail-value">
                +90 555 000 00 00
              </span>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          {isSubmitted ? (
            <div className="contact-success">
              <span className="contact-success-mark">✓</span>

              <h3>Mesajınız bize ulaştı.</h3>

              <p>
                İlginiz için teşekkür ederiz.
                En kısa sürede sizinle iletişime geçeceğiz.
              </p>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >
              <div className="contact-field">
                <label htmlFor="name">
                  Adınız
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Adınızı yazın"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="email">
                  E-posta
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="E-posta adresiniz"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="message">
                  Mesajınız
                </label>

                <textarea
                  id="message"
                  name="message"
                  placeholder="Size nasıl yardımcı olabiliriz?"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
              >
                Mesaj Gönder
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact;