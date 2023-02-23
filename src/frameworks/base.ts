import { TextDocument } from 'vscode';
import { DetectionResult } from '../types';
import { LanguageId } from '../utils';

export abstract class Framework {
  abstract id: string;
  abstract display: string;
  abstract languageIds: LanguageId[];
  abstract usageMatchRegex: string | RegExp | (string | RegExp)[];
  detectHardStrings(doc: TextDocument): DetectionResult[] | undefined {
    return undefined;
  }
}
