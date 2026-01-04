# HTML面试题

## 对于前端语义化的理解
前端语义化是指使用具有明确含义的 HTML 标签（如 `<header>`、`<nav>`、`<article>`、`<aside>`、`<footer>` 等）来准确表达内容结构和角色，而非仅依赖 `<div>` + CSS。

核心价值：
可访问性：辅助技术（如读屏器）能正确理解页面结构。
SEO 友好：搜索引擎更易抓取和理解内容层级。
可维护性：代码结构清晰，便于团队协作与后续迭代。
无样式降级：即使无 CSS，内容仍具可读性和逻辑性。

简言之：用对的标签做对的事。

## DOCTYPE 的作用

`<!DOCTYPE>` 的作用是告知浏览器使用哪种 HTML 或 XHTML 规范来解析文档，从而触发标准模式（Standards Mode），而非怪异模式（Quirks Mode）。

关键点：
不是 HTML 标签，而是文档类型声明（Document Type Declaration）。
必须位于 HTML 文档第一行。
HTML5 中简化为：`<!DOCTYPE html>`。

影响：
决定浏览器的渲染模式（盒模型、CSS 解析、JS 行为等）。
缺失或格式错误 → 浏览器可能回退到 Quirks Mode，导致布局不一致。

简言之：确保浏览器用现代标准正确渲染页面。

## HTML 与 XML

`HTML` 与 `XML` 都是标记语言，但**设计目标和使用方式不同**：

---

### 核心区别：

| 维度         | **HTML**                    | **XML**                            |
| ------------ | --------------------------- | ---------------------------------- |
| **目的**     | **展示数据**（结构 + 呈现） | **描述/传输数据**（结构 + 含义）   |
| **标签**     | 预定义（如 `<div>`, `<p>`） | 自定义（如 `<user>`, `<price>`）   |
| **容错性**   | 宽松（浏览器自动修复错误）  | 严格（格式错直接解析失败）         |
| **扩展性**   | 固定语法                    | 可扩展（配合 DTD/XSD 定义结构）    |
| **大小写**   | 不敏感                      | 敏感                               |
| **典型用途** | 网页结构                    | 配置文件、API 数据（如 RSS、SOAP） |

---

### 关系补充：
- **XHTML** = HTML 用 XML 语法重写（已基本淘汰）。
- **HTML5** 不基于 XML，但可序列化为 XHTML（需声明 `application/xhtml+xml`）。

✅ **一句话总结**：  
> **HTML 是给人看的，XML 是给机器读的。**

## src与href的区别

`src` 和 `href` 都用于引用外部资源，但用途和行为不同：

|          | `src`（source）                                                        | `href`（hypertext reference）                           |
| -------- | ---------------------------------------------------------------------- | ------------------------------------------------------- |
| 作用     | 嵌入资源到当前文档中                                                   | 建立当前文档与资源的链接关系                            |
| 典型标签 | `<img>`, `<script>`, `<iframe>`, `<video>`                             | `<a>`, `<link>`, `<base>`                               |
| 加载行为 | 浏览器会阻塞页面解析（如 `<script src>` 默认阻塞）并下载+执行/渲染资源 | 通常不阻塞 HTML 解析（如 CSS 会并行下载但可能阻塞渲染） |
| 语义     | “这个资源是页面内容的一部分”                                           | “这个资源与当前文档有关联”                              |

✅ 简记：

`src` → 替换自身（如 `<img>` 被图片内容替换）<br/>
`href` → 建立关系（如链接、引用样式）

## img 的 srcset 属性的作用

`srcset` 属性用于**响应式图像加载**，让浏览器根据设备特性（如屏幕分辨率、视口宽度）**自动选择最合适的图片源**，提升性能与体验。

---

### 两种主要用法：

#### 1. **基于像素密度（DPR）**
```html
<img src="image-1x.jpg"
     srcset="image-1x.jpg 1x, image-2x.jpg 2x, image-3x.jpg 3x"
     alt="示例">
```
- 浏览器根据设备像素比（如 Retina 屏为 2x）选择对应图片。
- `src` 作为兜底（不支持 `srcset` 时使用）。

#### 2. **基于视口宽度（配合 `sizes`）**
```html
<img src="image-400.jpg"
     srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
     sizes="(max-width: 600px) 100vw, 50vw"
     alt="示例">
```
- `w` 单位表示图片实际宽度（像素）。
- `sizes` 告诉浏览器：在不同视口下，该图将占用多大布局宽度。
- 浏览器结合 `sizes` + 当前视口宽度 + 网络状况，选最优资源。

---

### 优势：
- 节省流量（低分辨率设备不加载大图）
- 提升加载速度
- 无需 JS 实现响应式图片

✅ **最佳实践**：  
现代项目应优先用 `<picture>` + `srcset` 或纯 `srcset` 替代单一 `src`。

## defer和async的区别

`defer` 和 `async` 都用于优化 `<script>` 的加载，避免阻塞 HTML 解析，但执行时机不同：

| 特性     | `defer`                                           | `async`                                   |
| -------- | ------------------------------------------------- | ----------------------------------------- |
| 下载时机 | 异步下载（不阻塞 HTML 解析）                      | 异步下载（不阻塞 HTML 解析）              |
| 执行时机 | DOM 解析完成后，DOMContentLoaded 之前，按顺序执行 | 下载完成后立即执行，可能在 DOM 解析完成前 |
| 执行顺序 | 保证脚本顺序                                      | 不保证顺序                                |
| 适用场景 | 依赖 DOM 或其他脚本（如模块化入口）               | 独立脚本（如统计、广告）                  |

✅ 简记：

`defer` → 延迟到 DOM 构建完再按序执行 <br/>
`async` → 谁先下完谁先跑，不等 DOM

## 常用的meta标签

常用 `<meta>` 标签按用途分类如下（简洁版）：
1. 字符编码
```html
<meta charset="UTF-8">
```
必须尽早声明，确保正确解析文本。

2. 视口（移动端适配）
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
控制响应式布局，适配移动设备。

3. SEO 与描述
```html
<meta name="description" content="页面简要描述">
<meta name="keywords" content="关键词1,关键词2"> <!-- 现代 SEO 作用有限 -->
```

4. 缓存控制（开发/调试）
```html
<meta http-equiv="Cache-Control" content="no-cache">
```
强制不缓存（仅对当前页面有效，生产环境建议用 HTTP 头）。

5. 兼容性（IE）
```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```
强制 IE 使用最新渲染引擎（现代项目已少用）。

