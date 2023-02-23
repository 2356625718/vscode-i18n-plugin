import { workspace, ExtensionContext, window, TextDocument } from 'vscode';
import { Log } from '../utils';
import { regFindKeys } from '../utils/RegExp';
import { Global, KeyInDocument } from './index';

export class KeyDetector {
  private static _cache: Record<string, KeyInDocument[]> = {};

  static init(ctx: ExtensionContext) {
    workspace.onDidChangeTextDocument(
      (e) => delete this._cache[e.document.uri.fsPath],
      null,
      ctx.subscriptions,
    );
    KeyDetector.getKeys(window.activeTextEditor?.document.getText() as string);
  }

  static getKeyByContent(text: string) {
    const keys = new Set<string>();
    const regs = Global.getUsageMatchRegex();
    for (const reg of regs) {
      (text.match(reg) || []).forEach((key) => {
        keys.add(key.replace(reg, '$1'));
      });
    }
    return Array.from(keys);
  }

  static getKeys(doc: TextDocument | string, regs?: RegExp[]): KeyInDocument[] {
    let text = '',
      filepath = '';
    if (typeof doc !== 'string') {
      filepath = doc.uri.fsPath;
      if (this._cache[filepath]) {
        return this._cache[filepath];
      }
      regs = regs ?? Global.getUsageMatchRegex();
      text = doc.getText();
    } else {
      regs = Global.getUsageMatchRegex();
      text = doc;
    }
    const keys = regFindKeys(text, regs);
    if (filepath) {
      this._cache[filepath] = keys;
    }
    return keys;
  }
}
