# Muro de saludos: frontend estático (Vercel) + API (Render)

Un repositorio, dos carpetas:

- `frontend/`: HTML, CSS y JavaScript sin build. Se publica en Vercel (Root Directory = `frontend`).
- `api/`: servidor Node + Express. Se publica en Render como Web Service (Root Directory = `api`).

## Probar en tu computador (dos terminales)

    cd api && npm install && npm start          # http://localhost:4000
    cd frontend && npx serve -l 3000            # http://localhost:3000

## Publicar

1. Render: New + → Web Service, Root Directory `api`, Build `npm install`, Start `npm start`.
2. Pon la URL de Render en `frontend/config.js`, haz commit y push.
3. Vercel: Add New → Project, Root Directory `frontend`, Framework Preset `Other`.
4. En Render, define `ALLOWED_ORIGIN` con la URL de Vercel (sin barra final).

Licencia MIT.
