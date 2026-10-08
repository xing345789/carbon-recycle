<template>
  <view class="page">
    <view class="header">
      <view class="hi">你好，{{user.name}} 👋</view>
      <view class="points-card">
        <view class="pc-left">
          <text class="pc-label">我的碳积分</text>
          <text class="pc-num">{{user.points}}</text>
          <text class="pc-sub">累计减碳 {{myCarbon}} kg CO₂</text>
        </view>
        <view class="pc-right">
          <view class="leaf">🍃</view>
        </view>
      </view>
    </view>

    <view class="card quick">
      <view class="q-item" @click="go('/pages/student/booking')">
        <view class="qi-ico">📦</view><text>预约回收</text>
      </view>
      <view class="q-item" @click="go('/pages/student/orders')">
        <view class="qi-ico">📋</view><text>我的订单</text>
      </view>
      <view class="q-item" @click="go('/pages/student/mall')">
        <view class="qi-ico">🎁</view><text>积分商城</text>
      </view>
      <view class="q-item" @click="go('/pages/student/ranking')">
        <view class="qi-ico">🏆</view><text>减碳排行</text>
      </view>
      <view class="q-item" @click="go('/pages/student/points')">
        <view class="qi-ico">💎</view><text>积分明细</text>
      </view>
      <view class="q-item" @click="go('/pages/student/report')">
        <view class="qi-ico">📊</view><text>减碳报告</text>
      </view>
    </view>

    <view class="card" v-if="activities.length">
      <view class="sec-title">低碳活动</view>
      <view class="act" v-for="a in activities" :key="a.id">
        <view class="act-tag" :class="{on:a.active}">{{a.active?'进行中':'已结束'}}</view>
        <view class="act-body">
          <text class="act-title">{{a.title}}</text>
          <text class="act-desc">{{a.content}}</text>
        </view>
      </view>
    </view>

    <view class="card">
      <view class="sec-title">回收分类价目</view>
      <view class="rule-list">
        <view class="rule" v-for="r in rules" :key="r.type">
          <text class="r-type">{{r.type}}</text>
          <text class="r-pts">{{r.pointsPerKg}} 积分/kg</text>
          <text class="r-c">减碳 {{r.carbonPerKg}} kg</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const user = computed(() => store.currentUser || {})
const rules = computed(() => store.rules)
const activities = computed(() => store.activities)

const myCarbon = computed(() => {
  let c = 0
  store.orders.filter(o => o.userId === user.value.id && o.status === 'completed').forEach(o => {
    o.categoryResult.forEach(cr => {
      const rule = store.rules.find(r => r.type === cr.type)
      if (rule) c += rule.carbonPerKg * cr.weight
    })
  })
  return c.toFixed(1)
})

const go = (url) => {
  if (url.includes('/booking') || url.includes('/orders') || url.includes('/profile')) {
    uni.switchTab({ url, fail: () => uni.navigateTo({ url }) })
  } else {
    uni.navigateTo({ url })
  }
}
</script>

<style lang="scss" scoped>
.page { padding-bottom: 40rpx; }
.header { background: linear-gradient(135deg, #43A047, #2E7D32); padding: 40rpx 32rpx 80rpx; }
.hi { color: #fff; font-size: 36rpx; font-weight: 700; margin-bottom: 24rpx; }
.points-card { background: rgba(255,255,255,0.18); border-radius: 28rpx; padding: 36rpx; display:flex; justify-content:space-between; align-items:center; backdrop-filter: blur(10rpx); }
.pc-label { color:#E8F5E9; font-size:26rpx; }
.pc-num { display:block; color:#fff; font-size:72rpx; font-weight:900; margin:8rpx 0; }
.pc-sub { color:#C8E6C9; font-size:24rpx; }
.leaf { font-size:80rpx; }
.quick { margin-top:-50rpx; display:grid; grid-template-columns:repeat(3,1fr); gap:30rpx 0; }
.q-item { display:flex; flex-direction:column; align-items:center; gap:12rpx; }
.qi-ico { width:96rpx; height:96rpx; line-height:96rpx; text-align:center; background:#E8F5E9; border-radius:24rpx; font-size:44rpx; }
.q-item text { font-size:26rpx; color:#1B3A1B; }
.sec-title { font-size:32rpx; font-weight:700; margin-bottom:20rpx; }
.act { display:flex; gap:20rpx; padding:20rpx 0; border-bottom:2rpx solid #f0f0f0; }
.act:last-child { border-bottom:none; }
.act-tag { padding:6rpx 16rpx; border-radius:8rpx; font-size:22rpx; background:#eee; color:#999; height:fit-content; }
.act-tag.on { background:#FFF3E0; color:#E65100; }
.act-title { display:block; font-size:28rpx; font-weight:600; }
.act-desc { display:block; font-size:24rpx; color:#888; margin-top:6rpx; }
.rule-list { display:flex; flex-direction:column; gap:16rpx; }
.rule { display:flex; justify-content:space-between; align-items:center; background:#F1F8E9; padding:20rpx 24rpx; border-radius:16rpx; }
.r-type { font-weight:700; font-size:30rpx; }
.r-pts { color:#2E7D32; font-weight:700; }
.r-c { color:#888; font-size:24rpx; }
</style>
