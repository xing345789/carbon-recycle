<template>
  <view class="page">
    <view class="banner">
      <text class="b-title">接单大厅</text>
      <text class="b-sub">待接单 {{pending.length}} 单</text>
    </view>
    <view v-if="pending.length===0" class="empty">暂无待接单</view>
    <view v-for="o in pending" :key="o.id" class="card order">
      <view class="o-head">
        <text class="o-no">{{o.orderNo}}</text>
        <text class="tag tag-pending">待接单</text>
      </view>
      <view class="o-body">
        <view class="o-row"><text class="k">类型</text><text class="v">{{o.types.join('、')}}</text></view>
        <view class="o-row"><text class="k">预估重量</text><text class="v">{{o.weight}} kg</text></view>
        <view class="o-row"><text class="k">地址</text><text class="v">{{o.building}} {{o.room}}室</text></view>
        <view class="o-row"><text class="k">联系人</text><text class="v">{{o.userName}} {{o.phone}}</text></view>
        <view class="o-row"><text class="k">预约时间</text><text class="v">{{o.appointmentTime}}</text></view>
      </view>
      <button class="btn-primary accept" @click="accept(o.id)">立即接单</button>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const pending = computed(() => store.orders.filter(o => o.status === 'pending'))
const accept = (id) => {
  store.acceptOrder(id)
  uni.showToast({ title: '接单成功', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.banner { background: linear-gradient(135deg, #43A047, #2E7D32); padding: 50rpx 32rpx 70rpx; color:#fff; }
.b-title { display:block; font-size:40rpx; font-weight:800; }
.b-sub { display:block; font-size:26rpx; opacity:0.9; margin-top:8rpx; }
.empty { text-align:center; color:#aaa; padding:120rpx 0; }
.order { margin-top:-30rpx; position:relative; }
.o-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:16rpx; }
.o-no { font-size:24rpx; color:#999; }
.o-body { display:flex; flex-direction:column; gap:10rpx; margin-bottom:20rpx; }
.o-row { display:flex; gap:16rpx; font-size:28rpx; }
.k { color:#888; min-width:140rpx; }
.v { flex:1; }
.accept { margin-top:10rpx; }
</style>
