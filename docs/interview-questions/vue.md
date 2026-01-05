# VUE 面试题

## vue 的生命周期有哪些及每个生命周期做了什么？

Vue 2 的生命周期（按执行顺序）：

1. **beforeCreate**：实例初始化后，数据观测和事件尚未设置。  
2. **created**：数据观测、计算属性、方法、事件回调已配置完成，但 DOM 未挂载。  
3. **beforeMount**：模板编译完成，虚拟 DOM 创建，但尚未挂载到页面。  
4. **mounted**：DOM 挂载完成，可访问真实 DOM，常用于操作 DOM 或发起请求。  
5. **beforeUpdate**：响应式数据变化，虚拟 DOM 重新渲染前调用。  
6. **updated**：DOM 更新完成，避免在此修改状态以防无限更新。  
7. **beforeDestroy**（Vue 2） / **beforeUnmount**（Vue 3）：实例销毁前，可清理定时器、取消订阅等。  
8. **destroyed**（Vue 2） / **unmounted**（Vue 3）：实例完全销毁，所有绑定和子组件均被移除。

> Vue 3 使用 Composition API（如 `onMounted`）替代选项式写法，但生命周期逻辑一致。

## vue 响应式原理是什么？vue3 的响应式有何不同

**Vue 2 响应式原理：**  
基于 `Object.defineProperty`，递归遍历 data 对象属性，将其转换为 getter/setter。依赖收集通过 Dep 和 Watcher 实现，getter 收集依赖，setter 触发更新。

**Vue 3 响应式改进：**  
改用 `Proxy` + `Reflect`，支持动态增删属性、数组索引监听和深层嵌套对象的懒代理（通过 `reactive`）。同时引入 `effect` 和 `track/trigger` 机制，逻辑更清晰、性能更好，并支持 `ref` 包装基本类型。

## vue3 和 vue2 的区别

Vue 3 相比 Vue 2 的主要区别：

1. **响应式系统**：  
   - Vue 2：`Object.defineProperty`（不支持动态属性、数组索引监听受限）  
   - Vue 3：`Proxy`（全面拦截，支持动态增删、嵌套懒代理）

2. **Composition API**：  
   - Vue 3 引入 `setup()`、`ref`、`reactive` 等，逻辑复用更灵活（替代 Mixins）

3. **性能优化**：  
   - 更小的 bundle（Tree-shaking 支持）  
   - 虚拟 DOM 重写，patch 更快  
   - 静态节点提升、事件侦听器缓存等编译优化

4. **TypeScript 支持**：  
   - Vue 3 源码用 TS 重写，类型推导更完善

5. **Fragment / Teleport / Suspense**：  
   - 新增内置组件，提升开发能力

6. **生命周期钩子变化**：  
   - `beforeDestroy` → `onBeforeUnmount`，`destroyed` → `onUnmounted`（Composition API 中）

7. **全局 API 变更**：  
   - `Vue.component` → `app.component()`（应用实例化方式改变）

8. **IE11 不再支持**：  
   - Vue 3 仅支持现代浏览器（ES2015+）

## 谈一谈对 MVVM 的理解？

MVVM（Model-View-ViewModel）是一种前端架构模式，核心目标是**分离视图（View）与业务逻辑（Model）**，通过 ViewModel 实现自动同步：

- **Model**：数据层，负责业务逻辑和数据处理（如 API、状态）  
- **View**：UI 层，展示数据，响应用户交互  
- **ViewModel**：连接 View 与 Model，通过**双向数据绑定**监听双方变化并同步

**关键特点**：  
- View 与 Model 无直接引用，解耦  
- 数据驱动视图，开发者聚焦数据流而非 DOM 操作  
- Vue、Angular 等框架是 MVVM 的典型实现（Vue 虽不严格双向绑定，但理念一致）

## 在 Vue2.x 中如何检测数组的变化？

在 Vue 2.x 中，由于 `Object.defineProperty` 的限制，**无法直接监听数组索引或长度的变化**。Vue 通过 **重写数组原型上的 7 个变异方法** 来实现响应式更新：

这 7 个方法是：  
`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`

**原理**：  
- Vue 在初始化时，将这些方法替换为自己的版本  
- 调用时会触发依赖更新（通知 watcher 重新渲染）  
- 同时对新增的元素进行响应式处理（如 `push` 进的对象）

**局限**：  
- 直接通过索引赋值（如 `arr[0] = val`）或修改 `length` 不会触发更新  
- 需使用 `Vue.set(arr, index, val)` 或 `arr.splice(index, 1, val)` 替代

> Vue 3 使用 `Proxy` 彻底解决了这个问题。

## v-model 双向绑定的原理是什么？

`v-model` 是 Vue 提供的语法糖，用于在表单元素或组件上实现**双向数据绑定**。

### 原理（以 Vue 2 为例）：
- **在原生表单元素上**（如 `<input>`、`<textarea>`、`<select>`）：  
  `v-model="value"` 等价于：
  ```vue
  :value="value" @input="value = $event.target.value"
  ```
  - `:value`：将 data 中的数据绑定到元素的 value 属性（**数据 → 视图**）  
  - `@input`：监听输入事件，更新 data（**视图 → 数据**）

- **在自定义组件上**：  
  默认展开为：
  ```vue
  :value="value" @input="value = $event"
  ```
  组件需通过 `props` 接收 `value`，并通过 `$emit('input', newValue)` 触发更新。

### Vue 3 的变化：
- 支持自定义 `modelValue` 和 `update:modelValue` 事件（更灵活）  
- 可通过 `v-model:foo` 实现多 v-model

