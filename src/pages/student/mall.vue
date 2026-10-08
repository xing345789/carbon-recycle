<template>
  <view class="page">
    <view class="balance">我的积分：<text class="b">{{user.points}}</text></view>
    <view class="grid">
      <view v-for="p in products" :key="p.id" class="goods">
        <view class="g-img">{{p.type==='right'?'🎟️':'📦'}}</view>
        <text class="g-name">{{p.name}}</text>
        <text class="g-desc">{{p.desc}}</text>
        <view class="g-foot">
          <text class="g-pts">{{p.pointsCost}} 积分</text>
          <text class="g-stock">库存 {{p.stock}}</text>
        </view>
        <button class="g-btn" @click="exchange(p)" :disabled="user.points<p.pointsCost||p.stock<=0">
          {{user.points<p.pointsCost?'积分不足':(p.stock<=0?'已兑完':'立即兑换')}}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const user = computed(() => store.currentUser || {})
const products = computed(() => store.products)

const exchange = (p) => {
  const r = store.exchange(p.id)
  uni.showToast({ title: r.ok ? '兑换成功' : r.msg, icon: r.ok ? 'success' : 'none' })
}
</script>

<style lang="scss" scoped>
.balance { margin:24rpx; background:#fff; border-radius:16rpx; padding:24rpx; font-size:30rpx; }
.b { color:#2E7D32; font-weight:800; font-size:36rpx; margin-left:8rpx; }
.grid { display:grid; grid-template-columns:1fr 1fr; gap:20rpx; padding:0 24rpx 40rpx; }
.goods { background:#fff; border-radius:20rpx; padding:24rpx; display:flex; flex-direction:column; }
.g-img { height:160rpx; background:#F1F8E9; border-radius:16rpx; display:flex; align-items:center; justify-content:center; font-size:72rpx; margin-bottom:16rpx; }
.g-name { font-size:28rpx; font-weight:700; }
.g-desc { font-size:22rpx; color:#999; margin-top:6rpx; min-height:56rpx; }
.g-foot { display:flex; justify-content:space-between; align-items:center; margin-top:12rpx; }
.g-pts { color:#E65100; font-weight:700; font-size:28rpx; }
.g-stock { font-size:22rpx; color:#999; }
.g-btn { margin-top:16rpx; background:#2E7D32; color:#fff; border-radius:12rpx; font-size:26rpx; padding:14rpx 0; border:none; }
.g-btn[disabled] { background:#ccc; color:#fff; }
.g-btn::after { border:none; }
</style>
