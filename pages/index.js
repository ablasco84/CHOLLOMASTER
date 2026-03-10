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
    ? Number(deal.ahorro).toFixed(2)
    : deal.precio && deal.precioAntes
    ? (deal.precioAntes - deal.precio).toFixed(2)
    : null;
  const descuento = deal.descuento || (deal.precio && deal.precioAntes
    ? Math.round((1 - deal.precio / deal.precioAntes) * 100)
    : null);

  return (
    <a href={deal.enlace} target="_blank" rel="noopener noreferrer sponsored" className="deal-card">
      <div className="deal-img">
        {deal.imagen && !imgError ? (
          <img src={deal.imagen} alt={deal.titulo} onError={() => setImgError(true)} />
        ) : (
          <div className="deal-img-placeholder">🛍️</div>
        )}
        {descuento && <span className="badge-descuento">-{descuento}%</span>}
      </div>
      <div className="deal-body">
        <div className="deal-cat">{deal.categoria}</div>
        <div className="deal-nombre">{deal.titulo}</div>
        <div className="deal-precios">
          {deal.precio && <span className="precio-actual">{formatPrecio(deal.precio)}€</span>}
          {deal.precioAntes && <span className="precio-antes">{formatPrecio(deal.precioAntes)}€</span>}
          {ahorro && parseFloat(ahorro) > 0 && (
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
        <div className="alerta-top">
          <h2 className="alerta-titulo">
            Avísame cuando baje el precio
          </h2>
          <p className="alerta-sub">
            Dinos que producto buscas. Te avisamos por Telegram cuando baje al precio que quieres.
          </p>
          {estado === 'ok' ? (
            <div className="alerta-ok">✓ {msg}</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="alerta-form">
                <input
                  className="alerta-input"
                  type="text"
                  placeholder="Ej: iPhone 15, AirPods Pro, Samsung S24..."
                  value={producto}
                  onChange={e => setProducto(e.target.value)}
                  required
                />
                <input
                  className="alerta-input"
                  type="text"
                  placeholder="Tu @usuario de Telegram (opcional)"
                  value={telegram}
                  onChange={e => setTelegram(e.target.value)}
                />
                <button className="alerta-btn" type="submit" disabled={estado === 'loading'}>
                  {estado === 'loading' ? 'Enviando...' : 'Activar alerta gratis'}
                </button>
              </div>
              <p className="alerta-nota">Sin spam. Solo te avisamos cuando baje el precio.</p>
            </form>
          )}
        </div>
        <div className="alerta-canal">
          <div className="canal-texto">
            <div className="canal-titulo">Canal de Telegram</div>
            <div className="canal-sub">Recibe los mejores chollos directamente en Telegram</div>
          </div>
          <a href="https://t.me/chollomaster_ofertas" target="_blank" rel="noopener noreferrer" className="canal-btn">
            Unirme al canal →
          </a>
        </div>
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

  const dealsFiltrados = categoria === 'Todos' ? deals : deals.filter(d => d.categoria === categoria);

  return (
    <>
      <Head>
        <title>CholloMaster — Las mejores ofertas de Amazon</title>
        <meta name="description" content="Los mejores chollos de Amazon España actualizados automaticamente. Alertas gratis por Telegram." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo">
            Chollo<span>Master</span>
            <span className="logo-dot" />
          </a>
          <div className="header-tagline">
            Los mejores chollos de Amazon, solos.
          </div>
          <nav className="header-nav">
            <a href="#chollos" className="nav-link">Chollos</a>
            <a href="#alertas" className="nav-cta">Alertas Telegram</a>
          </nav>
        </div>
      </header>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[
            { txt: `${total || 0} chollos activos ahora mismo`, bold: true },
            { txt: 'Actualizado cada 6 horas', bold: false },
            { txt: 'Solo ofertas reales de Amazon', bold: true },
            { txt: 'Alertas gratis por Telegram', bold: false },
            { txt: 'Sin registro. Sin spam.', bold: true },
            { txt: 'Ahorra sin buscar', bold: false },
          ].concat([
            { txt: `${total || 0} chollos activos ahora mismo`, bold: true },
            { txt: 'Actualizado cada 6 horas', bold: false },
            { txt: 'Solo ofertas reales de Amazon', bold: true },
            { txt: 'Alertas gratis por Telegram', bold: false },
            { txt: 'Sin registro. Sin spam.', bold: true },
            { txt: 'Ahorra sin buscar', bold: false },
          ]).map((item, i) => (
            <span key={i} className="ticker-item">
              {item.bold ? <strong>{item.txt}</strong> : item.txt}
              <span className="ticker-sep">—</span>
            </span>
          ))}
        </div>
      </div>

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
          <h1 className="deals-titulo">
            {categoria === 'Todos' ? 'Todos los chollos' : categoria}
          </h1>
          <span className="deals-count">{dealsFiltrados.length} ofertas</span>
        </div>
        <div className="deals-grid">
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p className="loading-texto">Buscando los mejores chollos...</p>
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

      {/* COMO FUNCIONA */}
      <section className="como-funciona">
        <div className="section-inner">
          <h2 className="section-titulo">Como funciona</h2>
          <div className="pasos">
            <div className="paso">
              <div className="paso-num">01</div>
              <div className="paso-titulo">Escaneo automatico</div>
              <p className="paso-texto">Monitorizamos Amazon España cada 6 horas. Los mejores chollos aparecen solos.</p>
            </div>
            <div className="paso">
              <div className="paso-num">02</div>
              <div className="paso-titulo">Elige y ahorra</div>
              <p className="paso-texto">Filtra por categoria. Haz clic y vas directo al producto en Amazon.</p>
            </div>
            <div className="paso">
              <div className="paso-num">03</div>
              <div className="paso-titulo">Alertas por Telegram</div>
              <p className="paso-texto">Dinos que producto quieres. Te avisamos cuando baje del precio que buscas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ALERTA TELEGRAM */}
      <AlertaForm />

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">Chollo<span>Master</span></div>
          <p className="footer-afiliado">
            CholloMaster participa en el Programa de Afiliados de Amazon EU. Como afiliado de Amazon,
            obtenemos ingresos por las compras realizadas a traves de nuestros enlaces.
            Esto no supone ningun coste adicional para ti.
          </p>
        </div>
      </footer>
    </>
  );
}