> 本质：**语法糖 + 单向数据流 + 事件通信**，并非真正的“双向绑定”，而是**数据与视图的同步机制**。

## vue2.x 和 vue3.x 渲染器的 diff 算法分别说一下？

Vue 2.x 和 Vue 3.x 的 diff 算法都基于 **双端比较（双指针）策略**，但 Vue 3 在细节和性能上做了显著优化。

---

### **Vue 2.x Diff 算法（基于 Snabbdom 改进）**
- **核心思想**：同层比较，递归 patch。
- **节点比较策略**：
  - 先比对新旧节点是否为相同类型（`sameVnode`：key + tag）。
  - 若不同，直接替换整个节点。
  - 若相同，递归 patch 子节点。
- **子节点更新**（列表 diff）：
  - 使用 **双端指针（头头、尾尾、头尾、尾头）** 四种情况尝试匹配。
  - 若都未命中，则用 **key 建立旧节点 map**，遍历新节点查找对应旧节点。
  - 无 key 时退化为就地复用（易出错）。
- **缺点**：
  - 无法预判移动操作，可能产生多余 DOM 操作。
  - 静态节点未被充分优化。

---

### **Vue 3.x Diff 算法（重写，更高效）**
- **核心改进**：编译时 + 运行时协同优化。
- **关键优化点**：
  1. **静态提升（Static Hoisting）**：  
     静态节点在编译时提取，diff 时跳过。
  2. **PatchFlags**：  
     编译时标记动态节点类型（如 TEXT、PROPS、CHILDREN），运行时只 diff 需要的部分。
  3. **Block Tree**：  
     只追踪动态节点，形成“块”，大幅减少无用遍历。
  4. **子节点 diff 更智能**：
     - 引入 **最长递增子序列（LIS）算法**，最小化 DOM 移动。
     - 减少不必要的移动和插入操作，提升列表更新性能。

---

### 总结
| 维度     | Vue 2.x            | Vue 3.x                           |
| -------- | ------------------ | --------------------------------- |
| 核心策略 | 双端指针 + key map | 双端指针 + LIS + 编译时信息辅助   |
| 静态节点 | 每次都参与 diff    | 编译时跳过（静态提升）            |
| 动态检测 | 运行时全量判断     | 编译时标记（PatchFlags）          |
| 列表更新 | 可能多余移动       | 最小移动（LIS 优化）              |
| 性能     | 良好               | 显著提升（尤其大型列表/复杂模板） |

> Vue 3 的 diff 是 **编译时与运行时协同优化** 的典范，不仅更快，还更节省内存。

## vue 组件通信方式有哪些及原理

Vue 组件通信方式及原理（简洁概括）：

---

### 1. **Props / $emit**（父子通信）
- **原理**：单向数据流 + 自定义事件  
  - 父 → 子：通过 `props` 传递数据  
  - 子 → 父：子组件 `$emit('event', data)`，父组件监听

### 2. **$parent / $children / $refs**（直接访问实例）
- **原理**：通过组件实例引用直接读写  
  - 不推荐，破坏组件封装性，耦合高

### 3. **EventBus（$on / $emit）**（任意组件，Vue 2）
- **原理**：创建空 Vue 实例作为中央事件总线  
  - `bus.$on('event', cb)` / `bus.$emit('event', data)`  
  - **Vue 3 已移除 `$on`/`$off`/`$once`，不支持**

### 4. **Vuex / Pinia**（全局状态管理）
- **原理**：集中式 store，响应式状态 + 严格单向数据流  
  - 所有组件通过 `mapState`、`store.xxx` 或 `useStore()` 访问/修改状态

### 5. **provide / inject**（跨层级祖先-后代通信）
- **原理**：祖先组件 `provide` 数据，后代组件 `inject` 注入  
  - 响应式需配合 `ref` 或 `reactive`（Vue 3 中自动保持响应性）

### 6. **v-model / .sync（语法糖）**（父子双向绑定）
- **原理**：`v-model` 是 `:value + @input` 的语法糖（Vue 2）；Vue 3 支持多 v-model  
  - `.sync` 是 `:prop + @update:prop` 的语法糖（Vue 2，Vue 3 推荐用 v-model 替代）

### 7. **$attrs / $listeners（透传属性/事件）**
- **原理**：  
  - `$attrs`：父组件传入但未被 props 声明的 attribute  
  - `$listeners`（Vue 2）：未被声明的事件监听器（Vue 3 合并到 `$attrs`）

---

✅ **最佳实践**：  
- 简单场景：`props` / `$emit`  
- 跨多层：`provide/inject`  
- 全局共享：`Pinia`（推荐）或 `Vuex`  
- 避免滥用 `$parent`、EventBus（尤指 Vue 3）

## Vue 的路由实现, hash 路由和 history 路由实现原理说一下

Vue Router 支持两种路由模式：**hash 模式** 和 **history 模式**，核心区别在于 URL 形式和底层实现机制。

---

### 1. **Hash 路由**
- **URL 形式**：`http://example.com/#/home`
- **原理**：
  - 利用 `window.location.hash`（# 及其后内容）
  - 监听 `hashchange` 事件，感知 URL 变化
  - 页面不刷新（# 后内容不属于请求路径）
- **优点**：兼容性好（IE8+），无需服务端配置
- **缺点**：URL 不美观，SEO 略差

---

### 2. **History 路由**
- **URL 形式**：`http://example.com/home`
- **原理**：
  - 基于 HTML5 History API：`pushState()`、`replaceState()` 修改 URL（无刷新）
  - 监听 `popstate` 事件响应浏览器前进/后退
  - **注意**：`pushState/replaceState` 不会触发 `popstate`，需手动触发路由更新
