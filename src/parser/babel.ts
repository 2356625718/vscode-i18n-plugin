import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import type {
  DetectionResult,
  DetectionSource,
  ParserDefaultOptions,
} from '../types';

const defaultOptions: Required<ParserDefaultOptions> = {
  ignoreJSXAttributes: ['class', 'className', 'key', 'style', 'ref', 'onClick'],
};

export function detect(input: string, userOptions: ParserDefaultOptions = {}) {
  const detections: DetectionResult[] = [];
  const ignores: [number, number][] = [];
  const { ignoreJSXAttributes } = Object.assign(
    {},
    defaultOptions,
    userOptions,
  );
  const ast = parse(input, {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript', 'decorators-legacy'],
  });

  const handlePath = (path: any, type: DetectionSource) => {
    const fullStart = path?.node?.start;
    const fullEnd = path?.node?.end;
    if (!fullStart || !fullEnd) {
      return;
    }
    const quoted = type !== 'jsx-text';
    const fullText = input.slice(fullStart, fullEnd);
    const text = quoted ? fullText.slice(1, -1) : fullText;
    detections.push({
      text,
      start: fullStart,
      end: fullEnd,
      fullText,
      fullStart,
      fullEnd,
      source: type,
    });
  };

  const recordIgnore = (path: any) => {
    const start = path?.node?.start ?? path?.start;
    const end = path?.node?.end ?? path?.end;
    if (!start || !end) {
      return;
    }
    ignores.push([start, end]);
  };

  const isIgnored = (start: number, end: number) => {
    return (
      ignores.find(
        ([s, e]) => (s <= start && start <= e) || (s <= end && end <= e),
      ) != null
    );
  };

  traverse(ast, {
    StringLiteral(path: any) {
      handlePath(path.node, 'js-string');
    },
    TemplateLiteral(path: any) {
      handlePath(path.node, 'js-template');
    },
    JSXText(path: any) {
      handlePath(path.node, 'jsx-text');
    },
    JSXElement(path: any) {
      path?.node?.openingElement?.attributes?.forEach((i: any) => {
        if (ignoreJSXAttributes.includes(i?.name?.name)) {
          recordIgnore(i);
        }
      });
    },
    CallExpression(path: any) {
      const callee = path.get('callee');
      if (!callee.isMemberExpression()) {
        return;
      }
      if (isGlobalConsoleId(callee.get('object'))) {
        recordIgnore(path);
      }
    },
  });
}

const isGlobalConsoleId = (id: any) => {
  const name = 'console';
  return (
    id.isIdentifier({ name }) &&
    !id.scope.getBinding(name) &&
    id.scope.hasGlobal(name)
  );
};
