<template>
  <!-- 要把数据收集起来 -->
<el-form :model="formData" ref="formRef">
    <el-row :gutter="24">
      <template v-for="item in formItemWithCol" :key="item.prop">
        <!-- 指定里面的每个组件按响应式布局的规则 -->
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
          <component v-model="formData[item.prop]" :is="isComp(item.comp)" :placeholder="item.placeholderSign">
            <template v-if="item.comp=='select'">
              <el-option label="全部" value="" />
              <el-option v-for="option in item.options" 
              :key="option.id" 
              :label="option.label" 
              :value="option.value" />
            </template>
          </component>
        </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>

  <el-row>
    <!-- 查询实则是要把表单内容交给knowlwdge组件，让knowlwdge组件去搜索内容 -->
    <el-button type="primary" @click="handleSearch">查询</el-button>
    <el-button @click="resetForm">重置</el-button>
  </el-row>
</template>
<script lang="js" setup>
import { ElInput, ElSelect } from 'element-plus'
import { ref,reactive,computed } from 'vue'

// 接收父组件传递过来的表单数据
const props = defineProps({
  formItem: {
    type: Array,
    default: () => []
  }
})
// 接收父组件传递过来的事件名
const emit = defineEmits(['search'])

const formItemWithCol = computed(()=>{
  const{formItem} = props
  // 给formItem添加属性col对象
  formItem.forEach(item => {
    item.col = {
      xs: 24,sm: 12,md: 8,lg: 6,xl: 6,
    }
  })
  return formItem
})

function isComp(comp) {
  return {
    input: ElInput,
    select: ElSelect
  }[comp]
}
// 表单数据和方法
const formData = reactive({})

const handleSearch = () => {
  emit('search', formData)
}
// 拿到的是ref标记的内容
const formRef = ref()
const resetForm = () => {
  if(!formRef)return
  formRef.value.resetFields()
  emit('search', formData)
}


</script>