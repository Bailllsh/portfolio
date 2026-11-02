# 白路平作品集：GitHub 中文管理说明

已于 **2026-11-02** 上传并发布到你的账号 **Bailllsh**。

- **分享作品的网站**：[bailllsh.github.io/portfolio](https://bailllsh.github.io/portfolio/)
- **管理项目的仓库**：[Bailllsh/portfolio](https://github.com/Bailllsh/portfolio)
- **发布状态**：[Actions](https://github.com/Bailllsh/portfolio/actions)
- **网站设置**：[Settings → Pages](https://github.com/Bailllsh/portfolio/settings/pages)

发给招聘方的是第一个网站链接，访客不需要登录 GitHub。电脑关机、本地预览停止后，线上网站仍然可用。

## 三个东西分别是什么

| 名称 | 作用 | 谁能访问 |
| --- | --- | --- |
| 本地预览 | 电脑上运行开发服务，即改即看 | 默认只有这台电脑 |
| GitHub 仓库（Repository） | 保存源代码和修改历史 | 取决于仓库的公开/私有设置 |
| GitHub Pages | 将构建后的网站变成在线网址 | 发布后可通过网址访问 |

项目已经位于你账号下的公开仓库 `Bailllsh/portfolio`，正式分支为 `main`。你继续在本地修改，不需要在 GitHub 网页里直接写代码。公开仓库允许别人查看文件；修改正式版本仍需要你的写入权限。

## 网页英文怎么对应

| 英文 | 中文含义 | 什么时候用 |
| --- | --- | --- |
| Code | 代码文件 | 看源代码、图片和说明 |
| Commits | 修改记录 | 查看这次改了哪些文件 |
| Actions | 自动任务 | 看网站构建、发布是否成功 |
| Settings | 仓库设置 | 设置网站发布方式 |
| Pages | 网站托管 | 查看在线网址 |
| Repository | 仓库 | 这个网站的完整项目 |
| Branch / main | 分支 / 主分支 | 目前采用 main 保存正式版本 |
| Commit | 保存一次修改 | 给这次修改命名并留下记录 |
| Push | 上传本地修改 | 将修改送到你的 GitHub 仓库 |
| Pull | 获取远程修改 | 将 GitHub 上的更新同步到本地 |
| Revert | 撤销某次修改 | 用新记录恢复到修改前的状态 |

## 用 GitHub Desktop 管理已经上传的网站

第一次上传和 Pages 设置已经完成，**不用再创建仓库、执行 git init 或点击 Publish repository**。

GitHub Desktop 是 GitHub 官方的桌面客户端，可以用按钮保存记录和上传。下载：[GitHub Desktop](https://desktop.github.com/download/)。首次使用时在客户端登录自己的 **Bailllsh** 账号；Safari 已登录不等于客户端已登录。不需要把密码或验证码发给我。

本地网站目录：

```text
/Users/ethan/.codex/.chatgpt-projects/g-p-6a7e7dc2d40c81919df7b4cbfca16041/portfolio-prototypes
```

1. 在 Desktop 点 **File → Add Local Repository → Choose…**（文件 → 添加本地仓库 → 选择），选上面的网站目录，再点 **Add Repository**。
2. 确认当前仓库是 **portfolio**，当前分支是 **main**。本地已经关联 `https://github.com/Bailllsh/portfolio.git`。
3. **Changes** 显示还没保存的改动，**History** 显示已经保存的版本；**View on GitHub** 打开网页管理页。
4. 如果只想看网站，直接用分享网址，不需要打开 Desktop 或本地终端。

只选择这个网站目录，不选择上层整个资料目录。

## 网站怎么发布

发布来源已经设为 **Settings → Pages → Source → GitHub Actions**。项目的 `.github/workflows/pages.yml` 会在 `main` 收到更新后自动验证38页作品素材、运行手势测试、构建 React 网站并发布。

- **绿色对勾 / Success**：构建与发布成功，刷新网站查看。
- **黄色 / In progress / Queued**：正在执行或排队，稍等。
- **红色 / Failure**：某个步骤失败。点开该次记录看具体步骤，可以把链接发给我排查。
- **Settings → Pages → Visit site**：打开实际网站。

本次真实线上流程已经运行并通过。首次运行时 Pages 尚未开启而失败，开启后重跑成功；旧红色记录会留在历史里，以最新一次结果为准。不要重复添加 Jekyll 或 Static HTML 模板。

## 日后修改网站

1. 每次开始前，在 Desktop 点 **Fetch origin**（检查线上更新）；如果出现 **Pull origin**（取回更新），先拉取。
2. 在本地修改文案、图片或交互，打开本地预览检查。
3. Desktop 的 **Changes** 显示改动文件；在 **Summary** 写清楚内容，例如“更新网易经历”“替换游戏直播作品封面”。
4. 点 **Commit to main** 保存本地记录，再点 **Push origin** 上传。
5. 等网页 **Actions** 变绿，再刷新线上网站。本地尚未Push的修改不会自动出现在网上。

常用按钮：**Changes = 哪些文件改了；History = 已保存的版本；Commit = 本地存档；Push = 上传；Pull = 取回线上更新**。

如果这次修改效果不好，可在 Desktop 的 **History** 中右键那条记录，选择 **Revert Changes in Commit**（撤销该次修改），然后再次 Push。若只是本次尚未保存的改动，先检查内容再处理，不要拿“删仓库”当撤销。

网站内容维护入口：

| 要改什么 | 本地文件 |
| --- | --- |
| 中文、英文介绍/学历/奖项/经历 | `src/content.js` |
| 邮箱、微信、姓名、项目基础资料 | `src/data.js` |
| 本轮标题颜色、字号、留白、玻璃效果 | `src/reader-and-surfaces.css` |
| 原作在线阅读图片 | `public/assets/cases/` |
| 简历下载文件 | `public/downloads/bai-luping-resume-zh.pdf` |

更新整个作品集时不只是替换封面：还需要同步页图、`src/case-pages.json` 页数/尺寸和 `src/reader-sections.js` 目录起始页，保证连续阅读与跳转正确。你提供新PDF后，可以继续让我处理这些对应关系。

网页管理只需先认四处：**Code** 看文件，**Commits** 看修改记录，**Actions** 看发布结果，**Settings → Pages** 看网站地址。

## 作品和简历如何管理

- 简历：`public/downloads/bai-luping-resume-zh.pdf`，网站提供下载。替换此文件可以更新简历。
- 作品集：原始两份 PDF 留在你的电脑；站内显示转换后的 WebP 图片，共 26 页和 12 页，支持目录、连续阅读与画布内缩放。
- `public/` 的所有文件都会随网站公开，检查脚本只允许简历 PDF 出现在里面。
- 作品不提供下载入口，但网页图片仍可能被保存、截图或缓存；在线预览不能构成绝对的防下载保护。公开仓库还会直接展示其中的图片文件。
- 只上传适合公开展示的内容。原始 PDF、临时文件、旧版原型、node_modules 和 dist 均不需要放进源码仓库。
- 中文简历目前是你提供的原文件；网站按最新要求写为 2028 届。如原简历中的预计毕业时间仍是旧版，请提供更新版替换，网站不会自动修改 PDF 内容。

官方帮助（2026-11-02核对）：[导入本地仓库](https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-a-repository-from-your-local-computer-to-github-desktop)、[上传已有项目](https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-an-existing-project-to-github-using-github-desktop)、[配置Pages发布](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[GitHub Pages 是什么](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[Vite 部署说明](https://vite.dev/guide/static-deploy.html)。
