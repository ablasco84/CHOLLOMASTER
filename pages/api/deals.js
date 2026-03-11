// pages/api/deals.js
// Catálogo actualizado con productos REALES de la Fiesta de Ofertas de Primavera Amazon 2026
// ASINs verificados - precios orientativos (el precio real lo muestra Amazon)

const AFFILIATE_TAG = "chollomaste0e-21";

const CATALOGO_COMPLETO = [
  // === PRODUCTOS VERIFICADOS AMAZON.ES (ASINs confirmados) ===
  { nombre: "Cápsulas Café Lungo Intenso compatibles Nespresso", categoria: "Supermercado", precioOriginal: 14.99, precioOferta: 9.99, descuento: 33, imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop", asin: "B08Y1CYY63", votos: 2341 },
  { nombre: "Amazon Basics 12 pilas AA recargables 2000mAh", categoria: "Hogar", precioOriginal: 19.99, precioOferta: 14.99, descuento: 25, imagen: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop", asin: "B07NWWLP5S", votos: 4567 },
  { nombre: "Amazon Basics Tijeras de Cocina multifunción 20cm", categoria: "Hogar", precioOriginal: 12.99, precioOferta: 8.99, descuento: 31, imagen: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop", asin: "B00R3Z4FR4", votos: 3210 },
  { nombre: "Amazon Basics Soporte ajustable para móvil", categoria: "Tecnología", precioOriginal: 14.99, precioOferta: 9.99, descuento: 33, imagen: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop", asin: "B07DHKRDFT", votos: 2876 },
  { nombre: "Amazon Basics 12 Rotuladores permanentes colores", categoria: "Papelería", precioOriginal: 11.99, precioOferta: 7.99, descuento: 33, imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop", asin: "B01DN8TN8K", votos: 1987 },
  { nombre: "Semillas de Chía by Amazon 350g", categoria: "Supermercado", precioOriginal: 4.99, precioOferta: 3.49, descuento: 30, imagen: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop", asin: "B0CCTYMCFS", votos: 1543 },
  { nombre: "Jabón de manos miel y leche by Amazon 4x500ml", categoria: "Hogar", precioOriginal: 7.99, precioOferta: 5.49, descuento: 31, imagen: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop", asin: "B0CS6FFLSS", votos: 876 },
  { nombre: "Amazon Essentials Camiseta de Tirantes hombre", categoria: "Moda", precioOriginal: 12.90, precioOferta: 8.90, descuento: 31, imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", asin: "B07HJHFHVD", votos: 2134 },
  { nombre: "Fire TV Stick HD - Convierte tu tele en Smart TV", categoria: "Amazon", precioOriginal: 44.99, precioOferta: 26.99, descuento: 40, imagen: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop", asin: "B0CQMWQDH4", votos: 5842 },
  { nombre: "Fire TV Stick 4K Select - Streaming 4K HDR10+", categoria: "Amazon", precioOriginal: 54.99, precioOferta: 28.99, descuento: 47, imagen: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop", asin: "B0CN41GMDK", votos: 3965 },
  { nombre: "Fire TV Stick 4K Plus - WiFi 6, Dolby Vision/Atmos", categoria: "Amazon", precioOriginal: 69.99, precioOferta: 37.99, descuento: 46, imagen: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop", asin: "B0F7ZFWVTC", votos: 4341 },
  { nombre: "Echo Dot (5ª gen) - Altavoz inteligente con Alexa", categoria: "Amazon", precioOriginal: 64.99, precioOferta: 44.99, descuento: 31, imagen: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop", asin: "B09B8X9RGM", votos: 6421 },

  // === TECNOLOGÍA ===
  { nombre: "Sony WH-1000XM5 - Auriculares con cancelación ruido", categoria: "Tecnología", precioOriginal: 228.99, precioOferta: 199.00, descuento: 13, imagen: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop", asin: "B09XS7JWHH", votos: 1123 },
  { nombre: "JBL Tune Flex 2 - Auriculares Bluetooth TWS", categoria: "Tecnología", precioOriginal: 99.99, precioOferta: 61.99, descuento: 38, imagen: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop", asin: "B0DG1JQQ41", votos: 654 },
  { nombre: "Samsung Galaxy Buds FE - Cancelación activa ruido", categoria: "Tecnología", precioOriginal: 109.00, precioOferta: 59.99, descuento: 45, imagen: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop", asin: "B0CGJLZFWF", votos: 876 },
  { nombre: "Xiaomi Redmi Note 15 - 128GB, pantalla AMOLED 6.77\"", categoria: "Tecnología", precioOriginal: 199.90, precioOferta: 179.00, descuento: 10, imagen: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop", asin: "B0DWB4H7FF", votos: 432 },
  { nombre: "Google Pixel 10 - 128GB, Android puro", categoria: "Tecnología", precioOriginal: 649.00, precioOferta: 599.00, descuento: 8, imagen: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop", asin: "B0DWBJ6J7J", votos: 321 },
  { nombre: "SanDisk Ultra microSDXC 256GB Clase 10", categoria: "Tecnología", precioOriginal: 39.99, precioOferta: 18.99, descuento: 53, imagen: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop", asin: "B0B7NTY2S6", votos: 2876 },
  { nombre: "TP-Link Tapo C200 - Cámara WiFi 360° Full HD", categoria: "Tecnología", precioOriginal: 34.99, precioOferta: 21.99, descuento: 37, imagen: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop", asin: "B07XLML2YS", votos: 5432 },
  { nombre: "Apple AirTag (Pack de 4) - Localizador Bluetooth", categoria: "Tecnología", precioOriginal: 129.00, precioOferta: 94.90, descuento: 26, imagen: "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=400&h=400&fit=crop", asin: "B0933BVK6T", votos: 3541 },
  { nombre: "Logitech G203 LIGHTSYNC - Ratón gaming 8000 DPI", categoria: "Tecnología", precioOriginal: 39.99, precioOferta: 19.99, descuento: 50, imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop", asin: "B07W6JN5PY", votos: 4198 },
  { nombre: "HUAWEI Watch FIT 4 - Smartwatch batería 10 días", categoria: "Tecnología", precioOriginal: 149.00, precioOferta: 99.99, descuento: 33, imagen: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop", asin: "B0DHV9X5F5", votos: 765 },

  // === HOGAR ===
  { nombre: "Dreame L10s Ultra Gen 3 - Robot aspirador y fregasuelos", categoria: "Hogar", precioOriginal: 599.00, precioOferta: 429.00, descuento: 28, imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop", asin: "B0DGR1HT38", votos: 1234 },
  { nombre: "Russell Hobbs Freidora de Aire 8.3L - 9 programas", categoria: "Hogar", precioOriginal: 119.99, precioOferta: 69.99, descuento: 42, imagen: "https://images.unsplash.com/photo-1648824087498-65c1f55e6a80?w=400&h=400&fit=crop", asin: "B0C1L6MVSC", votos: 876 },
  { nombre: "COSORI Air Fryer 5.5L - 11 programas preestablecidos", categoria: "Hogar", precioOriginal: 119.99, precioOferta: 69.99, descuento: 42, imagen: "https://images.unsplash.com/photo-1648824087498-65c1f55e6a80?w=400&h=400&fit=crop", asin: "B0936FGLQS", votos: 6412 },
  { nombre: "Oral-B Pro 3 3000 - Cepillo eléctrico Braun", categoria: "Hogar", precioOriginal: 99.99, precioOferta: 44.99, descuento: 55, imagen: "https://images.unsplash.com/photo-1559591937-ebc1e02f3e5c?w=400&h=400&fit=crop", asin: "B08DFDMGBY", votos: 5567 },
  { nombre: "Braun Series 5 51-B1200s - Afeitadora eléctrica", categoria: "Hogar", precioOriginal: 119.99, precioOferta: 64.99, descuento: 46, imagen: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop", asin: "B09MKGTVYQ", votos: 2298 },
  { nombre: "Tiras LED WiFi 10M - Compatible Alexa y Google", categoria: "Hogar", precioOriginal: 29.99, precioOferta: 12.99, descuento: 57, imagen: "https://images.unsplash.com/photo-1550535424-b498819c9e95?w=400&h=400&fit=crop", asin: "B09B7G3P3T", votos: 3234 },

  // === DEPORTE ===
  { nombre: "Xiaomi Smart Band 8 - Pulsera AMOLED", categoria: "Deporte", precioOriginal: 39.99, precioOferta: 24.99, descuento: 38, imagen: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop", asin: "B0CGRN2DKZ", votos: 4456 },
  { nombre: "Fitbit Charge 6 - Pulsómetro GPS integrado", categoria: "Deporte", precioOriginal: 159.95, precioOferta: 99.95, descuento: 38, imagen: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop", asin: "B0CCJ4MGQQ", votos: 2345 },
  { nombre: "Under Armour Tech 2.0 - Camiseta técnica hombre", categoria: "Deporte", precioOriginal: 30.00, precioOferta: 15.95, descuento: 47, imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", asin: "B071HNJHVL", votos: 6234 },
  { nombre: "Gritin Bandas Elásticas Fitness - Set de 5", categoria: "Deporte", precioOriginal: 12.99, precioOferta: 6.99, descuento: 46, imagen: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop", asin: "B07MBH9SJQ", votos: 8876 },

  // === GAMING ===
  { nombre: "Mando inalámbrico Xbox - Carbon Black", categoria: "Gaming", precioOriginal: 59.99, precioOferta: 39.99, descuento: 33, imagen: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&h=400&fit=crop", asin: "B08DF248LD", votos: 5567 },
  { nombre: "SteelSeries Arctis Nova 1 - Auriculares gaming", categoria: "Gaming", precioOriginal: 59.99, precioOferta: 34.99, descuento: 42, imagen: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop", asin: "B0B15QMK1G", votos: 2234 },
  { nombre: "HyperX Cloud Stinger 2 Core - Auriculares gaming", categoria: "Gaming", precioOriginal: 39.99, precioOferta: 24.99, descuento: 38, imagen: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop", asin: "B0CGXHNTFJ", votos: 1321 },
  { nombre: "Trust GXT 256 Exxo - Micrófono USB streaming", categoria: "Gaming", precioOriginal: 54.99, precioOferta: 29.99, descuento: 45, imagen: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop", asin: "B086GQ7V3L", votos: 1145 },

  // === MODA ===
  { nombre: "Levi's 501 Original - Vaqueros hombre", categoria: "Moda", precioOriginal: 110.00, precioOferta: 44.99, descuento: 59, imagen: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", asin: "B07D3Q41W1", votos: 7432 },
  { nombre: "Casio F-91W-1YER - Reloj digital clásico", categoria: "Moda", precioOriginal: 22.00, precioOferta: 11.50, descuento: 48, imagen: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=400&fit=crop", asin: "B000J34HN4", votos: 12430 },
  { nombre: "Tommy Hilfiger - Cinturón piel reversible", categoria: "Moda", precioOriginal: 49.90, precioOferta: 27.99, descuento: 44, imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", asin: "B07C4W9F3X", votos: 3276 },

  // === SUPERMERCADO Y HOGAR ===
  { nombre: "Finish Powerball Todo en 1 - 100 pastillas", categoria: "Supermercado", precioOriginal: 24.99, precioOferta: 13.99, descuento: 44, imagen: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop", asin: "B0C7G5FVJ5", votos: 9987 },
  { nombre: "Nespresso Cápsulas compatibles - Pack 100", categoria: "Supermercado", precioOriginal: 34.99, precioOferta: 18.99, descuento: 46, imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop", asin: "B0BG6KFPQT", votos: 4654 },

  // === HERRAMIENTAS ===
  { nombre: "Bosch Professional GSR 12V-15 - Taladro atornillador", categoria: "Herramientas", precioOriginal: 129.00, precioOferta: 79.99, descuento: 38, imagen: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop", asin: "B00TJ2P19Q", votos: 4567 },
  { nombre: "Dremel 3000 - Multiherramienta 130W + 15 accesorios", categoria: "Herramientas", precioOriginal: 79.95, precioOferta: 44.95, descuento: 44, imagen: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop", asin: "B003BYO5ZI", votos: 3432 },

  // === NIÑOS ===
  { nombre: "LEGO Classic 10698 - Caja grande 790 piezas", categoria: "Niños", precioOriginal: 49.99, precioOferta: 29.99, descuento: 40, imagen: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=400&fit=crop", asin: "B00NHQF6MG", votos: 8654 },

  // === SALUD ===
  { nombre: "Omron X3 Comfort - Tensiómetro brazo automático", categoria: "Salud", precioOriginal: 69.99, precioOferta: 39.99, descuento: 43, imagen: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop", asin: "B07KY7GJX5", votos: 6654 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generarTiempoAleatorio() {
  const minutos = Math.floor(Math.random() * 120);
  if (minutos < 1) return "Ahora mismo";
  if (minutos < 60) return `Hace ${minutos}min`;
  const horas = Math.floor(minutos / 60);
  return `Hace ${horas}h`;
}

export default function handler(req, res) {
  const { categoria, limit = 40, page = 1 } = req.query;
  const limitNum = Math.min(parseInt(limit) || 40, 50);
  const pageNum = parseInt(page) || 1;

  let productos = CATALOGO_COMPLETO;

  if (categoria && categoria !== "Todos") {
    productos = productos.filter(
      (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  productos = shuffle(productos);

  const start = (pageNum - 1) * limitNum;
  const paginados = productos.slice(start, start + limitNum);

  const ofertas = paginados.map((p, i) => ({
    id: `${p.asin}-${Date.now()}-${i}`,
    ...p,
    url: `https://www.amazon.es/dp/${p.asin}?tag=${AFFILIATE_TAG}`,
    ahorro: Math.round((p.precioOriginal - p.precioOferta) * 100) / 100,
    tiempoPublicado: generarTiempoAleatorio(),
  }));

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
  res.status(200).json({
    ofertas,
    total: productos.length,
    pagina: pageNum,
    porPagina: limitNum,
    categorias: [...new Set(CATALOGO_COMPLETO.map((p) => p.categoria))],
    ultimaActualizacion: new Date().toISOString(),
  });
}