6. 安全（CSP / Referrer）
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
<meta name="referrer" content="no-referrer">
```
增强安全策略（但 CSP 更推荐通过 HTTP 头设置）。

✅ 最佳实践：

必加 charset 和 viewport；<br/>
其他按需使用，优先用 HTTP 头替代 http-equiv。


## 块元素、行内元素、空元素
三者是 HTML 元素按内容模型和渲染行为的分类：

1. 块级元素（Block-level）<br/>
特点：独占一行，可设宽高、内外边距；默认宽度 100%。
常见：`<div>`, `<p>`, `<h1>-<h6>`, `<section>`, `<ul>`, `<form>`, `<header>`, `<footer>` 等。
用途：构建页面结构。

2. 行内元素（Inline）<br/>
特点：不换行，不能设宽高（width/height 无效），margin/padding 仅左右生效（上下不影响布局）。
常见：`<span>`, `<a>`, `<strong>`, `<em>`, `<img>`, `<input>`, `<button>`。
注意：`<img>`、`<input>` 等虽为行内，但可设宽高（属 replaced element）。

3. 空元素（Void / Self-closing）<br/>
特点：不能包含子内容或结束标签，自闭合。
常见：`<br>`, `<hr>`, `<img>`, `<input>`, `<link>`, `<meta>`, `<area>`, `<col>`, `<embed>`, `<source>`, `<track>`, `<wbr>`。
写法：HTML5 中无需 `/`（如 `<img src="">` 即可）。

✅ 关键区别：

块 vs 行内 → 布局行为<br/>
空元素 → 语法结构（无子内容）
> 注：可通过 CSS display 改变默认显示类型（如 span { display: block }）。

## title与h1的区别、b与strong的区别、i与em的区别

三组标签的核心区别在于：**语义 vs 样式**。

---

### 1. **`<title>` vs `<h1>`**
|        | `<title>`                              | `<h1>`                         |
| ------ | -------------------------------------- | ------------------------------ |
| 位置   | `<head>` 中                            | `<body>` 中                    |
| 作用   | 定义**浏览器标签页标题**、SEO 页面标题 | 定义**页面主标题**（文档结构） |
| 可见性 | 不在页面正文显示                       | 在页面中可见                   |
| SEO    | 极重要                                 | 重要（表示内容层级）           |

✅ 建议：两者内容可相似，但**不要完全相同**，且 `<h1>` 应描述当前页核心内容。

---

### 2. **`<b>` vs `<strong>`**
|          | `<b>`                  | `<strong>`                     |
| -------- | ---------------------- | ------------------------------ |
| 语义     | **无语义**，仅视觉加粗 | 表示**内容重要性高**（有语义） |
| 默认样式 | `font-weight: bold`    | 同样加粗                       |
| 辅助技术 | 读屏器忽略             | 读屏器会强调                   |

✅ 用 `<strong>` 表达重要性；仅需样式加粗且无语义时用 `<b>`（如关键词高亮）。

---

### 3. **`<i>` vs `<em>`**
|          | `<i>`                  | `<em>`                     |
| -------- | ---------------------- | -------------------------- |
| 语义     | **无语义**，仅视觉斜体 | 表示**语气强调**（有语义） |
| 默认样式 | `font-style: italic`   | 同样斜体                   |
| 辅助技术 | 读屏器忽略             | 读屏器会改变语调强调       |

✅ 用 `<em>` 表达强调；仅用于图标、外文、分类名等无强调含义的斜体场景时用 `<i>`（如 `<i class="icon-home"></i>`）。

---

✅ **总原则**：  
> **能用语义标签就不用纯样式标签**。语义提升可访问性、SEO 和代码可维护性。

## 对 web workers 的理解

**Web Workers** 是浏览器提供的多线程机制，允许在**主线程之外**运行 JavaScript，避免耗时任务阻塞 UI。

---

### 核心特点：
- **独立线程**：Worker 运行在后台，不阻塞页面渲染和用户交互。
- **无 DOM 访问**：不能操作 `document`、`window`、`parent` 等（无 DOM API）。
- **通信方式**：通过 `postMessage()` 和 `onmessage` 与主线程**异步传递数据**（结构化克隆，非共享内存）。
- **同源限制**：Worker 脚本必须与主页面同源。

---

### 基本用法：
```js
// 主线程
const worker = new Worker('worker.js');
worker.postMessage(data);
worker.onmessage = (e) => { console.log(e.data); };

