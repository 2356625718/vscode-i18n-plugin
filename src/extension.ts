import * as vscode from 'vscode';
import { Log } from './utils';
import { version } from '../package.json';
import { KeyDetector, Global } from './core';

export function activate(ctx: vscode.ExtensionContext) {
  Log.info(`I18n-Shopee activated, version: ${version}`);
  KeyDetector.init(ctx);
  Global.init(ctx);
}

export function deactivate() {}
