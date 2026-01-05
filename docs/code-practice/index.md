# 代码实践 

## async/await 如何优雅的处理异常

在 `async/await` 中优雅处理异常，核心是 **避免未捕获的 Promise rejection**，同时保持代码清晰。以下是几种推荐方式：

---

### 一、基础：`try...catch`（最常用）

```js
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('请求失败');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('错误:', error.message);
    // 可返回默认值或重新抛出
    throw error; // 或 return null;
  }
}
```

✅ **优点**：结构清晰，同步风格  
⚠️ **注意**：只能捕获 `await` 后的异步错误，不能捕获同步抛错（但同步错误也会进入 `catch`）

---

### 二、封装 `to` 工具函数（Go 风格）

模仿 Go 语言的多返回值错误处理，避免 `try...catch` 嵌套：

```js
// utils.js
export function to(promise) {
  return promise
    .then(data => [null, data])
    .catch(err => [err, null]);
}

// 使用
async function main() {
  const [err, data] = await to(fetchData());
  if (err) {
    console.error('失败:', err);
    return;
  }
  console.log('成功:', data);
}
```

✅ **优点**：  
- 避免 `try...catch` 嵌套（尤其多异步操作时）；  
- 错误处理与业务逻辑平级。

---

### 三、全局未捕获异常监听（兜底）

防止未处理的 rejection 导致程序崩溃（Node.js / 浏览器）：

```js
// Node.js
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕获的异步错误:', reason);
});

// 浏览器
window.addEventListener('unhandledrejection', event => {
  console.error('未捕获的 Promise rejection:', event.reason);
  event.preventDefault(); // 阻止默认报错
});
```

> ⚠️ **仅作兜底**，不应替代局部错误处理！

---

### 四、高阶技巧：自定义错误边界（React 类似）

对关键模块封装统一错误处理逻辑：

```js
async function withErrorHandling(asyncFn, fallback = null) {
  try {
    return await asyncFn();
  } catch (error) {
    logToSentry(error); // 上报监控
    showUserMessage('操作失败，请重试');
    return fallback;
  }
}

// 使用
const data = await withErrorHandling(() => api.getUser(id), {});
```

---

### 五、避免的反模式

#### ❌ 1. 忽略错误
```js
await fetchData(); // 无 try/catch → 可能 unhandledRejection
```

#### ❌ 2. 混淆同步/异步错误
```js
async function bad() {
  JSON.parse(null); // 同步错误！需在 try 内
  await fetch(...);
}
```
✅ 正确：整个函数体包在 `try...catch` 中。

#### ❌ 3. 过度嵌套 try/catch
```js
// 不优雅
try {
  try {
    await step1();
  } catch {}
  try {
    await step2();
  } catch {}
} catch {}
```
✅ 改用 `to()` 工具函数或拆分为独立函数。

---

### 总结：最佳实践

| 场景             | 推荐方案                  |
| ---------------- | ------------------------- |
| 单次异步操作     | `try...catch`             |
| 多个独立异步操作 | `to()` 工具函数           |
| 全局监控         | `unhandledRejection` 监听 |
| 业务模块复用     | 封装 `withErrorHandling`  |

> 💡 **原则**：  
> - **每个 `await` 要么被 `try...catch` 包裹，要么由调用者处理**；  
> - **不要吞掉错误**（至少记录日志）；  
> - **用户可见操作必须有错误反馈**。