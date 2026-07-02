import { ROUTES, type Channel, type NotificationKind } from './channels.js';

export interface Notification {
  id: string;
  kind: NotificationKind;
  userId: string;
  workspaceId: string;
  createdAt: Date;
  /** IANA timezone of the recipient, e.g. "America/Los_Angeles". */
  timezone: string;
}

export async function deliver(n: Notification): Promise<Channel[]> {
  const sent: Channel[] = [];
  for (const channel of ROUTES[n.kind]) {
    await send(channel, n);
    sent.push(channel);
  }
  return sent;
}

async function send(channel: Channel, n: Notification): Promise<void> {
  // Transport adapters are injected in prod; this is the seam the tests use.
  void channel;
  void n;
}
