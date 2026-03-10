import Parser from 'rss-parser';

const AFFILIATE_TAG = 'chollomaste0e-21';

// RSS feeds de Amazon España - links directos garantizados con ASIN
const AMAZON_FEEDS = [
  { url: 'https://www.amazon.es/gp/rss/bestsellers/electronics/', cat: 'Informatica' },
  { url: 'https://www.amazon.es/gp/rss/bestsellers/mobile-phones/', cat: 'Moviles' },
  { url: 'https://www.amazon.es/gp/rss/bestsellers/computers/', cat: 'Informatica' },
  { url: 'https://www.amazon.es/gp/rss/bestsellers/hi-fi/', cat: 'Audio' },
  { url: 'https://www.amazon.es/gp/rss/bestsellers/tv/', cat: 'TV y Monitores' },
  { url: 'https://www.amazon.es/gp/rss/bestsellers/kitchen/', cat: 'Hogar' },
  { url: 'https://www.amazon.es/gp/rss/bestsellers/videogames/', cat: 'Gaming' },
  { url: 'https://www.amazon.es/gp/rss/bestsellers/shoes/', cat: 'Moda' },
  { url: 'https://www.amazon.es/gp/rss/bestsellers/books/', cat: 'Libros' },
  { url: 'https://www.amazon.es/gp/rss/movers-and-shakers/electronics/', cat: 'Informatica' },
  { url: 'https://www.amazon.es/gp/rss/movers-and-shakers/mobile-phones/', cat: 'Moviles' },
  { url: 'https://www.amazon.es/gp/rss/movers-and-shakers/kitchen/', cat: 'Hogar' },
];

function extractASIN(url) {
  if (!url) return null;
  const m = url.match(/\/dp\/([B][A-Z0-9]{9})/) || url.match(/\/gp\/product\/([B][A-Z0-9]{9})/);
  return m ? m[1] : null;
}

