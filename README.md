# Krakenfall — An Original Cinematic Pirate-Fantasy Site

An entirely original fictional universe, design, and codebase — inspired by the *interaction
quality* of cinematic sites like KPRVerse, but with its own branding, artwork direction, copy,
and code. No proprietary names, characters, logos, or assets from any existing franchise are
used anywhere in this project.

## Tech stack

- Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS
- **GSAP + ScrollTrigger** — scroll-driven reveals
- **Lenis** — smooth scroll, integrated with GSAP's ticker
- **Three.js / React Three Fiber** — shader-based animated ocean, drifting fog, floating embers,
  lightning flashes, mouse parallax camera
- **Framer Motion** — UI transitions (navbar, modals, entry gate)
- **Zustand** — audio state (mute/volume, persisted to localStorage)
- **Howler.js** — layered ambient audio + SFX playback
- Prisma + PostgreSQL, JWT auth, Cloudinary uploads, Resend/SMTP email

## What's included

### Cinematic frontend
- Fullscreen Hero with a custom WebGL ocean (vertex-shader wave displacement), drifting fog
  planes, floating ember particles, and randomized lightning strikes (screen flash + point light
  + thunder SFX, synced)
- Custom animated cursor: morphs on hover, magnetic pull on buttons, click ripple, fading
  slash-style trail — desktop only, gracefully disabled on touch devices
- Lenis smooth scroll wired into GSAP's ticker so ScrollTrigger and the scroll physics stay in sync
- Glassmorphism cards and nav throughout; dark luxury palette (abyss navy / brass gold / tide teal)
- Sections: Hero, Crew, Devil Fruits, Journey, Treasure, Gallery, Timeline, Contact — every one
  fetching real content from Postgres via Prisma, not hardcoded copy
- An "Entry Gate" intro (required first click, since browsers block audio autoplay — doubles as a
  polished cinematic title-card moment)

### Audio system
- Ambient ocean bed + low thunder rumble, looping
- Hover / click / nav / scroll SFX
- Volume slider + mute toggle, persisted via Zustand + localStorage
- **All audio files in `public/audio/` are synthesized placeholder tones** generated with ffmpeg
  (filtered noise for the ambient beds, simple sine tones for SFX) — zero copyrighted audio was
  used. Swap them for produced/licensed audio before shipping publicly; the code path is fully
  wired and functional as-is for development and demos.

### Backend / Admin CMS
- JWT auth (single-tenant — one Harbor Master admin account, seeded)
- Full CRUD admin panel for Crew, Devil Fruits, Journey chapters, Treasure, Timeline
- Gallery page with **real media upload** (image/video/audio) to Cloudinary
- SEO Editor (per-path title/description/OG image/keywords), wired into the home page's
  `generateMetadata`
- Lightweight first-party analytics (page views by path/day) — no external tracking script
- Contact message inbox + Newsletter subscriber list
- Audit log on every content mutation

## Setup

```bash
cp .env.example .env
# fill in DATABASE_URL, JWT secrets at minimum

npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Admin login: `admin@krakenfall.com` / `Password123` at `/admin/login`.

## Notes

- **Cloudinary** is required for the Gallery media-upload feature to work; without it, the upload
  button returns a clear "not configured" error rather than failing silently.
- **Prisma Client generation**: if you're behind a restrictive firewall, `prisma generate` may
  need `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` — see the Prisma docs. This is unrelated to the
  app code.
- The 3D ocean scene is dynamically imported (`ssr: false`) since Three.js requires a browser
  canvas context.
