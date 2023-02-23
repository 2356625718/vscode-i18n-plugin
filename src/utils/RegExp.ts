import { QUOTE_SYMBOLS } from '../const';
import { Config, KeyInDocument } from '../core';
import { Log } from './Log';

export function normalizeUsageMatchRegExp(reg: (string | RegExp)[]): RegExp[] {
  return reg
    .map((i) => {
      if (typeof i === 'string') {
        try {
          return new RegExp(i, 'mg');
        } catch (e) {
          Log.error(e, false);
          return undefined;
        }
      }
      return i;
    })
    .filter((i) => i) as RegExp[];
}

export function regFindKeys(text: string, regs: RegExp[]): KeyInDocument[] {
  const keys: KeyInDocument[] = [];
  for (const reg of regs) {
    let match = null;
    reg.lastIndex = 0;
    while ((match = reg.exec(text))) {
      const key = handleRegMatch(text, match);
      if (key) {
        keys.push(key);
      }
    }
  }
  return keys;
}

export function handleRegMatch(
  text: string,
  match: RegExpExecArray,
): KeyInDocument | undefined {
  const matchString = match[0];
  let key = match[1];
  if (!key) {
    return;
  }
  const start = match.index + matchString.lastIndexOf(key);
  const end = start + key.length;
  const quoted = QUOTE_SYMBOLS.includes(text[start - 1]);
  return {
    key,
    start,
    end,
    quoted,
  };
}
