<template>
  <!-- 这里就可以将要展示的内容插入到PageHead组件的button插槽中 -->
  <PageHead title="知识库" >
    <template #button>
      <el-button @click="handleEdit({})" type="primary">新增知识</el-button>
    </template>
  </PageHead>
  <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>
  <div class="knowledge">
    <el-table :data="tableData" style="width: 100%;margin-top:25px">
      <!-- 自定义 -->
      <el-table-column label="文章标题" fixed="left" width="240" >
        <template #default="scope">
          <div style="display: flex;align-items: center;">
            <el-icon><timer /></el-icon>
            <span>{{scope.row.title}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="分类" width="200" >
        <template #default="scope">
          <div style="display: flex;align-items: center;">
            <el-icon><timer /></el-icon>
            <span>{{categoryMap[scope.row.categoryId]}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="200" />
      <el-table-column prop="readCount" label="阅读量" width="120" />
      <el-table-column prop="updatedAt" label="发布时间" width="200" />
      <el-table-column label="操作" width="240" fixed="right" >
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" text type="primary">编辑</el-button>
          <el-button v-if="scope.row.status === 0||scope.row.status === 2" text type="success" @click="handlePublish(scope.row)">发布</el-button>
          <el-button v-if="scope.row.status === 1" text type="warning" @click="handleOffline(scope.row)">下线</el-button>
          <el-button text type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      style="margin-top: 25px;"
      v-model:page-size="pagination.size"
      :total="pagination.total"
      layout="prev, pager, next"
      @change="handleChange"
    />
    <!-- 给弹窗传的modelValue,监听事件 update:modelValue -->
    <ArticleDailog v-model:modelValue="dialogVisible" :currentArticle="currentArticle" :categories="categories" @success="handleSuccess"></ArticleDailog>
  </div>
</template>

<script lang="js" setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { categoryTree,articlePage,getArticleDetail,changeArticleStatus,deleteArticle } from '@/api/admin'
import { onMounted,reactive,ref } from 'vue'
import ArticleDailog from '@/components/ArticleDailog.vue'
import {ElMessageBox,ElMessage } from 'element-plus'
// 表格数据
const tableData = ref([])
// 弹窗是否显示
const dialogVisible = ref(false)

// 构建 id 和 名称 的映射字典，方便后面根据 id 拿名字
const categoryMap = reactive({})
// � 分类列表
const categories = ref([])
// 当页面挂载的时候就获取分类列表
onMounted(async () => {
  const res = await categoryTree()
  categories.value = res.map(item=>{
    categoryMap[item.id] = item.categoryName
    return {
      label:item.categoryName,
      value:item.id
    }
  })
  console.log("!!!!!",categories.value)
  formItem[1].options = categories.value
  handleSearch()
  })
const formItem = [
  {comp:'input',prop:'title',label:'文章标题',placeholderSign:'请输入文章标题'},
  {comp:'select',prop:'categoryId',label:'分类',placeholderSign:'请选择分类'},
  {comp:'select',prop:'status',label:'状态',placeholderSign:'请选择状态',options:[
    {label:'草稿',value:'0'},
    {label:'已发布',value:'1'},
    {label:'已删除',value:'2'},
    
  ]},
]

// 配置分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 10,
})
// formData是表单传过来的数据,handleSearch是刷新数据的方法
const handleSearch = async (formData = {}) => {
// 将当前的表单的信息和分页信息传给后端
  const params = {
    ...formData,
    ...pagination
  }
// 后端返回请求页列表和总条数
  const {records,total} = await articlePage(params)
// 更新表格数据
  tableData.value = records
  pagination.total = total
}
// success是弹窗组件调用的方法，用于刷新数据
const handleSuccess = () => {
  dialogVisible.value = false
  handleSearch()
}
// 分页改变时触发
const handleChange = (val) => {
  pagination.currentPage = val
  handleSearch()
}

// 新增知识和编辑知识的弹窗处理
const currentArticle = ref({})
const handleEdit = (row) => {
  if(!row.id){
    currentArticle.value = {}
    dialogVisible.value = true
  }else{
    getArticleDetail(row.id).then(res => {
      currentArticle.value = res
      dialogVisible.value = true
    })
  }
  
}
// 发布知识
const handlePublish = (row) => {
  ElMessageBox.confirm(`确定发布${row.title}吗？`,
  '确认',
  {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }
    ).then(() => {
      changeArticleStatus(row.id,{status:1}).then(res => {
        ElMessage.success('发布成功')
        handleSearch()
      })
      
    })
}
    // 下线知识
    const handleOffline = (row) => {
       ElMessageBox.confirm(`确定下线${row.title}吗？`,
  '确认',
  {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }
    ).then(() => {
      changeArticleStatus(row.id,{status:2}).then(res => {
        ElMessage.success('下线成功')
        handleSearch()
      })
      
    })
    }
    // 删除知识
    const handleDelete = (row) => {
        ElMessageBox.confirm(`确定删除${row.title}吗？`,
  '确认',
  {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }
    ).then(() => {
      deleteArticle(row.id).then(res => {
        ElMessage.success('删除成功')
        handleSearch()
      })
      
    })
    }
</script>

<style scoped>

</style>
