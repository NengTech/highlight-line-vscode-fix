# 修复无条件访问 activeEditor.selection，但 activeEditor 有时会是 undefined 的问题
- 修复 Uncaught Error
- 迁移至最新 TS / VSCODE 版本

```powershell
npm i -D @vscode/vsce
# 或者全局： npm i -g @vscode/vsce

npm run compile
npm ci
npx vsce package
```

# Highlight Line VS Code

Enhanced highlighting of the currently active line in your text editor.

## Features

### Multi-Tab Line Highlighting

Line highlighting is provided & preserved across multiple tabs, so it's easier to find where you left off in a tab.

## Customizable Settings

Through the configuration options, you can edit appearance of your hilighted line and see the changes take effect immediately in your editor.

<table>
  <tr>
    <th colspan="2">Highlight Line Settings</th>
  </tr>