- **优点**：URL 简洁，更符合 Web 标准
- **缺点**：需服务端配合（所有路径 fallback 到 index.html），否则刷新 404

---

### Vue Router 内部处理
- 初始化时根据 mode 选择监听策略
- 维护一个路由映射表（path → component）
- URL 变化时匹配路由，动态渲染对应组件

> ✅ **选型建议**：  
> - 静态部署 / 无服务端控制 → 用 **hash**  
> - 有服务端支持 / 追求体验 → 用 **history**

## 说一下 v-if 与 v-show 的区别

`v-if` 与 `v-show` 都用于条件渲染，但机制和适用场景不同：

---

### **1. 渲染机制**
- **`v-if`**：  
  - **真正地销毁/重建** DOM 节点  
  - 条件为 false 时，元素**不存在于 DOM 中**
- **`v-show`**：  
  - 始终渲染 DOM，通过 **CSS `display: none`** 控制显隐  
  - 元素始终存在于 DOM 中

---

### **2. 编译过程**
- `v-if`：切换时触发组件的**生命周期钩子**（如 `mounted`/`destroyed`）  
- `v-show`：不触发生命周期，仅切换样式

---

### **3. 性能特点**
- **`v-if`**：  
  - 切换开销大（重复创建/销毁）  
  - 初始渲染开销小（条件假时不渲染）
- **`v-show`**：  
  - 初始渲染开销大（始终渲染）  
  - 切换开销小（仅改样式）

---

### **4. 使用建议**
- **频繁切换** → 用 `v-show`  
- **运行时条件很少改变** → 用 `v-if`  
- **需要初始不渲染（节省资源）** → 用 `v-if`

> ⚠️ `v-if` 可与 `v-else` / `v-else-if` 连用，`v-show` 不支持。

## keep-alive 的常用属性有哪些及实现原理

`<keep-alive>` 是 Vue 的内置组件，用于**缓存动态组件**，避免重复创建/销毁。

---

### **常用属性**
1. **`include`**：字符串或正则，指定**哪些组件**需要缓存（组件 name 匹配）  
2. **`exclude`**：字符串或正则，指定**哪些组件不缓存**（优先级高于 `include`）  
3. **`max`**：数字，最多缓存多少个组件实例（超出则按 LRU 淘汰）

> 组件必须有 **`name`** 才能被匹配（匿名组件无效）。

---

### **实现原理（Vue 2 / 3 核心一致）**
1. **包裹动态组件**时，`<keep-alive>` 不会渲染真实 DOM，而是：
   - **首次激活**：创建组件实例并缓存到内部对象（`cache`）
   - **切换出去**：调用 `deactivated` 钩子，**保留实例但移出 DOM**
   - **再次激活**：从 `cache` 取出实例，调用 `activated` 钩子，重新插入 DOM

2. **缓存管理**：
   - 通过 `include`/`exclude` 控制是否缓存
   - `max` 限制缓存数量，超限时移除**最久未访问**的实例（LRU 策略）

3. **关键钩子**：
   - `activated`：组件被激活时调用  
   - `deactivated`：组件被停用时调用

---

### **适用场景**
- Tab 切换、列表详情页返回保持滚动位置等需**保留状态**的场景  
- 避免高频切换组件的重复初始化开销

> ✅ 注意：`<keep-alive>` 只作用于**直接子节点**（如 `<component :is="...">` 或动态路由组件）。

## nextTick 的作用是什么？他的实现原理是什么？

### **作用**
`Vue.nextTick`（或 `this.$nextTick`）用于**在 DOM 更新完成后执行回调**。  
因为 Vue 的数据更新是**异步批量处理**的，修改数据后 DOM 不会立即更新，`nextTick` 可确保拿到最新的 DOM 状态。

典型场景：
- 修改数据后立即操作更新后的 DOM（如获取元素高度、聚焦 input）
- 在 `created` 中访问 `$el`（此时 DOM 尚未挂载）

---

### **实现原理**
利用 **微任务（Microtask）优先于宏任务（Macrotask）** 的特性，按以下优先级选择异步机制：

1. **Promise.then**（微任务，首选）  
2. **MutationObserver**（微任务，兼容旧版 Safari）  
3. **setImmediate**（宏任务，IE 特有）  
4. **setTimeout(fn, 0)**（兜底）

> Vue 将所有 watcher 更新放入一个队列，在本轮事件循环末尾统一 flush（触发 DOM 更新），`nextTick` 的回调被安排在**flush 之后执行**，从而保证 DOM 已更新。

---

### **Vue 3 改进**
- 使用 `Promise` + `queueMicrotask`（更标准的微任务 API）  
- 更简洁、性能更好

---

✅ **一句话总结**：  
`nextTick` 是 Vue 异步更新机制的配套工具，通过微任务确保回调在 DOM 更新后执行。

## 说一下 Vue SSR 的实现原理

Vue SSR（Server-Side Rendering，服务端渲染）的核心目标是：**在服务端生成 HTML 字符串，发送给客户端，实现首屏快速渲染和 SEO 友好**。

---

### **实现原理**

#### 1. **服务端渲染流程**
- 在 Node.js 环境中，使用 `vue-server-renderer` 的 `renderToString()` 方法：
  ```js
  const app = createApp(); // 创建 Vue 应用实例
  const html = await renderToString(app);
  ```
