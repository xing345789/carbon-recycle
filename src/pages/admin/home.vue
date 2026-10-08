<template>
  <view class="page">
    <view class="header">
      <text class="title">管理后台</text>
      <text class="sub">碳索者 · 数据概览</text>
    </view>
    <view class="stats-grid">
      <view class="stat-card">
        <text class="s-num">{{students.length}}</text>
        <text class="s-l">学生数</text>
      </view>
      <view class="stat-card">
        <text class="s-num">{{recyclers.length}}</text>
        <text class="s-l">回收员</text>
      </view>
      <view class="stat-card">
        <text class="s-num">{{orders.length}}</text>
        <text class="s-l">总订单</text>
      </view>
      <view class="stat-card green">
        <text class="s-num">{{totalCarbon}}</text>
        <text class="s-l">减碳 kg</text>
      </view>
    </view>

    <view class="card menu">
      <view class="m-item" @click="go('/pages/admin/users')"><text>👥 用户管理</text><text class="arr">›</text></view>
      <view class="m-item" @click="go('/pages/admin/orders')"><text>📋 订单管理</text><text class="arr">›</text></view>
      <view class="m-item" @click="go('/pages/admin/stats')"><text>📊 回收分类统计</text><text class="arr">›</text></view>
      <view class="m-item" @click="go('/pages/admin/points-rule')"><text>⚙️ 积分规则配置</text><text class="arr">›</text></view>
      <view class="m-item" @click="go('/pages/admin/carbon-stats')"><text>🌍 碳减排统计</text><text class="arr">›</text></view>
      <view class="m-item" @click="go('/pages/admin/mall-manage')"><text>🎁 商城与活动管理</text><text class="arr">›</text></view>
    </view>

    <button class="logout" @click="logout">退出登录</button>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const students = computed(() => store.students)
const recyclers = computed(() => store.recyclers)
const orders = computed(() => store.orders)
const totalCarbon = computed(() => store.totalCarbon())
const go = (url) => uni.navigateTo({ url })
const logout = () => { store.logout(); uni.reLaunch({ url: '/pages/login/login' }) }
</script>

<style lang="scss" scoped>
.header { background: linear-gradient(135deg, #43A047, #2E7D32); padding: 50rpx 32rpx 70rpx; color:#fff; }
.title { display:block; font-size:40rpx; font-weight:800; }
.sub { display:block; font-size:26rpx; opacity:0.9; margin-top:8rpx; }
.stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:20rpx; margin:-40rpx 24rpx 0; }
.stat-card { background:#fff; border-radius:20rpx; padding:32rpx; text-align:center; box-shadow:0 8rpx 24rpx rgba(0,0,0,0.06); }
.s-num { display:block; font-size:56rpx; font-weight:900; color:#1B3A1B; }
.stat-card.green .s-num { color:#2E7D32; }
.s-l { font-size:24rpx; color:#888; }
.menu { padding:0; }
.m-item { display:flex; justify-content:space-between; align-items:center; padding:30rpx 28rpx; border-bottom:2rpx solid #f0f0f0; font-size:30rpx; }
.m-item:last-child { border-bottom:none; }
.arr { color:#ccc; font-size:36rpx; }
.logout { margin:40rpx 32rpx; background:#fff; color:#C62828; border-radius:16rpx; font-size:30rpx; border:2rpx solid #FFCDD2; }
.logout::after { border:none; }
</style>
