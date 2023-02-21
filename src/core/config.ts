import { workspace, ConfigurationScope } from 'vscode';

import { PLUGIN_NAME } from '../const';

export class Config {
  private static getConfig<T = any>(
    key: string,
    scope?: ConfigurationScope | undefined,
  ): T | undefined {
    return workspace.getConfiguration(PLUGIN_NAME, scope).get(key);
  }

  static funcName() {
    return this.getConfig<string>('funcName') ?? '$t';
  }

  static dir() {
    return this.getConfig<string>('dir') ?? 'assets/i18n';
  }
}
