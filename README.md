# Demo — Sistema de Automatización de Vías de Ingreso (IACC)

Prototipo navegable, sin backend real, del Sistema de Automatización de Vías de Ingreso del Instituto Profesional IACC: una plataforma con IA que propone reconocimientos de aprendizajes previos (Vía 5 — RFCP, Vía 6 — Convalidación), siempre sujetos a la aprobación de una persona responsable.

> Demo con datos ficticios. No corresponde a información real de estudiantes.

## Stack

Vite + React + TypeScript + Tailwind CSS + shadcn/ui + Zustand + React Router + Recharts. Todo el estado vive en el frontend (localStorage), sin backend ni autenticación real.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Despliegue

La app se publica automáticamente en GitHub Pages mediante GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) en cada push a `main`.

URL pública: https://javierajimenezr.github.io/iacc-vias-ingreso-demo/

### Configuración única en GitHub (ya realizada / a verificar)

En **Settings → Pages → Build and deployment → Source**, seleccionar **"GitHub Actions"** (no "Deploy from a branch").
