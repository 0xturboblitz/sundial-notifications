export type Channel = 'push' | 'email' | 'in_app';

export type NotificationKind =
  | 'mention'
  | 'comment_reply'
  | 'agent_run_finished'
  | 'suggestion_pending'
  | 'workspace_invite';

// Per-kind channel routing (spec: Channels).
export const ROUTES: Record<NotificationKind, Channel[]> = {
  mention: ['push', 'in_app'],
  comment_reply: ['push', 'in_app'],
  agent_run_finished: ['in_app'],
  suggestion_pending: ['in_app', 'email'],
  workspace_invite: ['email', 'in_app'],
};
