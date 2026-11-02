# 白路平 / Bai Luping — Design Portfolio

React + Vite 个人作品集。深炭灰与暖白；英文 Helvetica Neue，中文 HarmonyOS Sans SC。

## 在线网站

- [打开作品集](https://bailllsh.github.io/portfolio/)：可直接分享给招聘方，无需登录。
- [GitHub 仓库](https://github.com/Bailllsh/portfolio)：源码、素材和版本记录。
- [中文管理说明](docs/GitHub中文管理说明.md)：GitHub 页面与日后更新步骤。

已于2026-11-02发布至 GitHub Pages，main 分支更新后由 GitHub Actions 自动验证、构建与发布。

## 本地预览

http://127.0.0.1:5173/?lang=zh#top

已选择局部轻玻璃，顶部材质对比条已移除。轻玻璃仅用于语言切换、作品目录和阅读工具栏；背景更清透、模糊降低到12px，不使用背景扭曲。旧材质参数不再切换外观。

服务未启动时，在 Finder 双击 `start-preview.command`，保持终端窗口开启；Control+C停止服务。旧 `?v=a/b/c` 是第一阶段地址，如今显示当前统一方案。

标准 Node 22.12+ 环境：

```sh
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
pnpm verify
pnpm test
pnpm build
```

## 当前交互

网站图标使用用户提供的原创黑白摄影头像，保留完整构图与原始灰度，不裁剪或重绘。`assets-source/avatar.jpg`保留源图（不在公开构建目录中）；`public/`提供16/32/48/256px PNG、16/32/48px ICO及180px Apple touch icon。`index.html`使用相对路径引用，兼容本地与托管子目录。使用Pillow运行`scripts/prepare-site-icon.py`可重新导出。

首页保留中英文同字号姓名、加粗纯文字导航、设计方向、学历、联系方式和超大 Portfolio。移除首屏求职标签、年份与“精选作品”箭头。字标按同一SVG的实际像素墨迹测量，再等比适配窗口内容宽度；左右贴边，保持末字母完整、下沿贴在首屏底部。测量只在加载时进行一次，结果供页首、页尾共用。

Work / 作品、About / 关于、Honors & Awards / 荣誉与奖项、Experience / 经历、Contact / 联系共用SectionHeading。中文在左、英文在右，桌面16px、手机14px，600字重、暖灰#A6A6A0；切换语言也保持这组栏目标签。大字个人介绍保留。省级和校级奖项条目统一18px，手机16px。字节跳动公司名28px/600；区块留白96px、栏目到内容48px、条目到分割线上下36px（手机64/36/26px）。

语言胶囊采用同步移动的选中块和文字裁切层，文字高亮随选中块覆盖范围变化。语言和动效偏好保存在浏览器本地。

作品详情按原PDF顺序连续无缝显示26/12页，保留原始版式、图片和颜色。页间没有网站新增的标题、编号、边框和间距。作品与介绍对齐浏览器窗口中心，目录独立悬浮在左侧垂直居中，包含滑动选中块、圆环进度和收合功能；手机默认收合。

作品画布支持50%—300%的局部缩放：按钮、触控板Ctrl+wheel缩放事件、Safari手势事件及触屏双指手势。放大后可拖动平移；普通上下滚动继续阅读。键盘聚焦画布后，+/-缩放、0适合宽度；按Esc退出整个作品预览；左右空白可点击返回，右上角关闭按钮始终可见。返回会恢复原作品位置和焦点，并在支持View Transition的浏览器中使用呼应进入的过渡。点击目录、正文和缩放工具不会触发外侧退出。

手势只在作品画布范围内接管，不关闭全站浏览器缩放。Safari的系统“缩小到标签页总览”存在网页取消默认行为后仍偶发触发的已知问题，因此始终保留缩放按钮。真实硬件双指手感需使用者在自己的触控板/iPhone上体验。

## 维护入口

| 文件 | 内容 |
| --- | --- |
| src/main.jsx | 首页、统一栏目标题、导航、语言和项目路由 |
| src/content.js | 双语文案、教育、18条荣誉记录、3个实习项目、2个校园项目 |
| src/data.js | 姓名、邮箱、微信、项目ID |
| src/styles.css | 基础编辑式排版、字体、封面和首页其他区块 |
| src/reader-and-surfaces.css | 首页精简、统一字体层级、局部轻玻璃、连续画布和浮动目录 |
| src/components/Wordmark.jsx | 超大Portfolio实际字形边界 |
| src/components/ProjectReader.jsx | 连续作品、目录、阅读进度、工具栏 |
| src/hooks/useReaderZoom.js | 缩放时保持光标/手指锚点及平移 |
| src/utils/reader-gestures.js | 局部手势所有权与缩放边界 |
| src/reader-sections.js | 中英文主章节与起始页 |
| src/case-pages.json | 全部38页原图顺序、尺寸及标题 |
| public/assets/cases/ | 在线阅读的原作WebP与缩略图 |
| public/downloads/ | 唯一公开PDF：中文简历 |
| tests/reader-gestures.test.mjs | 手势处理与清理测试 |
| .github/workflows/pages.yml | GitHub Pages构建、验证和自动发布配置 |

## 素材与发布范围

作品来自用户提供的《白路平就业作品集-抖音游戏直播体验升级.pdf》26页与《白路平-就业作品集-抖音商城潮品狂欢.pdf》12页。输入文件不修改；原始作品PDF不放入public，仅提供站内图片阅读。网站图片仍可被保存、缓存或截图。

简历使用用户提供的原PDF，允许下载；网站教育时间已按用户指定2028届更新，原简历PDF的预计毕业时间如仍为旧版，需由更新文件替换。

重新生成作品图片（需要Poppler、Pillow、pypdf）：

```sh
python3 scripts/prepare-case-assets.py --live '/完整路径/直播项目.pdf' --mall '/完整路径/商城项目.pdf'
```

英文使用系统本地字体，未嵌入未授权商业Webfont；无Helvetica Neue的设备回退Helvetica/Arial。中文为未修改的HarmonyOS Sans SC原文件，附字体许可。

已上传至公开仓库Bailllsh/portfolio，并发布至GitHub Pages。[GitHub中文管理说明](docs/GitHub中文管理说明.md)解释后续操作。

省级区块补全浙江省名称，校级条目补全中国美术学院；奖学金优先，其次优秀毕业生、毕设银奖等。两次一等奖学金和两次三好学生按学年拆开，默认展示10条省/校荣誉，展开后共18条记录。

滚动文字动效：个人介绍保留原来的逐字清晰显现；公司名复用ScrollReveal的subtle参数，最大模糊3px、位移2px，文字中心跨过屏幕中线才开始，在0.18屏的滚动距离内完成。邮箱/微信使用ContactReveal按完整值淡入，进入视窗上方65%的阅读区域后触发，在本次页面加载内只播放一次，进入作品再返回也不重播。进入视野后断开IntersectionObserver；关闭动效、系统减少动态效果或浏览器不支持观察器时直接显示完整文字。

联系区标题在联系方式和整个页尾范围内局部吸顶；页尾作为完整末屏布局，保证标题不会挡住残留的联系方式，Portfolio仍按视口内容宽度贴边。页尾保留contentinfo地标。
