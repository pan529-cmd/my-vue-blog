<template>
  <div class="consultations">
    <PageHead title="咨询记录" />
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column label="会话ID" width="100px" >
        <template #default="scope">
          <el-avatar>{{scope.row.userNickname}}</el-avatar>
        </template>
      </el-table-column>

      <el-table-column label="情绪日志" >
        <template #default="scope">
          <div class="session-title">{{scope.row.sessionTitle}}</div>
          <div class="session-preview">{{scope.row.lastMessageContent}}</div>
        </template>
      </el-table-column>

      <el-table-column label="消息数" prop="messageCount" width="100px" />
      <el-table-column label="时间" prop="startedAt" width="100px" />
      <el-table-column label="操作" width="100px" >
        <template #default="scope">
          <el-button type="primary" text @click="handleDetail(scope.row)">详情</el-button>
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
    <el-dialog
      v-model="showDetailDialog"
      title="咨询会话详情"
      width="70%"
      :close-on-click-modal="false"
    >
      <div class="session-detail">
        <div class="detail-header">
          <div class="detail-row">
            <div class="detail-label">用户：</div>
            <div class="detail-value">{{dialogContent.userNickname}}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">开始时间：</div>
            <div class="detail-value">{{dialogContent.startedAt}}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">消息数：</div>
            <div class="detail-value">{{dialogContent.messageCount}}</div>
          </div>
        </div>
        <div class="messages-container">
          <div class="messages-header">
            <h4>会话记录</h4>
          </div>
          <div class="messages-list" v-loading="loadingMessages">
            <div v-for="item in sessionMessages" :key="item.id" class="message-item" :class="item.senderType === 1 ? 'user-message':'bot-message'">
              <div class="message-header">
                <span class="sender">{{item.senderType === 1 ? '用户' : 'AI助手'}}</span>
                <span class="time">{{item.createdAt}}</span>
              </div>
              <div class="message-content">{{item.content}}</div>
            </div>
          
        </div>
      </div>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="js" setup>
import PageHead from '@/components/PageHead.vue'
import {ref,onMounted,reactive,watch} from 'vue'
import { getConsultationPage,getSessionDetail} from '@/api/admin'

onMounted(async () => {
  handleSearch()
})
const showDetailDialog = ref(false)
const tableData = ref([])
const loadingMessages = ref(false)
// 配置分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 10,
})

const handleSearch = async () => {
  const res = await getConsultationPage(pagination)
  const {records,total} = res
  tableData.value = records
  pagination.total = total
}
// 处理详情点击事件
const dialogContent = ref({})
const sessionMessages = ref([])
const handleDetail = async (row) => {
  loadingMessages.value = true
  showDetailDialog.value = true
  const res = await getSessionDetail(row.id)
  loadingMessages.value = false
  // 后端直接返回数组，不需要 .messages
  sessionMessages.value = res
  dialogContent.value = row
  showDetailDialog.value = true
}
// 处理分页点击事件
const handleChange = (val) => {
  pagination.currentPage = val
  handleSearch()
}
</script>

<style scoped>
  .session-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  .session-preview {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .session-detail {
    max-height: 70vh;
    overflow-y: auto;
    .detail-header {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      :last-child {
        margin-bottom: 0;
      }
      .detail-label {
        font-weight: 500;
        color: #495057;
        min-width: 80px;
        margin-right: 8px;
      }

      .detail-value {
        color: #333;
      }
    }
  }
  .messages-container {
    margin-top: 20px;
    .messages-header {
      margin-bottom: 16px;
      h4 {
        margin: 0;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .messages-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      background: #fff;
      .message-item {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        :last-child {
          margin-bottom: 0;
        }
        &.user-message {
          background: #e8f4fd;
        }

        &.ai-message {
          background: #f0f9f0;
        }
      }
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        .sender {
          font-weight: 500;
          color: #333;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .time {
          font-size: 12px;
          color: #999;
        }

        .message-content {
          color: #333;
          line-height: 1.6;
          white-space: pre-wrap;
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }
</style>