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
      <p className="checkout-loading">
        Yükleniyor...
      </p>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">
        Sipariş Bilgileri
      </h1>

      {error && (
        <p className="checkout-error">
          {error}
        </p>
      )}

      <div className="checkout-layout">
        <div className="checkout-form-section">
          <h2>Teslimat Adresi</h2>

          {addresses.length > 0 &&
            !showNewAddressForm && (
              <>
                <select
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
              </>
            )}

          {showNewAddressForm && (
            <form
              className="checkout-address-form"
              onSubmit={handleSaveNewAddress}
            >
              <input
                type="text"
                name="title"
                placeholder="Adres Başlığı (Ev, İş vb.)"
                value={newAddress.title}
                onChange={handleNewAddressChange}
                required
              />

              <input
                type="text"
                name="city"
                placeholder="Şehir"
                value={newAddress.city}
                onChange={handleNewAddressChange}
                required
              />

              <input
                type="text"
                name="district"
                placeholder="İlçe"
                value={newAddress.district}
                onChange={handleNewAddressChange}
                required
              />

              <input
                type="text"
                name="fullAddress"
                placeholder="Açık Adres"
                value={newAddress.fullAddress}
                onChange={handleNewAddressChange}
                required
              />

              <input
                type="tel"
                name="phoneNumber"
                placeholder="Telefon"
                value={newAddress.phoneNumber}
                onChange={handleNewAddressChange}
                required
              />

              <button
                type="submit"
                className="checkout-save-address-btn"
              >
                Adresi Kaydet
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

          <h2>Teslimat Tarihi ve Saati</h2>

          <input
            type="date"
            min={getMinDeliveryDate()}
            value={deliveryDate}
            onChange={(e) =>
              setDeliveryDate(e.target.value)
            }
            className="checkout-select"
            required
          />

          <select
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

          <h2>Sipariş Notu (opsiyonel)</h2>

          <textarea
            value={orderNote}
            onChange={(e) =>
              setOrderNote(e.target.value)
            }
            rows={3}
            placeholder="Teslimatla ilgili bir notunuz varsa yazabilirsiniz"
            className="checkout-textarea"
          />
        </div>

        <div className="checkout-summary-section">
          <h2>Sipariş Özeti</h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="checkout-summary-item"
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <span>
                {item.price * item.quantity} ₺
              </span>
            </div>
          ))}

          <div className="checkout-summary-total">
            <span>Toplam</span>
            <span>{totalPrice} ₺</span>
          </div>

          <button
            className="checkout-confirm-btn"
            onClick={handleConfirmOrder}
            disabled={
              !selectedAddressId || !deliveryDate
            }
          >
            Siparişi Onayla
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;