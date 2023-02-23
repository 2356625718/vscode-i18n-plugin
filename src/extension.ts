import * as vscode from 'vscode';
import { Log } from './utils';
import { version } from '../package.json';
import { KeyDetector, Global, CurrentFile } from './core';

export function activate(ctx: vscode.ExtensionContext) {
  Log.info(`i18n-shopee activated, version: ${version}`);
  Global.init(ctx);
  KeyDetector.init(ctx);
  CurrentFile.watch(ctx);
}

export function deactivate() {
  Log.info(`i18n-shopee deactivated`);
}
