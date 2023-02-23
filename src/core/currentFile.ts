import { EventEmitter, ExtensionContext, Uri, window, workspace } from 'vscode';
import { throttle } from 'lodash';
import { DetectionResult } from '../types';
import { Global } from './global';
import { Analyst } from './analyst';
import { detectHardString, Log } from '../utils';

export class CurrentFile {
  static _onInvalidate = new EventEmitter<boolean>();
  static _onInitialized = new EventEmitter<void>();
  static _onHardStringDetected = new EventEmitter<
    DetectionResult[] | undefined
  >();
  static _currentUri: Uri | undefined;

  static onInvalidate = this._onInvalidate.event;
  static onInitialized = this._onInvalidate.event;
  static onHardStringDetected = this._onHardStringDetected.event;
  static hardStrings: DetectionResult[] | undefined;
  static _loaders: any = [];

  static watch(ctx: ExtensionContext) {
    ctx.subscriptions.push(
      workspace.onDidSaveTextDocument(
        (e) =>
          this._currentUri &&
          this._currentUri === e?.uri &&
          this.update(e?.uri),
      ),
    );
    ctx.subscriptions.push(
      workspace.onDidChangeTextDocument(
        (e) =>
          this._currentUri &&
          e?.document?.uri === this._currentUri &&
          this.throttleUpdate(e?.document?.uri),
      ),
    );
    ctx.subscriptions.push(
      window.onDidChangeActiveTextEditor(
        (e) => e?.document?.uri && this.update(e?.document?.uri),
      ),
    );
    ctx.subscriptions.push(Analyst.watch());
    this.update(window?.activeTextEditor?.document?.uri);
  }

  static invalidate() {
    this.hardStrings = undefined;
    this._onInvalidate.fire(true);
  }

  static throttleUpdate = throttle((uri?: Uri) => {
    this.update(uri);
  }, 100);

  static update(uri?: Uri) {
    this._currentUri = uri;
    this.invalidate();
    this._onInitialized.fire();
    this.updateLoader();
  }

  static updateLoader() {
    this._loaders = [Global.loader];
  }

  static get loaders() {
    return this._loaders;
  }

  static async DetectHardStrings(force = false) {
    try {
      if (!this.hardStrings || force) {
        this.hardStrings = await detectHardString();
        this._onHardStringDetected.fire(this.hardStrings);
      }
      return this.hardStrings;
    } catch (e) {
      Log.error('fail to extract current file', false);
      Log.error(e, false);
      this.hardStrings = [];
      return this.hardStrings;
    }
  }
}
