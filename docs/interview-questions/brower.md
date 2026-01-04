# HTTP和浏览器

## GET和POST有什么区别

GET 和 POST 是 HTTP 协议中最常用的两种请求方法，核心区别如下：

1. **语义不同**  
   - GET：用于**获取**资源，应是安全（不修改服务器状态）且幂等的。  
   - POST：用于**提交**数据，通常会改变服务器状态，非幂等。

2. **参数位置**  
   - GET：参数附在 URL 的查询字符串中（?key=value）。  
   - POST：参数放在请求体（body）中。

3. **长度与编码限制**  
   - GET：受 URL 长度限制（浏览器/服务器通常限制 2KB~8KB），仅支持 ASCII 编码。  
   - POST：无长度限制（理论上），支持多种编码（如 multipart/form-data、application/json 等）。

4. **安全性**  
   - GET：参数暴露在 URL 中，易被记录（历史、日志、书签），**不适合传敏感信息**。  
   - POST：参数在 body 中，相对更安全（但 HTTPS 才是关键）。

5. **缓存与书签**  
   - GET：可被缓存、收藏为书签。  
   - POST：不可缓存，不能直接通过 URL 重现。

6. **TCP 行为（常见误解澄清）**  
   - 并非“GET 一次包、POST 两次包”——实际取决于实现和是否带 body，现代浏览器对两者都可能合并或分片传输。

> 总结：**用 GET 获取数据，用 POST 提交数据；安全性和语义比技术细节更重要。**


## HTTP2相对于HTTP1.x有什么优势和特点

HTTP/2 相对于 HTTP/1.x 的核心优势和特点可高度概括如下：

1. **二进制分帧（Binary Framing）**  
   - 将请求和响应拆分为二进制帧（frame），提升解析效率和协议健壮性，取代 HTTP/1.x 的文本格式。

2. **多路复用（Multiplexing）**  
   - 单个 TCP 连接上可并行传输多个请求/响应流（stream），彻底解决 HTTP/1.x 的“队头阻塞”问题，无需域名分片或连接池。

3. **头部压缩（HPACK）**  
   - 使用 HPACK 算法压缩头部，避免重复字段冗余传输，显著减少带宽消耗（尤其对含 Cookie 的请求）。

4. **服务器推送（Server Push）**  
   - 服务器可主动向客户端推送资源（如 CSS、JS），无需等待客户端请求，优化关键渲染路径。

5. **优先级与流控制**  
   - 支持为流设置优先级，客户端可告知服务器资源加载顺序；同时提供细粒度的流量控制机制。

6. **兼容性**  
   - 语义层（方法、状态码、Header 等）与 HTTP/1.x 完全兼容，仅传输层重构，现有 Web 应用无需重写。

> 总结：**HTTP/2 通过二进制分帧 + 多路复用 + 头部压缩，在单连接上实现高效、低延迟、低开销的通信，大幅提升页面加载性能。**

## https是怎么保证安全的，为什么比http安全

HTTPS 本质是 **HTTP over TLS/SSL**，其安全性源于在传输层引入了加密、认证和完整性保护机制。相比 HTTP（明文传输），核心安全优势如下：

---

### 1. **加密（Confidentiality）**
- **对称加密 + 非对称加密混合机制**：
  - 非对称加密（如 RSA、ECDHE）用于安全交换**会话密钥**；
  - 对称加密（如 AES）用该密钥加密实际传输数据，兼顾效率与安全。
- **结果**：即使被中间人截获，也无法读取内容。

### 2. **身份认证（Authentication）**
- 服务器通过 **数字证书（由可信 CA 签发）** 证明身份；
- 客户端验证证书有效性（域名匹配、未过期、CA 信任链等），防止“冒充”。
- （可选）客户端也可提供证书实现双向认证。

### 3. **数据完整性（Integrity）**
- 使用 **MAC（消息认证码）或 AEAD 加密模式**，确保数据在传输中未被篡改。

---

### 为什么比 HTTP 安全？
| 维度       | HTTP                         | HTTPS                        |
| ---------- | ---------------------------- | ---------------------------- |
| 数据可见性 | 明文，可被嗅探               | 加密，不可读                 |
| 身份验证   | 无                           | 通过证书验证服务器身份       |
| 数据篡改   | 可被中间人修改（如注入广告） | 篡改会导致校验失败，连接终止 |
| 会话劫持   | Cookie 等易被盗用            | 加密保护敏感信息             |

> 💡 **关键点**：HTTPS 的安全不在于“协议本身”，而在于 **TLS 层提供的密码学保障**。HTTP 无任何安全机制，所有数据裸奔；HTTPS 在 TCP 之上构建了可信通道。

> ⚠️ 注意：HTTPS 不能防 XSS、CSRF 或业务逻辑漏洞，仅保障**传输过程**安全。

## HTTP的状态码有哪些？并代表什么意思？

HTTP 状态码是服务器对客户端请求的响应结果分类，共5大类（以首位数字区分），以下是**前端工程师需重点掌握的核心状态码及含义**：

---

### **1xx：信息性（临时响应）**
- **100 Continue**：客户端应继续发送请求体（用于分段上传前确认）。
- **101 Switching Protocols**：服务器同意切换协议（如 WebSocket 升级）。

> 前端通常不直接处理 1xx。

---

### **2xx：成功**
- **200 OK**：请求成功，响应体含结果（GET/PUT/POST 等）。
- **201 Created**：资源创建成功（常用于 POST 后返回新资源 URI）。
- **204 No Content**：请求成功，但无响应体（常用于 DELETE 或更新操作）。

---

### **3xx：重定向**
- **301 Moved Permanently**：永久重定向（SEO 友好，浏览器会缓存）。
- **302 Found**（临时重定向）：资源临时在另一 URI（传统表单提交后跳转常用）。
- **304 Not Modified**：协商缓存命中，客户端可使用本地缓存（配合 `If-Modified-Since` / `ETag`）。

> ⚠️ 307/308 是 302/301 的“严格版”（禁止改变请求方法）。

---

### **4xx：客户端错误**
- **400 Bad Request**：请求语法错误或参数无效。
- **401 Unauthorized**：未认证（需登录，通常触发弹出登录框）。
- **403 Forbidden**：已认证但无权限访问资源。
- **404 Not Found**：请求资源不存在。
- **405 Method Not Allowed**：请求方法（如 POST）不被该资源支持。
- **429 Too Many Requests**：请求频次超限（限流场景）。

---

### **5xx：服务器错误**
- **500 Internal Server Error**：服务器内部异常（通用错误）。
- **502 Bad Gateway**：网关/代理收到上游无效响应（如 Nginx → 应用宕机）。
- **503 Service Unavailable**：服务暂时不可用（如维护、过载）。
- **504 Gateway Timeout**：网关/代理等待上游超时。

---

### ✅ 前端重点关注
| 场景         | 关键状态码                   |
| ------------ | ---------------------------- |
| 接口调用成功 | 200, 201, 204                |
| 缓存命中     | 304                          |
| 登录/权限    | 401（未登录）, 403（无权限） |
| 资源不存在   | 404                          |
| 请求格式错误 | 400                          |
| 服务异常     | 500, 502, 503, 504           |

> 💡 **最佳实践**：前端应根据状态码做差异化处理（如 401 跳登录页，403 提示权限不足，5xx 显示友好错误页）。

## post请求为什么会多发送一次option请求

POST 请求**并非总是**会多发一次 OPTIONS 请求，只有在触发 **CORS 预检（Preflight）** 时才会发生。这是浏览器的**安全机制**，与 HTTP 协议本身无关。

---

### ✅ 什么情况下会触发 OPTIONS 预检？
当请求满足以下**任一条件**（即“非简单请求”）时，浏览器会先发送 OPTIONS 请求：

1. **使用了非简单方法**：如 `PUT`、`DELETE`、`PATCH`（注意：`POST` **可能**触发，见下条）；
2. **设置了非简单请求头**：如 `Content-Type: application/json`、`Authorization`、自定义 header（如 `X-Requested-With`）；
3. **POST 的 `Content-Type` 不是以下三种之一**：
   - `application/x-www-form-urlencoded`
   - `multipart/form-data`
   - `text/plain`

> 📌 关键点：**`POST + application/json` 是最常见触发预检的场景**。

---

### 🔍 预检请求的作用
- **询问服务器**：“你是否允许我接下来要发的这个跨域请求？”
- 浏览器自动发送 OPTIONS 请求，携带：
  - `Origin`：当前源
  - `Access-Control-Request-Method`：实际请求方法（如 POST）
  - `Access-Control-Request-Headers`：实际请求带的自定义头
- 服务器需在响应中明确允许：
  ```http
  Access-Control-Allow-Origin: https://your-site.com
  Access-Control-Allow-Methods: POST, GET, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
  ```

---

