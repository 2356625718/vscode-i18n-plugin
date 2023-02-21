import {
  ExtensionContext,
  workspace,
  window,
  WorkspaceFolder,
  EventEmitter,
  ConfigurationChangeEvent,
} from 'vscode';
import { Log } from '../utils';

export class Global {
  private static _currentWorkspaceFolder: WorkspaceFolder;
  private static _rootpath: string;
  private static _onDidChangeRootPath: EventEmitter<string> =
    new EventEmitter();

  static context: ExtensionContext;

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
    // context.subscriptions.push(
    //   workspace.onDidChangeConfiguration(e => this.update(e))
    // )
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
  }
}
