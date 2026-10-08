<template>
  <view class="page">
    <view class="card">
      <view class="sec-title">回收物分类与重量统计</view>
      <view class="total">累计回收总重量：<text class="green">{{totalWeight}} kg</text></view>
      <view v-for="(t,i) in stats" :key="t.type" class="bar-row">
        <text class="b-type">{{t.type}}</text>
        <view class="bar"><view class="bar-fill" :style="{width: pct(i)+'%'}"></view></view>
        <text class="b-val">{{t.weight}} kg</text>
      </view>
    </view>
    <view class="card">
      <view class="sec-title">订单状态分布</view>
      <view class="dist">
        <view class="d-item" v-for="d in dist" :key="d.k">
          <text class="d-num">{{d.count}}</text>
          <text class="d-l">{{d.label}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const stats = computed(() => store.statsByType())
const totalWeight = computed(() => stats.value.reduce((s,t) => s + t.weight, 0).toFixed(1))
const maxW = computed(() => Math.max(1, ...stats.value.map(t => t.weight)))
const pct = (i) => Math.round(stats.value[i].weight / maxW.value * 100)

const dist = computed(() => [
  { k:'pending', label:'待接单', count: store.orders.filter(o=>o.status==='pending').length },
  { k:'accepted', label:'已接单', count: store.orders.filter(o=>o.status==='accepted').length },
  { k:'completed', label:'已完成', count: store.orders.filter(o=>o.status==='completed').length },
  { k:'exception', label:'异常', count: store.orders.filter(o=>o.status==='exception').length }
])
</script>

<style lang="scss" scoped>
.sec-title { font-size:32rpx; font-weight:700; margin-bottom:20rpx; }
.total { font-size:28rpx; margin-bottom:24rpx; }
.green { color:#2E7D32; font-weight:800; font-size:32rpx; }
.bar-row { display:flex; align-items:center; gap:16rpx; margin-bottom:20rpx; }
.b-type { width:120rpx; font-size:26rpx; }
.bar { flex:1; height:28rpx; background:#F1F8E9; border-radius:14rpx; overflow:hidden; }
.bar-fill { height:100%; background:linear-gradient(90deg,#43A047,#2E7D32); border-radius:14rpx; }
.b-val { width:110rpx; text-align:right; font-size:24rpx; color:#2E7D32; font-weight:600; }
.dist { display:grid; grid-template-columns:repeat(4,1fr); gap:16rpx; }
.d-item { background:#F1F8E9; border-radius:16rpx; padding:24rpx 12rpx; text-align:center; }
.d-num { display:block; font-size:40rpx; font-weight:800; color:#1B3A1B; }
.d-l { font-size:22rpx; color:#888; }
</style>
