<template>
  <view class="page">
    <view class="header">
      <view class="avatar">{{user.name?.slice(0,1)}}</view>
      <view class="info">
        <text class="name">{{user.name}}</text>
        <text class="sub">回收员 · 工号 {{user.id}}</text>
      </view>
      <view class="stat">
        <text class="s-num">{{doneCount}}</text>
        <text class="s-l">已完成</text>
      </view>
    </view>
    <view class="card menu">
      <view class="m-item" @click="go('/pages/recycler/home')"><text>接单大厅</text><text class="arr">›</text></view>
      <view class="m-item" @click="go('/pages/recycler/tasks')"><text>我的任务</text><text class="arr">›</text></view>
    </view>
    <button class="logout" @click="logout">退出登录</button>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const user = computed(() => store.currentUser || {})
const doneCount = computed(() => store.orders.filter(o => o.recyclerId === user.value.id && o.status === 'completed').length)
const go = (url) => uni.navigateTo({ url })
const logout = () => { store.logout(); uni.reLaunch({ url: '/pages/login/login' }) }
</script>

<style lang="scss" scoped>
.header { background: linear-gradient(135deg, #43A047, #2E7D32); padding: 60rpx 32rpx; display:flex; align-items:center; gap:24rpx; }
.avatar { width:120rpx; height:120rpx; border-radius:50%; background:#fff; color:#2E7D32; font-size:56rpx; font-weight:800; line-height:120rpx; text-align:center; }
.info { flex:1; color:#fff; display:flex; flex-direction:column; gap:8rpx; }
.name { font-size:38rpx; font-weight:700; }
.sub { font-size:24rpx; opacity:0.85; }
.stat { color:#fff; text-align:center; }
.s-num { display:block; font-size:44rpx; font-weight:900; }
.s-l { font-size:22rpx; opacity:0.85; }
.menu { padding:0; }
.m-item { display:flex; justify-content:space-between; align-items:center; padding:30rpx 28rpx; border-bottom:2rpx solid #f0f0f0; font-size:30rpx; }
.m-item:last-child { border-bottom:none; }
.arr { color:#ccc; font-size:36rpx; }
.logout { margin:40rpx 32rpx; background:#fff; color:#C62828; border-radius:16rpx; font-size:30rpx; border:2rpx solid #FFCDD2; }
.logout::after { border:none; }
</style>
