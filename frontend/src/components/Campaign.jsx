import './Campaign.css';

function Campaign() {
  return (
    <section className="campaign">
      <div className="campaign-content">
        <h2 className="campaign-title">Sevdiklerinize Bugün Bir Çiçek Gönderin</h2>
        <p className="campaign-text">
          Aynı gün teslimat seçenekleriyle, özel günlerinizi unutmayın.
        </p>
        <button className="campaign-cta">Hemen Sipariş Ver</button>
      </div>
    </section>
  );
}

export default Campaign;