- 渲染器遍历组件树，同步执行组件的 `setup()` / `data()`、`computed` 等逻辑，**生成完整的 HTML 字符串**。
- 服务端将此 HTML 注入模板，返回给浏览器。

#### 2. **客户端激活（Hydration）**
- 浏览器加载 JS 后，Vue 在**已有 DOM 上进行“激活”**（hydrate），而非重新挂载。
- Vue 对比服务端生成的 DOM 结构与客户端虚拟 DOM，**复用节点并绑定事件监听器**，使页面可交互。
- 要求：**服务端与客户端渲染结果必须一致**，否则会丢弃服务端 HTML 并重新渲染（警告）。

#### 3. **数据预取（Data Prefetching）**
- 组件可通过 `serverPrefetch()`（Vue 3）或自定义逻辑在服务端提前获取数据。
- 获取的数据需注入到 HTML 中（如 `window.__INITIAL_STATE__`），客户端直接复用，避免重复请求。

#### 4. **路由与状态管理同构**
- 路由（Vue Router）和状态（Pinia/Vuex）需在服务端和客户端**共享同一份逻辑**，确保一致性。

---

### **关键依赖**
- `vue-server-renderer`（Vue 2）或 `@vue/server-renderer`（Vue 3）
- Node.js 服务（如 Express、Koa）动态渲染页面

---

### **优点 vs 缺点**
| 优点                         | 缺点                                                 |
| ---------------------------- | ---------------------------------------------------- |
| 首屏加载快（无需等 JS 执行） | 服务端压力增大                                       |
| SEO 友好                     | 构建部署更复杂                                       |
| 更好的用户体验               | 仅支持可在 Node 环境运行的代码（无 window/document） |

---

✅ **适用场景**：内容型网站（如新闻、电商详情页）、对 SEO 或首屏性能要求高的应用。

## Vue 组件的 data 为什么必须是函数

Vue 组件的 `data` 必须是**函数**，是为了**保证每个组件实例拥有独立的数据副本**，避免多个实例间数据共享和相互污染。

---

### **原理**
- 如果 `data` 是对象（引用类型），所有实例会**共享同一个对象引用**。
- 当一个实例修改 `data` 中的属性，其他实例也会同步变化，导致状态混乱。

```js
// ❌ 错误：多个组件共用同一个 data 对象
data: {
  count: 0
}

// ✅ 正确：每次返回新对象，实例隔离
data() {
  return { count: 0 }
}
```

---

### **底层机制**
- Vue 在初始化组件时，会调用 `data()` 函数，将其返回的对象通过 `reactive`（Vue 3）或 `Observer`（Vue 2）转为响应式。
- 每个实例调用一次 `data()`，获得**独立的响应式对象**。

---

### **例外**
- **根实例（new Vue）** 的 `data` 可以是对象，因为根实例只有一个，不存在复用问题。

---

✅ **一句话总结**：  
函数确保组件多实例下的数据隔离，是 Vue 组件化设计的基础保障。

## 说一下 Vue 的 computed 的实现原理

Vue 的 `computed`（计算属性）基于**响应式依赖收集 + 缓存机制**实现，核心目标是：**高效、自动地派生状态，并避免重复计算**。

---

### **实现原理（以 Vue 3 为例）**

#### 1. **创建 ComputedRef**
- 调用 `computed(fn)` 时，内部创建一个 `ComputedRefImpl` 对象。
- 该对象包含：
  - `getter`：用户传入的计算函数
  - `effect`：一个特殊的 `ReactiveEffect`（带调度器）
  - `_value`：缓存计算结果
  - `_dirty`：标记是否需要重新计算

#### 2. **依赖收集**
- 首次读取 `computed` 值时，执行 `getter`。
- 在 `getter` 中访问的响应式数据（如 `reactive` 或 `ref`）会触发它们的 `get` 拦截。
- 此时，`computed` 的 `effect` 会被这些响应式数据的 `dep` 收集为依赖（即：数据 → computed）。

#### 3. **缓存与惰性求值**
- 计算结果缓存在 `_value`，`_dirty = false`。
- **只要依赖未变化，再次访问直接返回缓存值**，不执行 `getter`。

#### 4. **依赖变更触发更新**
- 当依赖的响应式数据被修改，会通知其所有依赖（包括 `computed` 的 `effect`）。
- `computed` 的 `effect.scheduler` 被调用，设置 `_dirty = true`，**但不会立即重新计算**。
- 下次读取 `computed` 时，发现 `_dirty === true`，才重新执行 `getter` 并更新缓存。

---

### **与 watch / method 的区别**
|          | 缓存 | 自动依赖追踪 | 手动调用    |
| -------- | ---- | ------------ | ----------- |
| computed | ✅    | ✅            | ❌（自动）   |
| method   | ❌    | ❌            | ✅           |
| watch    | ❌    | ✅            | ❌（副作用） |

---

✅ **一句话总结**：  
`computed` 通过响应式系统自动追踪依赖，结合惰性求值和缓存，实现高效、声明式的派生状态。

## 说一下 Vue complier 的实现原理是什么样的？

Vue 的 **Compiler（编译器）** 负责将模板（template）编译成 **可执行的渲染函数（render function）**。其核心流程分为三步：**解析（Parse）→ 优化（Optimize）→ 代码生成（Generate）**。

---

### 1. **Parse（解析）**
- **输入**：字符串形式的模板（如 `<div>{{ msg }}</div>`）
- **输出**：**抽象语法树（AST）**
- **过程**：
  - 使用正则和状态机逐字符解析 HTML
  - 构建包含标签、属性、指令、插值等信息的 AST 节点树
  - 同时处理 `v-if`、`v-for`、`@click` 等 Vue 指令，标记到 AST 节点上

