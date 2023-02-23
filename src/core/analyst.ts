import { TextDocument, workspace } from 'vscode';

export class Analyst {
  static watch() {
    return workspace.onDidSaveTextDocument((doc) => this.updateCache(doc));
  }

  private static async updateCache(doc: TextDocument) {}
}
