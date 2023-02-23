import { workspace, ConfigurationScope } from 'vscode';

import { PLUGIN_NAME } from '../const';

export class Config {
  static readonly reloadConfig = ['dir'];
  private static getConfig<T = any>(
    key: string,
    scope?: ConfigurationScope | undefined,
  ): T | undefined {
    return workspace.getConfiguration(PLUGIN_NAME, scope).get(key);
  }

  static dir() {
    return Config.getConfig<string>('dir') ?? 'assets/i18n';
  }
}
