---
title: 如何优雅地使用 Hexo
---

本人由于多次丢失 Hexo Blog 源码而不得不重新部署且导致数据丢失，故而找到一种直接 Git 维护源码 + Github Actions 工作流部署静态网页的方法，且只需占用单一仓库的单一分支。

<!-- more -->

## 摘要

Hexo 的传统部署方法是在本地存储源码然后使用 Hexo 自带命令行工具部署，多设备/协作写作则需要相关云存储方法和重新配置本地环境，且源码丢失后仅凭静态网页难以还原。

本文介绍一种无需额外创建仓库和分支的方法，单纯使用 Github 相关自动化工具实现自动部署。

## 原理

使用 Github Actions 检测到 Push 动作时实现自动构造静态网页并部署到 Github Pages。

仓库示例目录

```
xxx/xxx.github.io
│
├── .github
│	└── workflows
│		└── pages.yml
├── source
│	└── _posts
│		└── yyy.md
├── themes
│	└── zzz(can be a submodule)
├── .gitmodules
├── adddate.js
├── CNAME
└── some files Hexo needed
```

一些 Hexo 必须文件被省略，`adddate.js` 用于添加文章修改时间，`CNAME` 是自定义域名，`pages.yml` 是 Workflows 配置文件。

与传统配置不同，`CNAME` 须保存在根目录而非 `source` 目录下。

需要通过 Git Log 提供的时间戳来修改时间。

## 一个 Workflows 示例

```yml
# pages.yml
name: Blog Workflow

on:
  push:
    branches: [master]
    paths:
      - '*.json'
      - '**.yml'
      - '**/source/**'

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: 'recursive'
          fetch-depth: 0
      - name: Setup Node.js
        uses: actions/setup-node@v4
      - name: Cache node_modules 
        uses: actions/cache@v4
        env:
          cache-name: cache-node-modules
        with:
          path: ~/.npm
          key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-build-${{ env.cache-name }}-
            ${{ runner.os }}-build-
            ${{ runner.os }}-
      - name: Environment Build
        run: |
          npm install -g hexo-cli --save
          npm install
      - name: Convert Source to Static
        run: |
          node adddate.js
          hexo clean
          hexo generate
          hexo deploy
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'public/'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

此处本人的主题采用了 submodule，则需在 Checkout 时 Pull submodule，**主题**配置文件可以直接在根目录下 `_config.yml` 修改；直接 Git Clone 然后直接修改应该也是可以的。

**注意：** 该方法会导致你的源码数据被公开，如果不希望这样做，则可能需要新建一个私有的源码仓库，然后通过 Hexo Push 到 `xxx.github.io` 仓库，此种方式互联网上存在相关方法，这里不再赘述。

其中，`adddate.js` 一种实现如下：

```js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to get the creation time of a file using Git
function getCreationTime(filePath) {
  try {
    const command = `git log --diff-filter=A --format="%ai" -- "${filePath}" | tail -n 1`;
    const creationTime = execSync(command).toString().trim();
    return creationTime.replace(/(\+\d{4}|\-\d{4})$/, '');
  } catch (error) {
    console.error(`Error getting creation time for ${filePath}: ${error.message}`);
    return null;
  }
}

// Function to get the updated time of a file using Git
function getupdatedTime(filePath) {
  try {
    const command = `git log -1 --format="%ai" -- "${filePath}"`;
    const updatedTime = execSync(command).toString().trim();
    return updatedTime.replace(/(\+\d{4}|\-\d{4})$/, '');
  } catch (error) {
    console.error(`Error getting updated time for ${filePath}: ${error.message}`);
    return null;
  }
}

// Function to update the front matter of a Markdown file
function updateMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const creationTime = getCreationTime(filePath);
  const updatedTime = getupdatedTime(filePath);

  if (!creationTime || !updatedTime) {
    console.error(`Skipping ${filePath} due to missing timestamps.`);
    return;
  }

  // Check if front matter exists
  const frontMatterRegex = /^---\n([\s\S]*?)---\n/;
  const match = content.match(frontMatterRegex);
  
  let updatedContent;
  
  if (match) {
    // Extract existing front matter
    const frontMatter = match[1];
    
    // Update front matter
    const newFrontMatter = `${frontMatter}date: ${creationTime}\nupdated: ${updatedTime}\n`;
    updatedContent = content.replace(frontMatterRegex, `---\n${newFrontMatter}---\n`);
  } else {
    // If no front matter, create a new one
    updatedContent = `---\ndate: ${creationTime}\nupdated: ${updatedTime}\n---\n${content}`;
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

// Main function to process all Markdown files in the specified directory
function processMarkdownFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      if (path.extname(file) === '.md') {
        updateMarkdownFile(filePath);
      }
    });
  });
}

// Specify the directory containing Markdown files
const markdownDirectory = path.join(__dirname, 'source/_posts/');
processMarkdownFiles(markdownDirectory);
```
