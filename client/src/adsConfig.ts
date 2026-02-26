/**
 * AdSense configuration.
 *
 * To enable ads:
 *  1. Replace ADS_CLIENT with your real publisher ID (e.g. 'ca-pub-1234567890123456').
 *  2. Set ADS_ENABLED to true.
 *  3. Replace the slot IDs in each AdBanner instance with your real ad slot IDs.
 *
 * The global window.ADS_ENABLED flag (set in public/index.html) controls whether
 * the AdSense library script is loaded at all. This file mirrors that value so
 * React components can read it without accessing window directly.
 */

/**
 * Master switch – set to true to activate all ad placements.
 *
 * This value is read once at module load time from window.ADS_ENABLED (set in
 * public/index.html). It is intentionally static: to change ad visibility you
 * update index.html and redeploy. For a fully dynamic runtime toggle, read
 * `(window as any).ADS_ENABLED` directly inside components instead.
 */
export const ADS_ENABLED: boolean =
    typeof window !== 'undefined' && (window as any).ADS_ENABLED === true;

/** Your AdSense publisher ID. Replace before going live. */
export const ADS_CLIENT: string = 'ca-pub-XXXXXXXXXXXXXXXX';

/** Ad slot IDs for each placement. Replace with real slot IDs before going live. */
export const AD_SLOTS = {
    /** Leaderboard banner displayed below the page header. */
    header: 'XXXXXXXXXX',
    /** Rectangle banner displayed between content sections. */
    inline: 'XXXXXXXXXX',
} as const;
