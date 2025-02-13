<script setup lang="ts">
import PostItem from './components/PostItem.vue'
</script>

<template>
  <div id="app">
    <div class="left-column">
      <el-header>
        <div class="logo-container">
          <img alt="logo" class="logo" src="@/assets/logo.png" width="80" height="80" />
          <h2>Yolo's Window</h2>
        </div>
      </el-header>
      <el-main>
        <PostItem />
      </el-main>
    </div>
    <div class="right-column">
      <div>
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/diary">Diary</RouterLink>
          <RouterLink to="/debuglog">Debuglog</RouterLink>
          <RouterLink to="/ielts">IELTS</RouterLink>
        </nav>
      </div>
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
#app {
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  gap: 20px; /* 可选：增加列间距 */
}

.left-column {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.el-header {
  height: 100px !important;
  width: 100%;
}

.el-main {
  width: 100%;
  clear: both; /* 确保清除浮动 */
}

.right-column {
  width: 100%;
  overflow-y: auto;
  height: 100vh;
}

.logo-container {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  margin-bottom: 10px;
}

.logo {
  margin-right: 10px; /* 图片和标题之间的间距 */
  border-radius: 50%; /* 将图片边缘变为圆形 */
}

/* 新增的媒体查询 */
@media (max-width: 800px) {
  #app {
    grid-template-columns: 1fr; /* 改为单列布局 */
  }
  .right-column {
    height: auto; /* 让右侧内容自适应高度 */
  }
}

@media (max-width: 320px) {
  #app {
    min-width: 320px; /* 确保最小宽度不小于320px */
  }
}
</style>