---

### 2. **Optimize（优化）— Vue 2 特有，Vue 3 更深入**
- **目的**：提升运行时 diff 性能
- **关键操作**：
  - **静态节点标记**：标记永远不会变的节点（如纯文本、无绑定的元素）
  - **静态根节点提升**：将静态子树提取到 render 函数外，避免重复创建 VNode
- **Vue 3 增强**：
  - 引入 **PatchFlags**：在 AST 阶段就标记动态部分类型（TEXT、PROPS、CHILDREN 等）
  - 构建 **Block Tree**：只追踪动态节点，大幅减少 diff 范围

---

### 3. **Generate（代码生成）**
- **输入**：优化后的 AST
- **输出**：**render 函数的字符串代码**（如 `with(this){return _c('div',[_v(_s(msg))])}`）
- **过程**：
  - 递归遍历 AST，生成对应 VNode 创建函数的调用代码（如 `_c`、`_v`、`_s`）
  - 处理指令转换为 JavaScript 逻辑（如 `v-if` → 三元表达式，`v-for` → map 循环）
  - 最终通过 `new Function(code)` 转为可执行函数

---

### Vue 2 vs Vue 3 编译器差异
| 特性     | Vue 2                | Vue 3                                 |
| -------- | -------------------- | ------------------------------------- |
| 静态提升 | 支持                 | 更精细（配合 Block Tree）             |
| 动态检测 | 运行时全量判断       | **编译时标记 PatchFlags**             |
| 编译目标 | render 函数          | render 函数 + Block + PatchFlags      |
| 编译位置 | 可运行时编译或预编译 | 推荐构建时预编译（运行时仅保留 core） |

---

✅ **一句话总结**：  
Vue Compiler 将模板转为高效 render 函数，通过 **AST + 静态分析 + 编译时优化**，实现运行时最小化开销。Vue 3 更进一步，让编译器与运行时深度协同，达成极致性能。

## Vue 与 React 的区别是什么？

Vue 与 React 的核心区别可概括为以下几点：

---

### 1. **设计理念**
- **Vue**：渐进式框架，提供**完整的解决方案**（模板、响应式、路由、状态管理等），约定优于配置。
- **React**：UI 库（非框架），强调**灵活性与组合**，生态由社区驱动（如路由用 React Router，状态用 Redux/Zustand）。

---

### 2. **数据绑定**
- **Vue**：**响应式系统自动追踪依赖**，数据变更自动更新视图（`ref`/`reactive` + `effect`）。
- **React**：**状态不可变 + 手动触发更新**（`useState`/`useReducer` + `setState`），依赖 **re-render + diff** 判断是否更新 DOM。

---

### 3. **模板 vs JSX**
- **Vue**：默认使用**基于 HTML 的模板语法**，更贴近 Web 标准，学习成本低。
- **React**：使用 **JSX**（JavaScript + XML），逻辑与视图高度融合，表达力强但需熟悉 JS。

---

### 4. **组件通信**
- **Vue**：父子通信（`props`/`$emit`）、跨层级（`provide/inject`）、全局（Pinia）。
- **React**：自上而下 `props`、Context API、状态提升，或借助第三方状态库。

---

### 5. **更新机制**
- **Vue**：细粒度响应式，**精准触发组件更新**（仅依赖变更的组件 re-render）。
- **React**：父组件状态变更 → **默认子组件全量 re-render**（需 `memo`/`useCallback` 优化）。

---

### 6. **生态系统 & 工具链**
- **Vue**：官方维护核心工具（Vue CLI、Vite、Vue Router、Pinia），一致性高。
- **React**：社区驱动，选择多但碎片化（Create React App、Vite、Next.js 等）。

---

### 7. **TypeScript 支持**
- **Vue 3**：源码用 TS 重写，类型推导优秀。
- **React**：TS 支持良好，但 JSX 类型有时较复杂。

---

✅ **总结**：
- **选 Vue**：追求开发效率、快速上手、完整方案、模板友好。
- **选 React**：需要高度灵活、函数式思维、强大社区、构建复杂交互应用。

> 两者都在互相借鉴（如 Vue 3 Composition API 受 React Hooks 启发），核心差异在于**响应式 vs 声明式渲染**的哲学。

## 说一下 watch 与 computed 的区别是什么？以及他们的使用场景分别是什么？

`watch` 与 `computed` 都用于响应数据变化，但**目的、机制和使用场景不同**：

---

### **核心区别**

| 特性         | `computed`                     | `watch`                                   |
| ------------ | ------------------------------ | ----------------------------------------- |
| **用途**     | **派生状态**（计算得到新值）   | **执行副作用**（如请求、日志、操作 DOM）  |
| **返回值**   | ✅ 有返回值，可直接在模板中使用 | ❌ 无返回值，用于执行逻辑                  |
| **缓存**     | ✅ 依赖不变时缓存结果，惰性求值 | ❌ 每次依赖变化都执行回调                  |
| **异步支持** | ❌ 不支持（应是纯函数）         | ✅ 支持（可在回调中写 async/await）        |
| **监听方式** | 自动追踪依赖                   | 显式指定监听源（ref / reactive / getter） |

---

### **使用场景**

#### ✅ `computed` 适用：
- 模板中需要**基于其他数据动态计算**的值  
  ```js
  fullName: computed(() => firstName.value + ' ' + lastName.value)
  ```
- 多个地方复用同一逻辑，且**无副作用**