// worker.js
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};
```

---

### 适用场景：
- 大数据计算（如加密、图像处理）
- 复杂算法（路径搜索、AI 推理）
- 轮询或长连接（避免影响 UI）

---

### 注意事项：
- 不适合频繁小量通信（有开销）
- 移动端支持良好但需考虑性能/电量
- 可通过 `worker.terminate()` 主动销毁

✅ **一句话总结**：**让 JS 在后台干活，不卡 UI，但不能碰 DOM。**

## head 标签有什么作用，其中什么标签必不可少

`<head>` 标签用于**定义文档元数据（metadata）**，不直接显示在页面上，但控制页面行为、样式、SEO 和兼容性。

---

### 必不可少的标签（现代 Web 开发）：

1. **`<meta charset="UTF-8">`**  
   - 声明文档字符编码，**必须放在 `<head>` 最顶部**，避免乱码。
   - HTML5 要求显式声明。

2. **`<title>`**  
   - 定义页面标题，显示在浏览器标签页、书签、搜索引擎结果中。
   - 对 SEO 和用户体验至关重要。

> ✅ 这两个是**功能性必需**：无 `charset` 可能乱码；无 `title` 页面无标题。

---

### 强烈推荐（非“语法必需”，但现代开发几乎必用）：
- `<meta name="viewport" content="width=device-width, initial-scale=1">`  
  → 移动端响应式基础。
- `<link rel="stylesheet" href="...">`  
  → 引入 CSS。
- `<script>`（带 `defer`/`async`）  
  → 引入 JS。

---

### 总结：
- **语法上**：HTML5 允许 `<head>` 为空（浏览器会自动推断），但**实践中必须包含 `charset` 和 `title`**。
- **原则**：`<head>` 是页面的“配置中心”，放所有非可视但影响全局的内容。

## Canvas和SVG的区别

`<canvas>` 和 SVG 都用于图形绘制，但**底层机制与适用场景截然不同**：

| 维度           | **Canvas**                             | **SVG**                           |
| -------------- | -------------------------------------- | --------------------------------- |
| **类型**       | 位图（像素）                           | 矢量（XML 节点）                  |
| **渲染方式**   | 通过 JS 逐帧绘制（过程式）             | 声明式 DOM 元素（如 `<circle>`）  |
| **缩放**       | 放大会失真                             | 无限缩放不失真                    |
| **性能**       | 大量元素/动画时性能好（无 DOM 开销）   | 元素多时 DOM 膨胀，性能下降       |
| **交互**       | 需手动计算坐标绑定事件                 | 原生支持 DOM 事件（如 click）     |
| **SEO/可访问** | 不友好                                 | 可被索引，支持 ARIA               |
| **适用场景**   | 游戏、图像处理、实时视频、大数据可视化 | 图标、图表、地图、高保真 UI、打印 |

✅ **简记**：  
- **Canvas = 画布 + 手绘**（适合动态、高性能、像素级控制）  
- **SVG = 图形 DOM**（适合静态/交互式矢量图形，需缩放或 SEO）

## iframe标签的优缺点

`<iframe>`（内联框架）用于在当前页面嵌入另一个 HTML 页面，优缺点如下：

---

### ✅ 优点：
1. **隔离性**  
   - 嵌入内容与主页面**样式、脚本、DOM 隔离**，避免冲突。
2. **第三方集成便捷**  
   - 轻松嵌入地图、视频、广告、支付页等（如 YouTube、Google Maps）。
3. **沙箱能力（`sandbox` 属性）**  
   - 可限制 iframe 内容权限（如禁止脚本、表单提交），提升安全性。
4. **并行加载**  
   - iframe 内容独立加载，不阻塞主页面渲染（但可能影响整体性能）。

---

### ❌ 缺点：
1. **性能开销大**  
   - 每个 iframe 是独立页面，需完整解析 HTML/CSS/JS，增加内存和 CPU 消耗。
2. **SEO 不友好**  
   - 搜索引擎通常不索引 iframe 内容（视为外部资源）。
3. **响应式困难**  
   - 高度需 JS 动态适配（因跨域无法直接读取内容高度）。
4. **安全风险**  
   - 若嵌入不可信源，可能引发点击劫持、XSS（需配合 `X-Frame-Options` / CSP 防御）。
5. **可访问性差**  
   - 屏幕阅读器对 iframe 导航支持有限，需显式提供标题（`title` 属性）。

---

### 📌 使用建议：
- **用**：嵌入可信第三方内容、需要强隔离的模块（如 OAuth 登录页）。
- **不用**：替代组件化方案（如 React/Vue 组件）、加载同源内容（应直接整合）。

> 现代替代方案：微前端（Module Federation、Web Components）更可控。

## label 的作用是什么？如何使用？

`<label>` 用于**为表单控件（如 `<input>`、`<textarea>`、`<select>`）定义语义关联的文本标签**，提升可访问性、可用性和用户体验。

---

### 核心作用：
1. **点击扩大交互区域**：点击 label 自动聚焦/选中关联控件。
2. **屏幕阅读器友好**：读屏器会朗读 label 内容作为控件说明。
3. **语义清晰**：明确表单字段用途，利于维护和 SEO。

---

### 使用方式（两种）：

#### ✅ 推荐：`for` + `id`（显式关联）
```html
<label for="email">邮箱</label>
<input type="email" id="email">
```

#### ✅ 或：包裹控件（隐式关联）
```html
<label>
  邮箱
  <input type="email">
</label>
```

> ⚠️ 注意：  
> - 每个控件应有唯一 `id`，且仅被一个 `label` 关联。  
> - 不要仅用普通文本代替 `<label>`（如 `<p>邮箱</p><input>`），这会破坏可访问性。

---

### 示例（带辅助说明）：
```html
<label for="username">
  用户名
  <small>3-20个字符</small>
