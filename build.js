const fs = require('fs');
const path = require('path');

// 简单的 markdown 转 HTML
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

// 生成 HTML 页面
function generateHtml(title, content, nav = '') {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - OpenClaw 养成计划</title>
    <style>
        :root {
            --primary-color: #2563eb;
            --bg-color: #f8fafc;
            --text-color: #334155;
            --code-bg: #f1f5f9;
            --border-color: #e2e8f0;
            --sidebar-bg: #fff;
            --sidebar-width: 280px;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.8;
            color: var(--text-color);
            background: var(--bg-color);
            display: flex;
            min-height: 100vh;
        }
        .sidebar {
            width: var(--sidebar-width);
            background: var(--sidebar-bg);
            border-right: 1px solid var(--border-color);
            padding: 20px;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
        }
        .sidebar h2 {
            font-size: 1.2em;
            color: var(--primary-color);
            margin-bottom: 1em;
            padding-bottom: 0.5em;
            border-bottom: 2px solid var(--border-color);
        }
        .sidebar ul {
            list-style: none;
            margin-left: 0;
        }
        .sidebar li {
            margin-bottom: 0.3em;
        }
        .sidebar a {
            color: var(--text-color);
            text-decoration: none;
            display: block;
            padding: 5px 10px;
            border-radius: 4px;
            transition: background 0.2s;
        }
        .sidebar a:hover {
            background: var(--code-bg);
            color: var(--primary-color);
        }
        .content {
            margin-left: var(--sidebar-width);
            flex: 1;
            padding: 40px;
            max-width: 900px;
        }
        .container {
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
        .nav-section { margin-bottom: 1.5em; }
        .nav-section-title { font-weight: 600; color: #64748b; font-size: 0.85em; text-transform: uppercase; margin-bottom: 0.5em; }
        @media (max-width: 768px) {
            .sidebar { display: none; }
            .content { margin-left: 0; }
        }
    </style>
</head>
<body>
    <nav class="sidebar">
        <h2>🦊 OpenClaw 养成计划</h2>
        ${nav}
    </nav>
    <main class="content">
        <div class="container">
            ${content}
        </div>
    </main>
</body>
</html>`;
}

// 获取所有 Markdown 文件
function getMarkdownFiles(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...getMarkdownFiles(fullPath, baseDir));
    } else if (stat.isFile() && item.endsWith('.md')) {
      const relativePath = path.relative(baseDir, fullPath);
      files.push({
        fullPath,
        relativePath,
        outputPath: relativePath.replace('.md', '.html'),
        title: item.replace('.md', '')
      });
    }
  }
  
  return files;
}

// 生成导航
function generateNav(files) {
  const sections = {
    '核心文档': [],
    '计划文档': [],
    '其他': []
  };
  
  for (const file of files) {
    const { relativePath, outputPath, title } = file;
    const link = `<a href="${outputPath}">${title}</a>`;
    
    if (relativePath.startsWith('workspace-backup/')) {
      sections['核心文档'].push(link);
    } else if (relativePath.includes('OpenClaw')) {
      sections['计划文档'].push(link);
    } else {
      sections['其他'].push(link);
    }
  }
  
  let nav = '';
  for (const [section, links] of Object.entries(sections)) {
    if (links.length > 0) {
      nav += `<div class="nav-section"><div class="nav-section-title">${section}</div><ul>`;
      for (const link of links) {
        nav += `<li>${link}</li>`;
      }
      nav += '</ul></div>';
    }
  }
  
  return nav;
}

// 主函数
function build() {
  console.log('Starting build...');
  
  // 获取所有 Markdown 文件
  const mdFiles = getMarkdownFiles('.');
  console.log(`Found ${mdFiles.length} markdown files`);
  
  // 生成导航
  const nav = generateNav(mdFiles);
  
  // 创建输出目录
  const outputDir = 'dist';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 处理每个文件
  for (const file of mdFiles) {
    const { fullPath, outputPath, title } = file;
    
    // 读取 Markdown 内容
    const mdContent = fs.readFileSync(fullPath, 'utf8');
    const htmlContent = simpleMarkdownToHtml(mdContent);
    
    // 生成完整 HTML
    const html = generateHtml(title, htmlContent, nav);
    
    // 创建输出子目录
    const outputFullPath = path.join(outputDir, outputPath);
    const outputSubDir = path.dirname(outputFullPath);
    if (!fs.existsSync(outputSubDir)) {
      fs.mkdirSync(outputSubDir, { recursive: true });
    }
    
    // 写入文件
    fs.writeFileSync(outputFullPath, html);
    console.log(`Generated: ${outputPath}`);
  }
  
  // 复制 Index.md 作为首页
  if (fs.existsSync('Index.md')) {
    const indexMd = fs.readFileSync('Index.md', 'utf8');
    const indexHtml = generateHtml('首页', simpleMarkdownToHtml(indexMd), nav);
    fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
    console.log('Generated: index.html (homepage)');
  }
  
  console.log('Build complete!');
  console.log(`Output directory: ${outputDir}/`);
}

build();
