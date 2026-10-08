<template>
  <view class="page">
    <view class="card">
      <picker mode="date" fields="month" :value="month" @change="e=>month=e.detail.value">
        <view class="month-picker">📅 {{month}} 月度报告 ▾</view>
      </picker>
      <view class="stat-grid">
        <view class="stat">
          <text class="s-num">{{monthData.totalWeight}}</text>
          <text class="s-l">回收重量 (kg)</text>
        </view>
        <view class="stat">
          <text class="s-num green">{{monthData.totalPoints}}</text>
          <text class="s-l">获得积分</text>
        </view>
        <view class="stat">
          <text class="s-num green">{{monthData.totalCarbon}}</text>
          <text class="s-l">减碳量 (kg CO₂)</text>
        </view>
      </view>
    </view>

    <view class="card">
      <view class="sec-title">分类回收重量</view>
      <view v-for="(t,i) in typeStats" :key="t.type" class="bar-row">
        <text class="b-type">{{t.type}}</text>
        <view class="bar"><view class="bar-fill" :style="{width: pct(i)+'%'}"></view></view>
        <text class="b-val">{{t.weight}} kg</text>
      </view>
    </view>

    <view class="card">
      <view class="sec-title">回收次数</view>
      <view class="big-num">{{monthData.count}} 次</view>
      <view class="tip">坚持回收，为校园减碳贡献力量 🌱</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const month = ref(new Date().toISOString().slice(0,7))

const monthOrders = computed(() => store.orders.filter(o =>
  o.userId === store.currentUser?.id && o.status === 'completed' && (o.completedAt||'').startsWith(month.value.replace('-','/'))
))

const monthData = computed(() => {
  let w=0, p=0, c=0
  monthOrders.value.forEach(o => {
    o.categoryResult.forEach(cr => {
      w += cr.weight
      const rule = store.rules.find(r => r.type === cr.type)
      if (rule) c += rule.carbonPerKg * cr.weight
    })
    p += o.pointsEarned
  })
  return { totalWeight: w.toFixed(1), totalPoints: p, totalCarbon: c.toFixed(1), count: monthOrders.value.length }
})

const typeStats = computed(() => {
  const map = {}
  monthOrders.value.forEach(o => o.categoryResult.forEach(cr => { map[cr.type] = (map[cr.type]||0)+cr.weight }))
  return store.rules.map(r => ({ type: r.type, weight: +(map[r.type]||0).toFixed(1) }))
})

const maxW = computed(() => Math.max(1, ...typeStats.value.map(t => t.weight)))
const pct = (i) => Math.round(typeStats.value[i].weight / maxW.value * 100)
</script>

<style lang="scss" scoped>
.month-picker { background:#E8F5E9; padding:20rpx 24rpx; border-radius:16rpx; text-align:center; font-size:30rpx; font-weight:600; color:#2E7D32; margin-bottom:30rpx; }
.stat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16rpx; }
.stat { background:#F1F8E9; border-radius:16rpx; padding:24rpx 12rpx; text-align:center; }
.s-num { display:block; font-size:40rpx; font-weight:800; color:#1B3A1B; }
.s-num.green { color:#2E7D32; }
.s-l { font-size:22rpx; color:#888; }
.sec-title { font-size:32rpx; font-weight:700; margin-bottom:20rpx; }
.bar-row { display:flex; align-items:center; gap:16rpx; margin-bottom:20rpx; }
.b-type { width:120rpx; font-size:26rpx; }
.bar { flex:1; height:24rpx; background:#F1F8E9; border-radius:12rpx; overflow:hidden; }
.bar-fill { height:100%; background:linear-gradient(90deg,#43A047,#2E7D32); border-radius:12rpx; }
.b-val { width:100rpx; text-align:right; font-size:24rpx; color:#2E7D32; font-weight:600; }
.big-num { font-size:56rpx; font-weight:800; color:#2E7D32; text-align:center; padding:20rpx 0; }
.tip { text-align:center; color:#888; font-size:26rpx; }
</style>
