'use strict';

module.exports = {
  types: [
    { value: 'feat', name: 'feat:        功能变更' },
    { value: 'fix', name: 'fix:         bug修复' },
    { value: 'docs', name: 'docs:        文档类变更' },
    { value: 'chore', name: 'chore:       工程构建' },
    { value: 'refactor', name: 'refactor:    重构' },
  ],

  scopes: [{ name: 'i18n' }],

  // it needs to match the value for field type. Eg.: 'fix'
  /*
  scopeOverrides: {
    fix: [
      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },
  */
  // override the messages, defaults are as follows
  messages: {
    type: '选择一种你的提交类型:',
    scope: '选择一个scope (可选):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject: '短说明:\n',
    body: '长说明,使用"|"换行(可选):\n',
    breaking: '非兼容性说明 (可选):\n',
    footer: '关联关闭的issue,例如,#31, #34(可选):\n',
    confirmCommit: '确定提交说明?',
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],

  // limit subject length
  subjectLimit: 100,
};
