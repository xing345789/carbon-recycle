<template>
  <view class="page">
    <view class="balance-card">
      <text class="b-label">碳积分余额</text>
      <text class="b-num">{{user.points}}</text>
      <text class="b-sub">积分可在商城兑换环保用品与校园权益</text>
    </view>
    <view class="card">
      <view class="sec-title">积分明细</view>
      <view v-if="mine.length===0" class="empty">暂无记录</view>
      <view v-for="r in mine" :key="r.id" class="rec">
        <view class="r-left">
          <text class="r-type">{{r.type}}</text>
          <text class="r-time">{{r.time}}</text>
        </view>
        <text class="r-change" :class="{pos:r.change>0}">{{r.change>0?'+':''}}{{r.change}}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const user = computed(() => store.currentUser || {})
const mine = computed(() => store.records.filter(r => r.userId === user.value.id))
</script>

<style lang="scss" scoped>
.balance-card { background: linear-gradient(135deg, #43A047, #2E7D32); margin:24rpx; border-radius:24rpx; padding:48rpx 36rpx; color:#fff; }
.b-label { font-size:26rpx; opacity:0.9; }
.b-num { display:block; font-size:88rpx; font-weight:900; margin:8rpx 0; }
.b-sub { font-size:24rpx; opacity:0.8; }
.sec-title { font-size:32rpx; font-weight:700; margin-bottom:20rpx; }
.empty { text-align:center; color:#aaa; padding:60rpx 0; }
.rec { display:flex; justify-content:space-between; align-items:center; padding:24rpx 0; border-bottom:2rpx solid #f0f0f0; }
.rec:last-child { border-bottom:none; }
.r-left { display:flex; flex-direction:column; gap:6rpx; }
.r-type { font-size:28rpx; font-weight:600; }
.r-time { font-size:22rpx; color:#999; }
.r-change { font-size:32rpx; font-weight:700; color:#C62828; }
.r-change.pos { color:#2E7D32; }
</style>
