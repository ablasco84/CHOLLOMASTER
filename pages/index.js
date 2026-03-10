import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const CATEGORIAS = ['Todos', 'Moviles', 'TV y Monitores', 'Audio', 'Informatica', 'Hogar', 'Gaming', 'Moda', 'Libros'];

function formatTiempo(fecha) {
  try {
    const diff = Math.floor((Date.now() - new Date(fecha)) / 60000);
    if (diff < 60) return `Hace ${diff}m`;
    if (diff < 1440) return `Hace ${Math.floor(diff / 60)}h`;
    return `Hace ${Math.floor(diff / 1440)}d`;
  } catch { return ''; }
}

function formatPrecio(n) {
  if (!n) return null;
  return Number(n).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function DealCard({ deal }) {
  const [imgError, setImgError] = useState(false);
  const ahorro = deal.ahorro
    ? deal.ahorro.toFixed(2)
    : deal.precio && deal.precioAntes
    ? (deal.precioAntes - deal.precio).toFixed(2)
    : null;

  return (
    <a
      href={deal.enlace}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="deal-card"
    >
      <div className="deal-img">
        {deal.imagen && !imgError ? (
          <img
            src={deal.imagen}
            alt={deal.titulo}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="deal-img-placeholder">🛍️</div>
        )}
        {deal.descuento && (
          <span className="badge-descuento">-{deal.descuento}%</span>
        )}
        {deal.esAmazon && (
          <span className="badge-amazon">amazon</span>
        )}
      </div>

      <div className="deal-body">
        <div className="deal-cat">{deal.categoria}</div>
        <div className="deal-nombre">{deal.titulo}</div>

        <div className="deal-precios">
          {deal.precio && (
            <span className="precio-actual">{formatPrecio(deal.precio)}€</span>
          )}
          {deal.precioAntes && (
            <span className="precio-antes">{formatPrecio(deal.precioAntes)}€</span>
          )}
          {ahorro && (
            <span className="precio-ahorro">Ahorras {ahorro}€</span>
          )}
        </div>

        <div className="deal-footer">
          <span className="deal-votos">🔥 {deal.votos}</span>
          <span className="deal-tiempo">{formatTiempo(deal.fecha)}</span>
        </div>

        <span className="deal-btn">Ver en Amazon →</span>
      </div>
    </a>
  );
}

function AlertaForm() {
  const [producto, setProducto] = useState('');
  const [telegram, setTelegram] = useState('');
  const [estado, setEstado] = useState('idle');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!producto.trim()) return;
    setEstado('loading');
    try {
      const res = await fetch('/api/alerta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ producto, telegram }),
      });
      const data = await res.json();
      setMsg(data.mensaje || 'Alerta registrada correctamente.');
      setEstado('ok');
      setProducto('');
      setTelegram('');
    } catch {
      setMsg('Error al registrar. Intentalo de nuevo.');
      setEstado('error');
    }
  }

  return (
    <section className="alerta-section" id="alertas">
      <div className="alerta-inner">
        <span className="alerta-icon">🔔</span>
        <h2 className="alerta-titulo">
          Te avisamos cuando<br /><span>baje el precio</span>
        </h2>
        <p className="alerta-sub">
          Dinos que quieres comprar y cuanto quieres pagar.
          Nosotros vigilamos 24/7 y te mandamos un mensaje cuando sea el momento.
        </p>

        {estado === 'ok' ? (
          <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '20px 28px', color: '#4ade80', fontSize: 15, marginBottom: 28 }}>
            ✓ {msg}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="alerta-form">
              <input
                className="alerta-input"
                type="text"
                placeholder="Que producto buscas? Ej: iPhone 15"
                value={producto}
                onChange={e => setProducto(e.target.value)}
                required
              />
              <button
                className="alerta-btn"
                type="submit"
                disabled={estado === 'loading'}
              >
                {estado === 'loading' ? '...' : 'Activar alerta'}
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <input
                className="alerta-input"
                style={{ maxWidth: 480, margin: '0 auto', display: 'block' }}
                type="text"
                placeholder="Tu usuario de Telegram (opcional): @tunombre"
                value={telegram}
                onChange={e => setTelegram(e.target.value)}
              />
            </div>
            <p className="alerta-nota">Sin spam. Solo te avisamos cuando baje el precio real.</p>
          </form>
        )}

        <a
          href="https://t.me/CholloMasterAlertasBot"
          target="_blank"
          rel="noopener noreferrer"
          className="telegram-link"
        >
          <span>✈</span> Unirte al canal de Telegram
        </a>
      </div>
    </section>
  );
}

