/**
 * Brand Concierge loader — lazy-mounts the shared AI concierge widget and
 * exposes a nav trigger (sparkle) as the primary affordance.
 *
 * Config is author-controlled via page metadata, falling back to the shared
 * Brand Concierge Supabase project. The AvKARE experience is themed per its
 * own `site_key`, so no production backend is touched:
 *   concierge-url   Supabase URL
 *   concierge-key   Supabase anon key
 *   concierge-site  tenant/site key (default: avkare)
 */

import { getMetadata } from './ak.js';

const SPARKLE_SVG = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
  + '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>'
  + '<path d="M20 3v4"/><path d="M22 5h-4"/>'
  + '<path d="M4 17v2"/><path d="M5 18H3"/></svg>';

const WIDGET_BASE = 'https://bwb1066.github.io/brand-concierge/widget/';
// Version query busts the browser/CDN module cache when the widget updates.
const WIDGET_URL = `${WIDGET_BASE}brand-concierge.js?v=avkare1`;
// eslint-disable-next-line max-len
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5anF1d2hrbXp5ZWRrd3VhZmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjY4MjcsImV4cCI6MjA5MDY0MjgyN30.GkMBLXBZr9u34m4uI6ZR-2ZniLZD3RkjropjQw058k4';
const SUPABASE_URL = getMetadata('concierge-url') || 'https://cyjquwhkmzyedkwuaffc.supabase.co';
const SUPABASE_KEY = getMetadata('concierge-key') || DEFAULT_KEY;
const SITE_KEY = getMetadata('concierge-site') || 'avkare';

let chatModule = null;

async function openConcierge() {
  // Expose the commerce store (window.brandCommerce) so the widget can offer
  // add-to-quote on any page — the sparkle lives in the global nav, but
  // commerce.js otherwise only loads on pages that have a commerce block.
  await import('./commerce.js');
  if (!chatModule) {
    // eslint-disable-next-line import/no-unresolved
    chatModule = await import(WIDGET_URL);
    chatModule.init({
      supabaseUrl: SUPABASE_URL,
      anonKey: SUPABASE_KEY,
      siteKey: SITE_KEY,
      showTrigger: false,
      widgetBase: WIDGET_BASE,
    });
  }
  chatModule.default();
}

/**
 * Build the nav sparkle trigger. Placed by the header block.
 * @param {{ label?: string, compact?: boolean }} opts
 * @returns {HTMLButtonElement}
 */
export function createConciergeTrigger({ label = 'Ask AI', compact = false } = {}) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-concierge';
  btn.setAttribute('aria-label', 'Ask the AvKARE AI Concierge');
  btn.innerHTML = compact ? SPARKLE_SVG : `${SPARKLE_SVG}<span class="nav-concierge-text">${label}</span>`;
  btn.addEventListener('click', openConcierge);
  return btn;
}

/** Fixed corner bubble fallback (unused when the nav trigger is present). */
export function mountCornerBubble() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'chatbot-bubble';
  btn.setAttribute('aria-label', 'Ask the AvKARE AI Concierge');
  btn.innerHTML = SPARKLE_SVG;
  btn.addEventListener('click', openConcierge);
  document.body.append(btn);
}
