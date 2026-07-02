import { ROUTES, type Channel, type NotificationKind } from './channels.js';
import { isQuietHours, URGENT_KINDS } from './quiet-hours.js';

export interface Notification {
  id: string;
  kind: NotificationKind;
  userId: string;
  workspaceId: string;
  createdAt: Date;
  /** IANA timezone of the recipient, e.g. "America/Los_Angeles". */
  timezone: string;
}

// Pushes held back during quiet hours for urgent kinds; flushed at 08:00.
const pushQueue: Notification[] = [];

export async function deliver(n: Notification): Promise<Channel[]> {
  const quiet = isQuietHours(n.createdAt, n.timezone);
  const sent: Channel[] = [];
  for (const channel of ROUTES[n.kind]) {
    if (channel === 'push' && quiet) {
      // Urgent kinds queue for the window end; everything else drops the push.
      if (URGENT_KINDS.has(n.kind)) pushQueue.push(n);
      continue;
    }
    await send(channel, n);
    sent.push(channel);
  }
  return sent;
}

/** Deliver queued pushes whose quiet window has ended as of `now`. */
export async function flushQueuedPushes(now: Date): Promise<Notification[]> {
  const ready = pushQueue.filter((n) => !isQuietHours(now, n.timezone));
  for (const n of ready) {
    pushQueue.splice(pushQueue.indexOf(n), 1);
    await send('push', n);
  }
  return ready;
}

async function send(channel: Channel, n: Notification): Promise<void> {
  // Transport adapters are injected in prod; this is the seam the tests use.
  void channel;
  void n;
}