> **原则**：只要能用 `computed`，就不用 `watch`。

#### ✅ `watch` 适用：
- 数据变化时**触发异步操作**（如 API 请求）  
- 执行**复杂逻辑或副作用**（如打点、修改非响应式变量）  
- 监听**特定路径**或**深度监听对象**  
- 需要**访问新旧值**进行对比

```js
watch(searchText, async (newVal) => {
  if (newVal) fetchData(newVal);
});
```

---

### **一句话总结**  
- **`computed` 是“算出来的值”** —— 用于声明式派生数据。  
- **`watch` 是“做事情”** —— 用于响应式地执行副作用。

## 说一下你知道的 vue 修饰符都有哪些？

Vue 的修饰符（Modifiers）用于**增强指令或事件的行为**，主要分为以下几类：

---

### 一、**事件修饰符**（用于 `v-on` / `@`）
作用：处理 DOM 事件细节，避免在方法中写原生 API。

| 修饰符     | 作用                                              |
| ---------- | ------------------------------------------------- |
| `.stop`    | 阻止事件冒泡（`event.stopPropagation()`）         |
| `.prevent` | 阻止默认行为（`event.preventDefault()`）          |
| `.capture` | 使用事件捕获模式（从外到内）                      |
| `.self`    | 只当事件在元素自身触发时才处理                    |
| `.once`    | 事件只触发一次                                    |
| `.passive` | 提升滚动性能（告诉浏览器不调用 `preventDefault`） |

> 示例：`@click.stop.prevent="handler"`

---

### 二、**按键修饰符**（用于键盘事件）
作用：监听特定按键。

| 修饰符                               | 对应键             |
| ------------------------------------ | ------------------ |
| `.enter`                             | Enter              |
| `.tab`                               | Tab                |
| `.delete`                            | Delete / Backspace |
| `.esc`                               | Esc                |
| `.space`                             | Space              |
| `.up` / `.down` / `.left` / `.right` | 方向键             |

> 也可自定义：`Vue.config.keyCodes.f1 = 112`

---

### 三、**系统修饰键**（组合键）
用于监听 `Ctrl`、`Alt`、`Shift`、`Meta`（Cmd/Win）：

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

> 示例：`@keyup.ctrl.enter="submit"`

---

### 四、**`v-model` 修饰符**
用于表单双向绑定：

| 修饰符    | 作用                                   |
| --------- | -------------------------------------- |
| `.lazy`   | 转为 `change` 事件更新（而非 `input`） |
| `.number` | 自动将输入转为 `Number` 类型           |
| `.trim`   | 自动去除首尾空格                       |

> 示例：`<input v-model.trim.number="age">`

---

### 五、**其他**
- **`.sync`**（Vue 2）：语法糖，实现父子组件双向绑定（Vue 3 推荐用 `v-model` 替代）
- **动态参数修饰符**（Vue 3）：如 `@[eventModifier]`

---

✅ **总结**：  
修饰符让 Vue 代码更简洁、语义化，避免在逻辑中混入 DOM 操作细节。合理使用可提升可读性与开发效率。

## 如何实现 vue 项目中的性能优化？

Vue 项目性能优化可从 **编译构建、运行时、加载、渲染** 四个维度入手，核心目标：**减少体积、加快加载、提升渲染效率、降低内存消耗**。

---

### 一、**构建与加载优化**
1. **代码分割（Code Splitting）**  
   - 路由懒加载：`defineAsyncComponent(() => import('./Foo.vue'))`
   - 组件懒加载：`import()` + `Suspense`（Vue 3）

2. **Tree Shaking**  
   - 使用 ES Module，按需引入（如 `lodash-es`、UI 库组件）

3. **压缩与缓存**  
   - 启用 Gzip/Brotli 压缩
   - 静态资源加 hash，配置强缓存

4. **CDN 加速**  
   - 将 Vue、Axios 等公共库通过 CDN 引入（外链 + externals）

---

### 二、**运行时优化**
1. **避免响应式数据冗余**  
   - 不将大数组/对象直接放入 `reactive`，用 `Object.freeze()` 或转为普通对象
   - 非响应式数据用 `markRaw`

2. **合理使用 `v-if` / `v-show`**  
   - 频繁切换用 `v-show`，条件稳定用 `v-if`

3. **列表优化**  
   - 必须加唯一 `key`（避免用 index）
   - 超长列表用虚拟滚动（如 `vue-virtual-scroller`）

4. **计算属性 vs 方法**  
   - 可缓存结果用 `computed`，避免模板中写方法调用

5. **避免在模板中写复杂表达式**  
   - 提前在 `computed` 中处理

---

### 三、**渲染优化**
1. **组件拆分**  
   - 拆分大组件，利用 Vue 的细粒度更新机制（仅更新依赖变更的组件）

2. **使用 `keep-alive` 缓存组件**  
   - Tab、详情页等场景避免重复创建

3. **避免不必要的 watcher**  
   - `watch` 指定 `deep: false`（默认）
   - 复杂对象监听用 getter 函数代替 `deep: true`

4. **Vue 3 特有优化**  
   - 利用 `PatchFlags` 和 `Block Tree`（无需手动干预，但需正确使用模板）
   - 使用 `v-memo`（Vue 3.2+）缓存子树

---

### 四、**网络与资源优化**
1. **图片/静态资源优化**  
   - 图片压缩、WebP 格式、懒加载（`<img loading="lazy">`）
   - 字体子集化

2. **接口优化**  
   - 数据分页、懒加载
   - 合并请求、启用缓存（ETag / Cache-Control）

