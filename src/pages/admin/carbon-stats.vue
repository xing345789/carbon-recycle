<template>
  <view class="page">
    <view class="card hero">
      <text class="h-label">校园累计减碳量</text>
      <text class="h-num">{{totalCarbon}} <text class="h-u">kg CO₂</text></text>
      <text class="h-sub">相当于种植 {{trees}} 棵树 🌳</text>
    </view>

    <view class="card">
      <view class="sec-title">各类型减碳贡献</view>
      <view v-for="(c,i) in carbonByType" :key="c.type" class="row">
        <text class="r-type">{{c.type}}</text>
        <view class="bar"><view class="bar-fill" :style="{width: pct(i)+'%'}"></view></view>
        <text class="r-val">{{c.carbon}} kg</text>
      </view>
    </view>

    <view class="card">
      <view class="sec-title">关键指标</view>
      <view class="metrics">
        <view class="m"><text class="m-num">{{orders}}</text><text class="m-l">回收订单</text></view>
        <view class="m"><text class="m-num">{{weight}}</text><text class="m-l">回收重量 kg</text></view>
        <view class="m"><text class="m-num green">{{points}}</text><text class="m-l">发放积分</text></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const totalCarbon = computed(() => store.totalCarbon())
const trees = computed(() => Math.round(totalCarbon.value / 18))

const carbonByType = computed(() => {
  const map = {}
  store.orders.filter(o => o.status === 'completed').forEach(o => {
    o.categoryResult.forEach(cr => {
      const rule = store.rules.find(r => r.type === cr.type)
      if (rule) map[cr.type] = (map[cr.type] || 0) + rule.carbonPerKg * cr.weight
    })
  })
  return store.rules.map(r => ({ type: r.type, carbon: +(map[r.type] || 0).toFixed(1) }))
})
const maxC = computed(() => Math.max(1, ...carbonByType.value.map(c => c.carbon)))
const pct = (i) => Math.round(carbonByType.value[i].carbon / maxC.value * 100)

const orders = computed(() => store.orders.filter(o => o.status === 'completed').length)
const weight = computed(() => {
  let w = 0
  store.orders.filter(o => o.status === 'completed').forEach(o => w += o.actualWeight)
  return w.toFixed(1)
})
const points = computed(() => store.orders.filter(o => o.status === 'completed').reduce((s,o) => s + o.pointsEarned, 0))
</script>

<style lang="scss" scoped>
.hero { background: linear-gradient(135deg, #43A047, #2E7D32); color:#fff; text-align:center; }
.h-label { display:block; font-size:26rpx; opacity:0.9; }
.h-num { display:block; font-size:88rpx; font-weight:900; margin:16rpx 0; }
.h-u { font-size:32rpx; font-weight:400; }
.h-sub { display:block; font-size:26rpx; opacity:0.9; }
.sec-title { font-size:32rpx; font-weight:700; margin-bottom:20rpx; }
.row { display:flex; align-items:center; gap:16rpx; margin-bottom:20rpx; }
.r-type { width:120rpx; font-size:26rpx; }
.bar { flex:1; height:28rpx; background:#F1F8E9; border-radius:14rpx; overflow:hidden; }
.bar-fill { height:100%; background:linear-gradient(90deg,#66BB6A,#2E7D32); border-radius:14rpx; }
.r-val { width:120rpx; text-align:right; font-size:24rpx; color:#2E7D32; font-weight:600; }
.metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:16rpx; }
.m { background:#F1F8E9; border-radius:16rpx; padding:28rpx 12rpx; text-align:center; }
.m-num { display:block; font-size:44rpx; font-weight:800; color:#1B3A1B; }
.m-num.green { color:#2E7D32; }
.m-l { font-size:22rpx; color:#888; }
</style>
