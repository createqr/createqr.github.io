# CreateQR | Free Custom QR Code Generator & Designer

[![Deploy to GitHub Pages](https://github.com/createqr/createqr.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/createqr/createqr.github.io/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![SEO Score: 100%](https://img.shields.io/badge/SEO-100%25-brightgreen.svg)](https://createqr.github.io)
[![Privacy: 100% Client--Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-blue.svg)](https://createqr.github.io)

An ultra-minimal, high-performance, 100% browser-based custom QR code generator and designer. Built with **Astro 5 (SSG)**, **React 19 (Astro Islands)**, **Tailwind CSS**, and **`qr-code-styling`**.

- 🌐 **Live Website**: [https://createqr.github.io](https://createqr.github.io)
- ☕ **Developer Support**: [Buy Me a Coffee](https://buymeacoffee.com/kisharadilz)

---

## 🎨 Brand Design System & Color Palette

CreateQR features a unified, accessible color scheme:

| Color Code | Name | Role across the UI |
|---|---|---|
| **`#000000`** | Pure Black | Primary typography, deep brand contrast |
| **`#233D4D`** | Dark Teal / Slate | QR primary gradient start, dark mode accents, slider tracks, badges |
| **`#FE7F2D`** | Vibrant Coral Orange | Main CTAs, QR gradient end, active tabs, buttons, focus rings, confetti |
| **`#EAECF0`** | Light Gray Surface | Base page background (`body`), card surfaces, glassmorphism panels |

---

## ✨ Features

### 🔒 100% Client-Side Privacy
* Direct browser rendering using HTML5 Canvas and Vector SVG.
* Zero server tracking — your data, contact info, Wi-Fi credentials, and uploaded logos never leave your device.

### 🎨 Deep Visual Customization
* **Dot Patterns**: Square, Dots, Rounded, Extra-Rounded, Classy, Classy-Rounded.
* **Corner Eye Shapes**: Frame geometries (Square, Extra-Rounded, Dot) and center dot shapes.
* **Color Modes**: Solid hex color, 2-color Linear gradient (with angle slider), and Radial gradient.
* **Background Modes**: Solid hex color or 100% Transparent background (for graphic design overlays).
* **Error Correction**: Level L (7%), M (15%), Q (25%), and H (30% - Best for Logos).
* **Quick Presets**: 6 1-click curated design templates (Minimalist Black, Ocean Gradient, Emerald Business, Sunset Glow, Cyber Neon, Royal Gold).

### 🖼️ Center Logo & Icon Integration
* Upload custom brand logos in PNG, SVG, WEBP, or JPEG formats (up to 2MB).
* 8 built-in brand/utility vector icons (Link, Wi-Fi, Contact, Mail, Phone, Bitcoin, Ethereum, Star).
* Customizable logo size ratio, surrounding margin, and automatic background dot clearance.

### 📁 8 Standardized QR Data Types
1. **Website URL** (`https://...`) — Automatic protocol validation.
2. **Wi-Fi Network** (`WPA/WPA2/WPA3`, `WEP`, `Open`, `Hidden SSID`) — Instant camera connection.
3. **Digital Contact (vCard 3.0)** — First Name, Last Name, Phone, Email, Company, Job Title, Website, Address.
4. **Plain Text** — Notes, serial numbers, and codes with real-time character counter.
5. **Email** (`mailto:`) — Recipient, Subject, and pre-filled Message Body.
6. **Phone Call** (`tel:`) — 1-tap direct dialing.
7. **SMS Message** (`smsto:`) — Phone number and pre-filled SMS text.
8. **Cryptocurrency** — Bitcoin (`BTC`), Ethereum (`ETH`), Solana (`SOL`), and Tether (`USDT`) with optional amount parameters.

### 💾 High-Resolution Multi-Format Export
* **Lossless Vector SVG**: Fully scalable vector XML with inlined base64 logos and standard namespaces.
* **High-Resolution Raster**: PNG, WEBP, and JPEG at 512px, 1024px (HD), 2048px (2K Ultra), and 4096px (4K Print).
* **1-Click Clipboard Copy**: Copies vector SVG code or PNG image directly to your OS clipboard.
* **Print Sheet Layout**: Dedicated `@media print` layout for desktop/office printers.

### 🌍 International Multi-Language Subpath Routing
* Fully translated across 6 locales with zero placeholders:
  * 🇺🇸 **English** (`/`)
  * 🇪🇸 **Spanish** (`/es/`)
  * 🇧🇷 **Portuguese** (`/pt/`)
  * 🇩🇪 **German** (`/de/`)
  * 🇫🇷 **French** (`/fr/`)
  * 🇯🇵 **Japanese** (`/ja/`)
* 7 bidirectional hreflang tags including `x-default` in both `<head>` and `public/sitemap.xml`.

### 🚀 100% Technical SEO & Core Web Vitals
* Combined Schema.org Linked Data JSON-LD (`WebApplication` + `BreadcrumbList` + `HowTo` + `FAQPage`).
* Full OpenGraph & Twitter Cards powered by Cloudinary CDN (`1200×630px`).
* Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<details>`, `<summary>`, `<footer>`).
* WAI-ARIA accessible tab controls (`role="tablist"`, `role="tab"`, `role="tabpanel"`).
* Google Tag Manager (`G-W5ZZHJ34X0`) with preconnect and DNS-prefetch performance hints.
* Cumulative Layout Shift (CLS) = 0.00 with inline anti-FOUC theme detector script.

---

## 🛠️ Tech Stack

* **Framework**: [Astro 5](https://astro.build/) (Static Site Generation mode)
* **UI Islands**: [React 19](https://react.dev/) (`client:load`)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) with glassmorphism utilities
* **QR Engine**: [`qr-code-styling`](https://github.com/kozakdenys/qr-code-styling)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Effects**: [canvas-confetti](https://github.com/catdad/canvas-confetti)
* **Deployment**: [GitHub Pages](https://pages.github.com/) via GitHub Actions

---

## 📁 Project Directory Structure

```
createqr.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD deployment
├── public/
│   ├── favicon.svg             # Vector brand favicon
│   ├── robots.txt              # Search crawler directives
│   └── sitemap.xml             # Multi-lingual sitemap index
├── src/
│   ├── components/
│   │   ├── FaqSection.astro    # Accessible accordion FAQ
│   │   ├── Features.astro      # Feature highlights grid
│   │   ├── Footer.astro        # Footer with privacy badge & links
│   │   ├── Header.astro        # Responsive navbar & mobile/tablet drawer
│   │   ├── HowItWorks.astro    # 3-step visual workflow
│   │   ├── LanguagePicker.astro# Dropdown language selector
│   │   ├── QrGeneratorWorkspace.jsx # Interactive React island
│   │   ├── SeoContent.astro    # Scannability guide & use cases
│   │   └── ThemeToggle.jsx     # Dark/Light theme switcher
│   ├── i18n/
│   │   ├── ui.ts               # Translation dictionaries (6 locales)
│   │   └── utils.ts            # Hreflang & localization utilities
│   ├── layouts/
│   │   └── Layout.astro        # Master layout, SEO tags & JSON-LD
│   ├── pages/
│   │   ├── index.astro         # English root route (/)
│   │   └── [lang]/
│   │       └── index.astro     # Localized routes (/es/, /pt/, /de/, /fr/, /ja/)
│   ├── styles/
│   │   └── global.css          # Custom glassmorphism, scrollbars & print
│   └── utils/
│       ├── export-helpers.ts   # Multi-resolution export engine
│       └── qr-formatter.ts     # 8 QR data type payload builders
├── .gitignore                  # Git ignore rules
├── astro.config.mjs            # Astro configuration
├── package.json                # Project scripts & dependencies
├── tailwind.config.mjs         # Tailwind theme & color tokens
└── tsconfig.json               # Strict TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js `v20.x` or higher
* npm `v10.x` or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/createqr/createqr.github.io.git
cd createqr.github.io

# 2. Install dependencies
npm install

# 3. Start local development server (http://localhost:4321)
npm run dev
```

### Production Build & Typecheck

```bash
# Typecheck TypeScript files
npx tsc --noEmit

# Compile static SSG site into ./dist
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

This project is licensed under the **MIT License** — free for both personal and commercial use without restrictions or royalties.
