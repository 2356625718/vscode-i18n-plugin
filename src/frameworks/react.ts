import { TextDocument } from 'vscode';
import { LanguageId } from '../utils';
import { Framework } from './base';
import { detect } from '../parser';

export class ReactFramework implements Framework {
  id = 'react';
  display = 'react';
  languageIds: LanguageId[] = [
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact',
  ];
  usageMatchRegex = [/\$t\([\'\"\`]([a-zA-Z0-9\.\-]+)[\'\"\`]\)/gm];
  detectHardStrings(doc: TextDocument) {
    return detect(doc?.getText());
  }
}