</label>
<input type="text" id="username" required>
```

✅ **最佳实践**：始终为每个表单控件提供 `<label>`，即使 UI 隐藏（可用 `.sr-only` 类视觉隐藏但保留可访问性）。

## HTML5的离线储存怎么使用，它的工作原理是什么

HTML5 的离线存储主要指 **Application Cache（AppCache）** 和 **Service Worker + Cache API**。  
⚠️ **注意：AppCache 已废弃，现代方案是 Service Worker。**

---

### ✅ 现代方案：**Service Worker + Cache API**

#### 工作原理：
1. **注册 Service Worker**（运行在后台的独立线程）
2. **拦截网络请求**（`fetch` 事件）
3. **按策略缓存/返回资源**（如 Cache First、Network First）
4. 实现**离线可用、按需更新、后台同步**

#### 基本使用步骤：

```js
// 1. 注册 SW（main.js）
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// 2. sw.js：缓存静态资源
const CACHE_NAME = 'v1';
const urlsToCache = ['/', '/style.css', '/app.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
```

#### 特点：
- **细粒度控制**：可缓存动态内容、API 响应
- **可更新**：通过版本号或 `skipWaiting()` 实现无缝更新
- **依赖 HTTPS**（安全要求）

---

### ❌ 废弃方案：Application Cache（AppCache）
- 通过 `.appcache` 清单文件声明缓存资源
- **问题**：更新机制不可靠、无法缓存动态内容、已从标准移除

---

### 总结：
- **不要用 AppCache**
- **用 Service Worker + Cache API** 实现离线能力（配合 PWA）
- 核心价值：**提升性能、支持离线访问、增强用户体验**

> 📌 提示：可结合 Workbox 库简化 Service Worker 开发。

## 浏览器是如何对 HTML5 的离线储存资源进行管理和加载？

浏览器对 HTML5 离线存储资源的管理与加载，**现代标准下完全依赖 Service Worker + Cache API**（AppCache 已废弃）。其机制如下：

---

### 一、核心组件
1. **Service Worker (SW)**  
   - 运行在主线程之外的可编程网络代理。
   - 生命周期独立：安装 → 激活 → 控制页面。
2. **Cache API**  
   - 浏览器提供的持久化存储接口，专用于请求/响应缓存。
   - 与 `localStorage` 无关，按命名空间（cache name）隔离。

---

### 二、资源加载流程（以“Cache First”策略为例）

![An image](../public/assets/tongyi-mermaid-2026-01-04-145638.png)

- **首次访问**：SW 安装时预缓存静态资源（install 事件）。
- **后续访问**：SW 激活后接管页面，通过 `fetch` 事件控制加载逻辑。
- **离线时**：直接从 Cache 返回资源，实现离线可用。

---

### 三、资源管理机制

| 行为         | 说明                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **存储位置** | 浏览器专属存储区（与同源策略绑定），不暴露给 JS 主线程                                                                                   |
| **容量限制** | 通常为磁盘空间的 50%~80%，超限时触发 LRU 清理或提示用户                                                                                  |
| **持久性**   | 默认持久化，除非：<br>• 用户清除站点数据<br>• 浏览器自动清理（如 Chrome 的“最近未使用”策略）<br>• 代码主动删除（`caches.delete()`）      |
| **更新机制** | • 修改 SW 文件 → 触发新版本安装<br>• 旧 SW 继续控制已打开页面，新 SW 控制新页面<br>• 可通过 `skipWaiting()` + `clients.claim()` 立即生效 |

---

### 四、关键约束
- **必须 HTTPS**（localhost 除外）
- **同源限制**：只能缓存同源或 CORS 正确配置的跨域资源
- **仅响应式缓存**：无法缓存未请求过的资源（除非预缓存）

---

### ✅ 总结
浏览器通过 **Service Worker 拦截请求 + Cache API 存储响应**，实现：
- **离线优先**的加载策略
- **细粒度、可编程**的缓存控制
- **安全、持久、高效**的离线资源管理

> 📌 实际开发建议使用 [Workbox](https://developers.google.com/web/tools/workbox) 库，避免手写复杂逻辑。


## 渐进增强和优雅降级

**渐进增强（Progressive Enhancement）** 与 **优雅降级（Graceful Degradation）** 是两种前端兼容性设计策略，目标一致（保证基础可用性），但**实现路径相反**。

---

### 1. **渐进增强（主流推荐）**
- **思路**：从**最基础功能**开始，逐步为高级浏览器**增强体验**。
- **步骤**：
  1. 确保 HTML 语义化 → 所有设备可访问内容
  2. 添加 CSS → 基础样式与布局
  3. 添加 JS → 交互与动态功能
- **优势**：
  - 核心内容始终可用（即使无 CSS/JS）
  - 更好的可访问性与 SEO
  - 适应未来新设备/浏览器

✅ **适用场景**：内容优先、广泛兼容（如政府、新闻站）

---

### 2. **优雅降级**
- **思路**：先为现代浏览器构建完整功能，再为旧浏览器**提供替代方案或简化体验**。
- **步骤**：
  1. 使用最新 Web 技术开发完整功能
  2. 通过特性检测（如 `@supports`、`typeof`）回退到基础方案
- **风险**：
  - 旧环境可能完全不可用（若降级逻辑缺失）
  - 开发成本高（需维护多套逻辑）

✅ **适用场景**：面向已知现代环境（如内部系统、Web App）

---

### 对比总结：
| 维度         | 渐进增强                   | 优雅降级                 |
| ------------ | -------------------------- | ------------------------ |
| **起点**     | 最低能力设备               | 最强能力浏览器           |
| **核心原则** | 内容 > 表现 > 行为         | 先实现完整功能，再兼容   |
| **健壮性**   | 高（基础功能永不丢失）     | 依赖降级逻辑完整性       |
| **现代实践** | ✅ 推荐（符合 PWA、无障碍） | ⚠️ 谨慎使用（仅特定场景） |

> 💡 **一句话**：  
> **渐进增强是“向上兼容”，优雅降级是“向下兼容”；前者更稳健，后者更激进。**

## 浏览器乱码的原因是什么？如何解决？

浏览器乱码的根本原因是：**页面编码声明与实际文件保存编码不一致**，导致浏览器错误解析字节流。

---

### 常见原因：
1. **未声明 `<meta charset>`**  
   → 浏览器猜测编码（如 ISO-8859-1），中文显示为 `` 或乱码。
2. **声明的编码 ≠ 文件实际保存编码**  
   → 如 HTML 声明 `UTF-8`，但文件用 GBK 保存。
3. **服务器 HTTP 头 `Content-Type` 指定错误编码**  
   → 优先级高于 `<meta>`，可能覆盖正确设置。
4. **编辑器保存时选错编码**  
   → 开发者误将 UTF-8 文件存为 ANSI/GBK。

---

### 解决方案：

#### ✅ 1. **统一使用 UTF-8（推荐）**
- 文件保存为 **UTF-8 无 BOM**
- HTML 中尽早声明：
  ```html
  <meta charset="UTF-8">
  ```
- 服务器配置响应头：
  ```http
  Content-Type: text/html; charset=utf-8
  ```

#### ✅ 2. **检查优先级**
浏览器编码判定优先级（从高到低）：
1. HTTP `Content-Type` 头中的 `charset`
2. `<meta charset>`（HTML5）
3. BOM 字节序标记
4. 浏览器自动检测（不可靠）

> ⚠️ 若 HTTP 头指定错误编码，即使 `<meta>` 正确也会乱码。

#### ✅ 3. **验证文件真实编码**
- 用 VS Code、Sublime 等编辑器确认右下角编码标识
- 用命令行检查：`file -i your-file.html`（Linux/macOS）

---

### 总结：
> **三统一原则**：  
> **文件保存编码 = `<meta charset>` = HTTP `Content-Type` charset = UTF-8**  
> 即可彻底避免乱码。

## 说一下 HTML5 drag API 

HTML5 Drag & Drop API 是一套原生浏览器接口，用于实现**拖拽交互**，无需依赖第三方库。

---

### 核心概念
- **可拖元素（Draggable）**：添加 `draggable="true"` 的元素（如 `<div draggable="true">`）。
- **拖拽事件流**：从拖开始 → 拖动中 → 放下，涉及两类对象：
  - **被拖元素（source）**
  - **放置目标（drop target）**

---

### 关键事件（按流程）

| 阶段   | 事件（在 source 上触发） | 事件（在 target 上触发）                     |
| ------ | ------------------------ | -------------------------------------------- |
| 开始   | `dragstart`              | —                                            |
| 拖动中 | `drag`（持续触发）       | `dragenter` → `dragover`（需阻止默认行为！） |
| 放下   | `dragend`                | `drop`                                       |

---

### 最小实现示例

```html
<!-- 可拖元素 -->
<div id="drag" draggable="true">拖我</div>

<!-- 放置区 -->
<div id="drop">放这里</div>
```

```js
const drag = document.getElementById('drag');
const drop = document.getElementById('drop');

// 1. 设置拖拽数据（必须）
drag.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', '拖拽内容');
});

// 2. 允许放置（关键！）
drop.addEventListener('dragover', (e) => {
  e.preventDefault(); // 必须！否则 drop 不触发
});

