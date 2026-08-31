import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Globe,
  Wifi,
  Contact,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  Coins,
  Sparkles,
  Palette,
  Image as ImageIcon,
  LayoutTemplate,
  Download,
  Copy,
  Printer,
  Check,
  AlertTriangle,
  Trash2,
  Upload,
  CheckCircle2,
} from 'lucide-react';

import { ui } from '../i18n/ui';
import { initialFormData, formatQrPayload } from '../utils/qr-formatter';
import {
  exportQrCode,
  copyQrToClipboard,
  printQrSheet,
  triggerSuccessConfetti,
} from '../utils/export-helpers';

// Preset Brand & Utility SVG Icons (Data URIs for qr-code-styling)
const PRESET_ICONS = [
  {
    id: 'link',
    label: 'Link',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23FE7F2D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  },
  {
    id: 'wifi',
    label: 'Wi-Fi',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23FE7F2D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
  },
  {
    id: 'contact',
    label: 'User',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23FE7F2D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  },
  {
    id: 'mail',
    label: 'Mail',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23FE7F2D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  },
  {
    id: 'phone',
    label: 'Phone',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23FE7F2D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  },
  {
    id: 'btc',
    label: 'Bitcoin',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.866c4.358.768 5.436-5.328 1.077-6.096m-1.077 6.096L6.903 10.98m7.135-2.853-.347 1.97M6.903 10.98l.347-1.97m-1.39 9.037.347-1.97"/></svg>`,
  },
  {
    id: 'eth',
    label: 'Ethereum',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%236366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4.5 12.5 12 17l7.5-4.5L12 2z"/><path d="M12 17v5l7.5-9.5L12 17z"/><path d="M4.5 12.5 12 22v-5l-7.5-4.5z"/></svg>`,
  },
  {
    id: 'star',
    label: 'Star',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f59e0b" stroke="%23f59e0b" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  },
];

export default function QrGeneratorWorkspace({ lang = 'en' }) {
  const t = ui[lang] || ui.en;

  // Active workspace state
  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState('data'); // 'data' | 'style' | 'logo' | 'presets'

  // Style customization state
  const [dotStyle, setDotStyle] = useState('rounded'); // 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'
  const [cornerSquareStyle, setCornerSquareStyle] = useState('extra-rounded'); // 'square' | 'dot' | 'extra-rounded'
  const [cornerDotStyle, setCornerDotStyle] = useState('dot'); // 'square' | 'dot'

  const [colorMode, setColorMode] = useState('linear'); // 'single' | 'linear' | 'radial'
  const [dotColor, setDotColor] = useState('#233D4D');
  const [dotGradientEnd, setDotGradientEnd] = useState('#FE7F2D');
  const [gradientRotation, setGradientRotation] = useState(45);

  const [customCorners, setCustomCorners] = useState(false);
  const [cornerSquareColor, setCornerSquareColor] = useState('#233D4D');
  const [cornerDotColor, setCornerDotColor] = useState('#FE7F2D');

  const [bgMode, setBgMode] = useState('solid'); // 'solid' | 'transparent'
  const [bgColor, setBgColor] = useState('#ffffff');

  const [errorCorrection, setErrorCorrection] = useState('Q'); // 'L' | 'M' | 'Q' | 'H'

  // Logo state
  const [logoImage, setLogoImage] = useState(null);
  const [logoSize, setLogoSize] = useState(0.32);
  const [logoMargin, setLogoMargin] = useState(8);
  const [hideBackgroundDots, setHideBackgroundDots] = useState(true);

  // Export settings
  const [exportFormat, setExportFormat] = useState('png');
  const [exportResolution, setExportResolution] = useState(1024);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Refs for qr-code-styling instance and container
  const qrRef = useRef(null);
  const qrCodeInstanceRef = useRef(null);

  // Compute live payload string
  const currentPayload = useMemo(() => {
    return formatQrPayload(formData);
  }, [formData]);

  // Check contrast between primary dot color and background
  const contrastHealth = useMemo(() => {
    if (bgMode === 'transparent') return { good: true, ratio: '21.0' };

    const hexToRgb = (hex) => {
      const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthand, (_, r, g, b) => r + r + g + g + b + b);
      const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return res ? { r: parseInt(res[1], 16), g: parseInt(res[2], 16), b: parseInt(res[3], 16) } : { r: 0, g: 0, b: 0 };
    };

    const getLuminance = ({ r, g, b }) => {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const l1 = getLuminance(hexToRgb(dotColor));
    const l2 = getLuminance(hexToRgb(bgColor));
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    return {
      good: ratio >= 3.0,
      ratio: ratio.toFixed(1),
    };
  }, [dotColor, bgColor, bgMode]);

  // Initialize and update qr-code-styling instance
  // Build the QR options object (shared between preview & export)
  const qrOptions = useMemo(() => {
    let dotsColorConfig = {};
    if (colorMode === 'single') {
      dotsColorConfig = { color: dotColor };
    } else {
      dotsColorConfig = {
        gradient: {
          type: colorMode,
          rotation: (gradientRotation * Math.PI) / 180,
          colorStops: [
            { offset: 0, color: dotColor },
            { offset: 1, color: dotGradientEnd },
          ],
        },
      };
    }

    return {
      width: 320,
      height: 320,
      type: 'svg',
      data: currentPayload,
      image: logoImage || undefined,
      margin: 12,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: errorCorrection,
      },
      imageOptions: {
        hideBackgroundDots: hideBackgroundDots,
        imageSize: logoSize,
        margin: logoMargin,
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        type: dotStyle,
        ...dotsColorConfig,
      },
      backgroundOptions: {
        color: bgMode === 'transparent' ? 'transparent' : bgColor,
      },
      cornersSquareOptions: {
        type: cornerSquareStyle,
        color: customCorners ? cornerSquareColor : undefined,
        gradient: !customCorners && colorMode !== 'single' ? dotsColorConfig.gradient : undefined,
      },
      cornersDotOptions: {
        type: cornerDotStyle,
        color: customCorners ? cornerDotColor : undefined,
        gradient: !customCorners && colorMode !== 'single' ? dotsColorConfig.gradient : undefined,
      },
    };
  }, [
    currentPayload,
    dotStyle,
    cornerSquareStyle,
    cornerDotStyle,
    colorMode,
    dotColor,
    dotGradientEnd,
    gradientRotation,
    customCorners,
    cornerSquareColor,
    cornerDotColor,
    bgMode,
    bgColor,
    errorCorrection,
    logoImage,
    logoSize,
    logoMargin,
    hideBackgroundDots,
  ]);

  // Render QR preview (uses memoized qrOptions)
  useEffect(() => {
    let isMounted = true;

    async function initOrUpdateQr() {
      try {
        const QRCodeStyling = (await import('qr-code-styling')).default;

        if (!qrCodeInstanceRef.current) {
          qrCodeInstanceRef.current = new QRCodeStyling(qrOptions);
          if (qrRef.current && isMounted) {
            qrRef.current.innerHTML = '';
            qrCodeInstanceRef.current.append(qrRef.current);
          }
        } else {
          qrCodeInstanceRef.current.update(qrOptions);
        }
      } catch (err) {
        console.error('Failed to render QR Code styling instance:', err);
      }
    }

    initOrUpdateQr();

    return () => {
      isMounted = false;
    };
  }, [qrOptions]);

  // Show Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoImage(event.target?.result);
      setErrorCorrection('H'); // Automatically switch to High error correction for best logo readability
    };
    reader.readAsDataURL(file);
  };

  // Preset Applicator
  const applyPreset = (presetKey) => {
    switch (presetKey) {
      case 'classic':
        setDotStyle('square');
        setCornerSquareStyle('square');
        setCornerDotStyle('square');
        setColorMode('single');
        setDotColor('#000000');
        setBgMode('solid');
        setBgColor('#ffffff');
        setCustomCorners(false);
        break;
      case 'oceanBlue':
        setDotStyle('rounded');
        setCornerSquareStyle('extra-rounded');
        setCornerDotStyle('dot');
        setColorMode('linear');
        setDotColor('#FE7F2D');
        setDotGradientEnd('#06b6d4');
        setGradientRotation(45);
        setBgMode('solid');
        setBgColor('#ffffff');
        setCustomCorners(false);
        break;
      case 'emeraldBusiness':
        setDotStyle('classy');
        setCornerSquareStyle('dot');
        setCornerDotStyle('dot');
        setColorMode('linear');
        setDotColor('#047857');
        setDotGradientEnd('#10b981');
        setGradientRotation(90);
        setBgMode('solid');
        setBgColor('#ffffff');
        setCustomCorners(false);
        break;
      case 'sunsetViolet':
        setDotStyle('classy-rounded');
        setCornerSquareStyle('extra-rounded');
        setCornerDotStyle('dot');
        setColorMode('linear');
        setDotColor('#7c3aed');
        setDotGradientEnd('#db2777');
        setGradientRotation(45);
        setBgMode('solid');
        setBgColor('#ffffff');
        setCustomCorners(false);
        break;
      case 'cyberNeon':
        setDotStyle('dots');
        setCornerSquareStyle('extra-rounded');
        setCornerDotStyle('dot');
        setColorMode('linear');
        setDotColor('#06b6d4');
        setDotGradientEnd('#ec4899');
        setGradientRotation(135);
        setBgMode('solid');
        setBgColor('#090d16');
        setCustomCorners(false);
        break;
      case 'royalGold':
        setDotStyle('extra-rounded');
        setCornerSquareStyle('extra-rounded');
        setCornerDotStyle('square');
        setColorMode('linear');
        setDotColor('#b45309');
        setDotGradientEnd('#f59e0b');
        setGradientRotation(45);
        setBgMode('solid');
        setBgColor('#0f172a');
        setCustomCorners(false);
        break;
      default:
        break;
    }
    showToast('Design template applied!');
  };

  // Actions
  const handleDownload = async () => {
    if (!currentPayload) return;
    setIsExporting(true);
    try {
      const success = await exportQrCode({
        currentOptions: qrOptions,
        format: exportFormat,
        resolution: exportResolution,
        baseFilename: `createqr-${formData.type}`,
      });
      if (success) {
        showToast(t.preview.downloadedSuccess);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyClipboard = async (type = 'png') => {
    if (!currentPayload) return;
    const ok = await copyQrToClipboard({
      currentOptions: qrOptions,
      type,
    });
    if (ok) {
      showToast(t.preview.copiedSuccess);
    } else {
      showToast('Clipboard copy not supported on this browser.');
    }
  };

  const handlePrint = () => {
    printQrSheet();
  };

  return (
    <section id="generator" className="pt-8 pb-16 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl border border-slate-700/50 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Hero Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/60 text-brand-600 dark:text-brand-300 text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
            <span>{t.site.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {t.site.heroHeading}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.site.heroSubtitle}
          </p>
        </div>

        {/* 2-Column Responsive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Tab Controls & Form Data (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Workspace Navigation Tabs */}
            <div role="tablist" aria-label="QR Code Customization Sections" className="glass-panel p-1.5 rounded-2xl flex items-center gap-1 shadow-sm overflow-x-auto">
              <button
                type="button"
                role="tab"
                id="tab-data"
                aria-controls="panel-data"
                aria-selected={activeTab === 'data'}
                onClick={() => setActiveTab('data')}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'data'
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>{t.tabs.data}</span>
              </button>

              <button
                type="button"
                role="tab"
                id="tab-style"
                aria-controls="panel-style"
                aria-selected={activeTab === 'style'}
                onClick={() => setActiveTab('style')}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'style'
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <Palette className="w-4 h-4" aria-hidden="true" />
                <span>{t.tabs.style}</span>
              </button>

              <button
                type="button"
                role="tab"
                id="tab-logo"
                aria-controls="panel-logo"
                aria-selected={activeTab === 'logo'}
                onClick={() => setActiveTab('logo')}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'logo'
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <ImageIcon className="w-4 h-4" aria-hidden="true" />
                <span>{t.tabs.logo}</span>
              </button>

              <button
                type="button"
                role="tab"
                id="tab-presets"
                aria-controls="panel-presets"
                aria-selected={activeTab === 'presets'}
                onClick={() => setActiveTab('presets')}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'presets'
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <LayoutTemplate className="w-4 h-4" aria-hidden="true" />
                <span>{t.tabs.presets}</span>
              </button>
            </div>

            {/* TAB 1: DATA CONTENT */}
            {activeTab === 'data' && (
              <div role="tabpanel" id="panel-data" aria-labelledby="tab-data" className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm animate-fade-in">
                
                {/* 8 Data Type Selection Buttons */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    Choose QR Data Format
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'url', label: t.dataTypes.url, icon: Globe },
                      { id: 'wifi', label: t.dataTypes.wifi, icon: Wifi },
                      { id: 'vcard', label: t.dataTypes.vcard, icon: Contact },
                      { id: 'text', label: t.dataTypes.text, icon: FileText },
                      { id: 'email', label: t.dataTypes.email, icon: Mail },
                      { id: 'phone', label: t.dataTypes.phone, icon: Phone },
                      { id: 'sms', label: t.dataTypes.sms, icon: MessageSquare },
                      { id: 'crypto', label: t.dataTypes.crypto, icon: Coins },
                    ].map((typeItem) => {
                      const IconComponent = typeItem.icon;
                      const isSelected = formData.type === typeItem.id;
                      return (
                        <button
                          key={typeItem.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: typeItem.id })}
                          className={`flex items-center gap-2 p-3 rounded-2xl text-xs font-bold border transition-all text-left ${
                            isSelected
                              ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-500 dark:text-brand-400 shadow-sm'
                              : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <IconComponent className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-brand-500 dark:text-brand-400' : 'text-slate-400'}`} />
                          <span className="truncate">{typeItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DYNAMIC FORM FIELDS */}
                <div className="space-y-4 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                  
                  {/* 1. URL */}
                  {formData.type === 'url' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        {t.form.urlLabel}
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="url"
                          value={formData.url}
                          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                          placeholder={t.form.urlPlaceholder}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.form.urlHint}</p>
                    </div>
                  )}

                  {/* 2. Wi-Fi */}
                  {formData.type === 'wifi' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.form.wifiSsid}
                        </label>
                        <input
                          type="text"
                          value={formData.wifi.ssid}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              wifi: { ...formData.wifi, ssid: e.target.value },
                            })
                          }
                          placeholder={t.form.wifiSsidPlaceholder}
                          className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            {t.form.wifiPassword}
                          </label>
                          <input
                            type="text"
                            value={formData.wifi.password}
                            disabled={formData.wifi.encryption === 'nopass'}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                wifi: { ...formData.wifi, password: e.target.value },
                              })
                            }
                            placeholder={t.form.wifiPasswordPlaceholder}
                            className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            {t.form.wifiEncryption}
                          </label>
                          <select
                            value={formData.wifi.encryption}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                wifi: { ...formData.wifi, encryption: e.target.value },
                              })
                            }
                            className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                          >
                            <option value="WPA">{t.form.encWpa}</option>
                            <option value="WEP">{t.form.encWep}</option>
                            <option value="nopass">{t.form.encNone}</option>
                          </select>
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={formData.wifi.hidden}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              wifi: { ...formData.wifi, hidden: e.target.checked },
                            })
                          }
                          className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 border-slate-300"
                        />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {t.form.wifiHidden}
                        </span>
                      </label>
                    </div>
                  )}

                  {/* 3. vCard */}
                  {formData.type === 'vcard' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {t.form.vcardFirst}
                          </label>
                          <input
                            type="text"
                            value={formData.vcard.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                vcard: { ...formData.vcard, firstName: e.target.value },
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {t.form.vcardLast}
                          </label>
                          <input
                            type="text"
                            value={formData.vcard.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                vcard: { ...formData.vcard, lastName: e.target.value },
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {t.form.vcardPhone}
                          </label>
                          <input
                            type="tel"
                            value={formData.vcard.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                vcard: { ...formData.vcard, phone: e.target.value },
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {t.form.vcardEmail}
                          </label>
                          <input
                            type="email"
                            value={formData.vcard.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                vcard: { ...formData.vcard, email: e.target.value },
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {t.form.vcardCompany}
                          </label>
                          <input
                            type="text"
                            value={formData.vcard.company}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                vcard: { ...formData.vcard, company: e.target.value },
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {t.form.vcardJob}
                          </label>
                          <input
                            type="text"
                            value={formData.vcard.jobTitle}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                vcard: { ...formData.vcard, jobTitle: e.target.value },
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {t.form.vcardWebsite}
                        </label>
                        <input
                          type="text"
                          value={formData.vcard.website}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vcard: { ...formData.vcard, website: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {t.form.vcardAddress}
                        </label>
                        <input
                          type="text"
                          value={formData.vcard.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vcard: { ...formData.vcard, address: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* 4. Plain Text */}
                  {formData.type === 'text' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          {t.form.textLabel}
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {formData.text.length} {t.form.textCounter}
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        placeholder={t.form.textPlaceholder}
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  )}

                  {/* 5. Email */}
                  {formData.type === 'email' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {t.form.emailTo}
                        </label>
                        <input
                          type="email"
                          value={formData.email.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: { ...formData.email, email: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {t.form.emailSubject}
                        </label>
                        <input
                          type="text"
                          value={formData.email.subject}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: { ...formData.email, subject: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {t.form.emailBody}
                        </label>
                        <textarea
                          rows={3}
                          value={formData.email.body}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: { ...formData.email, body: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* 6. Phone Call */}
                  {formData.type === 'phone' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        {t.form.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={t.form.phonePlaceholder}
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  )}

                  {/* 7. SMS */}
                  {formData.type === 'sms' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {t.form.smsPhone}
                        </label>
                        <input
                          type="tel"
                          value={formData.sms.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sms: { ...formData.sms, phone: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {t.form.smsMessage}
                        </label>
                        <textarea
                          rows={3}
                          value={formData.sms.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sms: { ...formData.sms, message: e.target.value },
                            })
                          }
                          placeholder={t.form.smsMessagePlaceholder}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* 8. Crypto */}
                  {formData.type === 'crypto' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {t.form.cryptoCoin}
                          </label>
                          <select
                            value={formData.crypto.coin}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                crypto: { ...formData.crypto, coin: e.target.value },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                          >
                            <option value="BTC">Bitcoin (BTC)</option>
                            <option value="ETH">Ethereum (ETH)</option>
                            <option value="SOL">Solana (SOL)</option>
                            <option value="USDT">Tether (USDT)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {t.form.cryptoAmount}
                          </label>
                          <input
                            type="text"
                            value={formData.crypto.amount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                crypto: { ...formData.crypto, amount: e.target.value },
                              })
                            }
                            placeholder="e.g. 0.05"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {t.form.cryptoAddress}
                        </label>
                        <input
                          type="text"
                          value={formData.crypto.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              crypto: { ...formData.crypto, address: e.target.value },
                            })
                          }
                          placeholder={t.form.cryptoAddressPlaceholder}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500 font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* TAB 2: STYLE & COLORS */}
            {activeTab === 'style' && (
              <div role="tabpanel" id="panel-style" aria-labelledby="tab-style" className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm animate-fade-in">
                
                {/* Dot Pattern Shapes */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    {t.styles.dotStyle}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'square', label: t.styles.dotStyleSquare },
                      { id: 'dots', label: t.styles.dotStyleDots },
                      { id: 'rounded', label: t.styles.dotStyleRounded },
                      { id: 'extra-rounded', label: t.styles.dotStyleExtraRounded },
                      { id: 'classy', label: t.styles.dotStyleClassy },
                      { id: 'classy-rounded', label: t.styles.dotStyleClassyRounded },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDotStyle(item.id)}
                        className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all ${
                          dotStyle === item.id
                            ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-500 dark:text-brand-400 shadow-sm'
                            : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Corner Frame & Dot Geometries */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      {t.styles.cornerSquareStyle}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'square', label: t.styles.cornerSquareSquare },
                        { id: 'extra-rounded', label: t.styles.cornerSquareExtraRounded },
                        { id: 'dot', label: t.styles.cornerSquareDot },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCornerSquareStyle(item.id)}
                          className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-all ${
                            cornerSquareStyle === item.id
                              ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-500 dark:text-brand-400'
                              : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      {t.styles.cornerDotStyle}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'square', label: t.styles.cornerDotSquare },
                        { id: 'dot', label: t.styles.cornerDotDot },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCornerDotStyle(item.id)}
                          className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-all ${
                            cornerDotStyle === item.id
                              ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-500 dark:text-brand-400'
                              : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color Mode & Gradients */}
                <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t.styles.colorMode}
                    </label>
                    <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800/80">
                      {[
                        { id: 'single', label: 'Solid' },
                        { id: 'linear', label: 'Linear' },
                        { id: 'radial', label: 'Radial' },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setColorMode(mode.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            colorMode === mode.id
                              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {colorMode === 'single' ? t.styles.solidColor : t.styles.primaryColor}
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={dotColor}
                          onChange={(e) => setDotColor(e.target.value)}
                        />
                        <span className="text-xs font-mono text-slate-500 uppercase">{dotColor}</span>
                      </div>
                    </div>

                    {colorMode !== 'single' && (
                      <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between animate-fade-in">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {t.styles.secondaryColor}
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={dotGradientEnd}
                            onChange={(e) => setDotGradientEnd(e.target.value)}
                          />
                          <span className="text-xs font-mono text-slate-500 uppercase">
                            {dotGradientEnd}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {colorMode === 'linear' && (
                    <div className="space-y-1.5 animate-fade-in">
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>{t.styles.gradientAngle}</span>
                        <span className="font-mono font-bold">{gradientRotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={gradientRotation}
                        onChange={(e) => setGradientRotation(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                {/* Background Setting */}
                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-3">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t.styles.backgroundMode}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBgMode(bgMode === 'transparent' ? 'solid' : 'transparent')}
                      className={`p-3 rounded-2xl text-xs font-bold border flex items-center justify-between transition-all ${
                        bgMode === 'transparent'
                          ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-500 dark:text-brand-400'
                          : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{t.styles.bgTransparent}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 font-mono">
                        PNG/SVG
                      </span>
                    </button>

                    {bgMode === 'solid' && (
                      <div className="p-2.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {t.styles.bgColor}
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                          />
                          <span className="text-xs font-mono text-slate-500 uppercase">{bgColor}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Correction Level */}
                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t.styles.errorCorrection}
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'L', label: t.styles.ecLevelL },
                      { id: 'M', label: t.styles.ecLevelM },
                      { id: 'Q', label: t.styles.ecLevelQ },
                      { id: 'H', label: t.styles.ecLevelH },
                    ].map((ec) => (
                      <button
                        key={ec.id}
                        type="button"
                        onClick={() => setErrorCorrection(ec.id)}
                        className={`p-2.5 rounded-2xl text-xs font-bold border transition-all text-center ${
                          errorCorrection === ec.id
                            ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-500 dark:text-brand-400 shadow-sm'
                            : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {ec.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.styles.errorCorrectionHint}</p>
                </div>

              </div>
            )}

            {/* TAB 3: LOGO & ICONS */}
            {activeTab === 'logo' && (
              <div role="tabpanel" id="panel-logo" aria-labelledby="tab-logo" className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm animate-fade-in">
                
                {/* Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {t.logo.uploadTitle}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t.logo.uploadSubtitle}
                      </p>
                    </div>
                    {logoImage && (
                      <button
                        type="button"
                        onClick={() => setLogoImage(null)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t.logo.removeLogo}</span>
                      </button>
                    )}
                  </div>

                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl cursor-pointer hover:border-brand-500 dark:hover:border-brand-400 bg-white/40 dark:bg-slate-900/40 hover:bg-brand-50/20 transition-all">
                    <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center">
                      {t.logo.dragDropText}
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Built-in Preset Icons */}
                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-3">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t.logo.presetIconsTitle}
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PRESET_ICONS.map((iconItem) => (
                      <button
                        key={iconItem.id}
                        type="button"
                        onClick={() => {
                          setLogoImage(iconItem.svg);
                          setErrorCorrection('H');
                        }}
                        className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:scale-105 transition-all flex flex-col items-center gap-1.5 shadow-sm"
                        title={iconItem.label}
                      >
                        <img src={iconItem.svg} alt={iconItem.label} className="w-6 h-6 object-contain" />
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate">
                          {iconItem.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logo Adjustments (Visible if logo is active) */}
                {logoImage && (
                  <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                          <span>{t.logo.logoSize}</span>
                          <span className="font-mono font-bold">{Math.round(logoSize * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.15"
                          max="0.45"
                          step="0.01"
                          value={logoSize}
                          onChange={(e) => setLogoSize(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                          <span>{t.logo.logoMargin}</span>
                          <span className="font-mono font-bold">{logoMargin}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="1"
                          value={logoMargin}
                          onChange={(e) => setLogoMargin(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={hideBackgroundDots}
                        onChange={(e) => setHideBackgroundDots(e.target.checked)}
                        className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 border-slate-300"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {t.logo.clearBgBehindLogo}
                      </span>
                    </label>
                  </div>
                )}

                {/* Privacy Badge */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.logo.privacyNotice}</span>
                </div>

              </div>
            )}

            {/* TAB 4: PRESETS */}
            {activeTab === 'presets' && (
              <div role="tabpanel" id="panel-presets" aria-labelledby="tab-presets" className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm animate-fade-in">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {t.presets.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Choose a professionally curated style template to apply instantly with 1-click.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {[
                    { id: 'classic', label: t.presets.classic, color1: '#000000', color2: '#1e293b', bg: '#ffffff' },
                    { id: 'oceanBlue', label: t.presets.oceanBlue, color1: '#FE7F2D', color2: '#06b6d4', bg: '#ffffff' },
                    { id: 'emeraldBusiness', label: t.presets.emeraldBusiness, color1: '#047857', color2: '#10b981', bg: '#ffffff' },
                    { id: 'sunsetViolet', label: t.presets.sunsetViolet, color1: '#7c3aed', color2: '#db2777', bg: '#ffffff' },
                    { id: 'cyberNeon', label: t.presets.cyberNeon, color1: '#06b6d4', color2: '#ec4899', bg: '#090d16' },
                    { id: 'royalGold', label: t.presets.royalGold, color1: '#b45309', color2: '#f59e0b', bg: '#0f172a' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.id)}
                      className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-brand-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-left shadow-sm flex flex-col gap-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400">
                          {preset.label}
                        </span>
                        <div className="flex items-center -space-x-1.5">
                          <div className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" style={{ backgroundColor: preset.color1 }} />
                          <div className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" style={{ backgroundColor: preset.color2 }} />
                        </div>
                      </div>
                      <div
                        className="w-full h-8 rounded-xl flex items-center justify-center text-[10px] font-mono font-bold tracking-wider"
                        style={{
                          background: `linear-gradient(135deg, ${preset.color1}, ${preset.color2})`,
                          color: '#ffffff',
                        }}
                      >
                        PREVIEW
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Sticky Live Preview & Export Toolbar (lg:col-span-5) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            {/* Live QR Preview Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-glass dark:shadow-glass-dark border border-slate-200/90 dark:border-slate-800/90 flex flex-col items-center text-center relative overflow-hidden qr-preview-card">
              
              {/* Top Card Header */}
              <div className="w-full flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>{t.preview.liveBadge}</span>
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {formData.type}
                </span>
              </div>

              {/* Live QR Code Canvas / SVG Container */}
              <div className="relative p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-inner flex items-center justify-center max-w-[340px] w-full aspect-square">
                <div ref={qrRef} className="flex items-center justify-center w-full h-full [&>svg]:w-full [&>svg]:h-full [&>canvas]:w-full [&>canvas]:h-full" />
              </div>

              {/* Contrast Health & Scannability Meter */}
              <div className="w-full mt-6">
                {contrastHealth.good ? (
                  <div className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-900/40">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>{t.preview.scanCheckGood}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200/60 dark:border-amber-900/40">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <span>{t.preview.scanCheckWarn}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Export & Download Controls Card */}
            <div className="glass-panel p-6 sm:p-7 rounded-3xl shadow-sm space-y-5">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                {t.preview.exportCardTitle}
              </h3>

              {/* Format & Resolution Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    {t.preview.formatLabel}
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="png">PNG (Raster HD)</option>
                    <option value="svg">SVG (Vector Lossless)</option>
                    <option value="webp">WEBP (Web Optimized)</option>
                    <option value="jpeg">JPEG (Photo Standard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    {t.preview.resolutionLabel}
                  </label>
                  <select
                    value={exportResolution}
                    disabled={exportFormat === 'svg'}
                    onChange={(e) => setExportResolution(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                  >
                    <option value="512">512 × 512 px (Small)</option>
                    <option value="1024">1024 × 1024 px (HD)</option>
                    <option value="2048">2048 × 2048 px (2K Ultra)</option>
                    <option value="4096">4096 × 4096 px (4K Print)</option>
                  </select>
                </div>
              </div>

              {/* Main Download Button */}
              <button
                type="button"
                disabled={isExporting}
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Generating...' : t.preview.downloadBtn}</span>
              </button>

              {/* Secondary Actions: Copy & Print */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleCopyClipboard(exportFormat === 'svg' ? 'svg' : 'png')}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700/60"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{exportFormat === 'svg' ? t.preview.copySvgBtn : t.preview.copyPngBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700/60"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.preview.printBtn}</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* PRINT-ONLY SHEET LAYOUT */}
      <div className="hidden print-only-container text-center p-8 bg-white text-black">
        <h1 className="text-3xl font-extrabold mb-2">{t.preview.printTitle}</h1>
        <p className="text-sm text-slate-600 mb-8 max-w-md">{t.preview.printInstructions}</p>
        
        <div className="p-6 border-4 border-black rounded-3xl inline-block mb-6">
          <div className="w-72 h-72 flex items-center justify-center">
            <span className="text-xs text-slate-400 font-mono">CreateQR Code</span>
          </div>
        </div>

        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          Created with CreateQR • https://createqr.github.io
        </p>
      </div>

    </section>
  );
}
