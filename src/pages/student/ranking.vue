<template>
  <view class="page">
    <view class="tabs">
      <view v-for="d in dims" :key="d.k" :class="['tab', cur===d.k && 'on']" @click="cur=d.k">{{d.label}}</view>
    </view>
    <view class="card">
      <view class="rank-head">
        <text class="rh-1">排名</text>
        <text class="rh-2">{{cur==='personal'?'姓名':cur==='dorm'?'宿舍':'学院'}}</text>
        <text class="rh-3">减碳量 (kg)</text>
      </view>
      <view v-for="(item, i) in ranked" :key="i" class="rank-row">
        <text :class="['rk', i<3 && 'top'+(i+1)]">{{i+1}}</text>
        <text class="rname">{{item.name}}</text>
        <text class="rcarbon">{{item.carbon.toFixed(1)}}</text>
      </view>
      <view v-if="ranked.length===0" class="empty">暂无数据</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const cur = ref('personal')
const dims = [
  { k:'personal', label:'个人' },
  { k:'dorm', label:'宿舍' },
  { k:'college', label:'学院' }
]

const userCarbon = (userId) => {
  let c = 0
  store.orders.filter(o => o.userId === userId && o.status === 'completed').forEach(o => {
    o.categoryResult.forEach(cr => {
      const rule = store.rules.find(r => r.type === cr.type)
      if (rule) c += rule.carbonPerKg * cr.weight
    })
  })
  return c
}

const ranked = computed(() => {
  if (cur.value === 'personal') {
    return store.students.map(s => ({ name: s.name, carbon: userCarbon(s.id) }))
      .sort((a,b) => b.carbon - a.carbon)
  }
  const map = {}
  store.students.forEach(s => {
    const key = cur.value === 'dorm' ? (s.building + ' ' + s.room) : s.college
    if (!key) return
    map[key] = (map[key] || 0) + userCarbon(s.id)
  })
  return Object.entries(map).map(([name, carbon]) => ({ name, carbon })).sort((a,b) => b.carbon - a.carbon)
})
</script>

<style lang="scss" scoped>
.tabs { display:flex; background:#fff; padding:0 24rpx; position:sticky; top:0; z-index:10; }
.tab { flex:1; text-align:center; padding:24rpx 0; font-size:28rpx; color:#888; position:relative; }
.tab.on { color:#2E7D32; font-weight:700; }
.tab.on::after { content:''; position:absolute; bottom:0; left:30%; right:30%; height:6rpx; background:#2E7D32; border-radius:3rpx; }
.rank-head, .rank-row { display:flex; align-items:center; padding:20rpx 0; border-bottom:2rpx solid #f0f0f0; }
.rank-head { font-weight:700; color:#888; font-size:26rpx; }
.rh-1, .rk { width:80rpx; text-align:center; }
.rh-2, .rname { flex:1; }
.rh-3, .rcarbon { width:200rpx; text-align:right; }
.rk { font-size:28rpx; font-weight:700; }
.rk.top1 { color:#FFA000; }
.rk.top2 { color:#9E9E9E; }
.rk.top3 { color:#8D6E63; }
.rname { font-size:28rpx; }
.rcarbon { font-size:28rpx; font-weight:700; color:#2E7D32; }
.empty { text-align:center; color:#aaa; padding:60rpx 0; }
</style>