// 3. 处理放下
drop.addEventListener('drop', (e) => {
  e.preventDefault();
  const data = e.dataTransfer.getData('text/plain');
  drop.textContent = data;
});
```

---

### 重要细节
- **`dataTransfer` 对象**：  
  - `setData(type, data)` / `getData(type)`：传递数据（仅限字符串）  
  - `setDragImage(img, x, y)`：自定义拖影
- **`dragover` 必须 `preventDefault()`**：否则浏览器默认禁止放置。
- **文件拖拽**：通过 `e.dataTransfer.files` 获取用户拖入的本地文件（常用于上传）。

---

### 局限性
- 样式定制弱（拖影、反馈需额外处理）
- 移动端支持差（iOS/Android 原生不支持）
- 复杂交互（如排序）建议用库（如 SortableJS）

✅ **适用场景**：简单拖放、文件上传、卡片分组等。

## 介绍下资源预加载 prefetch/preload

`prefetch` 和 `preload` 都是 HTML 提供的**资源预加载提示（hints）**，用于优化性能，但**用途和优先级不同**。

---

### 1. **`<link rel="preload">`**  
> **“马上要用，提前加载”**

- **目的**：**高优先级**预加载当前页面**即将使用**的关键资源。
- **触发时机**：HTML 解析时立即加载。
- **适用资源**：字体、关键 CSS/JS、首屏图片、WebAssembly 等。
- **特点**：
  - 浏览器会**高优加载**（与 CSS/JS 同级）
  - **必须在当前页面使用**，否则控制台报 warning
  - 支持 `as` 属性指定类型（如 `as="font"`、`as="script"`）

```html
<link rel="preload" href="critical.js" as="script">
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```

---

### 2. **`<link rel="prefetch">`**  
> **“未来可能用，空闲再加载”**

- **目的**：**低优先级**预加载**未来导航可能需要**的资源（如下一页 JS）。
- **触发时机**：当前页面**主资源加载完成后**，利用空闲带宽。
- **适用资源**：下一页脚本、非首屏组件、登录后才用的资源。
- **特点**：
  - 浏览器**最低优先级**加载（不影响当前页性能）
  - 资源存入 HTTP 缓存，后续请求直接命中
  - 适合跨页面预取

```html
<link rel="prefetch" href="next-page.js" as="script">
```

---

### 对比总结

| 特性           | `preload`                  | `prefetch`                 |
| -------------- | -------------------------- | -------------------------- |
| **优先级**     | 高（与关键资源同级）       | 低（空闲时加载）           |
| **用途**       | 当前页面**即将使用**的资源 | 未来页面**可能使用**的资源 |
| **缓存**       | 内存缓存（本次导航有效）   | HTTP 缓存（可跨页面）      |
| **未使用后果** | 控制台警告                 | 无影响                     |
| **典型场景**   | 关键字体、首屏 JS/CSS      | 下一页路由、懒加载模块     |

---

✅ **最佳实践**：
- 用 `preload` 加载**首屏关键资源**（避免 Waterfall）
- 用 `prefetch` 预热**用户下一步可能访问**的内容
- 结合 Webpack 的 `/* webpackPrefetch: true */` 或 `<link>` 手动注入

> ⚠️ 注意：两者均为**提示（hint）**，浏览器可选择忽略。

## DOM事件流是什么？

DOM 事件流描述的是**事件在 DOM 树中传播的顺序和阶段**。根据 DOM Level 3 Events 规范，事件流包含 **三个阶段**：

---

### 1. **捕获阶段（Capturing Phase）**  
- 事件从 `window` → `document` → ... → **目标元素的父级**逐层向下传递。
- 默认不触发监听器（除非显式开启）。

### 2. **目标阶段（Target Phase）**  
- 事件到达**目标元素本身**。
- 无论捕获/冒泡，此阶段的监听器都会执行。

### 3. **冒泡阶段（Bubbling Phase）**  
- 事件从目标元素 → 父级 → ... → `document` → `window` 向上传播。
- **默认行为**：大多数事件（如 `click`、`input`）会冒泡。

---

### 事件监听控制
通过 `addEventListener(type, handler, useCapture)` 的第三个参数控制：
- `useCapture = false`（默认）→ 监听**冒泡阶段**
- `useCapture = true` → 监听**捕获阶段**

```js
// 捕获阶段监听
parent.addEventListener('click', handler, true);

// 冒泡阶段监听（默认）
child.addEventListener('click', handler);
```

---

### 阻止传播
- `event.stopPropagation()`：阻止事件继续传播（捕获/冒泡均停止）
- `event.stopImmediatePropagation()`：额外阻止同一阶段其他监听器执行

---

### 示例流程（点击子元素）：
```html
<div id="parent">
  <div id="child">Click</div>
</div>
```
事件流顺序（若同时注册捕获和冒泡）：
1. `window`（捕获）
2. `document`（捕获）
3. `#parent`（捕获）
4. `#child`（目标）
5. `#parent`（冒泡）
6. `document`（冒泡）
7. `window`（冒泡）

---

✅ **关键点**：  
- **冒泡是默认且常用**的（如事件委托）  
- **捕获用于提前拦截**（如权限控制）  
- 不是所有事件都冒泡（如 `focus`、`scroll`）

## offset、scroll、client的区别

`offset`、`scroll`、`client` 是 DOM 元素三组用于**尺寸与位置计算**的只读属性，核心区别在于 **是否包含边框（border）、滚动条、溢出内容**。

---

### 一、横向对比（以 `Width` 为例）

| 属性          | 包含内容                   | 是否含 border | 是否含 padding | 是否含 scrollbar | 是否受滚动影响 |
| ------------- | -------------------------- | ------------- | -------------- | ---------------- | -------------- |
| `offsetWidth` | **整体占据空间**           | ✅             | ✅              | ✅（作为内容）    | ❌              |
| `clientWidth` | **可视内容区 + 内边距**    | ❌             | ✅              | ❌（被减去）      | ❌              |
| `scrollWidth` | **全部内容宽度（含溢出）** | ❌             | ✅              | ❌                | ❌              |

> 高度同理：`offsetHeight` / `clientHeight` / `scrollHeight`

---

### 二、关键说明

#### 1. **`offsetWidth` / `offsetHeight`**
- = `content + padding + border + scrollbar`
- 用于获取元素在页面中**实际占位大小**
- 常配合 `offsetTop` / `offsetLeft` 获取绝对位置

#### 2. **`clientWidth` / `clientHeight`**
- = `content + padding`（**不含 border 和 scrollbar**）
- 表示**当前可视区域大小**
- 滚动时值不变