### 🛠 如何避免不必要的 OPTIONS？
- 使用简单请求（如 `POST` + `application/x-www-form-urlencoded`）；
- 后端正确配置 CORS 响应头，并考虑**缓存预检结果**：
  ```http
  Access-Control-Max-Age: 86400  // 预检结果缓存 24 小时
  ```

---

### ❌ 常见误解澄清
- **不是 POST 本身导致**，而是**跨域 + 非简单请求特征**触发；
- **同源请求不会发 OPTIONS**；
- **OPTIONS 是浏览器自动发出的，开发者无法阻止（也不应阻止）**。

> 💡 总结：**OPTIONS 预检是 CORS 安全策略的一部分，用于保护用户免受恶意跨域请求，而非协议缺陷。**

## http的请求和响应报文分别是什么样的？

HTTP 请求和响应报文均采用**文本格式**（HTTP/1.x），由三部分组成：**起始行 + 头部（Headers） + 空行 + 正文（Body，可选）**。以下是结构化概括：

---

### 一、HTTP 请求报文（Request）
```
<请求行>
<请求头>
                  ← 空行（\r\n\r\n）
<请求体（可选）>
```

#### 1. **请求行（Request Line）**
```http
GET /api/users HTTP/1.1
```
- 格式：`方法 路径 协议版本`
- 方法：`GET`、`POST`、`PUT`、`DELETE` 等
- 路径：URL 的路径和查询参数（不含域名）
- 协议：如 `HTTP/1.1`、`HTTP/2`

#### 2. **请求头（Request Headers）**
```http
Host: api.example.com
User-Agent: Mozilla/5.0 ...
Accept: application/json
Content-Type: application/json
Authorization: Bearer xxx
```
- 键值对形式，提供元信息（如身份、内容类型、缓存策略等）
- `Host` 是 HTTP/1.1 **必填**字段

#### 3. **请求体（Request Body）**
- `GET` 请求通常无 body；
- `POST`/`PUT` 等携带数据（如 JSON、表单、文件）：
  ```json
  {"name": "Alice", "age": 30}
  ```

> ✅ 示例（POST）：
```http
POST /login HTTP/1.1
Host: example.com
Content-Type: application/json
Content-Length: 38

{"username":"alice","password":"123456"}
```

---

### 二、HTTP 响应报文（Response）
```
<状态行>
<响应头>
                  ← 空行（\r\n\r\n）
<响应体（可选）>
```

#### 1. **状态行（Status Line）**
```http
HTTP/1.1 200 OK
```
- 格式：`协议版本 状态码 状态文本`
- 如 `HTTP/1.1 404 Not Found`

#### 2. **响应头（Response Headers）**
```http
Content-Type: application/json
Content-Length: 123
Set-Cookie: sessionid=abc123; Path=/
Cache-Control: no-cache
```
- 描述响应元数据（内容类型、缓存控制、Cookie 设置等）

#### 3. **响应体（Response Body）**
- 返回实际数据（HTML、JSON、图片等）：
  ```json
  {"code": 200, "data": {...}}
  ```

> ✅ 示例（成功响应）：
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 25

