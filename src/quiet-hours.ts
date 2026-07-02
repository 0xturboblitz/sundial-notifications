import type { NotificationKind } from './channels.js';

// Quiet hours: no push between 22:00 and 08:00 in the recipient's local time.
const QUIET_START = 22; // inclusive
const QUIET_END = 8; // exclusive

// Urgent kinds queue their push and flush at the window end; others drop it.
export const URGENT_KINDS: ReadonlySet<NotificationKind> = new Set([
  'mention',
  'comment_reply',
]);

/** Local wall-clock hour (0–23) of `at` in the given IANA timezone. */
function localHour(at: Date, timezone: string): number {
  const hour = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false,
  }).format(at);
  // Intl renders midnight as "24" in some engines; normalise to 0.
  return Number(hour) % 24;
}

/** True when `at` falls inside the 22:00–08:00 quiet window in `timezone`. */
export function isQuietHours(at: Date, timezone: string): boolean {
  const hour = localHour(at, timezone);
  return hour >= QUIET_START || hour < QUIET_END;
}
