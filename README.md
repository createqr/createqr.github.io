# CreateQR | Free Custom QR Code Generator & Designer

[![Deploy to GitHub Pages](https://github.com/createqr/createqr.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/createqr/createqr.github.io/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An ultra-minimal, high-performance, 100% browser-based custom QR code generator and designer. Built with **Astro (SSG)**, **React (Astro Islands)**, **Tailwind CSS**, and **`qr-code-styling`**.

- 🌐 **Live Website**: [https://createqr.github.io](https://createqr.github.io)
- ☕ **Support Developer**: [Buy Me a Coffee](https://buymeacoffee.com/kisharadilz)

---

## ✨ Features

- 🔒 **100% Client-Side Privacy**: Direct browser rendering using HTML5 Canvas and SVG. No data or uploaded images ever leave your device.
- 🎨 **Deep Customization**:
  - **Dot Patterns**: Square, Dots, Rounded, Extra-Rounded, Classy, Classy-Rounded.
  - **Corner Eye Shapes**: Square, Dot, Extra-Rounded.
  - **Color Modes**: Solid color, Linear gradient, Radial gradient with rotation angle controls.
  - **Background Modes**: Solid hex or transparent background.
  - **Error Correction**: Level L (7%), M (15%), Q (25%), and H (30% - Best for Logos).
- 🖼️ **Logo & Icon Integration**:
  - Upload custom PNG, SVG, WEBP, or JPEG logos.
  - 8 built-in brand/utility icons (Link, Wi-Fi, User, Mail, Phone, Bitcoin, Ethereum, Star).
  - Size ratio and margin controls with automatic background dot clearing.
- 📁 **8 Standardized Data Types**:
  1. Website URL (`https://...`)
  2. Wi-Fi Network (`WPA/WPA2/WPA3`, `WEP`, `Open`, `Hidden SSID`)
  3. Digital Contact (`vCard 3.0`)
  4. Plain Text
  5. Email (`mailto:`)
  6. Phone Call (`tel:`)
  7. SMS Message (`smsto:`)
  8. Cryptocurrency (`BTC`, `ETH`, `SOL`, `USDT`)
- 💾 **Multi-Format Export & Print**:
  - Lossless Vector SVG
  - High-Resolution Raster: PNG, WEBP, JPEG up to 4096×4096px
  - 1-Click Clipboard Copy (Vector SVG or PNG image)
  - Clean Print Sheet layout for desktop/office printers
- 🌍 **Full 6-Language Subpath Localization**:
  - English (`/`)
  - Spanish (`/es/`)
  - Portuguese (`/pt/`)
  - German (`/de/`)
  - French (`/fr/`)
  - Japanese (`/ja/`)
  - Complete bidirectional hreflang tags including `x-default`.
- ⚡ **SEO & Schema.org JSON-LD**:
  - `WebApplication`, `HowTo`, and `FAQPage` structured data.
  - Full OpenGraph & Twitter Cards.
  - Dark mode and Light mode with anti-FOUC inline script.

---

## 🛠️ Tech Stack

- **Framework**: [Astro 5](https://astro.build/) (Static Site Generation mode)
- **UI Islands**: [React 19](https://react.dev/) (`client:load`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom glassmorphism
- **QR Engine**: [`qr-code-styling`](https://github.com/kozakdenys/qr-code-styling)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [canvas-confetti](https://github.com/catdad/canvas-confetti)
- **Hosting**: [GitHub Pages](https://pages.github.com/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v20` or higher
- npm `v10` or higher

### Installation

```bash
# Clone repository
git clone https://github.com/createqr/createqr.github.io.git
cd createqr.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build static files into ./dist
npm run build

# Preview build locally
npm run preview
```

---

## 📄 License

MIT License. Free for personal and commercial use without restrictions or royalties.
