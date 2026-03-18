const fs = require('fs');
const { execSync } = require('child_process');

// 使用 npx 运行 markdown-it
const markdownItPath = execSync('npx which markdown-it 2>/dev/null || echo "markdown-it"').toString().trim();

const content = fs.readFileSync('OpenClaw从零开始养成计划.md', 'utf8');

// 简单的 markdown 转 HTML（不使用外部库）
function simpleMarkdownToHtml(md) {
  let html = md
    // 代码块
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 标题
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 粗体
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // 列表
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    // 段落
    .replace(/\n\n/g, '</p><p>')
    // 换行
    .replace(/\n/g, '<br>');
  
  return '<p>' + html + '</p>';
}

const htmlContent = simpleMarkdownToHtml(content);

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenClaw 从零开始养成计划</title>
    <style>
        :root {
            --primary-color: #2563eb;
            --bg-color: #f8fafc;
            --text-color: #334155;
            --code-bg: #f1f5f9;
            --border-color: #e2e8f0;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.8;
            color: var(--text-color);
            background: var(--bg-color);
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        h1 { font-size: 2.5em; color: var(--primary-color); margin-bottom: 0.5em; padding-bottom: 0.3em; border-bottom: 3px solid var(--primary-color); }
        h2 { font-size: 1.8em; margin-top: 1.5em; margin-bottom: 0.8em; color: var(--primary-color); border-bottom: 2px solid var(--border-color); padding-bottom: 0.3em; }
        h3 { font-size: 1.4em; margin-top: 1.2em; margin-bottom: 0.6em; color: #475569; }
        p { margin-bottom: 1em; }
        code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: #dc2626; }
        pre { background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 1em 0; }
        pre code { background: transparent; color: inherit; padding: 0; }
        table { width: 100%; border-collapse: collapse; margin: 1em 0; }
        th, td { border: 1px solid var(--border-color); padding: 12px; text-align: left; }
        th { background: var(--code-bg); font-weight: 600; }
        ul, ol { margin-left: 2em; margin-bottom: 1em; }
        li { margin-bottom: 0.5em; }
        blockquote { border-left: 4px solid var(--primary-color); padding-left: 1em; margin: 1em 0; color: #64748b; font-style: italic; }
        a { color: var(--primary-color); text-decoration: none; }
        a:hover { text-decoration: underline; }
        hr { border: none; border-top: 2px solid var(--border-color); margin: 2em 0; }
    </style>
</head>
<body>
    <div class="container">
        ${htmlContent}
    </div>
</body>
</html>`;

fs.writeFileSync('index.html', html);
console.log('Build complete: index.html');