{"message": "success"}
```

---

### 🔑 关键区别总结
| 部分      | 请求报文         | 响应报文                        |
| --------- | ---------------- | ------------------------------- |
| 起始行    | `方法 路径 版本` | `版本 状态码 状态文本`          |
| 必填头部  | `Host`           | 无强制，但通常有 `Content-Type` |
| Body 触发 | 非 GET/HEAD 方法 | 非 204/304 等无体状态码         |

> 💡 注意：HTTP/2 虽将报文转为**二进制分帧**，但语义结构（Header + Body）保持不变，开发者仍按上述逻辑理解。

## 同样是重定向307，303，302的区别？

302、303、307 都是 HTTP 重定向状态码，但**对后续请求方法（如 POST → GET）的处理不同**，核心区别在于是否允许浏览器**改变原始请求方法**：

---

### ✅ 精简对比表
| 状态码  | 名称                | 是否允许方法变更             | 典型用途                            |
| ------- | ------------------- | ---------------------------- | ----------------------------------- |
| **302** | Found（临时重定向） | **允许**（实践中常转为 GET） | 传统临时跳转（历史行为不一致）      |
| **303** | See Other           | **强制改为 GET**             | POST 后重定向到结果页（防重复提交） |
| **307** | Temporary Redirect  | **禁止变更方法**             | 严格保持原方法（如 POST 仍为 POST） |

---

### 🔍 详细说明

#### **302 Found**
- **原始语义**：临时重定向，**应保持原方法**。
- **现实问题**：早期浏览器（如 IE）将 302 的 POST 自动转为 GET，导致行为混乱。
- **现状**：多数浏览器对 302 的非 GET 请求**默认转为 GET**（违背 RFC，但已成事实标准）。

#### **303 See Other**
- **明确要求**：无论原方法是什么，**客户端必须用 GET 发起新请求**。
- **典型场景**：表单提交（POST）后，服务器返回 303 跳转到“操作成功”页面，避免刷新重复提交。

#### **307 Temporary Redirect**
- **严格语义**：临时重定向，**必须保持原始请求方法和 body**。
- **用途**：需要确保重定向后仍用 POST/PUT 等方法（如 API 代理、负载均衡）。

---

### 💡 前端/后端实践建议
- **要跳转到新页面（如登录后首页）** → 用 **303**（确保 GET）；
- **需保持请求方法不变（如 API 重试）** → 用 **307**；
- **避免使用 302 处理非 GET 请求**（行为不可控）；
- **永久重定向统一用 308**（301 的“方法保持版”）。

> 📌 **记忆口诀**：  
> **303 → See Other（看别的，用 GET）**  
> **307 → Temporary（临时，原样重发）**

## HTTP的keep-alive是干什么的？

HTTP 的 **Keep-Alive** 是一种**持久连接（Persistent Connection）机制**，核心作用是：**在单个 TCP 连接上复用多个 HTTP 请求/响应，避免频繁建立和关闭连接的开销**。

---

### ✅ 核心价值
- **减少 TCP 握手（3 次）和挥手（4 次）次数** → 降低延迟；
- **避免慢启动（Slow Start）重复发生** → 提升吞吐；
- **节省服务器资源**（连接数、内存）；
- **对 HTTPS 尤其重要**（省去 TLS 握手开销）。

---

### 🔧 工作方式（HTTP/1.1 默认启用）
- **HTTP/1.0**：默认关闭，需显式加头部：
  ```http
  Connection: keep-alive
  ```
- **HTTP/1.1**：默认开启，除非显式关闭：
  ```http
  Connection: close
  ```
- 连接保持一段时间（由服务器 `Keep-Alive: timeout=5, max=100` 控制），超时或达到最大请求数后关闭。

---

### 🌰 示例
无 Keep-Alive（每次请求新建连接）：
```
[GET /a] → TCP 建连 → 传输 → 断连  
[GET /b] → TCP 建连 → 传输 → 断连  // 高延迟
```

有 Keep-Alive（复用连接）：
```
[GET /a] → TCP 建连 → 传输  
[GET /b] → 复用同一连接 → 传输  
...  
空闲超时 → 自动断连
```

---

### ⚠️ 注意事项
- **不是“长连接”**：仍是短生命周期的复用连接（通常几秒到几十秒）；
- **与 HTTP/2 关系**：HTTP/2 通过多路复用彻底解决队头阻塞，但仍依赖持久连接，Keep-Alive 在底层依然有效；
- **资源泄漏风险**：客户端或服务器若未正确关闭空闲连接，可能耗尽文件描述符。

---

### 💡 总结
> **Keep-Alive = 单 TCP 连接跑多个 HTTP 事务，显著提升性能，是现代 Web 高效加载的基础。**  
> （HTTP/1.1 默认开启，无需额外配置；调优重点在服务端超时和最大请求数设置。）

## 从输入URL到看到页面发生的全过程

从在浏览器地址栏输入 URL 到最终看到页面，全过程可高度概括为以下 **7 个关键阶段**（前端工程师视角）：

---

### 1. **URL 解析与安全检查**
- 浏览器解析 URL（协议、域名、路径、参数）；
- 检查 HSTS 列表（强制 HTTPS）、恶意站点数据库（Safe Browsing）。

---

### 2. **DNS 查询（域名 → IP）**
- 查找缓存顺序：  
  **浏览器缓存 → 系统 hosts → 本地 DNS 缓存 → 递归 DNS 服务器（如 8.8.8.8）**
- 返回目标服务器 IP 地址（可能 IPv4/IPv6）。

---

### 3. **建立 TCP 连接（三次握手）**
- 客户端 → 服务器：`SYN`  
- 服务器 → 客户端：`SYN-ACK`  
- 客户端 → 服务器：`ACK`  
- 若为 HTTPS，**紧接着进行 TLS 握手**（密钥交换、证书验证等，通常 1-RTT 或 0-RTT）。

---

### 4. **发送 HTTP 请求**
- 构造请求报文（含 Method、Path、Headers 如 `Host`, `User-Agent`, `Cookie` 等）；
- 通过已建立的 TCP/TLS 连接发送；
- 若启用了 HTTP/2，此阶段可能复用连接并多路复用流。

---

### 5. **服务器处理 & 返回响应**
- Web 服务器（如 Nginx）接收请求，可能：
  - 静态资源：直接返回文件（如 HTML/CSS/JS）；
  - 动态请求：转发给应用服务器（如 Node.js、Java）处理业务逻辑；
- 返回 HTTP 响应（状态码 + Headers + Body，如 HTML 文档）。

---

### 6. **浏览器解析与渲染（关键！）**
#### a) **构建 DOM 树**
- 解析 HTML → 生成 DOM 节点树。

#### b) **构建 CSSOM 树**
- 加载 `<link>` CSS 和 `<style>` → 解析样式规则 → 生成 CSSOM。

#### c) **构建 Render Tree**
- 合并 DOM + CSSOM → 只包含可见元素的渲染树。

#### d) **Layout（回流）**
- 计算每个节点几何位置（宽高、坐标）。

#### e) **Paint（重绘）**
- 将像素绘制到屏幕（分层、合成）。

> ⚠️ 遇到 `<script>` 会**阻塞 HTML 解析**（除非 `async`/`defer`）；  
> 遇到外部 CSS 会**阻塞渲染**（但不阻塞 HTML 解析）。

---

### 7. **加载子资源 & 执行 JS**
- 解析 HTML 时发现 `<img>`, `<script>`, `fetch()` 等 → 发起新请求（复用 Keep-Alive 连接）；
- 执行 JavaScript（可能修改 DOM/CSSOM → 触发重新 Layout/Paint）；
- 最终完成 **FP（First Paint）→ FCP（First Contentful Paint）→ LCP（Largest Contentful Paint）**。

---

### 🔄 补充：连接关闭
- 页面加载完成后，TCP 连接可能保持（Keep-Alive）供后续请求复用；
- 空闲超时后由服务器或客户端关闭（四次挥手）。

---

### 💡 性能优化关键点
| 阶段    | 优化手段                                 |
| ------- | ---------------------------------------- |
| DNS     | DNS 预解析 (`<link rel="dns-prefetch">`) |
| TCP/TLS | HTTP/2, TLS 1.3, 0-RTT                   |
| 请求    | 减少请求数、CDN、缓存策略                |
| 渲染    | 关键资源内联、懒加载、避免长任务         |

> ✅ **一句话总结**：  
> **DNS → TCP/TLS → HTTP → 服务端响应 → 浏览器解析 → 构建 DOM/CSSOM → 渲染 → 加载子资源 → 交互就绪。**

## 浏览器缓存的优先级？

浏览器缓存的优先级遵循一套**明确的决策流程**，核心原则是：**强缓存 > 协商缓存 > 网络请求**。以下是前端工程师必须掌握的精确优先级顺序：

---

### ✅ 缓存决策流程（按优先级从高到低）

#### 1. **Service Worker 缓存（最高优先级）**
- 如果注册了 Service Worker 且其 `fetch` 事件拦截了请求，**完全由 JS 控制缓存逻辑**；
- 可绕过所有 HTTP 缓存机制（常用于 PWA）。

#### 2. **Memory Cache（内存缓存）**
- 存储在内存中的临时缓存（如页面内重复图片、脚本）；
- **生命周期最短**（刷新即失效），但速度最快；
- 无标准控制方式，由浏览器自动管理。

#### 3. **Disk Cache（磁盘缓存） + HTTP 强缓存**
- 通过响应头控制，**无需发起网络请求**：
  - `Cache-Control: max-age=3600`（HTTP/1.1，优先级更高）
  - `Expires: <GMT 时间>`（HTTP/1.0，若无 `Cache-Control` 则用它）
- **命中条件**：未过期 → 直接返回缓存。

> 📌 `Cache-Control` 指令优先级（常见）：  
> `no-store` > `no-cache` > `max-age` > `Expires`

#### 4. **协商缓存（需发请求，但可能 304）**
- 强缓存失效后触发，通过以下头部验证资源是否更新：
  - **ETag / If-None-Match**（优先级更高，基于内容指纹）
  - **Last-Modified / If-Modified-Since**（基于时间戳）
- 服务器比对后：
  - 未修改 → 返回 **304 Not Modified**（复用本地缓存）
  - 已修改 → 返回 **200 + 新资源**

#### 5. **网络请求（兜底）**
- 所有缓存均未命中 → 发起完整 HTTP 请求获取新资源。

---

### 🔁 补充说明
| 缓存类型       | 是否发请求 | 控制方式                    | 典型场景                |
| -------------- | ---------- | --------------------------- | ----------------------- |
| Service Worker | 否（可选） | JavaScript                  | PWA、离线应用           |
| Memory Cache   | 否         | 浏览器自动                  | 同页面重复资源          |
| 强缓存         | 否         | `Cache-Control` / `Expires` | 静态资源（JS/CSS/图片） |
| 协商缓存       | 是（轻量） | `ETag` / `Last-Modified`    | 动态内容、HTML          |

---

### 💡 最佳实践
- **静态资源**：长 `max-age` + 文件名哈希（如 `app.a1b2c3.js`）→ 永久强缓存；
- **HTML 页面**：`Cache-Control: no-cache` → 每次走协商缓存，确保最新；
- **避免同时设置 `ETag` 和 `Last-Modified` 冗余**，优先用 `ETag`（更精准）；
- **调试时**：强制刷新（Ctrl+F5）会跳过所有缓存，普通刷新（F5）仍会使用强缓存。

> ✅ **一句话总结优先级**：  
> **Service Worker → Memory Cache → Disk Cache（强缓存）→ 协商缓存 → 网络请求**。

## 为什么会存在跨域及常见跨域的解决办法？

跨域问题源于浏览器的 **同源策略（Same-Origin Policy）**，是安全机制而非缺陷。以下是高度概括的解释与解决方案：

---

### 🔒 为什么存在跨域？
- **同源定义**：协议 + 域名 + 端口 **完全相同**。
- **目的**：防止恶意网站窃取用户数据（如读取银行页面的 Cookie、DOM）。
- **限制行为**（仅限前端 JavaScript）：
  - 无法读取非同源响应的 **Response Body / Headers**；
  - 无法发送某些自定义请求头或非简单方法（触发预检）；
  - 但 **请求仍会发出**（服务器能收到），只是浏览器拦截响应。

> ⚠️ 注意：跨域是**浏览器限制**，服务端之间调用（如 Node.js、curl）无此问题。

---

### ✅ 常见跨域解决方案（按适用场景）

#### 1. **CORS（跨域资源共享）** —— **最主流方案**
- **原理**：服务器在响应中添加允许跨域的头部：
  ```http
  Access-Control-Allow-Origin: https://your-site.com  // 或 *
  Access-Control-Allow-Credentials: true               // 允许带 Cookie
  Access-Control-Allow-Headers: Content-Type, Authorization
  ```
- **优点**：标准、灵活、支持所有 HTTP 方法；
- **注意**：
  - `Allow-Origin` 不能为 `*` 且同时设置 `Credentials: true`；
  - 预检请求（OPTIONS）需正确处理。

#### 2. **代理（Proxy）** —— **开发/部署常用**
- **开发时**：Webpack/Vite 的 `proxy` 配置（如 `/api → http://localhost:8080`）；
- **生产时**：Nginx 反向代理（将 `/api` 路径转发到后端，同源访问）；
- **本质**：绕过浏览器限制，由同源服务器代发请求。

#### 3. **JSONP** —— **仅限 GET，已淘汰**
- **原理**：利用 `<script>` 标签不受同源限制，回调函数接收数据；
- **缺点**：仅支持 GET、无错误处理、有 XSS 风险；
- **现状**：**不推荐使用**（CORS 已全面替代）。

#### 4. **PostMessage** —— **跨窗口/iframe 通信**
- 适用于父子页面、弹窗等场景：
  ```js
  // 父页面
  iframe.contentWindow.postMessage(data, 'https://target.com');
  // 子页面
  window.addEventListener('message', (e) => { /* 验证 origin 后处理 */ });
  ```

#### 5. **WebSocket** —— **天然支持跨域**
- WebSocket 协议本身无同源限制，但服务器可主动校验 `Origin` 头做防护。

#### 6. **Service Worker / Mock** —— **仅限开发调试**
- 拦截请求并返回模拟数据（非真实跨域解决）。

---

