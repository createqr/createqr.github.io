export type QrDataType = 'url' | 'wifi' | 'vcard' | 'text' | 'email' | 'phone' | 'sms' | 'crypto';

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  jobTitle: string;
  website: string;
  address: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface CryptoData {
  coin: 'BTC' | 'ETH' | 'SOL' | 'USDT';
  address: string;
  amount: string;
}

export interface QrFormData {
  type: QrDataType;
  url: string;
  wifi: WifiData;
  vcard: VCardData;
  text: string;
  email: EmailData;
  phone: string;
  sms: SmsData;
  crypto: CryptoData;
}

export const initialFormData: QrFormData = {
  type: 'url',
  url: 'https://createqr.github.io',
  wifi: {
    ssid: 'CreateQR_Guest_5G',
    password: 'HighSpeedWiFi2026',
    encryption: 'WPA',
    hidden: false,
  },
  vcard: {
    firstName: 'Alex',
    lastName: 'Morgan',
    phone: '+1 (555) 234-5678',
    email: 'alex.morgan@example.com',
    company: 'Creative Innovations Lab',
    jobTitle: 'Principal Product Architect',
    website: 'https://createqr.github.io',
    address: '100 Silicon Way, San Francisco, CA 94107',
  },
  text: 'Welcome to CreateQR! Design high-resolution, custom vector QR codes directly in your browser with 100% privacy.',
  email: {
    email: 'contact@createqr.github.io',
    subject: 'Inquiry from Custom QR Code',
    body: 'Hello! I scanned your QR code and would like to connect.',
  },
  phone: '+15552345678',
  sms: {
    phone: '+15552345678',
    message: 'Hi! Let’s meet up soon.',
  },
  crypto: {
    coin: 'BTC',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    amount: '0.005',
  },
};

/**
 * Escapes characters for standard Wi-Fi QR string formatting.
 */
function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:"])/g, '\\$1');
}

/**
 * Formats data object into standard QR payload string based on data type.
 */
export function formatQrPayload(data: QrFormData): string {
  switch (data.type) {
    case 'url': {
      const trimmed = (data.url || '').trim();
      if (!trimmed) return 'https://createqr.github.io';
      // If user typed without protocol, prepend https://
      if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
        return `https://${trimmed}`;
      }
      return trimmed;
    }

    case 'wifi': {
      const { ssid, password, encryption, hidden } = data.wifi;
      const cleanSsid = escapeWifiString(ssid.trim());
      const cleanPass = escapeWifiString(password);
      const encType = encryption === 'nopass' ? 'nopass' : encryption;
      const isHidden = hidden ? 'true' : 'false';

      if (!cleanSsid) return 'WIFI:S:MyWiFi;T:nopass;;';

      if (encType === 'nopass') {
        return `WIFI:S:${cleanSsid};T:nopass;H:${isHidden};;`;
      }
      return `WIFI:S:${cleanSsid};T:${encType};P:${cleanPass};H:${isHidden};;`;
    }

    case 'vcard': {
      const { firstName, lastName, phone, email, company, jobTitle, website, address } = data.vcard;
      const fn = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ') || 'Contact Person';
      
      const vcardLines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${lastName.trim()};${firstName.trim()};;;`,
        `FN:${fn}`,
      ];

      if (company.trim()) vcardLines.push(`ORG:${company.trim()}`);
      if (jobTitle.trim()) vcardLines.push(`TITLE:${jobTitle.trim()}`);
      if (phone.trim()) vcardLines.push(`TEL;TYPE=CELL,VOICE:${phone.trim()}`);
      if (email.trim()) vcardLines.push(`EMAIL;TYPE=WORK,INTERNET:${email.trim()}`);
      if (website.trim()) {
        const cleanWeb = website.trim().startsWith('http') ? website.trim() : `https://${website.trim()}`;
        vcardLines.push(`URL:${cleanWeb}`);
      }
      if (address.trim()) vcardLines.push(`ADR;TYPE=WORK:;;${address.trim()};;;;`);
      
      vcardLines.push('END:VCARD');
      return vcardLines.join('\n');
    }

    case 'text': {
      return (data.text || '').trim() || 'CreateQR Code';
    }

    case 'email': {
      const { email, subject, body } = data.email;
      const target = (email || '').trim();
      const params = new URLSearchParams();
      if (subject.trim()) params.append('subject', subject.trim());
      if (body.trim()) params.append('body', body.trim());

      const qs = params.toString();
      return `mailto:${target}${qs ? `?${qs}` : ''}`;
    }

    case 'phone': {
      const cleanPhone = (data.phone || '').replace(/[^\d+]/g, '');
      return `tel:${cleanPhone || '+15551234567'}`;
    }

    case 'sms': {
      const { phone, message } = data.sms;
      const cleanPhone = phone.replace(/[^\d+]/g, '');
      if (message.trim()) {
        return `smsto:${cleanPhone}:${message.trim()}`;
      }
      return `smsto:${cleanPhone}`;
    }

    case 'crypto': {
      const { coin, address, amount } = data.crypto;
      const cleanAddr = (address || '').trim();
      const cleanAmount = (amount || '').trim();

      if (!cleanAddr) return 'bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

      switch (coin) {
        case 'BTC':
          return cleanAmount ? `bitcoin:${cleanAddr}?amount=${cleanAmount}` : `bitcoin:${cleanAddr}`;
        case 'ETH':
          return cleanAmount ? `ethereum:${cleanAddr}?value=${cleanAmount}` : `ethereum:${cleanAddr}`;
        case 'SOL':
          return cleanAmount ? `solana:${cleanAddr}?amount=${cleanAmount}` : `solana:${cleanAddr}`;
        case 'USDT':
          return cleanAmount ? `ethereum:${cleanAddr}?amount=${cleanAmount}` : cleanAddr;
        default:
          return cleanAddr;
      }
    }

    default:
      return 'https://createqr.github.io';
  }
}
