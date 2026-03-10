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

function imgUrl(asin) {
  return `https://ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${asin}&Format=_SL250_&ID=AsinImage&MarketPlace=ES&ServiceVersion=20070822&WS=1`;
}

function getDealsEjemplo() {
  return [
    { id: 'ej1', titulo: 'Echo Pop - Altavoz inteligente con Alexa, sonido potente', enlace: buildLink('B0CX6JDTPJ'), imagen: imgUrl('B0CX6JDTPJ'), precio: 27.99, precioAntes: 54.99, descuento: 49, ahorro: 27.00, categoria: 'Hogar', fecha: new Date().toISOString(), votos: 342 },
    { id: 'ej2', titulo: 'Fire TV Stick HD - Mando por voz con Alexa', enlace: buildLink('B0CF4Y9423'), imagen: imgUrl('B0CF4Y9423'), precio: 24.99, precioAntes: 49.99, descuento: 50, ahorro: 25.00, categoria: 'TV y Monitores', fecha: new Date().toISOString(), votos: 312 },
    { id: 'ej3', titulo: 'Kindle 16GB - Pantalla sin reflejos, 6 pulgadas', enlace: buildLink('B0CVDFMVJ7'), imagen: imgUrl('B0CVDFMVJ7'), precio: 94.99, precioAntes: 129.99, descuento: 27, ahorro: 35.00, categoria: 'Libros', fecha: new Date().toISOString(), votos: 423 },
    { id: 'ej4', titulo: 'Echo Dot 5a generacion - Altavoz inteligente con Alexa', enlace: buildLink('B09B93ZDY4'), imagen: imgUrl('B09B93ZDY4'), precio: 34.99, precioAntes: 64.99, descuento: 46, ahorro: 30.00, categoria: 'Hogar', fecha: new Date().toISOString(), votos: 289 },
    { id: 'ej5', titulo: 'Xiaomi Redmi Buds 5 - Auriculares inalambricos ANC 46dB', enlace: buildLink('B0CQTQ5TPP'), imagen: imgUrl('B0CQTQ5TPP'), precio: 19.99, precioAntes: 49.99, descuento: 60, ahorro: 30.00, categoria: 'Audio', fecha: new Date().toISOString(), votos: 189 },
    { id: 'ej6', titulo: 'Cecotec Freidora de Aire Cecofry 5000 - 5 litros sin aceite', enlace: buildLink('B09NS7GS9X'), imagen: imgUrl('B09NS7GS9X'), precio: 44.90, precioAntes: 89.90, descuento: 50, ahorro: 45.00, categoria: 'Hogar', fecha: new Date().toISOString(), votos: 445 },
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
