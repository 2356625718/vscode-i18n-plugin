import { window, OutputChannel } from 'vscode';
import { PLUGIN_NAME } from '../const';

export class Log {
  private static _channel: OutputChannel;

  static get outputChannel(): OutputChannel {
    if (!this._channel) {
      this._channel = window.createOutputChannel(PLUGIN_NAME);
    }
    return this._channel;
  }

  static raw(...values: any[]) {
    this.outputChannel.appendLine(values.map((i) => i.toString()).join(' '));
  }

  static info(message: string, intend = 0) {
    this.outputChannel.appendLine(`${'\t'.repeat(intend)}${message}`);
  }

  static warn(message: string, prompt = false, intend = 0) {
    if (prompt) {
      window.showWarningMessage(message);
    }
    this.info(`⚠ WARN: ${message}`, intend);
  }

  static error(err: Error | string | any = {}, prompt = true, intend = 0) {
    if (typeof err !== 'string') {
      const message = [
        err.message,
        err?.response?.data,
        err.stack,
        err?.toJSON?.(),
      ]
        .filter(Boolean)
        .join('\n');
      this.info(`🐛 ERROR: ${err.name}: ${message}`, intend);
    }
    const message =
      typeof err === 'string' ? err : `${PLUGIN_NAME}: ${err.toString()}`;
    this.show();
    this.info(`🐛 ERROR: ${message}`, intend);
    if (prompt) {
      window.showErrorMessage(message);
    }
  }

  static show() {
    this.outputChannel.show();
  }

  static divider() {
    this.outputChannel.appendLine('\n————————\n');
  }
}
