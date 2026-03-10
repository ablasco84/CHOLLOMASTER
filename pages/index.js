// pages/index.js
import { useState, useEffect, useCallback } from "react";
import Head from "next/head";

const TELEGRAM_CANAL = "https://t.me/chollomaster_ofertas";
const REFRESH_MS = 5 * 60 * 1000; // 5 minutos

export default function Home() {
  const [ofertas, setOfertas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [cargando, setCargando] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [countdown, setCountdown] = useState(300);
  const [imgErrors, setImgErrors] = useState({});

  const cargarOfertas = useCallback(async (cat) => {
    try {
      const url = cat && cat !== "Todos"
        ? `/api/deals?categoria=${encodeURIComponent(cat)}&limit=40`
        : `/api/deals?limit=40`;
      const res = await fetch(url);
      const data = await res.json();
      setOfertas(data.ofertas || []);
      setCategorias(data.categorias || []);
      setUltimaActualizacion(new Date());
      setCountdown(300);
      setImgErrors({});
    } catch (err) {
      console.error("Error cargando ofertas:", err);
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    cargarOfertas(categoriaActiva);
  }, [categoriaActiva, cargarOfertas]);

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      cargarOfertas(categoriaActiva);
    }, REFRESH_MS);
    return () => clearInterval(interval);
  }, [categoriaActiva, cargarOfertas]);

  // Countdown visual
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((prev) => (prev <= 0 ? 300 : prev - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const formatCountdown = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const coloresCategoria = {
    "Tecnología": "#2563eb",
    Hogar: "#16a34a",
    Deporte: "#dc2626",
    Gaming: "#7c3aed",
    Moda: "#db2777",
    "Niños": "#f59e0b",
    "Bebé": "#ec4899",
    Supermercado: "#059669",
    Mascotas: "#8b5cf6",
    "Papelería": "#6366f1",
    Herramientas: "#ca8a04",
    Salud: "#0891b2",
  };

  return (
    <>
      <Head>
        <title>CholloMaster - Las mejores ofertas de Amazon actualizadas</title>
        <meta
          name="description"
          content="Ofertas y chollos de Amazon España actualizados cada 5 minutos. Ahorra en tecnología, hogar, deporte, gaming y más."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* HEADER - compacto */}
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <h1 className="logo">
              Chollo<span>Master</span>
            </h1>
            <p className="tagline">Ofertas de Amazon actualizadas cada 5 min</p>
          </div>
          <div className="header-right">
            <div className="refresh-badge">
              <span className="refresh-dot"></span>
              Próxima actualización: {formatCountdown(countdown)}
            </div>
            <a
              href={TELEGRAM_CANAL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-telegram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Alertas Telegram
            </a>
          </div>
        </div>
      </header>

      <main className="main">
        {/* FILTROS DE CATEGORÍA */}
        <div className="filtros-bar">
          <div className="filtros-inner">
            <button
              className={`filtro-btn ${categoriaActiva === "Todos" ? "activo" : ""}`}
              onClick={() => setCategoriaActiva("Todos")}
            >
              🔥 Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat}
                className={`filtro-btn ${categoriaActiva === cat ? "activo" : ""}`}
                onClick={() => setCategoriaActiva(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* CONTADOR DE OFERTAS */}
        <div className="ofertas-header">
          <h2 className="ofertas-titulo">
            {categoriaActiva === "Todos" ? "Todas las ofertas" : categoriaActiva}
            <span className="ofertas-count">{ofertas.length} chollos</span>
          </h2>
          {ultimaActualizacion && (
            <p className="ofertas-update">
              Actualizado: {ultimaActualizacion.toLocaleTimeString("es-ES")}
            </p>
          )}
        </div>

        {/* GRID DE OFERTAS */}
        {cargando ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Buscando chollos...</p>
          </div>
        ) : (
 <div className="ofertas-grid">
{ofertas.map((oferta) => (
<div key={oferta.id} className="oferta-card">
<div className="descuento-badge">-{oferta.descuento}%</div>
<div className="oferta-img-wrap">
{!imgErrors[oferta.id] ? (
<img
src={oferta.imagen}
alt={oferta.nombre}
className="oferta-img"
loading="lazy"
onError={() => handleImgError(oferta.id)}
/>
) : (
<div className="oferta-img-placeholder">
<span>📦</span>
</div>
)}
</div>
<span className="oferta-cat" style={{ color: coloresCategoria[oferta.categoria] || "#666" }}>
{oferta.categoria.toUpperCase()}
</span>
<h3 className="oferta-nombre">{oferta.nombre}</h3>
<div className="oferta-precios">
<span className="precio-oferta">{oferta.precioOferta.toFixed(2)}€</span>
<span className="precio-original">{oferta.precioOriginal.toFixed(2)}€</span>
<span className="precio-ahorro">Ahorras {oferta.ahorro.toFixed(2)}€</span>
</div>
<div className="oferta-footer">
<span className="oferta-votos">🔥 {oferta.votos}</span>
<span className="oferta-tiempo">{oferta.tiempoPublicado}</span>
</div>
<a
href={oferta.url}
target="_blank"
rel="noopener noreferrer"
className="oferta-cta"
style={{ display: "block", textDecoration: "none" }}
>
Ver en Amazon →
</a>
</div>
))}
</div>
)}

        {/* BANNER TELEGRAM */}
        <div className="telegram-banner">
          <div className="telegram-banner-inner">
            <div className="telegram-texto">
              <strong>¿Quieres recibir las ofertas en tu móvil?</strong>
              <p>Únete al canal de Telegram y te avisamos de cada chollo al instante</p>
            </div>
            <a
              href={TELEGRAM_CANAL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-telegram-grande"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Unirme al canal de Telegram
            </a>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p className="footer-brand">
          Chollo<span>Master</span> © {new Date().getFullYear()}
        </p>
        <p className="footer-legal">
          CholloMaster participa en el Programa de Afiliados de Amazon EU. Los precios
          y disponibilidad pueden variar. Última comprobación:{" "}
          {new Date().toLocaleDateString("es-ES")}
        </p>
      </footer>
    </>
  );
}
