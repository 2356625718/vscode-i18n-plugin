import {
  ExtensionContext,
  workspace,
  window,
  WorkspaceFolder,
  EventEmitter,
  ConfigurationChangeEvent,
} from 'vscode';
import { PLUGIN_NAME } from '../const';
import { getEnabledFramework } from '../frameworks';
import { Framework } from '../frameworks/base';
import { LanguageId, Log } from '../utils';
import { normalizeUsageMatchRegExp } from '../utils/RegExp';
import { Config } from './config';

export class Global {
  private static _loaders: Record<string, any> = {};
  private static _currentWorkspaceFolder: WorkspaceFolder;
  private static _rootpath: string;
  private static _onDidChangeRootPath: EventEmitter<string> =
    new EventEmitter();
  private static _onDidChangeLoader: EventEmitter<any> = new EventEmitter();

  static context: ExtensionContext;
  static enableFrameworks: Framework[] = [];
  static _cacheUsageMatchRegExp: RegExp[] = [];

  static async init(context: ExtensionContext) {
    this.context = context;

    context.subscriptions.push(
      workspace.onDidChangeWorkspaceFolders(() => this.updateRootPath()),
    );
    context.subscriptions.push(
      window.onDidChangeActiveTextEditor(() => this.updateRootPath()),
    );
    context.subscriptions.push(
      workspace.onDidOpenTextDocument(() => this.updateRootPath()),
    );
    context.subscriptions.push(
      workspace.onDidCloseTextDocument(() => this.updateRootPath()),
    );
    context.subscriptions.push(
      workspace.onDidChangeConfiguration((e) => this.update(e)),
    );
    await this.updateRootPath();
  }

  private static async updateRootPath() {
    const editor = window.activeTextEditor;
    let rootpath = '';

    if (
      !editor ||
      !workspace.workspaceFolders ||
      workspace.workspaceFolders.length === 0
    ) {
      return;
    }
    const resource = editor.document.uri;
    if (resource.scheme === 'file') {
      const folder = workspace.getWorkspaceFolder(resource);
      if (folder) {
        this._currentWorkspaceFolder = folder;
        rootpath = folder.uri.fsPath;
      }
    }
    if (!rootpath && workspace.rootPath) {
      rootpath = workspace.rootPath;
    }
    if (rootpath && rootpath !== this._rootpath) {
      this._rootpath = rootpath;
      Log.divider();
      Log.info(`💼 Workspace root changed to "${rootpath}"`);
      await this.update();
      this._onDidChangeRootPath.fire(rootpath);
    }
  }

  static async update(e?: ConfigurationChangeEvent) {
    let reload = false;
    if (e) {
      for (const config of Config.reloadConfig) {
        const key = `${PLUGIN_NAME}.${config}`;
        if (e.affectsConfiguration(key)) {
          reload = true;
          Log.info(`🧰 Config "${key}" changed, reloading`);
          break;
        }
      }
      if (reload) {
        Log.info('🔁 Reloading loader');
      }
    }
    this.enableFrameworks = getEnabledFramework();
    const isValidProject = this.enableFrameworks.length > 0;
    if (isValidProject) {
      Log.info(
        `🧩 Enabled frameworks: ${this.enableFrameworks
          .map((i: Framework) => i.display)
          .join(', ')}`,
      );
    } else {
      Log.info(
        '⚠ Current workspace is not a valid project, extension disabled',
      );
    }
  }

  static get loader() {
    return this._loaders[this._rootpath];
  }

  static getUsageMatchRegex() {
    if (this._cacheUsageMatchRegExp.length) {
      return this._cacheUsageMatchRegExp;
    }
    this._cacheUsageMatchRegExp = normalizeUsageMatchRegExp(
      this.enableFrameworks.flatMap((i) => i.usageMatchRegex),
    );
    return this._cacheUsageMatchRegExp;
  }
}