---

### 五、**开发体验辅助**
- 使用 **Vue DevTools** 分析组件层级、响应式依赖
- 使用 **Webpack Bundle Analyzer** 查看包体积
- 开启 **生产环境模式**（移除警告、压缩代码）

---

✅ **总结口诀**：  
**懒加载、少响应、缓计算、精渲染、压体积、快网络**。  
优先做 **高 ROI 优化**（如路由懒加载、图片压缩），再深入细节。

## vue 中的 spa 应用如何优化首屏加载速度?

Vue 的 SPA（单页应用）首屏加载慢通常因**打包体积大、资源未按需加载、服务端无优化**。优化核心思路：**减体积、快加载、早渲染**。

---

### 一、**代码层面优化**

#### 1. **路由懒加载（关键！）**
```js
// Vue 3 + Vite / Webpack
const Home = () => import('@/views/Home.vue');
```
- 按路由拆分 chunk，首屏只加载必要代码

#### 2. **组件懒加载**
- 非首屏组件（如弹窗、图表）用 `defineAsyncComponent` 延迟加载

#### 3. **Tree Shaking + 按需引入**
- UI 库（如 Element Plus、Ant Design Vue）启用按需导入
- 工具库用 `lodash-es` 替代 `lodash`

#### 4. **移除无用依赖/代码**
- 使用 `webpack-bundle-analyzer` 分析包体积
- 删除未使用的插件、polyfill（如 IE 兼容）

---

### 二、**构建与部署优化**

#### 1. **开启 Gzip / Brotli 压缩**
- Nginx / CDN 配置压缩，可减少 70%+ 体积

#### 2. **静态资源 CDN 加速**
- 将 JS/CSS/图片部署到 CDN，提升下载速度

#### 3. **预加载关键资源**
- 使用 `<link rel="preload">` 加载首屏关键 chunk
- 或通过 Webpack 的 `prefetch` / `preload`（谨慎使用）

#### 4. **SplitChunks 合理分包**
- 避免 vendor 过大，将第三方库（如 Vue、Axios）单独抽离并长期缓存

---

### 三、**渲染体验优化**

#### 1. **骨架屏（Skeleton Screen）**
- 首屏 HTML 内联简单骨架，提升感知速度
- 工具：`vue-skeleton-webpack-plugin`（Vue 2）或手写

#### 2. **SSR / SSG（终极方案）**
- **SSR**（Nuxt.js / 自建）：服务端直出 HTML，首屏内容立即可见
- **SSG**（如 VitePress、Nuxt Content）：构建时生成静态 HTML，兼顾 SEO 与速度

> 若无法上 SSR，至少保证**首屏关键数据预加载**（在 `main.js` 前发起 API 请求）

---

### 四、**其他技巧**

- **字体优化**：字体子集化 + `font-display: swap`
- **图片优化**：WebP 格式 + 懒加载 + 适当压缩
- **缓存策略**：JS/CSS 文件加 hash，配置强缓存（Cache-Control: max-age=31536000）

---

✅ **优先级建议**：
1. 路由懒加载 ✅  
2. Gzip + CDN ✅  
3. 包体积分析 & 精简 ❗  
4. 骨架屏（提升体验）  
5. 条件允许上 SSR/SSG（效果最显著）

> 首屏加载 ≠ 白屏时间，**让用户“感觉快”同样重要**。

## Vue 中的 Key 的作用是什么？

Vue 中的 `key` 是**虚拟 DOM 节点的唯一标识**，核心作用是：**帮助 Vue 的 diff 算法高效、准确地复用和更新 DOM 元素**。

---

### 一、核心作用

#### 1. **精准识别节点身份**
- 默认 diff 策略（无 key）：就地复用（in-place patch），按位置更新
- 有 `key`：通过 key 建立新旧节点映射，**跨位置复用真实 DOM**

> ✅ 避免因列表顺序变化导致不必要的 DOM 创建/销毁

#### 2. **触发组件重建**
- 当 `key` 变化时，Vue 会**销毁旧组件实例并创建新实例**
- 用于强制重新渲染（如表单重置、切换同类型组件）

```vue
<component :is="currentView" :key="currentViewId" />
```

---

### 二、典型场景

| 场景                | 无 key 的问题                          | 有 key 的优势                   |
| ------------------- | -------------------------------------- | ------------------------------- |
| 列表渲染（`v-for`） | 顺序变更时状态错乱（如输入框内容错位） | 正确复用/移动 DOM，保持组件状态 |
| 动态组件切换        | 组件缓存，状态残留                     | 强制重建，干净初始化            |

---

### 三、注意事项

- **必须唯一且稳定**：避免用 `index`（插入/删除会导致 key 错位）
- **不要随意变更**：除非需要强制重建
- **仅在 v-for 或动态组件中必要**：静态元素无需加 key

---

✅ **一句话总结**：  
`key` 是 Vue diff 算法的“身份证”，确保 DOM 更新**准确、高效、状态一致**。

## 组件中写 name 选项有哪些好处

在 Vue 组件中定义 `name` 选项主要有以下好处：

---

### 1. **支持 `<keep-alive>` 缓存**
- `keep-alive` 的 `include` / `exclude` 属性通过组件的 `name` 进行匹配  
- 若未显式声明 `name`，则无法被精准缓存或排除

```js
export default {
  name: 'UserProfile',
  // ...
}
```

```vue
<keep-alive include="UserProfile">
  <component :is="currentComp" />
</keep-alive>
```

---