#### 3. **`scrollWidth` / `scrollHeight`**
- = **完整内容尺寸**（即使溢出不可见）
- 用于判断是否可滚动：`scrollHeight > clientHeight`
- 滚动位置用 `scrollTop` / `scrollLeft` 控制

---

### 三、典型应用场景
- **监听滚动到底部**：  
  ```js
  if (el.scrollTop + el.clientHeight >= el.scrollHeight) { /* 到底 */ }
  ```
- **计算滚动百分比**：  
  ```js
  const percent = el.scrollTop / (el.scrollHeight - el.clientHeight);
  ```
- **获取元素真实渲染宽高**：用 `offsetWidth/Height`

---

✅ **一句话总结**：  
> **`offset` 算占地，`client` 算可视，`scroll` 算全部。**

## 关于一些兼容性

前端兼容性问题主要源于**浏览器内核差异、API 支持度、CSS 渲染行为不一致**。以下是关键点与应对策略（高度概括）：

---

### 一、核心兼容问题分类

| 类型           | 典型问题                                                | 解决方案                                                   |
| -------------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| **HTML**       | 语义标签（如 `<article>`）在 IE8- 不识别                | 引入 `html5shiv` 或使用 `<div>` 降级                       |
| **CSS**        | 盒模型、Flex/Grid、前缀属性（如 `-webkit-`）            | Autoprefixer + PostCSS；必要时用 CSS Hack 或 polyfill      |
| **JavaScript** | ES6+ 语法、新 API（如 `fetch`, `Promise`）              | Babel 转译 + core-js 垫片；特性检测（`if (window.fetch)`） |
| **DOM/BOM**    | 事件模型（IE 的 `attachEvent`）、`console` 在旧 IE 报错 | 使用现代框架（React/Vue）抽象；或封装兼容层                |

---

### 二、关键实践原则

1. **特性检测 > 浏览器检测**  
   ```js
   // ✅ 好
   if ('serviceWorker' in navigator) { ... }
   // ❌ 坏
   if (isIE) { ... }
   ```

2. **渐进增强**  
   基础功能在低版本可用，高级功能按能力增强。

3. **工具链兜底**  
   - **Babel**：转译 JS 语法  
   - **Autoprefixer**：自动加 CSS 前缀  
   - **polyfill.io**：按需加载缺失 API 垫片

4. **明确兼容范围**  
   根据产品需求定义支持的浏览器（如 `browserslist` 配置）：
   ```txt
   > 1%,
   last 2 versions,
   not dead
   ```

---

### 三、常见“坑”速查

- **IE8-**：不支持 `JSON`、`addEventListener`、`querySelector`
- **Safari 旧版**：`flex` 行为异常、`Date` 解析不支持 `-`
- **移动端 WebView**：Android 4.x 内核陈旧，iOS 需处理 `-webkit-overflow-scrolling`
- **Edge Legacy**：部分 CSS Grid 行为与标准不符

---

✅ **总结**：  
> **不盲目兼容，用工具自动化处理，核心体验保底，高级功能按能力提供。**

## 网页制作会用到的图片格式有哪些

网页常用图片格式按**用途与特性**可分为以下几类：

---

### ✅ 1. **通用位图格式**
| 格式     | 特点                                              | 适用场景                         |
| -------- | ------------------------------------------------- | -------------------------------- |
| **JPEG** | 有损压缩、不支持透明、文件小                      | 照片、复杂渐变图像               |
| **PNG**  | 无损压缩、支持透明（Alpha）、文件较大             | 图标、Logo、带透明背景图         |
| **GIF**  | 仅支持 256 色、支持简单动画、支持透明（非 Alpha） | 小动画、极简图标（已基本被替代） |

---

### ✅ 2. **现代高效格式（需兼容处理）**
| 格式     | 特点                         | 优势                           | 兼容性                                |
| -------- | ---------------------------- | ------------------------------ | ------------------------------------- |
| **WebP** | 支持有损/无损、透明、动画    | 比 JPEG/PNG 小 25%~35%         | Chrome/Firefox/Edge/Safari 14+        |
| **AVIF** | 基于 AV1 编码，高压缩率      | 比 WebP 再小 20%+，画质更优    | Chrome 85+、Firefox 93+、Safari 16.4+ |
| **SVG**  | 矢量格式、XML 结构、无限缩放 | 图标、图表、简单图形，文件极小 | 全现代浏览器                          |

---

### ✅ 3. **使用建议**
- **优先用 SVG**：适用于图标、Logo、简单图形（可 CSS 控制、SEO 友好）
- **照片用 JPEG/WebP/AVIF**：通过 `<picture>` 提供 fallback：
  ```html
  <picture>
    <source srcset="image.avif" type="image/avif">
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="...">
  </picture>
  ```
- **透明图用 PNG/WebP**：WebP 支持 Alpha 透明且体积更小
- **避免 GIF**：用视频（`<video muted loop>`）或 APNG 替代动画

---

### ⚠️ 注意
- **不要盲目用新格式**：需根据目标用户浏览器支持情况决定
- **响应式图片**：结合 `srcset` + `sizes` 适配不同分辨率

✅ **总结**：  
> **SVG（矢量） + WebP/AVIF（位图）为主，JPEG/PNG 为 fallback，GIF 尽量不用。**

## 点击一个input依次触发的事件

点击一个 `<input>` 元素（假设为 `type="text"`），在现代浏览器中**依次触发的事件顺序**如下：

---

### ✅ 事件流顺序（从外到内再冒泡）：

1. **`mousedown`**  
   - 鼠标按钮按下（在 input 上）
2. **`focus`**  
   - input 获得焦点（若之前未聚焦）
3. **`focusin`**（可冒泡的 focus 事件）  
4. **`mouseup`**  
   - 鼠标按钮释放
5. **`click`**  
   - mousedown + mouseup 完整点击
6. **（若有选中文本）`select`**  
   - 触发于文本被选中时（部分浏览器在点击已聚焦 input 时会触发）

> 若 input **已处于聚焦状态**，再次点击通常只触发：  
> `mousedown` → `mouseup` → `click`（不再触发 `focus` / `focusin`）

---

### 🔁 补充说明：
- **`focus` 和 `blur` 不冒泡**，但 `focusin` / `focusout` 可冒泡（IE 标准，现已被 DOM 标准采纳）。
- 若通过 JS 调用 `.focus()`，则只触发 `focus` / `focusin`，**不触发鼠标相关事件**。
- 移动端可能触发 `touchstart` → `touchend` → `mousedown` → `focus` → `mouseup` → `click`（存在 300ms 延迟或合成事件）。

---

