<template>
  <view class="page">
    <view class="tabs">
      <view v-for="s in statuses" :key="s.k" :class="['tab', cur===s.k && 'on']" @click="cur=s.k">{{s.label}}</view>
    </view>
    <view v-if="list.length===0" class="empty">暂无订单</view>
    <view v-for="o in list" :key="o.id" class="card order" @click="detail(o.id)">
      <view class="o-head">
        <text class="o-no">{{o.orderNo}}</text>
        <text :class="['tag', 'tag-'+o.status]">{{statusText(o.status)}}</text>
      </view>
      <view class="o-body">
        <view class="o-row"><text class="k">类型</text><text class="v">{{o.types.join('、')}}</text></view>
        <view class="o-row"><text class="k">地址</text><text class="v">{{o.building}} {{o.room}}室</text></view>
        <view class="o-row"><text class="k">预约时间</text><text class="v">{{o.appointmentTime}}</text></view>
        <view class="o-row" v-if="o.actualWeight"><text class="k">实际重量</text><text class="v">{{o.actualWeight}} kg</text></view>
        <view class="o-row" v-if="o.pointsEarned"><text class="k">获得积分</text><text class="v green">+{{o.pointsEarned}}</text></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const cur = ref('all')
const statuses = [
  { k:'all', label:'全部' },
  { k:'pending', label:'待接单' },
  { k:'accepted', label:'已接单' },
  { k:'completed', label:'已完成' }
]
const list = computed(() => {
  const mine = store.orders.filter(o => o.userId === (store.currentUser?.id))
  if (cur.value === 'all') return mine
  return mine.filter(o => o.status === cur.value)
})
const statusText = (s) => ({pending:'待接单', accepted:'已接单', completed:'已完成', exception:'异常'})[s]
const detail = (id) => uni.navigateTo({ url: '/pages/student/order-detail?id=' + id })
</script>

<style lang="scss" scoped>
.tabs { display:flex; background:#fff; padding:0 24rpx; position:sticky; top:0; z-index:10; }
.tab { flex:1; text-align:center; padding:24rpx 0; font-size:28rpx; color:#888; position:relative; }
.tab.on { color:#2E7D32; font-weight:700; }
.tab.on::after { content:''; position:absolute; bottom:0; left:30%; right:30%; height:6rpx; background:#2E7D32; border-radius:3rpx; }
.empty { text-align:center; color:#aaa; padding:120rpx 0; }
.order { padding:24rpx 28rpx; }
.o-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:16rpx; }
.o-no { font-size:24rpx; color:#999; }
.o-body { display:flex; flex-direction:column; gap:10rpx; }
.o-row { display:flex; gap:16rpx; font-size:28rpx; }
.k { color:#888; min-width:140rpx; }
.v { flex:1; }
.green { color:#2E7D32; font-weight:700; }
</style>
