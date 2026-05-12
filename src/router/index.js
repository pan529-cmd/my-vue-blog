import { createRouter, createWebHistory } from 'vue-router'





//后端路由配置
const backendRoutes = [
  {
    path: '/backend',
    redirect: '/backend/dashboard',
    name: 'backend',
    component: () => import('@/components/BackendLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashBoard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart'
        }
      },
      {
        path: 'knowledge',
        name: 'backend-knowledge',
        component: () => import('@/views/Knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare'
        }
      },
      {
        path: 'consultations',
        name: 'consultations',
        component: () => import('@/views/Consultations.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message'
        }
      },
      {
        path: 'emotion',
        name: 'emotion',
        component: () => import('@/views/Emotion.vue'),
        meta: {
          title: '情感分析',
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/components/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
        meta: {
          title: '登录',
        }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/Register.vue'),
        meta: {
          title: '注册',
        }
      }
    ]

  }
]
const frontendRoutes = [
  {
    path: '/',
    name: 'frontend',
    component: () => import('@/components/FrontendLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'knowledge',
        name: 'knowledge',
        component: () => import('@/views/FrontendKnowledge.vue'),

      },
      {
        path: 'consultation',
        name: 'consultation',
        component: () => import('@/views/Consultation.vue'),

      },
      {
        path: 'emotion-diary',
        name: 'emotion-diary',
        component: () => import('@/views/EmotionDiary.vue'),

      },
      {
        path: 'knowledge/article/:id',
        component: () => import('@/views/ArticleDetail.vue'),
        props: true,
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes, ...frontendRoutes]
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // 如果是管理员
    if (userInfo.userType === 2) {
      if (to.path.startsWith('/backend')) {
        next()
      } else {
        next('/backend/dashboard')
      }
    } else if (userInfo.userType === 1) {
      // 用户端的账号只能访问前台的路由,如果访问后台路由,重定向到首页
      if (to.path.startsWith('/backend') || to.path.startsWith('/auth')) {
        next('/')
      } else {
        next()
      }
    }
  } else {
    // 如果是后台路由，重定向到登录页
    if (to.path.startsWith('/backend')) {
      next('/auth/login')
    } else {
      // 如果是用户端路由，直接放行
      next()
    }
  }
})
//导出路由
export default router
