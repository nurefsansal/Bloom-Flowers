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
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Backend hazır olmadığı için şimdilik sadece konsola yazdırıyoruz.
    console.log('Form gönderildi:', formData);
    setIsSubmitted(true);
  }

  return (
    <section className="contact" id="contact">
      <h2 className="contact-title">Bize Ulaşın</h2>

      {isSubmitted ? (
        <p className="contact-success">Mesajınız için teşekkürler, en kısa sürede dönüş yapacağız.</p>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Adınız"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-posta"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Mesajınız"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            required
          />
          <button type="submit" className="contact-submit-btn">Gönder</button>
        </form>
      )}
    </section>
  );
}

export default Contact;