### 🚫 无效/错误方案
- **前端改 header**（如 `Origin`）→ 浏览器禁止；
- **隐藏 iframe / form 提交** → 无法读取响应；
- **修改浏览器安全设置** → 不可行（用户环境不可控）。

---

### 💡 总结
| 场景             | 推荐方案       |
| ---------------- | -------------- |
| 前后端分离开发   | DevServer 代理 |
| 生产环境 API     | CORS           |
| 跨域 iframe 通信 | postMessage    |
| 实时通信         | WebSocket      |

> ✅ **核心原则**：跨域必须由**服务端配合**（CORS 或代理），纯前端无法真正“解决”跨域。

## 浏览器的渲染机制是怎样的？

浏览器的渲染机制是将 HTML、CSS、JavaScript 转换为可视页面的过程，核心流程可高度概括为以下 **5 个关键阶段**（以 Chromium/Blink 引擎为例）：

---

### 1. **解析（Parsing） → 构建 DOM & CSSOM**
- **HTML 解析**：  
  流式解析 → 生成 **DOM 树**（Document Object Model），遇到 `<script>` 会阻塞（除非 `async`/`defer`）。
- **CSS 解析**：  
  加载并解析所有样式（内联、`<link>`、`@import`）→ 生成 **CSSOM 树**（CSS Object Model），**阻塞渲染但不阻塞 HTML 解析**。

> ⚠️ 关键点：DOM 和 CSSOM 是独立构建的，任一缺失都无法渲染。

---

### 2. **合成（Combining） → 构建 Render Tree**
- 合并 DOM + CSSOM → 生成 **Render Tree**（渲染树）；
- **仅包含可见节点**：`display: none`、`<head>`、注释等被剔除；
- 每个节点包含**计算后的样式**（Computed Style）。

---

### 3. **布局（Layout / Reflow）**
- 计算每个 Render Tree 节点的**几何信息**（位置、宽高）；
- 从根节点开始递归布局（“回流”）；
- **触发条件**：DOM 结构变化、窗口 resize、读取 offset/scroll/client 等布局属性。

> 💡 布局是**全局或局部**的，现代浏览器会优化为增量布局。

---

### 4. **绘制（Paint / Rasterization）**
- 将 Render Tree 转换为**屏幕像素**：
  - 分层（Layer）：如 `transform`、`opacity` 元素会提升为独立合成层；
  - 光栅化（Raster）：CPU/GPU 将图层绘制成位图；
- **重绘（Repaint）**：样式变化但不影响布局（如 color、background）。

---

### 5. **合成（Compositing）**
- 合成线程（Compositor Thread）将各图层按 **z-index、transform** 等顺序合并；
- 直接提交给 GPU 显示，**无需主线程参与**；
- 利用 **硬件加速** 实现高性能动画（如 `transform: translateX(100px)`）。

---

### 🔄 关键优化概念
| 术语                  | 含义                                                          |
| --------------------- | ------------------------------------------------------------- |
| **重排（Reflow）**    | 布局变化 → 触发 Layout → 开销大（避免频繁读写布局属性）       |
| **重绘（Repaint）**   | 样式变化但布局不变 → 触发 Paint → 开销中等                    |
| **合成（Composite）** | 仅图层变换 → 跳过 Layout/Paint → **开销最小（推荐动画方式）** |

---

### 💡 渲染性能最佳实践
- **避免强制同步布局**：不要在循环中读取 `offsetWidth` 后立即修改样式；
- **提升动画元素为合成层**：使用 `transform` / `opacity` 触发 GPU 加速；
- **减少样式层级嵌套**：简化 CSS 选择器，加速 CSSOM 构建；
- **关键资源预加载**：`<link rel="preload">` 提前加载首屏 CSS/JS。

---

### ✅ 一句话总结  
> **DOM + CSSOM → Render Tree → Layout → Paint → Composite，其中 Layout 和 Paint 在主线程，Composite 可由 GPU 异步完成。**  
> **高性能渲染的核心：减少重排重绘，最大化利用合成。**

## 什么是重绘和回流及怎么减少重绘和回流？

**重绘（Repaint）** 和 **回流（Reflow，也称重排）** 是浏览器渲染过程中的两个关键性能开销操作：

---

### 🔍 定义与区别

| 操作                | 触发条件                                                                                                           | 是否影响布局 | 性能开销                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------ | ------------------------------------------------- |
| **回流（Reflow）**  | DOM 结构变化、几何尺寸/位置改变（如 width、padding、font-size）、窗口 resize、读取 offset/scroll/client 等布局属性 | ✅ 是         | ⚠️ **高**（需重新计算整个或部分 Render Tree 布局） |
| **重绘（Repaint）** | 样式变化但**不改变布局**（如 color、background、visibility）                                                       | ❌ 否         | 🟡 中等（只需重新绘制像素）                        |

> 💡 **回流必定触发重绘，但重绘不一定触发回流。**

---

### 🛠 如何减少回流和重绘？

#### ✅ 1. **批量修改 DOM**
- 避免逐条修改样式，使用 **CSS class 切换** 或 **documentFragment**：
  ```js
  // ❌ 差：多次触发回流
  el.style.width = '100px';
  el.style.height = '100px';
  el.style.color = 'red';

  // ✅ 好：一次回流
  el.className = 'new-style'; // 在 CSS 中定义
  ```

#### ✅ 2. **离线操作 DOM**
- 将元素从文档流中移除 → 修改 → 重新插入：
  ```js
  el.style.display = 'none';   // 脱离文档流
  // 批量修改...
  el.style.display = 'block';  // 一次性回流
  ```
- 或使用 `DocumentFragment` 构建子树后再插入。

#### ✅ 3. **避免强制同步布局（Forced Synchronous Layout）**
- 不要在循环中 **先读取布局属性，再修改样式**：
  ```js
  // ❌ 危险：每次 offsetWidth 都触发回流
  for (let i = 0; i < items.length; i++) {
    items[i].style.height = container.offsetHeight + 'px';
  }

  // ✅ 安全：先读，后写
  const height = container.offsetHeight;
  for (let i = 0; i < items.length; i++) {
    items[i].style.height = height + 'px';
  }
  ```

#### ✅ 4. **使用 transform / opacity 实现动画**
- 这些属性由 **合成线程（Compositor Thread）** 处理，**不触发回流/重绘**：
  ```css
  .animate {
    transform: translateX(100px); /* 推荐 */
    /* 避免：left: 100px; */
  }
  ```

#### ✅ 5. **提升元素为独立合成层（谨慎使用）**
- 通过 `will-change: transform` 或 `transform: translateZ(0)` 提升图层；
- ⚠️ 过度使用会增加内存和合成开销。

#### ✅ 6. **避免频繁操作表格**
- 表格的回流成本极高（需多次计算），尽量用 `table-layout: fixed` 固定列宽。

---

### 💡 总结口诀
> **“读写分离、批量操作、离线修改、合成优先”**  
> **能用 `transform/opacity` 就不用改布局；能改 class 就不逐条设 style。**

通过以上策略，可显著减少主线程负担，提升页面流畅度（尤其在低端设备）。

## 浏览器的事件机制

浏览器的事件机制是前端交互的核心，其核心模型可高度概括为以下三点：

---

### 一、**事件流（Event Flow）：捕获 → 目标 → 冒泡**
根据 DOM 标准，事件传播分三个阶段：
1. **捕获阶段（Capture）**：从 `window` → `document` → ... → 目标父元素；
2. **目标阶段（Target）**：事件到达目标元素；
3. **冒泡阶段（Bubble）**：从目标元素 → 父元素 → ... → `document` → `window`。

> ⚠️ 大多数事件（如 `click`）默认只走**冒泡阶段**；只有显式设置 `{ capture: true }` 才监听捕获。

```js
// 冒泡（默认）
el.addEventListener('click', handler);

// 捕获
el.addEventListener('click', handler, { capture: true });
```

---

### 二、**事件委托（Event Delegation）**
- **原理**：利用事件冒泡，在**父元素**上统一处理子元素事件；
- **优势**：
  - 减少内存占用（避免为大量子元素绑定监听器）；
  - 动态新增元素自动生效；
- **实现**：
  ```js
  parent.addEventListener('click', (e) => {
    if (e.target.matches('.child')) {
      // 处理逻辑
    }
  });
  ```

---

### 三、**关键 API 与行为**
| 方法 / 属性                        | 作用                                           |
| ---------------------------------- | ---------------------------------------------- |
| `event.stopPropagation()`          | 阻止事件继续传播（捕获/冒泡）                  |
| `event.stopImmediatePropagation()` | 阻止同级其他监听器执行 + 停止传播              |
| `event.preventDefault()`           | 阻止默认行为（如 `<a>` 跳转、表单提交）        |
| `event.target`                     | 实际触发事件的元素（可能不是绑定监听器的元素） |
| `event.currentTarget`              | 绑定监听器的元素（等价于 `this`）              |

