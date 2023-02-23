import { window } from 'vscode';
import { getEnabledFramework } from '../frameworks';
import { DetectionResult } from '../types';
import { Log } from './Log';

export function detectHardString(
  doc = window.activeTextEditor?.document,
): DetectionResult[] | undefined {
  if (!doc) {
    return;
  }
  const frameworks = getEnabledFramework();
  let result: DetectionResult[] = [];
  for (const framework of frameworks) {
    const temp = framework
      .detectHardStrings(doc)
      ?.filter(Boolean)
      .map(trimDetection)
      .filter(Boolean)
      .map((i) => ({
        ...i,
        doc,
      })) as DetectionResult[];
    if (temp?.length) {
      result.push(...temp);
    }
  }
  return result;
}

export function trimDetection(
  dect: DetectionResult,
): DetectionResult | undefined {
  const leadingReg = /^(\s\n)*/gm;
  const tailingReg = /(\s\n)+$/gm;
  const leadingSpace = dect.text.match(leadingReg)?.[0] || '';
  const tailingSpace = dect.text.match(tailingReg)?.[0] || '';
  dect.start += leadingSpace.length;
  dect.end -= tailingSpace.length;
  if (dect.start >= dect.end) {
    return undefined;
  }
  return dect;
}
