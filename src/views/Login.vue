<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon>
          <Back />
        </el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账户</h2>
        <p>请输入您的登入信息</p>
      </div>
    </div>

    <div class="form-container">
      <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-position="top">
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input v-model="formData.username" size="large" placeholder="请输入用户名或邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" size="large" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="submitForm(ruleFormRef)" size="large">登录</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="footer">
      <div class="footer-text">
        <p>还没有账号？<router-link type="primary" to="/auth/register">去注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
// 登入接口
import { login } from '@/api/admin'
const router = useRouter()
const ruleFormRef = ref()
const submitForm = async (formRef) => {
  if (!formRef) return
  // valid 为 true：表单填对了，可以提交  valid 为 false：格式错了、没填，不让提交
  await formRef.validate((valid, fields) => {
    if (valid) {
      login(formData).then(res => {
        console.log(res)
        if (!res.token) {
          ElMessage.error(res.msg || '登录失败')
          return
        }
        localStorage.setItem('token', res.token)
        localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
        // 根据userType判断是否是后端登入
        if (res.userInfo.userType === 2) {
          router.push('/backend/dashboard')
        } else {
          router.push('/')
        }
      })
    } else {
      console.log('校验不通过')
    }
  })
}

const formData = reactive({
  username: '',
  password: ''
})

const rules = reactive({
  // required是否必填，message:提示输入框为空时的提示信息，trigger:触发校验的时间点
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})


</script>


<style scoped>
.container {
  width: 384px;

  .back-home {
    margin-bottom: 60px;
  }

  .title {
    .title-text {
      text-align: center;

      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }

      p {
        font-size: 18px;
        color: #6b7280;
      }

    }
  }

  .form-container {
    .login-btn {
      margin-top: 40px;
      width: 100%;
    }
  }

  .footer {
    margin-top: 30px;

    .footer-text {
      text-align: center;

      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }
}
</style>