export default function Home() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState('Todos');
  const [total, setTotal] = useState(0);
  const dealsRef = useRef(null);

  useEffect(() => {
    fetch('/api/deals')
      .then(r => r.json())
      .then(data => {
        setDeals(data.deals || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const dealsFiltrados = categoria === 'Todos'
    ? deals
    : deals.filter(d => d.categoria === categoria);

  const ahorroTotal = deals
    .filter(d => d.precio && d.precioAntes)
    .reduce((acc, d) => acc + (d.precioAntes - d.precio), 0);

  function scrollADeals() {
    dealsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const tickerItems = [
    { txt: 'Actualizado cada 6 horas', bold: false },
    { txt: 'Solo ofertas reales de Amazon', bold: true },
    { txt: 'Tu afiliado activo: chollomaste0e-21', bold: false },
    { txt: `${total} chollos activos ahora mismo`, bold: true },
    { txt: 'Alertas por Telegram gratuitas', bold: false },
    { txt: 'Compara precios historicos', bold: true },
  ];

  return (
    <>
      <Head>
        <title>CholloMaster — Las mejores ofertas de Amazon, solas</title>
        <meta name="description" content="CholloMaster detecta automaticamente los mejores chollos de Amazon España. Recibe alertas por Telegram cuando baje el precio del producto que quieres." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="CholloMaster — Chollos automaticos de Amazon" />
        <meta property="og:description" content="Los mejores chollos de Amazon actualizados automaticamente. Alertas por Telegram gratis." />
        <meta property="og:type" content="website" />
      </Head>

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">
            Chollo<span>Master</span>
            <span className="logo-dot" />
          </a>
          <nav className="header-nav">
            <a href="#chollos" className="nav-link">Chollos</a>
            <a href="#alertas" className="nav-link">Alertas</a>
            <a href="#alertas" className="nav-cta">Alertas gratis →</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />

        <div className="hero-badge">
          <span className="hero-badge-dot" />
          {total > 0 ? `${total} chollos activos ahora` : 'Actualizando chollos...'}
        </div>

        <h1>
          Deja de buscar.<br />
          <span className="acento">Ahorra</span> sin pensar.
        </h1>

        <p className="hero-sub">
          Nuestros agentes escanean Amazon 24 horas al dia para que
          tu no tengas que hacerlo. Solo entra, elige y ahorra.
        </p>

        <div className="hero-ctas">
          <button className="btn-primary" onClick={scrollADeals}>
            Ver chollos de hoy →
          </button>
          <a href="#alertas" className="btn-secondary">
            Activar alertas gratis
          </a>
        </div>

        <div className="hero-stats">
          <div>
            <div className="hero-stat-num">{deals.length}<span>+</span></div>
            <div className="hero-stat-label">Chollos activos</div>
          </div>
          <div>
            <div className="hero-stat-num">6<span>h</span></div>
            <div className="hero-stat-label">Frecuencia de actualizacion</div>
          </div>
          <div>
            <div className="hero-stat-num">
              {ahorroTotal > 0 ? `${Math.round(ahorroTotal)}€` : '0€'}
            </div>
            <div className="hero-stat-label">Ahorro potencial hoy</div>
          </div>
          <div>
            <div className="hero-stat-num"><span>0</span>€</div>
            <div className="hero-stat-label">Coste para ti</div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="ticker-item">
              {item.bold ? <strong>{item.txt}</strong> : item.txt}
              <span style={{ marginLeft: 32, opacity: 0.3 }}>—</span>
            </span>
          ))}
        </div>
      </div>

      {/* COMO FUNCIONA */}
      <section className="como-funciona">
        <div className="section-inner">
          <div className="section-label">Como funciona</div>
          <h2 className="section-titulo">Simplicidad radical.<br />Resultados reales.</h2>
          <div className="pasos">
            <div className="paso">
              <div className="paso-num">01</div>
              <div className="paso-titulo">Escaneo automatico</div>
              <p className="paso-texto">
                Nuestros agentes monitorizan Amazon España cada 6 horas.
                Sin que hagas nada, los mejores chollos aparecen solos.
              </p>
            </div>
            <div className="paso">
              <div className="paso-num">02</div>
              <div className="paso-titulo">Filtra y elige</div>
              <p className="paso-texto">
                Busca por categoria, ordena por descuento.
                Haz clic en el chollo que quieras y vas directo a Amazon.
              </p>
            </div>
            <div className="paso">
              <div className="paso-num">03</div>
              <div className="paso-titulo">Alertas a tu Telegram</div>
              <p className="paso-texto">
                Dinos que producto quieres. Te avisamos por Telegram
                en el momento exacto en que baje del precio que buscas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FILTROS */}
      <div className="filters-wrap" ref={dealsRef} id="chollos">
        <div className="filters-inner">
          <span className="filter-label">Filtrar:</span>
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              className={`filter-btn${categoria === cat ? ' activo' : ''}`}
              onClick={() => setCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* DEALS */}
      <section className="deals-section">
        <div className="deals-header">
          <h2 className="deals-titulo">
            {categoria === 'Todos' ? 'Todos los chollos' : categoria}
          </h2>
          <span className="deals-count">
            {dealsFiltrados.length} ofertas
          </span>
        </div>

        <div className="deals-grid">
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p className="loading-texto">Los agentes estan buscando chollos...</p>
            </div>
          )}
          {!loading && dealsFiltrados.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
          {!loading && dealsFiltrados.length === 0 && (
            <div className="loading-state">
              <p className="loading-texto">Sin chollos en esta categoria por ahora.</p>
            </div>
          )}
        </div>
      </section>

      {/* ALERTA TELEGRAM */}
      <AlertaForm />

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">Chollo<span>Master</span></div>
          <p className="footer-texto">
            Las mejores ofertas de Amazon España, detectadas automaticamente.
            Ahorra dinero cada dia sin buscar.
          </p>
          <p className="footer-afiliado">
            CholloMaster participa en el Programa de Afiliados de Amazon EU.
            Como afiliado de Amazon, obtenemos ingresos por las compras realizadas
            a traves de nuestros enlaces. Esto no supone ningun coste adicional para ti.
          </p>
        </div>
      </footer>
    </>
  );
}
