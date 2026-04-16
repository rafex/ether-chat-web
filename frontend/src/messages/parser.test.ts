import { describe, it, expect } from 'vitest';
import { parseAgentMessage, hasTinkerBlocks } from './parser';

describe('parseAgentMessage', () => {
  it('returns text unchanged when there are no tinker blocks', () => {
    const result = parseAgentMessage('Hello, how can I help you?');
    expect(result.text).toBe('Hello, how can I help you?');
    expect(result.tinkerBlocks).toHaveLength(0);
  });

  it('extracts a single tinker block', () => {
    const raw = 'Answer: 42 <tinker>internal reasoning</tinker>';
    const result = parseAgentMessage(raw);
    expect(result.tinkerBlocks).toHaveLength(1);
    expect(result.tinkerBlocks[0].content).toBe('internal reasoning');
    expect(result.text).toContain('[__tinker:tinker-1__]');
    expect(result.text).not.toContain('<tinker>');
  });

  it('extracts multiple tinker blocks', () => {
    const raw = '<tinker>step one</tinker> result <tinker>step two</tinker>';
    const result = parseAgentMessage(raw);
    expect(result.tinkerBlocks).toHaveLength(2);
    expect(result.tinkerBlocks[0].content).toBe('step one');
    expect(result.tinkerBlocks[1].content).toBe('step two');
  });

  it('ignores empty tinker blocks', () => {
    const raw = 'hello <tinker></tinker> world';
    const result = parseAgentMessage(raw);
    expect(result.tinkerBlocks).toHaveLength(0);
  });

  it('ignores tinker blocks with only whitespace', () => {
    const raw = 'hello <tinker>   </tinker> world';
    const result = parseAgentMessage(raw);
    expect(result.tinkerBlocks).toHaveLength(0);
  });

  it('handles multiline tinker content', () => {
    const raw = '<tinker>\nline 1\nline 2\n</tinker> final';
    const result = parseAgentMessage(raw);
    expect(result.tinkerBlocks[0].content).toBe('line 1\nline 2');
  });

  it('handles malformed unclosed tinker tag gracefully', () => {
    const raw = 'text <tinker>unclosed content';
    const result = parseAgentMessage(raw);
    expect(result.tinkerBlocks).toHaveLength(0);
    expect(result.text).toContain('<tinker>');
  });

  it('assigns unique ids to each block', () => {
    const raw = '<tinker>a</tinker><tinker>b</tinker><tinker>c</tinker>';
    const result = parseAgentMessage(raw);
    const ids = result.tinkerBlocks.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('hasTinkerBlocks', () => {
  it('returns true when tinker blocks are present', () => {
    expect(hasTinkerBlocks('text <tinker>x</tinker> more')).toBe(true);
  });

  it('returns false when no tinker blocks are present', () => {
    expect(hasTinkerBlocks('plain text')).toBe(false);
  });
});
