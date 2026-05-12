<template>
    <div class="backend-layout">
      <el-container class="main-container">
        <!-- 侧边栏 -->
        <Sidebar />
        <el-container>
          <!-- 导航栏 -->
          <el-header><Navbar /></el-header>
          <!-- 根据地址不同，展示不同内容 -->
          <el-main class="content-wrapper">
            <div class="content-container">
              <router-view></router-view>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>

<script lang="js" setup>
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'


</script>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .main-container {
    height: 100%;
    .content-container{
      padding:20px;
      background-color: #fff;
      min-height: calc(100% - 74px);
  }
  }
  
}

:deep(.el-header) {
  padding: 0;
  margin: 0;
  border: none;
  height: 64px;
}

:deep(.el-container) {
  margin: 0;
  width: 100%;
  max-width: 100%;
}
</style>
