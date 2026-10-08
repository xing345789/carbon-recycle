<template>
  <view class="page">
    <view class="tabs">
      <view v-for="s in statuses" :key="s.k" :class="['tab', cur===s.k && 'on']" @click="cur=s.k">{{s.label}}</view>
    </view>
    <view v-if="list.length===0" class="empty">暂无订单</view>
    <view v-for="o in list" :key="o.id" class="card order">
      <view class="o-head">
        <text class="o-no">{{o.orderNo}}</text>
        <text :class="['tag', 'tag-'+o.status]">{{statusText(o.status)}}</text>
      </view>
      <view class="o-body">
        <view class="o-row"><text class="k">用户</text><text class="v">{{o.userName}} ({{o.phone}})</text></view>
        <view class="o-row"><text class="k">类型</text><text class="v">{{o.types.join('、')}}</text></view>
        <view class="o-row"><text class="k">地址</text><text class="v">{{o.building}} {{o.room}}室</text></view>
        <view class="o-row" v-if="o.actualWeight"><text class="k">实重</text><text class="v green">{{o.actualWeight}} kg / +{{o.pointsEarned}}积分</text></view>
        <view class="o-row" v-if="o.recyclerName"><text class="k">回收员</text><text class="v">{{o.recyclerName}}</text></view>
        <view class="o-row" v-if="o.exception"><text class="k">异常</text><text class="v red">{{o.exception.reason}}</text></view>
      </view>
      <view class="o-actions" v-if="o.status==='exception'">
        <button class="act green" @click="resolve(o.id,'complete')">标记完成</button>
        <button class="act" @click="resolve(o.id,'cancel')">退回待接单</button>
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
  { k:'all', label:'全部' }, { k:'pending', label:'待接单' },
  { k:'accepted', label:'已接单' }, { k:'completed', label:'已完成' },
  { k:'exception', label:'异常' }
]
const list = computed(() => cur.value === 'all' ? store.orders : store.orders.filter(o => o.status === cur.value))
const statusText = (s) => ({pending:'待接单', accepted:'已接单', completed:'已完成', exception:'异常'})[s]
const resolve = (id, action) => {
  store.resolveException(id, action)
  uni.showToast({ title: '已处理', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.tabs { display:flex; background:#fff; padding:0 24rpx; position:sticky; top:0; z-index:10; }
.tab { flex:1; text-align:center; padding:24rpx 0; font-size:28rpx; color:#888; position:relative; }
.tab.on { color:#2E7D32; font-weight:700; }
.tab.on::after { content:''; position:absolute; bottom:0; left:25%; right:25%; height:6rpx; background:#2E7D32; border-radius:3rpx; }
.empty { text-align:center; color:#aaa; padding:120rpx 0; }
.o-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:16rpx; }
.o-no { font-size:24rpx; color:#999; }
.o-body { display:flex; flex-direction:column; gap:8rpx; }
.o-row { display:flex; gap:16rpx; font-size:26rpx; }
.k { color:#888; min-width:120rpx; }
.v { flex:1; }
.green { color:#2E7D32; font-weight:700; }
.red { color:#C62828; }
.o-actions { display:flex; gap:16rpx; margin-top:16rpx; }
.act { flex:1; background:#F1F8E9; color:#2E7D32; border-radius:12rpx; font-size:26rpx; padding:16rpx 0; }
.act.green { background:#2E7D32; color:#fff; }
.act::after { border:none; }
</style>
