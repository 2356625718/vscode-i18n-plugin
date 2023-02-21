import { workspace, ExtensionContext } from 'vscode';
import { KeyInDocument } from './index';

export class KeyDetector {
  private static _cache: Record<string, KeyInDocument> = {};

  static init(ctx: ExtensionContext) {
    workspace.onDidChangeTextDocument(
      (e) => delete this._cache[e.document.uri.fsPath],
      null,
      ctx.subscriptions,
    );
  }
}
