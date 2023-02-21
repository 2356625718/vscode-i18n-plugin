import { TextDocument } from 'vscode';

export interface ParserDefaultOptions {
  ignoreJSXAttributes?: string[];
}

export type DetectionSource =
  | 'html-attribute'
  | 'html-inline'
  | 'js-string'
  | 'js-template'
  | 'jsx-text';

export interface DetectionResult {
  text: string;
  start: number;
  end: number;
  document?: TextDocument;
  fullText?: string;
  fullStart?: number;
  fullEnd?: number;
  source: DetectionSource;
}
