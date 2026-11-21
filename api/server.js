const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS: que origenes (paginas web) pueden llamar a esta API desde el navegador.
// En Render define ALLOWED_ORIGIN con la URL de tu frontend en Vercel.
// Varios origenes: separados por coma. Sin definir => '*' (solo para practicar).
const permitidos = (process.env.ALLOWED_ORIGIN || '*')
  .split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: permitidos.includes('*') ? '*' : permitidos }));
app.use(express.json({ limit: '10kb' }));

// Datos en memoria: se pierden al reiniciar (en Render gratis, tambien al dormirse).
const muro = [];

// Comprobacion de salud: el frontend y Render la usan para saber si la API vive.
app.get('/health', (req, res) => res.json({ ok: true, hora: new Date().toISOString() }));

// GET: un saludo personalizado
app.get('/api/saludo', (req, res) => {
  const nombre = String(req.query.nombre || 'mundo').trim().slice(0, 30) || 'mundo';
  res.json({ mensaje: `¡Hola, ${nombre}! Te saluda la API desde Render.`, hora: new Date().toISOString() });
});

// GET: leer el muro
app.get('/api/muro', (req, res) => res.json(muro.slice(-20).reverse()));

// POST: escribir en el muro (validacion en el servidor)
app.post('/api/muro', (req, res) => {
  const nombre = String(req.body.nombre || '').trim().slice(0, 30);
  const mensaje = String(req.body.mensaje || '').trim().slice(0, 140);
  if (!nombre || !mensaje) return res.status(400).json({ error: 'Nombre y mensaje son obligatorios' });
  const item = { id: Date.now(), nombre, mensaje };
  muro.push(item);
  if (muro.length > 100) muro.shift();
  res.status(201).json(item);
});

// Render exige escuchar en 0.0.0.0 y en el puerto de la variable PORT.
app.listen(PORT, '0.0.0.0', () => console.log(`API escuchando en 0.0.0.0:${PORT}`));
