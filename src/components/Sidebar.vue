<template>
  <el-aside width="isCollapsed ? '64px' : '264px'">

    <el-menu
      :collapse="isCollapsed"
      :collapse-transition="false"
      default-active="2"
      class="menu-style"
    >
      
      <div class="brand">
        <el-image :src="logoUrl" alt="logo" class="logo" />
        <div v-show="!isCollapsed" class="brand-info">
          <h1 class="brand-title">心理健康AI助手</h1>
          <p class="brand-subtitle">管理后台</p>
        </div>

      </div>
      <!-- 动态添加菜单，数据在router/index.js中，所以要拿到router对象 -->
      <el-menu-item @click="selectMenu" v-for="item in router.options.routes[0].children" :key="item.path" :index="item.path">
        <el-icon><component :is="item.meta.icon"></component></el-icon>
        <span>{{item.meta.title}}</span>
      </el-menu-item>
      
    </el-menu>


  </el-aside>
</template>

<script lang="js" setup>
  import { useRouter } from 'vue-router'
  import { useAdminStore } from '@/stores/admin'
  import {computed} from 'vue'
  // 用computed监听isCollapsed变化，依赖数据变了，computed会重新执行，否则用缓存中的值
  const isCollapsed = computed(()=>useAdminStore().isCollapsed)
  const router = useRouter()
  console.log(router)
  const logoUrl = new URL('@/assets/images/机器人.png', import.meta.url).href
  function selectMenu(item) {
    const currentPath = router.options.routes[0].path
    const newPath = `${currentPath}/${item.index}`
    router.push(newPath)
    // console.log(newPath);
  }
  
</script>

<style lang="scss" scoped>
.menu-style {
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    padding:10px;
    background-color: #fff;
    border-bottom:1px solid #e5e7eb;
    .logo {
      width: 50px;
      height: 50px;
      // margin-right: 10px;
    }
    .brand-info {
      .brand-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
      color:#1f2937;
      }
      .brand-subtitle {
      font-size: 14px;
      color:#6b7280;
    }
  }
}
}

:deep(.el-aside) {
  padding: 0;
  margin: 0;
  border: none;
}


.brand-title {
  font-weight: 400;
  font-size: 24px;
  font-weight: bold;
}
.brand-subtitle {
  font-size: 16px;
  font-weight: normal;
}
</style>