---

### 四、**特殊事件类型**
- **合成事件（Synthetic Events）**：React 等框架封装的跨浏览器兼容层；
- **被动事件（Passive Event）**：提升滚动性能（禁止 `preventDefault`）：
  ```js
  el.addEventListener('touchstart', handler, { passive: true });
  ```
- **自定义事件**：
  ```js
  const ev = new CustomEvent('my-event', { detail: data });
  el.dispatchEvent(ev);
  ```

---

### 💡 最佳实践
- **优先使用事件委托**（尤其列表、动态内容）；
- **避免在冒泡阶段滥用 `stopPropagation`**（可能破坏第三方组件逻辑）；
- **高频事件（scroll/mousemove）务必节流 + passive 优化**；
- **移除监听器防内存泄漏**（尤其在 SPA 组件销毁时）。

---

### ✅ 一句话总结  
> **浏览器事件沿“捕获→目标→冒泡”传播，默认只冒泡；通过委托、节流、被动监听等策略可构建高性能、可维护的交互系统。**

## 浏览器的事件循环和node的事件循环区别

浏览器和 Node.js 的事件循环（Event Loop）都基于 **“异步回调调度”** 模型，但因运行环境不同，在**阶段划分、任务优先级、API 实现**上有关键差异。以下是前端工程师需掌握的核心区别：

---

### ✅ 一、宏观架构对比

| 特性               | 浏览器 Event Loop                 | Node.js Event Loop（v11+）          |
| ------------------ | --------------------------------- | ----------------------------------- |
| **规范依据**       | HTML 标准                         | 基于 libuv（C++ 库）                |
| **主要任务类型**   | 渲染、用户交互、网络、定时器      | I/O、文件系统、网络、子进程、定时器 |
| **是否含渲染相关** | ✅ 包含 `requestAnimationFrame` 等 | ❌ 无                                |

---

### ✅ 二、核心阶段与执行顺序

#### 🔹 **浏览器 Event Loop（简化模型）**
1. 执行 **宏任务（MacroTask）** 队列中的一个任务（如 `script`、`setTimeout`、I/O）；
2. 执行 **所有微任务（MicroTask）**（如 `Promise.then`、`MutationObserver`）；
3. **渲染阶段**（可选）：  
   - 执行 `requestAnimationFrame` 回调；  
   - 布局、绘制（若需）；
4. 下一轮宏任务。

> 📌 **关键**：每轮宏任务后，**清空所有微任务**，再考虑渲染。

#### 🔹 **Node.js Event Loop（libuv 六阶段）**
```text
┌───────────────────────┐
│        timers         │ → 执行 setTimeout/setInterval 回调
├───────────────────────┤
│ pending callbacks     │ → 执行延迟的 I/O 回调（如 TCP 错误）
├───────────────────────┤
│     idle, prepare     │ → 内部使用
├───────────────────────┤
│      poll             │ → 获取新 I/O 事件，执行 I/O 回调（重点！）
├───────────────────────┤
│      check            │ → 执行 setImmediate() 回调
├───────────────────────┤
│    close callbacks    │ → 执行 close 事件（如 socket.on('close')）
└───────────────────────┘
```
- **每阶段结束后**，会执行当前阶段的 **微任务（Promise.then 等）**；
- **`process.nextTick()` 优先级最高**：在**任意阶段结束后立即执行**，甚至高于 Promise。

---

### ✅ 三、关键行为差异

| 场景                                      | 浏览器                                               | Node.js                                                            |
| ----------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| **`setTimeout(fn, 0)` vs `setImmediate`** | 只有 `setTimeout`（最小延迟 ≈4ms）                   | `setImmediate` 在 poll 阶段后执行，通常比 `setTimeout(0)` **更快** |
| **微任务来源**                            | `Promise.then`, `MutationObserver`, `queueMicrotask` | 同左 + `process.nextTick`（更高优先级）                            |
| **I/O 异步处理**                          | 主要靠 Web API（如 fetch）                           | 由 libuv 的 **poll 阶段** 统一调度                                 |
| **首屏 script 执行**                      | 作为第一个宏任务                                     | 顶层代码同步执行，不进事件循环                                     |

---

### ✅ 四、经典面试题示例

#### 代码：
```js
setTimeout(() => console.log('timeout'));
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
```

- **浏览器输出**：  
  `promise` → `timeout`（`setImmediate` 不存在）

- **Node.js 输出（非 I/O 上下文）**：  
  不确定！`setTimeout` 和 `setImmediate` 顺序取决于事件循环启动速度（通常 `timeout` 先）；  
  **但在 I/O 回调内（如 fs.readFile）**：  
  `promise` → `immediate` → `timeout`（因为 `setImmediate` 在 poll 后立即执行）

---

### 💡 总结口诀
> **浏览器：宏任务 → 清空微任务 → 渲染；**  
> **Node.js：六阶段循环，`nextTick` 最高，`setImmediate` 在 poll 后；**  
> **共性：微任务总在当前操作后立即执行，但 Node 多一层 `nextTick` 优先级。**

> ⚠️ 注意：Node.js v11+ 已对微任务调度与浏览器对齐（每阶段后清空微任务），但 `process.nextTick` 仍是特例。

## 浏览器的垃圾回收机制

浏览器的垃圾回收（Garbage Collection, GC）机制用于自动管理内存，核心目标是**释放不再使用的对象所占内存**。现代浏览器（如 Chrome 的 V8 引擎）主要采用以下策略：

---

### ✅ 一、核心原理：可达性分析（Reachability）
- **GC 根（Roots）**：全局对象（如 `window`）、当前执行栈中的变量、内置对象等；
- **存活对象**：从 GC 根出发**能直接或间接引用到的对象**；
- **垃圾对象**：无法从根访问的对象 → 被回收。

> 📌 不是“引用计数为 0”，而是“不可达”——可解决循环引用问题。

---

### ✅ 二、主流 GC 算法（以 V8 为例）

#### 1. **分代式垃圾回收（Generational GC）**
V8 将堆内存分为两代：
- **新生代（Young Generation）**  
  - 存放**新创建、短生命周期**对象；  
  - 使用 **Scavenge 算法（Cheney 复制算法）**：  
    - 内存分为 `From` 和 `To` 两个半区；  
    - 活跃对象从 `From` 复制到 `To`，清空 `From`；  
    - 存活多次后晋升到老生代。
  - **优点**：快速回收短命对象；  
  - **缺点**：内存利用率仅 50%。

- **老生代（Old Generation）**  
  - 存放**长期存活**对象；  
  - 使用 **标记-清除（Mark-Sweep） + 标记-整理（Mark-Compact）**：  
    - **标记**：遍历所有可达对象；  
    - **清除**：回收未标记对象；  
    - **整理**：移动存活对象消除内存碎片（耗时，按需触发）。

#### 2. **增量标记（Incremental Marking） & 并发/并行 GC**
- **问题**：老生代 GC 停顿时间长（“Stop-The-World”）；
- **优化**：
  - **增量标记**：将标记过程拆分为多步，穿插在 JS 执行中，减少单次停顿；
  - **并发/并行**：利用多核 CPU，在后台线程执行部分 GC 工作。

---

### ✅ 三、前端开发者需注意的内存问题

| 问题类型         | 原因                         | 解决方案                       |
| ---------------- | ---------------------------- | ------------------------------ |
| **意外全局变量** | 未声明变量 → 挂载到 `window` | 使用严格模式（`'use strict'`） |
| **闭包泄漏**     | 内部函数持有外部大对象引用   | 手动置 `null` 或重构作用域     |
| **DOM 泄漏**     | 移除 DOM 但保留 JS 引用      | 移除事件监听器 + 清空引用      |
| **定时器/回调**  | `setInterval` 未清理         | 组件销毁时调用 `clearInterval` |
| **缓存无上限**   | Map/Set 不断增长             | 设置 LRU 限制或定期清理        |

---

### ✅ 四、性能建议
- **避免频繁创建大对象**（触发 GC 频繁）；
- **慎用 `delete` 对象属性**（可能使对象进入“慢路径”）；
- **使用 `WeakMap` / `WeakSet`**：弱引用，不影响 GC；
- **监控内存**：Chrome DevTools 的 **Memory 面板** + **Performance 录制**。

---

### 💡 一句话总结  
> **浏览器 GC 基于“可达性”判断垃圾，V8 采用分代回收（Scavenge + Mark-Sweep/Compact），并通过增量、并发优化停顿；开发者应避免意外长引用，主动解绑资源。**

## 进程和线程的区别?

**进程（Process）和线程（Thread）** 是操作系统进行任务调度和资源管理的基本单位，核心区别如下：

---

