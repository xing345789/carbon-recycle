<template>
  <view class="page">
    <view class="header">
      <view class="avatar">{{user.name?.slice(0,1)}}</view>
      <view class="info">
        <text class="name">{{user.name}}</text>
        <text class="sub">{{user.college || '回收员'}} · {{user.building ? user.building+' '+user.room+'室' : ''}}</text>
      </view>
      <view class="pts">{{user.points}}<text class="u">积分</text></view>
    </view>

    <view class="card menu">
      <view class="m-item" @click="go('/pages/student/points')"><text>碳积分明细</text><text class="arr">›</text></view>
      <view class="m-item" @click="go('/pages/student/report')"><text>每月减碳报告</text><text class="arr">›</text></view>
      <view class="m-item" @click="go('/pages/student/mall')"><text>积分兑换商城</text><text class="arr">›</text></view>
      <view class="m-item" @click="go('/pages/student/ranking')"><text>减碳排行榜</text><text class="arr">›</text></view>
    </view>

    <view class="card menu">
      <view class="m-item" @click="go('/pages/student/orders')"><text>我的订单</text><text class="arr">›</text></view>
      <view class="m-item" @click="go('/pages/student/booking')"><text>去预约回收</text><text class="arr">›</text></view>
    </view>

    <button class="logout" @click="logout">退出登录</button>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const user = computed(() => store.currentUser || {})
const go = (url) => {
  if (url.includes('/booking') || url.includes('/orders')) uni.switchTab({ url })
  else uni.navigateTo({ url })
}
const logout = () => {
  store.logout()
  uni.reLaunch({ url: '/pages/login/login' })
}
</script>

<style lang="scss" scoped>
.header { background: linear-gradient(135deg, #43A047, #2E7D32); padding: 60rpx 32rpx; display:flex; align-items:center; gap:24rpx; }
.avatar { width:120rpx; height:120rpx; border-radius:50%; background:#fff; color:#2E7D32; font-size:56rpx; font-weight:800; line-height:120rpx; text-align:center; }
.info { flex:1; color:#fff; display:flex; flex-direction:column; gap:8rpx; }
.name { font-size:38rpx; font-weight:700; }
.sub { font-size:24rpx; opacity:0.85; }
.pts { color:#fff; font-size:52rpx; font-weight:900; }
.u { font-size:24rpx; font-weight:400; margin-left:6rpx; }
.menu { padding:0; }
.m-item { display:flex; justify-content:space-between; align-items:center; padding:30rpx 28rpx; border-bottom:2rpx solid #f0f0f0; font-size:30rpx; }
.m-item:last-child { border-bottom:none; }
.arr { color:#ccc; font-size:36rpx; }
.logout { margin:40rpx 32rpx; background:#fff; color:#C62828; border-radius:16rpx; font-size:30rpx; border:2rpx solid #FFCDD2; }
.logout::after { border:none; }
</style>
