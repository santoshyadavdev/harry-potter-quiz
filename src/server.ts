import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

const angularApp = new AngularAppEngine();

/**
 * Supported locales and their base href prefixes.
 */
const SUPPORTED_LOCALES = ['en', 'de'] as const;
const DEFAULT_LOCALE = 'en';

/**
 * Detect locale from incoming URL path prefix (/en/ or /de/).
 * Falls back to Accept-Language header, then to the default locale.
 */
function detectLocale(req: Request): string {
  const url = new URL(req.url);
  const firstSegment = url.pathname.split('/')[1];
  if ((SUPPORTED_LOCALES as readonly string[]).includes(firstSegment)) {
    return firstSegment;
  }
  // Attempt Accept-Language header matching
  const acceptLang = req.headers.get('accept-language') ?? '';
  const preferred = acceptLang.split(',')[0]?.trim().split('-')[0] ?? '';
  if ((SUPPORTED_LOCALES as readonly string[]).includes(preferred)) {
    return preferred;
  }
  return DEFAULT_LOCALE;
}

/**
 * This is a request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(async (req) => {
  const url = new URL(req.url);

  // Redirect bare root "/" to the default locale
  if (url.pathname === '/') {
    return Response.redirect(new URL(`/${DEFAULT_LOCALE}/`, req.url), 302);
  }

  const locale = detectLocale(req);

  // Redirect requests without a locale prefix to the correct locale subpath
  const firstSegment = url.pathname.split('/')[1];
  if (!(SUPPORTED_LOCALES as readonly string[]).includes(firstSegment)) {
    const redirectUrl = new URL(`/${locale}${url.pathname}${url.search}`, req.url);
    return Response.redirect(redirectUrl, 302);
  }

  const res = await angularApp.handle(req);
  return res ?? new Response('Page not found.', { status: 404 });
});

export default { fetch: reqHandler };
