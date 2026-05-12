<!-- 相同的页面头组件 -->
 <template>
    <div class="page-head">
      <p class="page-title">{{ title }}</p>
      <div class="action-btn">
        <!-- 由于不确定是否有操作按钮，所以使用slot来占位,名为button的插槽 -->
        <slot name="button"></slot>
      </div>
    </div>
 </template>
 <script lang="js" setup>
  defineProps(['title'])
</script>
 <style lang="scss" scoped>
  .page-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .page-title {
      font-size: 24px;
      color:#2d3748;
    }
    margin-bottom: 20px;
  }
</style>