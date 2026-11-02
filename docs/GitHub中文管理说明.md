# 白路平作品集：GitHub 中文管理说明

当前连接账号：**Bailllsh**。连接账号不等于已经上传：本轮只准备了代码和自动发布配置，尚未创建仓库、推送文件或公开网站。

## 三个东西分别是什么

| 名称 | 作用 | 谁能访问 |
| --- | --- | --- |
| 本地预览 | 电脑上运行开发服务，即改即看 | 默认只有这台电脑 |
| GitHub 仓库（Repository） | 保存源代码和修改历史 | 取决于仓库的公开/私有设置 |
| GitHub Pages | 将构建后的网站变成在线网址 | 发布后可通过网址访问 |

将来会上传到你的账号下，例如 `Bailllsh/portfolio`。实际仓库名称和公开范围在正式发布时确定。你继续在本地修改，不需要在 GitHub 网页里直接写代码。

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

## 第一次上传：使用 GitHub Desktop

GitHub Desktop 是 GitHub 官方的桌面客户端，可以用按钮完成保存记录和上传，不必长期使用命令行。下载地址：https://desktop.github.com/download/ 。安装、登录由你操作，使用自己的 Bailllsh 账号；账号连接不会自动把所有本地文件传到网上。

项目目录是：

```text
/Users/ethan/.codex/.chatgpt-projects/g-p-6a7e7dc2d40c81919df7b4cbfca16041/portfolio-prototypes
```

只选择这个网站文件夹，不选择上层整个项目目录。

1. 当前网站尚未初始化为 Git 仓库。第一次在 Mac 的终端中运行下面两行，只为网站创建本地修改记录的容器，不会上网或上传文件：

   ```sh
   cd /Users/ethan/.codex/.chatgpt-projects/g-p-6a7e7dc2d40c81919df7b4cbfca16041/portfolio-prototypes
   git init -b main
   ```

2. 打开 GitHub Desktop：**File → Add Local Repository → Choose…**（文件 → 添加本地仓库 → 选择），选择上面的网站目录，再点 **Add Repository**。
3. 在 **Changes**（改动文件）里检查文件；`.gitignore` 已排除依赖、构建输出、预览截图和归档。源码、public中的预览图/简历、字体和自动发布配置应包含在内。
4. 左下角 **Summary**（本次修改标题）写“作品集首次上线”，点 **Commit to main**（保存本地修改记录）。如第一次要求作者信息，填写自己的名字及 GitHub 账号配置的提交邮箱。
5. 点 **Publish repository**（上传到 GitHub 创建仓库）。**Name** 建议填 `portfolio`；个人账号的 **Organization** 选 **None**。确认使用的是你的 Bailllsh 账号。
6. 选择公开范围：GitHub Free 的 Pages 需要 **Public** 仓库，因此使用免费方案时取消 **Keep this code private**（保持代码私有）的勾选。公开仓库里的源码和预览图片可被访问；原始作品PDF仍不上传。如果要私有源码，先核对账户是否支持私有仓库的 Pages。
7. 点 **Publish Repository**。成功后 **View on GitHub**（在网页查看）会打开你账号里的作品集仓库。

仅有 GitHub 网站上的登录状态，不等于 Desktop 已登录；首次使用 Desktop 时仍需完成它自己的登录流程。不需要把密码或验证码发给我。

## 第二步：发布成网站

上传代码和发布网址是两步。React 项目需要先构建，项目已准备 `.github/workflows/pages.yml`，不需要自己把源码逐个改成HTML。

1. 在网站仓库打开 **Settings → Pages → Build and deployment → Source**（设置 → 网站托管 → 构建和部署 → 来源）。
2. **Source** 选择 **GitHub Actions**。已有发布文件，不必再创建第二份模板。
3. 打开 **Actions**，选择 **Build and publish portfolio**。若首次上传时尚未开启Pages而失败，设置完成后点 **Run workflow → Run workflow** 手动执行一次。
4. 等构建与发布都出现绿色对勾。在 **Settings → Pages** 查看实际网址。红色代表失败，可以点进去查看具体失败步骤；黄色代表运行中。
5. 若仓库名为 `portfolio`，通常网址为 `https://bailllsh.github.io/portfolio/`，以 GitHub 显示为准。这个地址目前只是预期，尚未由本次任务创建或发布。

当前配置在 `main` 分支收到修改后安装依赖、核对公开素材、运行手势测试、构建并发布。图片路径使用相对基础路径，项目详情使用 `#project/live` 等地址，便于放在仓库子目录下。自动发布流程尚未在 GitHub 上实际运行过。

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
- 中文简历目前是你提供的原文件；网站按最新要求写为 2028 届。原简历中的预计毕业时间如需同步，正式上线前应换成更新版。

官方帮助（2026-11-02核对）：[导入本地仓库](https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-a-repository-from-your-local-computer-to-github-desktop)、[上传已有项目](https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-an-existing-project-to-github-using-github-desktop)、[配置Pages发布](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[GitHub Pages 是什么](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[Vite 部署说明](https://vite.dev/guide/static-deploy.html)。
