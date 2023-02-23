export const languageIdExtMap = {
  javascript: 'js',
  typescript: 'ts',
  javascriptreact: 'jsx',
  typescriptreact: 'tsx',
};

export type LanguageId = keyof typeof languageIdExtMap;

export function getExtOfLanguageId(id: LanguageId) {
  return languageIdExtMap[id] || id;
}
