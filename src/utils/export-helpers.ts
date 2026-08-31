import confetti from 'canvas-confetti';

export type ExportFormat = 'png' | 'svg' | 'webp' | 'jpeg';
export type ExportResolution = 512 | 1024 | 2048 | 4096;

/**
 * Fires celebration confetti on successful export or copy.
 */
export function triggerSuccessConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.75 },
      colors: ['#FE7F2D', '#fe9749', '#10b981', '#f59e0b', '#8b5cf6'],
      disableForReducedMotion: true,
    });
  } catch (e) {
    console.debug('Confetti animation suppressed', e);
  }
}

/**
 * Downloads a Blob as a file in the browser.
 */
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/**
 * Creates a fresh, dedicated QRCodeStyling instance at the exact target
 * resolution and uses the library's own getRawData() to export.
 *
 * getRawData() is a Promise that internally waits for all async operations
 * (including logo image loading) to complete before resolving, so there
 * are zero race conditions.
 *
 * - SVG format:  instance type 'svg'  → getRawData('svg')
 * - Raster fmts: instance type 'canvas' → getRawData('png'|'webp'|'jpeg')
 */
export async function exportQrCode({
  currentOptions,
  format,
  resolution,
  baseFilename = 'custom-qr-code',
}: {
  currentOptions: Record<string, any>;
  format: ExportFormat;
  resolution: ExportResolution;
  baseFilename?: string;
}): Promise<boolean> {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19);
  const filename = `${baseFilename}-${resolution}px-${timestamp}.${format}`;

  try {
    const QRCodeStyling = (await import('qr-code-styling')).default;

    const isSvg = format === 'svg';

    // Create a fresh export instance at the exact target resolution.
    // Using 'svg' type for SVG exports, 'canvas' type for raster exports.
    const exportInstance = new QRCodeStyling({
      ...currentOptions,
      width: resolution,
      height: resolution,
      type: isSvg ? 'svg' : 'canvas',
    });

    // getRawData() returns a Promise<Blob> that resolves AFTER all internal
    // async operations (image loading, drawing) are complete.
    // Cast to Blob since this code only runs in the browser (never Node Buffer).
    const blob = (await exportInstance.getRawData(format)) as Blob | null;

    if (!blob || blob.size === 0) {
      console.error('getRawData returned empty blob for format:', format);
      return false;
    }

    triggerDownload(blob, filename);
    triggerSuccessConfetti();
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
}

/**
 * Copies the QR code to the clipboard as SVG text or PNG image.
 * Creates a fresh instance at 1024px to guarantee logo fidelity.
 */
export async function copyQrToClipboard({
  currentOptions,
  type = 'png',
}: {
  currentOptions: Record<string, any>;
  type?: 'svg' | 'png';
}): Promise<boolean> {
  try {
    const QRCodeStyling = (await import('qr-code-styling')).default;

    const isSvg = type === 'svg';
    const copyResolution = 1024;

    const exportInstance = new QRCodeStyling({
      ...currentOptions,
      width: copyResolution,
      height: copyResolution,
      type: isSvg ? 'svg' : 'canvas',
    });

    const blob = (await exportInstance.getRawData(type)) as Blob | null;

    if (!blob || blob.size === 0) return false;

    if (isSvg) {
      const svgText = await blob.text();
      await navigator.clipboard.writeText(svgText);
      triggerSuccessConfetti();
      return true;
    }

    // PNG clipboard copy
    if (navigator.clipboard && (window as any).ClipboardItem) {
      const item = new (window as any).ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      triggerSuccessConfetti();
      return true;
    }

    return false;
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    return false;
  }
}

/**
 * Prepares the window for printing clean QR sheets.
 */
export function printQrSheet() {
  window.print();
}
