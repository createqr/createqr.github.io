import { ui, defaultLang, languages, type SupportedLanguage } from './ui';

export { languages, defaultLang, type SupportedLanguage };

/**
 * Extracts current language from the URL path.
 * Paths starting with /es/, /pt/, /de/, /fr/, /ja/ map to those languages.
 * Root / or unrecognized prefixes fallback to 'en'.
 */
export function getLangFromUrl(url: URL): SupportedLanguage {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in ui) {
    return lang as SupportedLanguage;
  }
  return defaultLang;
}

/**
 * Returns the translation dictionary object for the given locale.
 */
export function useTranslations(lang: SupportedLanguage) {
  return ui[lang] || ui[defaultLang];
}

/**
 * Returns a localized URL path for language switching.
 * E.g., for targetLang 'es', path '/' -> '/es/'
 * for targetLang 'en', path '/es/' -> '/'
 */
export function getLocalizedPath(targetLang: SupportedLanguage, currentPathname: string = '/'): string {
  // Strip existing lang prefix if present
  const segments = currentPathname.split('/').filter(Boolean);
  let cleanPath = '';
  
  if (segments.length > 0 && segments[0] in ui) {
    cleanPath = segments.slice(1).join('/');
  } else {
    cleanPath = segments.join('/');
  }

  if (targetLang === defaultLang) {
    return cleanPath ? `/${cleanPath}/` : '/';
  }

  return cleanPath ? `/${targetLang}/${cleanPath}/` : `/${targetLang}/`;
}

/**
 * Generates alternate hreflang entries for SEO <head> tag.
 */
export function getHreflangLinks(siteUrl: string = 'https://createqr.github.io', currentPathname: string = '/') {
  const cleanBase = siteUrl.replace(/\/$/, '');
  const locales = Object.keys(languages) as SupportedLanguage[];

  const links = locales.map((lang) => ({
    lang,
    href: `${cleanBase}${getLocalizedPath(lang, currentPathname)}`,
  }));

  // Add x-default pointing to the default English root
  links.push({
    lang: 'x-default' as any,
    href: `${cleanBase}/`,
  });

  return links;
}
