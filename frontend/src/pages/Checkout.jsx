import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  getAddresses,
  createAddress,
} from '../services/addressService';
import { createOrder } from '../services/orderService';
import './Checkout.css';

const TIME_SLOTS = [
  '09:00 – 12:00',
  '12:00 – 15:00',
  '15:00 – 18:00',
  '18:00 – 21:00',
];

function getMinDeliveryDate() {
  const now = new Date();

  if (now.getHours() >= 14) {
    now.setDate(now.getDate() + 1);
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function Checkout() {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    title: '',
    city: '',
    district: '',
    fullAddress: '',
    phoneNumber: '',
  });

  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState(
    TIME_SLOTS[0]
  );
  const [orderNote, setOrderNote] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0 && !orderPlaced) {
      navigate('/cart');
      return;
    }

    async function fetchAddresses() {
      try {
        const data = await getAddresses();

        setAddresses(data);

        if (data.length === 0) {
          setShowNewAddressForm(true);
        } else {
          setSelectedAddressId(data[0].id);
        }
      } catch {
        setError('Adresler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    fetchAddresses();
  }, [
    user,
    cartItems.length,
    navigate,
    orderPlaced,
  ]);

  function handleNewAddressChange(e) {
    const { name, value } = e.target;

    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSaveNewAddress(e) {
    e.preventDefault();
    setError('');

    try {
      const created = await createAddress(newAddress);

      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id);
      setShowNewAddressForm(false);

      setNewAddress({
        title: '',
        city: '',
        district: '',
        fullAddress: '',
        phoneNumber: '',
      });
    } catch {
      setError('Adres kaydedilirken bir hata oluştu.');
    }
  }

  async function handleConfirmOrder() {
    setError('');

    const minDeliveryDate = getMinDeliveryDate();

    if (!deliveryDate) {
      setError('Lütfen teslimat tarihi seçin.');
      return;
    }

    if (deliveryDate < minDeliveryDate) {
      setError(
        'Geçmiş bir tarih için teslimat seçilemez.'
      );
      return;
    }

    try {
      const orderData = {
        addressId: Number(selectedAddressId),
        deliveryDate,
        deliveryTimeSlot,
        orderNote: orderNote || null,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const createdOrder = await createOrder(orderData);

      setOrderPlaced(true);

      clearCart();

      navigate(
        `/order-confirmation/${createdOrder.orderNumber}`
      );
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          'Sipariş oluşturulurken bir hata oluştu.'
        );
      }
    }
  }

  if (loading) {
    return (
      <main className="checkout-message-page">
        <p>Sipariş bilgileri yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <span className="checkout-eyebrow">
          SİPARİŞ
        </span>

        <h1 className="checkout-title">
          Sipariş Bilgileri
        </h1>

        <p className="checkout-intro">
          Çiçeklerinizin size ulaşması için teslimat
          bilgilerinizi tamamlayın.
        </p>
      </header>

      <div className="checkout-layout">
        <section className="checkout-form-section">
          <div className="checkout-section">
            <div className="checkout-section-heading">
              <span>01</span>

              <div>
                <span className="checkout-section-eyebrow">
                  TESLİMAT
                </span>

                <h2>Teslimat Adresi</h2>
              </div>
            </div>

            {addresses.length > 0 &&
              !showNewAddressForm && (
                <div className="checkout-address-selection">
                  <label htmlFor="checkout-address">
                    Kayıtlı adresiniz
                  </label>

                  <select
                    id="checkout-address"
                    value={selectedAddressId}
                    onChange={(e) =>
                      setSelectedAddressId(e.target.value)
                    }
                    className="checkout-select"
                  >
                    {addresses.map((addr) => (
                      <option
                        key={addr.id}
                        value={addr.id}
                      >
                        {addr.title} — {addr.city}/
                        {addr.district}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="checkout-link-btn"
                    onClick={() =>
                      setShowNewAddressForm(true)
                    }
                  >
                    + Yeni adres ekle
                  </button>
                </div>
              )}

            {showNewAddressForm && (
              <form
                className="checkout-address-form"
                onSubmit={handleSaveNewAddress}
              >
                <div className="checkout-field">
                  <label htmlFor="address-title">
                    Adres Başlığı
                  </label>

                  <input
                    id="address-title"
                    type="text"
                    name="title"
                    placeholder="Ev, İş vb."
                    value={newAddress.title}
                    onChange={handleNewAddressChange}
                    required
                  />
                </div>

                <div className="checkout-field-row">
                  <div className="checkout-field">
                    <label htmlFor="address-city">
                      Şehir
                    </label>

                    <input
                      id="address-city"
                      type="text"
                      name="city"
                      placeholder="Ankara"
                      value={newAddress.city}
                      onChange={handleNewAddressChange}
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="address-district">
                      İlçe
                    </label>

                    <input
                      id="address-district"
                      type="text"
                      name="district"
                      placeholder="Çankaya"
                      value={newAddress.district}
                      onChange={handleNewAddressChange}
                      required
                    />
                  </div>
                </div>

                <div className="checkout-field">
                  <label htmlFor="address-full">
                    Açık Adres
                  </label>

                  <input
                    id="address-full"
                    type="text"
                    name="fullAddress"
                    placeholder="Mahalle, sokak, bina..."
                    value={newAddress.fullAddress}
                    onChange={handleNewAddressChange}
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="address-phone">
                    Telefon
                  </label>

                  <input
                    id="address-phone"
                    type="tel"
                    name="phoneNumber"
                    placeholder="Telefon numaranız"
                    value={newAddress.phoneNumber}
                    onChange={handleNewAddressChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="checkout-save-address-btn"
                >
                  Adresi Kaydet
                  <span>→</span>
                </button>

                {addresses.length > 0 && (
                  <button
                    type="button"
                    className="checkout-link-btn"
                    onClick={() =>
                      setShowNewAddressForm(false)
                    }
                  >
                    Vazgeç
                  </button>
                )}
              </form>
            )}
          </div>

          <div className="checkout-section">
            <div className="checkout-section-heading">
              <span>02</span>

              <div>
                <span className="checkout-section-eyebrow">
                  ZAMANLAMA
                </span>

                <h2>Teslimat Tarihi ve Saati</h2>
              </div>
            </div>

            <div className="checkout-field">
              <label htmlFor="delivery-date">
                Teslimat Tarihi
              </label>

              <input
                id="delivery-date"
                type="date"
                min={getMinDeliveryDate()}
                value={deliveryDate}
                onChange={(e) =>
                  setDeliveryDate(e.target.value)
                }
                className="checkout-select"
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="delivery-time">
                Teslimat Saat Aralığı
              </label>

              <select
                id="delivery-time"
                value={deliveryTimeSlot}
                onChange={(e) =>
                  setDeliveryTimeSlot(e.target.value)
                }
                className="checkout-select"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="checkout-section">
            <div className="checkout-section-heading">
              <span>03</span>

              <div>
                <span className="checkout-section-eyebrow">
                  NOT
                </span>

                <h2>Sipariş Notu</h2>
              </div>
            </div>

            <div className="checkout-field">
              <label htmlFor="order-note">
                İsteğe bağlı
              </label>

              <textarea
                id="order-note"
                value={orderNote}
                onChange={(e) =>
                  setOrderNote(e.target.value)
                }
                rows={4}
                placeholder="Teslimatla ilgili bir notunuz varsa yazabilirsiniz."
                className="checkout-textarea"
              />
            </div>
          </div>
        </section>

        <aside className="checkout-summary-section">
          <div className="checkout-summary-heading">
            <span>YOUR ORDER</span>
            <span>{cartItems.length} ürün</span>
          </div>

          <h2>Sipariş Özeti</h2>

          <div className="checkout-summary-items">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="checkout-summary-item"
              >
                <div className="checkout-summary-product">
                  <span className="checkout-summary-product-name">
                    {item.name}
                  </span>

                  <span className="checkout-summary-quantity">
                    {item.quantity} adet
                  </span>
                </div>

                <span className="checkout-summary-price">
                  {item.price * item.quantity} ₺
                </span>
              </div>
            ))}
          </div>

          <div className="checkout-summary-total">
            <span>Toplam</span>

            <span>{totalPrice} ₺</span>
          </div>

          {error && (
            <p className="checkout-summary-error">
              {error}
            </p>
          )}

          <button
            type="button"
            className="checkout-confirm-btn"
            onClick={handleConfirmOrder}
            disabled={
              !selectedAddressId || !deliveryDate
            }
          >
            <span>Siparişi Onayla</span>
            <span>→</span>
          </button>

          <p className="checkout-summary-note">
            Siparişinizi onayladıktan sonra sipariş
            numaranız oluşturulacaktır.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;