### 📌 典型用途：
- 用 `focus` 初始化校验逻辑
- 用 `click` 控制光标位置或弹出选择器
- 用 `select` 获取用户选中文本

✅ **记住核心顺序**：  
> **`mousedown` → `focus` → `mouseup` → `click`**

## 有写过原生的自定义事件吗

是的，原生 JavaScript 支持自定义事件，主要通过 **`CustomEvent`** 或 **`Event`** 构造函数 + `dispatchEvent` 实现。

---

### ✅ 基本用法（现代标准）

```js
// 1. 创建自定义事件（带数据）
const event = new CustomEvent('myEvent', {
  detail: { message: 'Hello' },
  bubbles: true,    // 是否冒泡
  cancelable: true  // 是否可取消
});

// 2. 在目标元素上触发
element.dispatchEvent(event);

// 3. 监听
element.addEventListener('myEvent', (e) => {
  console.log(e.detail.message); // 'Hello'
});
```

---

### ✅ 兼容旧浏览器（IE9+）
```js
// 降级方案：使用 Event + initCustomEvent（已废弃但可用）
const event = document.createEvent('CustomEvent');
event.initCustomEvent('myEvent', true, true, { message: 'Hello' });
element.dispatchEvent(event);
```

---

### 🛠️ 典型应用场景
- 组件间通信（如弹窗关闭通知父组件）
- 解耦逻辑（如“用户登录成功”事件，多个模块监听）
- 模拟原生行为（如封装一个 `swipe` 手势事件）

---

### ⚠️ 注意
- 自定义事件**不会触发默认行为**（无原生副作用）
- `detail` 是传递数据的标准字段
- 避免与原生事件名冲突（如不要叫 `click`）

✅ **一句话总结**：  
> 用 `new CustomEvent()` + `dispatchEvent()` 即可实现解耦、可冒泡、带数据的原生级自定义事件。

## target="_blank"有哪些问题？

`target="_blank"` 虽然常用于在新标签页打开链接，但存在三个关键问题，**尤其第一个是严重安全漏洞**：

---

### 1. **安全漏洞：`window.opener` 劫持（高危）**
- 新页面可通过 `window.opener` **直接访问原页面的 `window` 对象**。
- 恶意网站可执行：
  ```js
  // 在新打开的恶意页面中
  window.opener.location = 'https://phishing.com'; // 强制原页面跳转到钓鱼站
  ```
- **后果**：用户以为还在原站，实则已被劫持。

✅ **修复**：始终添加 `rel="noopener"`  
```html
<a href="https://example.com" target="_blank" rel="noopener">安全链接</a>
```
- `noopener`：切断 `window.opener` 引用（现代浏览器标准）
- 兼容旧浏览器可用 `rel="noreferrer"`（但会丢失 Referer）

---

### 2. **性能隐患**
- 新标签页与原页面**共享部分资源/进程**（尤其非 Chromium 浏览器）。
- 若新页面含 heavy JS/动画，可能拖慢原页面。

✅ **缓解**：`rel="noopener"` 可促使浏览器将新页面放入独立进程（Chromium 行为）。

---

### 3. **用户体验问题**
- 用户可能**迷失上下文**（尤其移动端多标签管理混乱）。
- 屏幕阅读器无法明确提示“已在新窗口打开”。

✅ **建议**：
- 非必要不强制新开（让用户自主 Ctrl+Click）
- 如必须新开，**视觉标注**（如 ↗ 图标）并用 ARIA 提示：
  ```html
  <a href="..." target="_blank" rel="noopener" aria-label="在新窗口打开：Example">
    Example ↗
  </a>
  ```

---

### 📌 最佳实践
> **所有 `target="_blank"` 必须配 `rel="noopener"`**  
> 这是 MDN、Google 安全团队、OWASP 共同推荐的基线要求。

## HTMLCollection 和 NodeList的区别

`HTMLCollection` 和 `NodeList` 都是 DOM 查询返回的**类数组集合**，但关键区别在于 **动态性、包含节点类型、方法支持**：

---

### ✅ 核心区别

| 特性             | `HTMLCollection`                                | `NodeList`                                                      |
| ---------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| **动态 vs 静态** | **动态（live）**：DOM 变化自动更新              | **通常静态（static）**：快照（除 `childNodes`）                 |
| **包含节点类型** | 仅 **元素节点（Element）**                      | 可包含 **所有节点类型**（文本、注释等）                         |
| **常见来源**     | `getElementsBy*()`（如 `getElementsByTagName`） | `querySelectorAll()`、`childNodes`                              |
| **可用方法**     | 无 `forEach`、`map` 等数组方法                  | `querySelectorAll` 返回的 NodeList 支持 `forEach`（现代浏览器） |
| **访问方式**     | 支持 `.item(i)` 和 `[i]`                        | 仅支持 `[i]`（部分老浏览器不支持 `forEach`）                    |

---

### 📌 示例说明

```js
// HTMLCollection（动态）
const divs1 = document.getElementsByTagName('div');
console.log(divs1.length); // 假设为 2
document.body.appendChild(document.createElement('div'));
console.log(divs1.length); // 自动变为 3！

// NodeList（静态）
const divs2 = document.querySelectorAll('div');
console.log(divs2.length); // 假设为 2
document.body.appendChild(document.createElement('div'));
console.log(divs2.length); // 仍为 2（快照）
```

> ⚠️ 注意：`parentNode.childNodes` 返回的是**动态 NodeList**，属例外。

---

### ✅ 使用建议
- **优先用 `querySelectorAll`**：返回静态 NodeList，避免意外副作用。
- **转换为数组**（如需高阶函数）：
  ```js
  const arr = Array.from(nodeList);
  // 或 [...nodeList]
  ```

---

### 💡 一句话总结  
> **`HTMLCollection` 是动态的元素集合，`NodeList` 通常是静态的全节点快照；现代开发首选 `querySelectorAll`。**

## children 以及 childNodes 的区别

`children` 与 `childNodes` 都用于访问元素的子节点，但**包含的节点类型不同**：

---

### ✅ 核心区别

| 特性          | `children`                     | `childNodes`                                |
| ------------- | ------------------------------ | ------------------------------------------- |
| **节点类型**  | 仅返回 **元素节点（Element）** | 返回 **所有类型节点**（元素、文本、注释等） |
| **类型**      | `HTMLCollection`（动态集合）   | `NodeList`（动态集合）                      |
| **空格/换行** | 忽略文本节点（包括空白）       | 包含空白文本节点（如缩进、换行）            |

---