### ✅ 一、本质定义
|          | 进程                                     | 线程                                   |
| -------- | ---------------------------------------- | -------------------------------------- |
| **定义** | 程序的一次执行实例，拥有**独立内存空间** | 进程内的一个**执行单元**，共享进程资源 |
| **粒度** | 粗（重量级）                             | 细（轻量级）                           |

---

### ✅ 二、关键区别

| 特性              | 进程                                      | 线程                                     |
| ----------------- | ----------------------------------------- | ---------------------------------------- |
| **内存空间**      | ✅ 完全隔离（独立堆、栈、数据段）          | ❌ 共享所属进程的堆、全局变量等           |
| **通信方式**      | IPC（管道、消息队列、共享内存等，开销大） | 直接读写共享内存（需同步，如锁、信号量） |
| **创建/切换开销** | 大（需分配独立资源）                      | 小（只需栈和寄存器上下文）               |
| **稳定性/安全性** | 高（一个崩溃不影响其他进程）              | 低（一个线程崩溃可能导致整个进程退出）   |
| **并发性**        | 进程间并发                                | 线程间并发（更高效利用多核）             |

> 📌 **一句话**：**进程是“资源拥有者”，线程是“CPU 调度者”**。

---

### ✅ 三、类比理解
- **进程 = 工厂**（有独立厂房、设备、原料库）  
- **线程 = 工人**（在同一个工厂内协作，共用设备和原料，但各有自己的工具箱（栈））

---

### ✅ 四、前端相关场景
- **浏览器多进程架构**（Chromium）：
  - 浏览器主进程、GPU 进程、网络进程、**每个标签页（Renderer 进程）** → 隔离崩溃；
- **Web Worker**：
  - 在**同进程内**开启新线程（JS 主线程 + Worker 线程），**共享 JS 引擎但不共享内存**（通过 `postMessage` 通信）；
  - ⚠️ 注意：Web Worker 是**线程**，但因安全限制**不能直接访问 DOM**。

---

### 💡 总结
> **进程隔离资源，线程共享资源；多进程保稳定，多线程提性能。**  
> 前端虽不直接操作 OS 级线程，但需理解浏览器多进程模型与 Web Worker 的线程语义。

## 浏览器渲染进程有哪些线程

现代浏览器（以 Chromium 为例）的**渲染进程（Renderer Process）** 是多线程架构，主要包含以下 **5 个核心线程**，各司其职以实现高性能、安全的页面渲染：

---

### ✅ 1. **主线程（Main Thread）** —— **JS 执行 & DOM 操作核心**
- 负责：
  - 解析 HTML/CSS → 构建 DOM/CSSOM；
  - 执行 JavaScript（包括事件回调、Promise、setTimeout 等）；
  - 触发 **Layout（回流）** 和 **Paint（重绘）**；
- ⚠️ **单线程**：所有 JS 和渲染任务在此排队执行，**长任务会阻塞页面响应**。

---

### ✅ 2. **合成线程（Compositor Thread）** —— **高性能动画关键**
- 负责：
  - 接收主线程生成的**图层（Layers）**；
  - 执行 **合成（Compositing）**：将图层按 `z-index`、`transform` 等合并；
  - 直接提交给 GPU 渲染，**无需主线程参与**；
- ✅ 优势：即使主线程卡死，`transform`/`opacity` 动画仍流畅（硬件加速）。

---

### ✅ 3. **光栅化线程（Raster Thread）** —— **位图生成**
- 负责：
  - 将合成线程指定的图层内容**转换为位图（光栅化）**；
  - 可运行在 **GPU 或 CPU** 上（取决于硬件和设置）；
- ⚠️ 若内容复杂（如大图、阴影），可能成为性能瓶颈。

---

### ✅ 4. **Worker 线程（Web Worker Threads）** —— **用户可控的后台线程**
- 由开发者通过 `new Worker()` 创建；
- 特点：
  - **与主线程并行执行**，不阻塞 UI；
  - **不能访问 DOM / window / document**；
  - 通过 `postMessage` 与主线程通信（结构化克隆）；
- 用途：密集计算（如图像处理、加密、数据解析）。

---

### ✅ 5. **IO 线程（内部使用，部分版本存在）**
- 处理磁盘缓存读写、网络数据接收等 I/O 操作；
- 避免阻塞主线程（实际网络请求通常由**独立的 Browser 进程**处理，通过 IPC 传给 Renderer）。

---

### 🔄 线程协作流程（简化）

![An image](../public/assets/tongyi-mermaid-2026-01-04-162932.png)

---

### 💡 前端性能关键点
- **避免主线程长任务** → 使用 `Web Worker` 或拆分任务（`requestIdleCallback`）；
- **动画优先用 `transform`/`opacity`** → 触发合成线程，跳过 Layout/Paint；
- **减少强制同步布局** → 防止主线程频繁计算几何属性。

---

### ✅ 总结
> 渲染进程 = **主线程（JS+DOM） + 合成线程（动画） + 光栅线程（绘图） + Worker 线程（计算）**  
> 理解线程分工，是优化 Web 性能、实现 60fps 流畅体验的基础。

## web安全攻击方式及防御方法

Web 安全攻击方式繁多，以下是**前端工程师必须掌握的 6 大常见攻击类型及其核心防御方法**，按危害性和发生频率排序：

---

### 1. **XSS（跨站脚本攻击）**
- **原理**：攻击者注入恶意脚本（如 `<script>`），在用户浏览器执行。
- **类型**：
  - **反射型**：恶意脚本来自 URL 参数（如搜索框）；
  - **存储型**：脚本存入数据库（如评论区）；
  - **DOM 型**：前端 JS 直接操作 `innerHTML`/`location.hash`。
- **防御**：
  - **输出编码**：对动态内容做 HTML 转义（如 `<` → `&lt;`）；
  - **CSP（Content Security Policy）**：限制脚本来源（`script-src 'self'`）；
  - **避免 innerHTML**：用 `textContent` 或安全框架（React/Vue 默认转义）；
  - **HttpOnly Cookie**：防止 JS 窃取 Cookie。

---

### 2. **CSRF（跨站请求伪造）**
- **原理**：诱导用户点击恶意链接，在已登录状态下**自动携带 Cookie** 向目标站发起请求（如转账）。
- **防御**：
  - **SameSite Cookie**：`Set-Cookie: SameSite=Strict`（现代浏览器默认 Lax）；
  - **Anti-CSRF Token**：表单/API 请求携带一次性 token（服务端校验）；
  - **验证 Origin/Referer 头**（辅助手段）。

---

### 3. **点击劫持（Clickjacking）**
- **原理**：用透明 `<iframe>` 覆盖按钮，诱使用户点击非预期操作。
- **防御**：
  - **X-Frame-Options**：`DENY` 或 `SAMEORIGIN`（阻止被嵌入 iframe）；
  - **CSP frame-ancestors**：`Content-Security-Policy: frame-ancestors 'self'`。

---

### 4. **中间人攻击（MITM） & 明文传输**
- **原理**：HTTP 明文传输，可被窃听/篡改（如公共 Wi-Fi）。
- **防御**：
  - **强制 HTTPS**：HSTS（`Strict-Transport-Security` 头）；
  - **证书校验**：避免忽略证书错误（尤其移动端）。

---

### 5. **接口安全（越权、参数篡改）**
- **原理**：前端隐藏按钮 ≠ 后端无权限，攻击者直接调用 API。
- **防御**：
  - **后端鉴权**：每个接口校验用户角色/数据归属（**前端不可信！**）；
  - **敏感操作二次验证**：如支付需短信/密码；
  - **参数校验**：后端严格校验 ID、金额等字段合法性。

---

### 6. **第三方资源风险**
- **原理**：引入 CDN 脚本/图片可能被投毒（如 `//unpkg.com/evil.js`）。
- **防御**：
  - **SRI（Subresource Integrity）**：
    ```html
    <script src="https://cdn.example.com/app.js"
            integrity="sha384-abc123..."></script>
    ```
  - **CSP 限制来源**：`script-src https://trusted.cdn.com`。

---

### 🔒 通用防御原则（前端视角）
| 原则               | 实践                                                  |
| ------------------ | ----------------------------------------------------- |
| **永远不信任前端** | 所有安全逻辑必须由后端实现                            |
| **最小权限原则**   | Cookie 加 `HttpOnly` + `Secure` + `SameSite`          |
| **输入输出过滤**   | 前端防 XSS（输出编码），后端防 SQL 注入（参数化查询） |
| **安全头加固**     | 配置 CSP、X-Frame-Options、HSTS 等                    |

---

### 💡 总结口诀  
> **XSS 防注入，CSRF 防伪造，  
> 点击劫持设 X-Frame，  
> 敏感操作后端验，  
> HTTPS + CSP 保平安。**

> ⚠️ 记住：**前端是攻击入口，后端是安全底线**。任何前端“隐藏”或“禁用”都不能替代服务端校验。

## 浏览器存储数据方式有哪些

