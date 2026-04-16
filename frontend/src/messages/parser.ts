/**
 * Parses agent messages to extract <tinker>...</tinker> blocks.
 *
 * Rules:
 * - A tinker block starts with <tinker> and ends with </tinker>.
 * - Blocks can be nested only one level (inner tags are treated as content).
 * - Malformed blocks (unclosed or empty tags) are ignored and left as-is.
 * - The remaining text after extraction is the visible text.
 */

export interface ParsedTinkerBlock {
  id: string;
  content: string;
}

export interface ParsedMessage {
  text: string;
  tinkerBlocks: ParsedTinkerBlock[];
}

const TINKER_RE = /<tinker>([\s\S]*?)<\/tinker>/g;

export function parseAgentMessage(raw: string): ParsedMessage {
  const blocks: ParsedTinkerBlock[] = [];
  let counter = 0;

  const text = raw.replace(TINKER_RE, (_match, content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return '';
    const id = `tinker-${++counter}`;
    blocks.push({ id, content: trimmed });
    return `[__tinker:${id}__]`;
  });

  return {
    text: text.trim(),
    tinkerBlocks: blocks,
  };
}

/** Checks whether a raw string contains any tinker block. */
export function hasTinkerBlocks(raw: string): boolean {
  TINKER_RE.lastIndex = 0;
  return TINKER_RE.test(raw);
}