### 📌 示例
```html
<div id="parent">
  <!-- 注释 -->
  <span>1</span>
  <p>2</p>
</div>
```

```js
const parent = document.getElementById('parent');

console.log(parent.children.length);     // 2（仅 <span>, <p>）
console.log(parent.childNodes.length);   // 5（#text, <!-->, #text, <span>, #text, <p>, #text）

// children 只包含元素
for (let el of parent.children) {
  console.log(el.tagName); // SPAN, P
}

// childNodes 包含所有
for (let node of parent.childNodes) {
  console.log(node.nodeType); // 3(文本), 8(注释), 3, 1(元素), ...
}
```

---

### ✅ 使用建议
- **要操作子元素** → 用 `children`（干净、直接）
- **需处理文本/注释节点** → 用 `childNodes`
- 两者都是**动态集合**：DOM 变化会实时反映

---

### 💡 一句话总结  
> **`children` 是“子元素列表”，`childNodes` 是“所有子节点快照”；90% 场景用 `children`。**

## 前端页面有哪三层构成，分别是什么？

前端页面由 **结构、样式、行为** 三层构成，遵循 **关注点分离（Separation of Concerns）** 原则：

---

### 1. **结构层（Structure）**  
- **技术**：HTML（或 JSX、模板等）  
- **作用**：定义内容语义与骨架，如标题、段落、表单、列表。  
- **核心要求**：语义化、可访问性（Accessibility）、SEO 友好。

### 2. **样式层（Presentation）**  
- **技术**：CSS（或 SCSS、CSS-in-JS 等）  
- **作用**：控制布局、颜色、字体、响应式等视觉表现。  
- **核心要求**：解耦结构、适配多端、性能优化（避免重绘/回流）。

### 3. **行为层（Behavior）**  
- **技术**：JavaScript（或 TypeScript、框架逻辑）  
- **作用**：实现交互、数据处理、动态更新（如点击、动画、AJAX）。  
- **核心要求**：渐进增强、事件解耦、性能与兼容性。

---

✅ **关键原则**：  
- 三层**相互独立又协同工作**，避免混杂（如内联 `style` 或 `onclick`）。  
- 现代框架（React/Vue）在组件内聚合三层，但**逻辑上仍保持分离**（JSX 表结构，CSS 模块表样式，hooks/methods 表行为）。

> 💡 **一句话总结**：  
> **HTML 是骨架，CSS 是皮肤，JS 是肌肉和神经。**

## 对于Web标准以及W3C的理解

**Web 标准**是由 **W3C（World Wide Web Consortium）** 等组织制定的一系列技术规范，旨在确保 Web 的**互操作性、可访问性、长期可维护性**。

---

### 一、W3C 是什么？
- **角色**：Web 技术的国际标准化组织（由 Tim Berners-Lee 创立）。
- **职责**：制定 HTML、CSS、DOM、WCAG、SVG 等核心标准。
- **运作方式**：成员（浏览器厂商、企业、学术机构）协作提案 → 草案 → 推荐标准（W3C Recommendation）。

> ✅ W3C 标准 ≠ 强制法律，但**主流浏览器均以其实现为依据**。

---

### 二、Web 标准的核心组成
1. **结构标准**：HTML / XML —— 内容语义化  
2. **表现标准**：CSS —— 样式与布局分离  
3. **行为标准**：ECMAScript（JS）、DOM、Web APIs —— 交互逻辑  
4. **可访问性标准**：WCAG —— 保障残障用户可用  
5. **协议标准**：HTTP、URI 等（部分由 IETF 主导）

---

### 三、遵循 Web 标准的价值
| 维度         | 收益                               |
| ------------ | ---------------------------------- |
| **兼容性**   | 页面在不同浏览器/设备表现一致      |
| **可维护性** | 结构清晰，团队协作高效             |
| **SEO**      | 语义化 HTML 更易被搜索引擎理解     |
| **可访问性** | 屏幕阅读器等辅助技术正常工作       |
| **未来兼容** | 避免依赖私有 API，延长项目生命周期 |

---

### 四、常见误区
- ❌ “W3C 标准 = 过时” → 实际上 HTML5、CSS Grid、Web Components 均是现代标准。
- ❌ “标准阻碍创新” → 标准确保创新可被广泛采用（如 Service Worker 成为 PWA 基石）。

---

✅ **总结**：  
> **Web 标准是 Web 生态的“通用语言”，W3C 是其主要制定者。遵循标准 = 写更健壮、更可持续、更包容的代码。**

## cookie、sessionStorage 和 localStorage 的区别

`cookie`、`sessionStorage` 和 `localStorage` 都是前端存储机制，但**用途、生命周期、容量和 API** 差异显著：

---

### ✅ 核心对比

| 特性               | **Cookie**                                      | **sessionStorage**                       | **localStorage**             |
| ------------------ | ----------------------------------------------- | ---------------------------------------- | ---------------------------- |
| **主要用途**       | 会话管理、身份认证（如 token）                  | 临时保存**单会话**数据                   | 持久化保存**跨会话**数据     |
| **生命周期**       | 可设过期时间（默认会话结束清除）                | **页面会话期间有效**（关闭标签页即清除） | **永久存储**（除非手动清除） |
| **存储容量**       | ≈4KB                                            | ≈5MB                                     | ≈5–10MB                      |
| **是否随请求发送** | ✅ 自动携带在 HTTP 头中                          | ❌                                        | ❌                            |
| **作用域**         | 可设 `domain`/`path`，支持跨子域                | 同源 + **同标签页**（不共享）            | 同源（不同标签页可共享）     |
| **API**            | `document.cookie = "..."`（字符串操作）         | `setItem`/`getItem`（简单 KV）           | 同 sessionStorage            |
| **安全性**         | 可设 `HttpOnly`（防 XSS）、`Secure`（仅 HTTPS） | 无特殊安全机制                           | 无特殊安全机制               |

---

### 📌 典型场景
- **Cookie**：用户登录态（配合 `HttpOnly` 防 XSS）、AB 测试分组  
- **sessionStorage**：表单草稿、单页应用临时状态（刷新保留，关闭丢失）  
- **localStorage**：主题偏好、长期缓存（如离线数据）、用户配置  

---

### ⚠️ 注意事项
- **敏感数据勿存 localStorage/sessionStorage**：易被 XSS 窃取  
- **Cookie 会增加请求体积**：避免存大内容  
- **移动端 Safari 隐私模式**：可能限制 localStorage 写入  

---

✅ **一句话总结**：  
> **Cookie 用于通信，sessionStorage 用于临时，localStorage 用于持久。**