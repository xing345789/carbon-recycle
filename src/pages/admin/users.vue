<template>
  <view class="page">
    <view class="tabs">
      <view :class="['tab', cur==='student' && 'on']" @click="cur='student'">学生</view>
      <view :class="['tab', cur==='recycler' && 'on']" @click="cur='recycler'">回收员</view>
    </view>
    <view v-for="u in list" :key="u.id" class="card user">
      <view class="u-head">
        <view class="avatar">{{u.name?.slice(0,1)}}</view>
        <view class="u-info">
          <text class="u-name">{{u.name}}</text>
          <text class="u-phone">{{u.phone}}</text>
        </view>
        <text class="u-pts" v-if="cur==='student'">{{u.points}} 积分</text>
      </view>
      <view class="u-detail" v-if="cur==='student'">
        <text>学号: {{u.studentId || '-'}}</text>
        <text>{{u.college}} · {{u.building}} {{u.room}}室</text>
      </view>
      <view class="u-actions">
        <button class="del" @click="del(u.id)">删除</button>
      </view>
    </view>
    <view v-if="list.length===0" class="empty">暂无用户</view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const cur = ref('student')
const list = computed(() => cur.value === 'student' ? store.students : store.recyclers)
const del = (id) => {
  uni.showModal({
    title: '确认删除', content: '删除后不可恢复',
    success: (r) => { if (r.confirm) { store.deleteUser(id); uni.showToast({ title:'已删除', icon:'success' }) } }
  })
}
</script>

<style lang="scss" scoped>
.tabs { display:flex; background:#fff; padding:0 24rpx; position:sticky; top:0; z-index:10; }
.tab { flex:1; text-align:center; padding:24rpx 0; font-size:28rpx; color:#888; position:relative; }
.tab.on { color:#2E7D32; font-weight:700; }
.tab.on::after { content:''; position:absolute; bottom:0; left:30%; right:30%; height:6rpx; background:#2E7D32; border-radius:3rpx; }
.user { padding:24rpx; }
.u-head { display:flex; align-items:center; gap:20rpx; }
.avatar { width:88rpx; height:88rpx; border-radius:50%; background:#E8F5E9; color:#2E7D32; font-size:38rpx; font-weight:800; line-height:88rpx; text-align:center; }
.u-info { flex:1; display:flex; flex-direction:column; gap:6rpx; }
.u-name { font-size:30rpx; font-weight:700; }
.u-phone { font-size:24rpx; color:#999; }
.u-pts { color:#E65100; font-weight:700; }
.u-detail { display:flex; flex-direction:column; gap:6rpx; margin-top:16rpx; font-size:24rpx; color:#666; padding-top:16rpx; border-top:2rpx solid #f0f0f0; }
.u-actions { margin-top:16rpx; display:flex; justify-content:flex-end; }
.del { background:#FFEBEE; color:#C62828; border-radius:12rpx; font-size:24rpx; padding:12rpx 28rpx; margin:0; }
.del::after { border:none; }
.empty { text-align:center; color:#aaa; padding:120rpx 0; }
</style>