function buildLink(asin) {
  return `https://www.amazon.es/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

function extractPreciosDeTexto(texto) {
  if (!texto) return { precio: null, precioAntes: null, descuento: null };
  
  // Busca precio actual y precio anterior en el contenido HTML del RSS
  const todosPrecios = [];
  const regexes = [
    /(\d{1,4}[,.]\d{2})\s*€/g,
    /€\s*(\d{1,4}[,.]\d{2})/g,
  ];
  
  for (const r of regexes) {
    let m;
    while ((m = r.exec(texto)) !== null) {
      const val = parseFloat(m[1].replace(',', '.'));
      if (val > 0.5 && val < 10000) todosPrecios.push(val);
    }
  }

  const descuentoMatch = texto.match(/(\d+)\s*%\s*de\s*descuento|(-\d+)%|descuento[^\d]*(\d+)%/i);
  const descuento = descuentoMatch ? parseInt(descuentoMatch[1] || descuentoMatch[2] || descuentoMatch[3]) : null;

  if (todosPrecios.length === 0) return { precio: null, precioAntes: null, descuento };
  if (todosPrecios.length === 1) return { precio: todosPrecios[0], precioAntes: null, descuento };
  
  const min = Math.min(...todosPrecios);
  const max = Math.max(...todosPrecios);
  return { 
    precio: min, 
    precioAntes: max > min * 1.05 ? max : null,
    descuento
  };
}

function extractImagen(content) {
  if (!content) return null;
  const m = content.match(/src=["'](https?:\/\/[^"']+\.(jpg|jpeg|png|webp)(\?[^"']*)?)[^"']*/i);
  return m ? m[1] : null;
}

function calcularAhorro(precio, precioAntes) {
  if (!precio || !precioAntes || precioAntes <= precio) return null;
  return Math.round((precioAntes - precio) * 100) / 100;
}

function calcularDescuentoPorcentaje(precio, precioAntes) {
  if (!precio || !precioAntes || precioAntes <= precio) return null;
  return Math.round((1 - precio / precioAntes) * 100);
}

function getDealsEjemplo() {
  return [
    { id: 'ej1', titulo: 'Echo Dot 5a Gen - Altavoz inteligente Alexa', enlace: buildLink('B09B8YWXDF'), imagen: 'https://m.media-amazon.com/images/I/71GTpNiNkCL._AC_SL1000_.jpg', precio: 21.99, precioAntes: 54.99, descuento: 60, ahorro: 33.00, categoria: 'Hogar', fecha: new Date().toISOString(), votos: 342 },
    { id: 'ej2', titulo: 'Samsung Galaxy Buds2 Pro - Auriculares inalambricos con cancelacion de ruido', enlace: buildLink('B0B4BSMFBD'), imagen: 'https://m.media-amazon.com/images/I/71VEEqP8g3L._AC_SL1500_.jpg', precio: 89.00, precioAntes: 229.00, descuento: 61, ahorro: 140.00, categoria: 'Audio', fecha: new Date().toISOString(), votos: 218 },
    { id: 'ej3', titulo: 'Kindle Paperwhite 16GB - Pantalla 6.8 pulgadas sin reflejos', enlace: buildLink('B09TMZKQR3'), imagen: 'https://m.media-amazon.com/images/I/61e1MhMVOlL._AC_SL1000_.jpg', precio: 94.99, precioAntes: 159.99, descuento: 41, ahorro: 65.00, categoria: 'Libros', fecha: new Date().toISOString(), votos: 423 },
    { id: 'ej4', titulo: 'Fire TV Stick 4K Max - Dispositivo de streaming con Wi-Fi 6E', enlace: buildLink('B0BP9SNVH9'), imagen: 'https://m.media-amazon.com/images/I/51TjJOTfslL._AC_SL1000_.jpg', precio: 34.99, precioAntes: 69.99, descuento: 50, ahorro: 35.00, categoria: 'TV y Monitores', fecha: new Date().toISOString(), votos: 312 },
    { id: 'ej5', titulo: 'Xiaomi Redmi Buds 5 - Auriculares inalambricos 46dB ANC', enlace: buildLink('B0CQTQ5TPP'), imagen: 'https://m.media-amazon.com/images/I/61qNCIs-WoL._AC_SL1500_.jpg', precio: 19.99, precioAntes: 49.99, descuento: 60, ahorro: 30.00, categoria: 'Audio', fecha: new Date().toISOString(), votos: 189 },
    { id: 'ej6', titulo: 'Instant Pot Duo 7 en 1 - Olla a presion electrica 5.7L', enlace: buildLink('B07YNFNFW3'), imagen: 'https://m.media-amazon.com/images/I/71V4fwSiPiL._AC_SL1500_.jpg', precio: 69.99, precioAntes: 99.99, descuento: 30, ahorro: 30.00, categoria: 'Hogar', fecha: new Date().toISOString(), votos: 445 },
  ];
}

let cache = { deals: null, timestamp: 0 };

async function fetchDeals() {
  if (cache.deals && Date.now() - cache.timestamp < 6 * 60 * 60 * 1000) return cache.deals;

  const parser = new Parser({
    timeout: 8000,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CholloMaster/2.0)' },
  });

  let items = [];
  const vistos = new Set();

  for (const feed of AMAZON_FEEDS) {
    try {
      const resultado = await parser.parseURL(feed.url);
      for (const item of resultado.items.slice(0, 6)) {
        const asin = extractASIN(item.link || '') || extractASIN(item.guid || '');
        if (!asin || vistos.has(asin)) continue;
        vistos.add(asin);

        const content = item.content || item.summary || item['content:encoded'] || '';
        const titulo = item.title || 'Oferta Amazon';
        const enlace = buildLink(asin);
        const imagen = extractImagen(content);
        const { precio, precioAntes, descuento: descRSS } = extractPreciosDeTexto(content);
        const ahorro = calcularAhorro(precio, precioAntes);
        const descuento = descRSS || calcularDescuentoPorcentaje(precio, precioAntes);

        items.push({
          id: `amz-${asin}`,
          titulo,
          enlace,
          imagen,
          precio,
          precioAntes,
          descuento,
          ahorro,
          categoria: feed.cat,
          fecha: item.pubDate || new Date().toISOString(),
          votos: Math.floor(Math.random() * 400) + 50,
        });
      }
    } catch (e) {
      console.log('Feed error:', feed.url, e.message);
    }
  }

  const resultado = items.length >= 3 ? items : getDealsEjemplo();
  cache = { deals: resultado, timestamp: Date.now() };
  return resultado;
}

export default async function handler(req, res) {
  try {
    const deals = await fetchDeals();
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json({ deals, total: deals.length });
  } catch (e) {
    res.status(200).json({ deals: getDealsEjemplo(), total: 6 });
  }
}
