import { Framework } from './base';
import { ReactFramework } from './react';

export const frameworks: Framework[] = [new ReactFramework()];

export function getEnabledFramework() {
  return frameworks;
}
