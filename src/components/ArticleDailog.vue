<template>
  <el-dialog
    :title="isEdit ? '编辑文章' : '添加文章'"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要" maxlength="1000" show-word-limit :rows="4" />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select v-model="formData.tagArray" placeholder="请选择文章标签" clearable multiple allow-create width="100%">
          <el-option v-for="item in commonTags" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div class="cover-upload">
          <!-- action后面的路径是上传图片的接口地址 -->
          <el-upload
            class="avatar-uploader"
            action="uploadUrl"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            :accept="'image/*'"
            :show-file-list="false"
          >
          <!-- 如果没有上传图片 -->
            <div v-if="!imgURL" class="cover-placeholder">
              <p>点击上传封面</p>
            </div>
            <!-- 如果上传了图片 -->
            <img v-else :src="imgURL" alt="封面图片" class="cover-image" />
            
            </el-upload>
            <div v-if="imgURL" class="cover-remove">
              <el-button type="danger" size="small" @click="removeImage">移除封面</el-button>
            </div>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor 
        v-model="formData.content" 
        placeholder="请输入文章内容"
        :maxCharCount="5000"
        min-height="400px"
        @change="handleContentChange"
        @create="handleEditorCreate"
         />
      </el-form-item>
    </el-form>
    <div v-if="btnpreview">
      <h2>内容预览</h2>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button @click="btnpreview = !btnpreview">{{ btnpreview ? '隐藏预览' : '预览效果' }}</el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="loading">{{ isEdit ? '更新文章' : '创建文章' }}</el-button>
    </template>
  </el-dialog>
  
</template>

<script lang="js" setup>
import { ref, computed, reactive,nextTick,watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile,createArticle,updateArticle } from '@/api/admin'
import { fileBaseUrl } from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'

const btnpreview = ref(false)
const emit = defineEmits(['update:modelValue','success'])
// 上传的图片的url
const imgURL = ref('')
const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  },
  currentArticle: {
    type: Object,
    default: null
  },

})

// 是否编辑文章,如果有这个外部变量currentArticle,则为编辑文章,否则为添加文章
const isEdit = computed(() => !!props.currentArticle.id)
const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { max: 5000, message: '文章内容最多5000个字符', trigger: 'blur' }
  ],
  
})

const formData = reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 1,
    "summary": "",
    "tags": "",
    "id": ""
})

const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

// 编辑后,需要将currentArticle的值赋值给formData
watch(()=>props.currentArticle, (newVal) => {
  if (newVal) {
    nextTick(() => {
      Object.assign(formData, newVal)
      businessId.value = newVal.id
      imgURL.value = newVal.coverImage
    })
  }
})
const handleClose = () => {
  // 重置表单数据
  formRef.value.resetFields()
  // 重置businessId.value
  businessId.value = null
  // 重置标签数组
  formData.tagArray = []
  // 重置imgURL.value
  removeImage()
  // 改dialogVisible只能用emit方法
  emit('update:modelValue', false)
}
// 上传之前的校验
const beforeUpload = (file) => {
  // 校验是否是图片文件
  const isImage = file.type.startsWith('image/')
  // 校验文件大小
  const isLt5M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('请上传图片文件')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  // true 表示校验通过
  return true
  
}
const businessId = ref(null)
const handleUploadRequest = async ({ file }) => {
   businessId.value = crypto.randomUUID()
  
  
    const fileRes = await uploadFile(file, {
      businessId: businessId.value,
      businessType: 'ARTICLE',
      businessField: 'cover'
    })
    
  // 拼接图片url
  imgURL.value = fileBaseUrl + fileRes.filePath
  formData.coverImage = fileRes.filePath
  
}
// 移除图片
const removeImage = () => {
  imgURL.value = ''
  formData.coverImage = ''
}
// 文章内容改变时触发,更新formData.content
const handleContentChange = (data) => {
  formData.content = data.html
  console.log(formData.content)
}
// 文章内容创建时触发
const editorInsatnce = ref(null)
const handleEditorCreate = (editor) => {
  editorInsatnce.value = editor
  if(formData.content && editor){
    nextTick(() => {
      editor.setHtml(formData.content)
    })
    
  }
}
const formRef = ref(null)
const loading = ref(false)
const handleSubmit = () => {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      loading.value = true
     
    }
     const submitData = {
        ...formData,
        tags: formData.tagArray.join(',')
      }
      delete submitData.tagArray

      if(!isEdit.value){
        submitData.id = businessId.value
        createArticle(submitData).then(res => {
          loading.value = false
          emit('success')
        })
      }else{
        updateArticle(props.currentArticle.id, submitData).then(res => {
          loading.value = false
          emit('success')
        })
      }
  })
}
</script>

<style scoped>
  .cover-placeholder{
    width: 200px;
    height: 120px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color:#8b949e;
    background: #f6f8fa;
  }
  .cover-image{
    width: 200px;
    height: 120px;
    display: block;
  }
</style>