import type { Message, TinkerBlock } from '@/types';
import { parseAgentMessage } from './parser';

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function normalizeAgentMessage(raw: string): Message {
  const parsed = parseAgentMessage(raw);

  const tinkerBlocks: TinkerBlock[] = parsed.tinkerBlocks.map((b) => ({
    id: b.id,
    content: b.content,
    isVisible: false,
  }));

  return {
    id: generateId(),
    role: 'agent',
    rawContent: raw,
    content: parsed.text,
    timestamp: new Date(),
    tinkerBlocks,
  };
}

export function buildUserMessage(text: string): Message {
  const sanitized = escapeHtml(text.trim());
  return {
    id: generateId(),
    role: 'user',
    rawContent: text,
    content: sanitized,
    timestamp: new Date(),
    tinkerBlocks: [],
  };
}

/** Escape HTML entities to prevent XSS from user input. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
