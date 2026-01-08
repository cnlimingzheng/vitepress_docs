# 发布 vue 可用的组件包到 npm （开发 -> 发布到npm -> 用户使用）

## 1. 开发组件

开发 vue 组件应同时支持 **局部使用** 和 **全局使用** 两种方式。

```js
// src/index.ts
import LivePlayer from './components/LivePlayer.vue';

// 支持 app.use()
export default {
  install(app: any) {
    app.component('LivePlayer', LivePlayer);
  }
};

// 支持按需引入
export { LivePlayer };
```

## 2. 发布准备

```bash
# 1. 提交所有更改
git add .
git commit -m "feat: add screenshot support"

# 2. 自动升级版本（根据变更类型）
pnpm version patch    # 或 minor / major

# ✅ 自动：
#   - 更新 package.json version
#   - 创建 Git commit（"v1.0.1"）
#   - 打 Git tag（v1.0.1）
```

> 遵循 SemVer：  
> patch：bug fix  
> minor：新功能（兼容）  
> major：破坏性变更

## 3. 构建生产包

```bash
pnpm build
```

> 输出到 dist/：  
> vue-live-player.mjs（ESM，现代构建工具用）  
> vue-live-player.umd.js（UMD，CDN / 旧项目用）  
> vue-live-player.css（仅当你有全局样式时需要）  
> 确保 package.json 中 "files": ["dist"]，只发布必要文件。

## 4. 本地验证（关键）

### 方法 A `pnpm pack` 模拟安装

```bash
# 生成 .tgz 包
pnpm pack

# 在另一个测试项目中安装
cd ../test-project
pnpm add ../vue-live-player/vue-live-player-1.0.1.tgz
```

```vue
<!-- App.vue -->
<script setup>
import { VueLivePlayer } from 'vue-live-player';
</script>
<template>
  <VueLivePlayer :options="{ url: '...' }" />
</template>
```

✅ 验证是否能正常运行。

### 方法 B `npm link` (快速链接)

```bash
# 在 vue-live-player 根目录
pnpm build
pnpm link --global

# 在测试项目
pnpm link --global vue-live-player
```

## 5. 发布到npm

```bash
# 预演（可选）
pnpm publish --dry-run

# 正式发布
pnpm publish --access public
```

> 首次发布请加 `--access public`（否则 scoped 包默认私有）
> ✅ 成功后，包可在 https://www.npmjs.com/package/vue-live-player 查看。

## 6. 推送代码和标签到仓库

```bash
git push
git push --tags
```

> ✅ GitHub/GitLab 会自动显示 release tag，方便追溯。

## 7. 用户使用你的npm包（发布包请提供优秀文档）

```bash
pnpm add vue-live-player
```

局部注册使用

```vue
<script setup>
import { LivePlayer } from 'vue-live-player';
</script>

<template>
  <div style="width:800px;height:600px">
    <LivePlayer :options="{ url: 'webrtc://...', autoplay: true }" />
  </div>
</template>
```

全局使用

```js
import { createApp } from 'vue';
import App from './App.vue';
import VueLivePlayer from 'vue-live-player';

createApp(App).use(VueLivePlayer).mount('#app');
```