浏览器提供了多种客户端数据存储方式，各有适用场景、容量限制和生命周期。以下是前端工程师必须掌握的 **6 种核心存储机制**及其对比：

---

### ✅ 1. **Cookie**
- **用途**：会话管理（如登录态）、个性化设置；
- **特点**：
  - 每次 HTTP 请求**自动携带**（增加带宽）；
  - 容量小（**≈4KB/条**）；
  - 可设过期时间（`Expires`/`Max-Age`）；
  - 支持 `HttpOnly`（防 XSS 窃取）、`Secure`（仅 HTTPS）、`SameSite`（防 CSRF）。
- **API**：`document.cookie = "key=value; path=/; max-age=3600"`

---

### ✅ 2. **localStorage**
- **用途**：持久化存储（关浏览器不丢失）；
- **特点**：
  - **同源策略**限制（协议+域名+端口相同）；
  - 容量大（**≈5–10MB**）；
  - **仅字符串**（需 `JSON.stringify` 存对象）；
  - **无过期机制**（手动清除）；
  - **同步 API**，阻塞主线程（不适合大量数据）。
- **API**：`localStorage.setItem('key', 'value')`

---

### ✅ 3. **sessionStorage**
- **用途**：临时会话数据（页面刷新保留，关闭标签页清除）；
- **特点**：
  - 同 `localStorage`，但**生命周期仅限当前会话**；
  - 不同 tab 间**不共享**（即使同源）。
- **API**：`sessionStorage.getItem('key')`

---

### ✅ 4. **IndexedDB**
- **用途**：存储**大量结构化数据**（如离线应用、PWA 缓存）；
- **特点**：
  - **异步 API**（不阻塞主线程）；
  - 容量极大（**≈50% 磁盘空间**，用户可授权）；
  - 支持**事务、索引、游标查询**；
  - 操作复杂（需封装或使用库如 `idb`）。
- **典型场景**：缓存用户文档、消息历史、离线地图数据。

---

### ✅ 5. **Web SQL（已废弃）**
- **状态**：**非标准，已被废弃**（仅 Safari/旧版 Chrome 支持）；
- **替代方案**：用 **IndexedDB**。

---

### ✅ 6. **Cache Storage（Service Worker 专属）**
- **用途**：缓存**网络请求**（HTML/CSS/JS/API 响应）；
- **特点**：
  - 与 Service Worker 配合实现离线访问；
  - 按 **Request/Response** 存储（非 key-value）；
  - 需 HTTPS（或 localhost）。
- **API**：
  ```js
  caches.open('my-cache').then(cache => cache.add('/api/data'));
  ```

---

### 🔍 对比速查表
| 存储方式           | 容量      | 生命周期           | 同步/异步 | 是否随请求发送 | 适用场景                 |
| ------------------ | --------- | ------------------ | --------- | -------------- | ------------------------ |
| **Cookie**         | ~4KB      | 可设过期           | 同步      | ✅ 是           | 登录态、跟踪             |
| **localStorage**   | 5–10MB    | 永久（手动清除）   | 同步      | ❌ 否           | 用户偏好、主题配置       |
| **sessionStorage** | 5–10MB    | 当前会话（关页清） | 同步      | ❌ 否           | 表单草稿、临时状态       |
| **IndexedDB**      | ≈50% 磁盘 | 永久               | **异步**  | ❌ 否           | 大量结构化数据、离线应用 |
| **Cache Storage**  | 动态      | 永久（需手动清理） | 异步      | ❌ 否           | 网络资源缓存（PWA）      |

---

### 💡 最佳实践
- **敏感数据**（如 token）→ 用 **HttpOnly Cookie**（防 XSS）；
- **简单配置** → `localStorage`；
- **离线优先应用** → **IndexedDB + Cache Storage**；
- **避免滥用 Cookie**（影响性能）；
- **跨标签通信** → `localStorage` + `storage` 事件 或 `BroadcastChannel`。

> ✅ **一句话总结**：  
> **小数据用 Storage，会话用 Cookie，大数据上 IndexedDB，离线靠 Cache API。**

## 如何实现浏览器内多个标签页之间的通信

在浏览器中实现多个标签页（同源）之间的通信，有以下 **5 种主流方案**，按推荐度排序：

---

### ✅ 1. **BroadcastChannel API（现代首选）**
- **原理**：创建一个广播通道，所有监听该通道的标签页可收发消息。
- **优点**：简单、高效、专为跨标签通信设计。
- **兼容性**：现代浏览器（Chrome 54+、Firefox 38+、Safari 15.4+）。
- **代码示例**：
  ```js
  // 所有标签页加入同一频道
  const channel = new BroadcastChannel('my-channel');

  // 发送消息
  channel.postMessage({ type: 'update', data: 'hello' });

  // 接收消息
  channel.addEventListener('message', (e) => {
    console.log('收到:', e.data);
  });
  ```
- **清理**：`channel.close()`。

---

### ✅ 2. **localStorage + storage 事件（兼容性最佳）**
- **原理**：一个标签页修改 `localStorage`，其他同源标签页会触发 `storage` 事件。
- **优点**：兼容所有现代浏览器（包括 IE8+）。
- **限制**：仅在**不同标签页**间触发（当前页修改不会触发自身事件）。
- **代码示例**：
  ```js
  // 发送方
  localStorage.setItem('msg', JSON.stringify({ time: Date.now(), data: 'hi' }));

  // 接收方（其他标签页）
  window.addEventListener('storage', (e) => {
    if (e.key === 'msg') {
      console.log('收到:', JSON.parse(e.newValue));
    }
  });
  ```

---

### ✅ 3. **SharedWorker（较少用）**
- **原理**：多个标签页共享同一个 Worker 线程，通过 `port` 通信。
- **优点**：支持复杂逻辑；可跨 iframe。
- **缺点**：API 复杂；iOS Safari 长期不支持（15.4+ 才支持）。
- **代码示例**：
  ```js
  // shared-worker.js
  const connections = [];
  onconnect = (e) => {
    const port = e.ports[0];
    connections.push(port);
    port.onmessage = (msg) => {
      connections.forEach(p => p !== port && p.postMessage(msg.data));
    };
  };

  // 页面中
  const worker = new SharedWorker('shared-worker.js');
  worker.port.postMessage('hello');
  worker.port.onmessage = (e) => console.log(e.data);
  ```

---

### ✅ 4. **Cookie / sessionStorage 轮询（不推荐）**
- **原理**：通过定时读取 `document.cookie` 或 `sessionStorage` 检测变化。
- **缺点**：性能差、延迟高、不可靠。
- **仅作备选**：当以上方案均不可用时（如极老浏览器）。

---

### ✅ 5. **Service Worker 中转（间接方案）**
- **原理**：标签页 → Service Worker → 其他标签页（需配合 `clients.claim()` 和 `BroadcastChannel`/`postMessage`）。
- **适用场景**：PWA 应用中已有 SW，可复用其作为消息中心。
- **注意**：SW 本身不能直接访问 DOM，需通过 `client.postMessage` 与页面通信。

---

### 🔒 安全注意事项
- **所有方案均受同源策略限制**（协议+域名+端口必须一致）；
- **敏感数据避免明文传输**（如 token），建议加密或仅传事件标识；
- **防消息伪造**：校验消息来源（如加签名）。

---

### 💡 推荐选择
| 场景                      | 推荐方案                        |
| ------------------------- | ------------------------------- |
| 现代浏览器（无需兼容 IE） | **BroadcastChannel**            |
| 需兼容旧浏览器            | **localStorage + storage 事件** |
| 已使用 Service Worker     | **SW 中转 + BroadcastChannel**  |

> ✅ **一句话总结**：  
> **优先用 `BroadcastChannel`，兼容性要求高则用 `localStorage` 监听 `storage` 事件。**

## tcp和udp的区别

TCP（传输控制协议）和 UDP（用户数据报协议）是传输层的两种核心协议，主要区别体现在**可靠性、连接方式、性能和适用场景**上。以下是清晰对比：

---

### ✅ 核心区别速览表

| 特性         | TCP                                    | UDP                                  |
| ------------ | -------------------------------------- | ------------------------------------ |
| **连接方式** | 面向连接（三次握手建立，四次挥手断开） | 无连接（直接发数据包）               |
| **可靠性**   | ✅ 可靠：确认应答 + 重传 + 排序 + 流控  | ❌ 不可靠：不保证到达、不重传、不排序 |
| **传输效率** | 较低（头部 20 字节 + 控制开销大）      | 较高（头部仅 8 字节 + 无控制逻辑）   |
| **实时性**   | 差（因重传、排队等机制）               | ✅ 好（适合音视频、游戏等低延迟场景） |
| **数据边界** | 无消息边界（字节流）                   | ✅ 有消息边界（每个包独立）           |
| **拥塞控制** | ✅ 有（慢启动、拥塞避免等）             | ❌ 无                                 |
| **适用场景** | Web（HTTP/HTTPS）、文件传输、邮件      | 视频会议、直播、DNS 查询、在线游戏   |