### 2. **调试工具友好（DevTools）**
- Vue DevTools 中会显示组件的 `name`，便于识别组件树结构  
- 匿名组件显示为 `<Anonymous>`，不利于调试

---

### 3. **递归组件自引用**
- 递归组件需通过 `name` 在模板中调用自身（否则无法解析）

```vue
<!-- TreeItem.vue -->
<template>
  <div>
    {{ item.name }}
    <tree-item
      v-for="child in item.children"
      :key="child.id"
      :item="child"
    />
  </div>
</template>

<script>
export default {
  name: 'TreeItem', // 必须！
  props: ['item']
}
</script>
```

---

### 4. **动态组件与错误边界（Vue 3）**
- 在 `errorCaptured` 等生命周期中可通过 `name` 识别出错组件
- 动态导入时可用于日志、监控等场景

---

### 5. **代码可读性与维护性**
- 显式命名提升组件语义，便于团队协作和代码搜索

---

✅ **总结**：  
`name` 虽非强制，但在 **缓存、调试、递归、工具链集成** 等场景至关重要，**建议所有组件都显式声明 `name`**。

## 说一下 ref 的作用是什么？

`ref` 在 Vue 中主要有两个作用，分别用于 **访问 DOM 元素 / 子组件实例** 和 **创建响应式基本类型数据**（Vue 3 Composition API）。

---

### 一、**在模板中：获取 DOM 或子组件引用**
- 通过 `ref="xxx"` 标记元素或组件  
- 在逻辑中通过 `this.$refs.xxx`（Vue 2）或 `xxx.value`（Vue 3 setup）访问

```vue
<template>
  <input ref="inputEl" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
const inputEl = ref(null)
onMounted(() => {
  inputEl.value.focus() // 聚焦输入框
})
</script>
```

> ✅ 适用于：操作焦点、获取尺寸、调用子组件方法等

---

### 二、**在逻辑中（Vue 3）：创建响应式基本类型**
- `ref()` 将原始值（如 number、string）包装成**响应式对象**
- 访问/修改需通过 `.value`（模板中自动解包）

```js
const count = ref(0)
count.value++ // 响应式更新
```

> ✅ 解决了 Vue 2 中 `data` 无法直接响应基本类型的限制

---

### 三、**与 reactive 的区别**
|          | `ref`                     | `reactive`            |
| -------- | ------------------------- | --------------------- |
| 类型     | 适用于**基本类型 & 对象** | 仅适用于**对象/数组** |
| 使用方式 | `.value`（逻辑中）        | 直接属性访问          |
| 模板     | 自动解包                  | 无需处理              |

> 实际上，`ref` 内部对对象会调用 `reactive` 包裹

---

✅ **一句话总结**：  
`ref` 既是 **DOM/组件的“桥梁”**，也是 **基本类型响应式的“容器”**，是 Vue 3 Composition API 的核心工具之一。

## 你的接口请求一般放在哪个生命周期中？为什么要这样做？

在 Vue 中，**接口请求通常放在 `mounted`（Vue 2）或 `onMounted`（Vue 3）中**，但在实际项目中更推荐 **根据数据依赖和场景灵活选择**。以下是详细说明：

---

### ✅ **常规做法：`mounted` / `onMounted`**
- **原因**：
  - 此时组件已挂载，DOM 可用（如需操作 DOM）
  - 避免在 `created` 中请求后立即因路由跳转等导致无意义渲染
- **适用场景**：  
  页面初始化数据、不需要 SSR 的普通数据加载

```js
// Vue 3
onMounted(() => {
  fetchData();
});
```

---

### ⚠️ **但更优实践：根据需求选择**

#### 1. **需要服务端渲染（SSR）？ → 放在 `serverPrefetch`（Vue 3）或路由级预取**
- `mounted` 在服务端不执行，SSR 无法获取数据
- Vue 3 提供 `serverPrefetch` 钩子，支持服务端数据预取

```js
export default {
  async serverPrefetch() {
    this.data = await fetchFromAPI();
  }
}
```

#### 2. **依赖响应式数据（如 route params、props）？ → 用 `watch`**
- 若请求参数来自 `props` 或 `$route`，应在 `watch` 中监听变化后请求

```js
watch(() => route.params.id, (id) => {
  if (id) fetchData(id);
}, { immediate: true });
```

#### 3. **组合式函数封装？ → 在 `setup()` 顶层直接调用（配合 `onMounted` 或自动触发）**
- 使用 `useXxx` 组合函数时，常在内部处理请求时机

```js
// useUser.js
export function useUser(id) {
  const user = ref(null);
  const load = () => { /* fetch */ };
  onMounted(load); // 或由外部控制
  return { user, load };
}
```

---

### ❌ **为什么不放 `created`？**
- 虽然 `created` 更早，但：
  - SSR 场景下可行，但客户端仍需重复请求（除非注入状态）
  - 若组件很快被销毁（如路由切换），会造成无效请求
  - 一般无 DOM 操作需求时，`created` 和 `mounted` 差异不大，但 `mounted` 语义更清晰（“挂载后加载”）

---

### ✅ **最佳实践总结**
| 场景                    | 推荐位置                          |
| ----------------------- | --------------------------------- |
| 普通页面初始化数据      | `onMounted`                       |
| 依赖 props / route 参数 | `watch(..., { immediate: true })` |
| 需要 SSR 支持           | `serverPrefetch` + 客户端激活复用 |
| 封装可复用逻辑          | 组合式函数内部管理生命周期        |

> **核心原则**：**在确保必要且有效的时机发起请求，避免浪费资源，兼顾 SSR 与用户体验。**

## 