---

### 🔍 详细说明

#### 1. **连接 vs 无连接**
- **TCP**：通信前必须建立连接（三次握手），结束后释放连接（四次挥手）；
- **UDP**：直接发送数据包，无需握手，服务器也不知客户端是否存在。

#### 2. **可靠性机制**
- **TCP**：
  - **ACK 确认**：接收方必须回传确认；
  - **超时重传**：未收到 ACK 则重发；
  - **序列号**：保证数据按序到达；
  - **滑动窗口**：流量控制，防止接收方缓冲区溢出。
- **UDP**：发完即忘，丢包、乱序、重复均由应用层处理（或忽略）。

#### 3. **性能与开销**
- **TCP 头部**：20 字节（不含选项），含端口、序号、ACK、窗口等字段；
- **UDP 头部**：仅 8 字节（源端口、目的端口、长度、校验和）；
- **CPU/带宽**：TCP 因控制逻辑更耗资源；UDP 更轻量。

#### 4. **编程模型**
- **TCP**：`socket` 编程中使用 `SOCK_STREAM`，读写像操作文件流；
- **UDP**：使用 `SOCK_DGRAM`，每次 `sendto`/`recvfrom` 操作一个完整数据报。

---

### 💡 典型应用场景

| 协议    | 应用示例                                                                        |
| ------- | ------------------------------------------------------------------------------- |
| **TCP** | 网页浏览（HTTP/HTTPS）、SSH、FTP、数据库连接、API 调用                          |
| **UDP** | VoIP（如微信语音）、视频直播（RTMP/QUIC）、DNS 查询、NTP 时间同步、多人在线游戏 |

> 📌 **现代趋势**：  
> - HTTP/3 基于 **QUIC（UDP 上实现可靠传输）**，兼顾 TCP 的可靠性和 UDP 的低延迟；
> - 实时音视频通常在 UDP 上自定义“部分可靠”策略（如丢帧可接受，但延迟必须低）。

---

### ✅ 一句话总结  
> **TCP 是“打电话”——先拨通、确认听清、按顺序说话；  
> UDP 是“发短信”——发完就走，不管对方是否收到。**  
> **要可靠选 TCP，要速度选 UDP。**

## 简述tcp三次握手和四次挥手的过程

TCP 的 **三次握手（建立连接）** 和 **四次挥手（断开连接）** 是保证可靠通信的核心机制，过程如下：

---

### 🔗 一、三次握手（Three-Way Handshake）—— 建立连接
> **目的**：同步双方初始序列号（ISN），确保双向通信能力。

| 步骤 | 发送方 → 接收方 | 关键字段                             | 作用                                           |
| ---- | --------------- | ------------------------------------ | ---------------------------------------------- |
| 1    | 客户端 → 服务端 | `SYN=1`, `seq=x`                     | 客户端请求连接，发送初始序号 `x`               |
| 2    | 服务端 → 客户端 | `SYN=1`, `ACK=1`, `seq=y`, `ack=x+1` | 服务端确认客户端请求，并发送自己的初始序号 `y` |
| 3    | 客户端 → 服务端 | `ACK=1`, `seq=x+1`, `ack=y+1`        | 客户端确认服务端的序号，连接建立               |

✅ **结果**：双方进入 `ESTABLISHED` 状态，可传输数据。  
⚠️ **为什么不是两次？** 防止历史重复连接请求突然到达服务器造成资源浪费（“已失效的请求”问题）。

---

### 🚪 二、四次挥手（Four-Way Wavehand）—— 断开连接
> **原因**：TCP 是**全双工**协议，需分别关闭两个方向的连接。

| 步骤 | 发送方 → 接收方 | 关键字段                             | 状态变化                                                           |
| ---- | --------------- | ------------------------------------ | ------------------------------------------------------------------ |
| 1    | 主动方 → 被动方 | `FIN=1`, `seq=u`                     | 主动方进入 `FIN-WAIT-1`                                            |
| 2    | 被动方 → 主动方 | `ACK=1`, `seq=v`, `ack=u+1`          | 被动方进入 `CLOSE-WAIT`<br>主动方进入 `FIN-WAIT-2`                 |
| 3    | 被动方 → 主动方 | `FIN=1`, `ACK=1`, `seq=w`, `ack=u+1` | 被动方进入 `LAST-ACK`                                              |
| 4    | 主动方 → 被动方 | `ACK=1`, `seq=u+1`, `ack=w+1`        | 主动方进入 `TIME-WAIT`（等待 2MSL 后关闭）<br>被动方收到后立即关闭 |

✅ **关键点**：
- **主动关闭方**最后会进入 `TIME-WAIT` 状态（持续 **2 倍最大段生命周期 MSL**，通常 30~120 秒）；
- **目的**：  
  1. 确保最后一个 ACK 能到达对方；  
  2. 防止旧连接的重复数据包干扰新连接。

> 💡 **为什么挥手比握手多一次？**  
> 握手时服务端可将 `SYN` 和 `ACK` 合并发送（步骤2）；  
> 挥手时，被动方可能还有数据要发送，不能立即发 `FIN`，必须等应用层调用 `close()` 后才发送，因此 **ACK 和 FIN 需分两次**。

---

### ✅ 总结口诀
> **握手三次建连接，同步序号防失效；  
> 挥手四次断双工，TIME-WAIT 保可靠。**

## tcp/ip协议包含哪几层

TCP/IP 协议栈是一个**四层模型**（实际应用中最常用的说法），它简化了 OSI 七层模型，更贴近互联网的实际实现。从上到下依次为：

---

### ✅ TCP/IP 四层模型

| 层级  | 名称                            | 核心功能                               | 常见协议/技术                          |
| ----- | ------------------------------- | -------------------------------------- | -------------------------------------- |
| **4** | **应用层（Application Layer）** | 提供应用程序网络接口，处理业务逻辑     | HTTP、HTTPS、FTP、SMTP、DNS、WebSocket |
| **3** | **传输层（Transport Layer）**   | 端到端通信、可靠性、流量控制、多路复用 | **TCP**、**UDP**、SCTP                 |
| **2** | **网络层（Internet Layer）**    | 主机到主机的路由与寻址（逻辑地址）     | **IP**（IPv4/IPv6）、ICMP、ARP*、IGMP  |
| **1** | **网络接口层（Link Layer）**    | 物理传输、MAC 地址、帧封装（硬件相关） | Ethernet、Wi-Fi（802.11）、PPP、ARP*   |

> 📌 注：ARP（地址解析协议）在功能上属于网络层，但实际封装在数据链路层帧中传输。

---

### 🔍 各层详解

#### 1. **应用层**
- 用户直接交互的协议；
- 负责**数据格式、会话管理、身份验证**等；
- 例如：浏览器用 HTTP 请求网页，邮件客户端用 SMTP 发邮件。

#### 2. **传输层**
- 提供**进程到进程**的通信（通过端口号区分应用）；
- **TCP**：可靠、有序、面向连接；
- **UDP**：不可靠、低延迟、无连接。

#### 3. **网络层（IP 层）**
- 负责**跨网络的数据包路由**；
- 使用 **IP 地址**标识主机；
- **IP 协议不保证可靠**（丢包、乱序由上层如 TCP 处理）。

#### 4. **网络接口层（链路层）**
- 负责**同一物理网络内**的数据帧传输；
- 使用 **MAC 地址**标识设备；
- 包括驱动程序、网卡、交换机等硬件交互。

---

### 🔄 数据封装过程（发送端）
```
应用层数据 
→ [加 TCP/UDP 头] → 传输层段（Segment/Datagram）  
→ [加 IP 头]      → 网络层包（Packet）  
→ [加 MAC 头+尾]  → 链路层帧（Frame）  
→ 物理信号（比特流）
```

接收端则**逐层解封装**，从帧 → 包 → 段 → 应用数据。

---

### ⚠️ 与 OSI 七层模型对比
| TCP/IP 四层 | 对应 OSI 层级            |
| ----------- | ------------------------ |
| 应用层      | 应用层 + 表示层 + 会话层 |
| 传输层      | 传输层                   |
| 网络层      | 网络层                   |
| 网络接口层  | 数据链路层 + 物理层      |

> 💡 **前端工程师重点掌握**：  
> - **应用层**（HTTP/WebSocket）  
> - **传输层**（TCP vs UDP）  
> - **网络层**（IP、DNS 解析）  
> 链路层通常由操作系统/硬件处理，无需深入。

---

### ✅ 一句话总结  
> **TCP/IP 四层：应用传语义，传输管端口，网络定路由，链路走物理。**