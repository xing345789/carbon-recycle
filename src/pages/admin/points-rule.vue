<template>
  <view class="page">
    <view class="card">
      <view class="sec-title">积分规则配置</view>
      <view class="tip">设置各类回收物的积分系数与减碳系数</view>
      <view v-for="(r,i) in rules" :key="r.type" class="rule-row">
        <text class="r-type">{{r.type}}</text>
        <view class="r-field">
          <text class="r-label">积分/kg</text>
          <input class="r-ipt" type="digit" v-model="r.pointsPerKg" />
        </view>
        <view class="r-field">
          <text class="r-label">减碳/kg</text>
          <input class="r-ipt" type="digit" v-model="r.carbonPerKg" />
        </view>
      </view>
      <button class="btn-primary" @click="save">保存规则</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const rules = ref(JSON.parse(JSON.stringify(store.rules)))
const save = () => {
  store.saveRules(rules.value.map(r => ({
    type: r.type,
    pointsPerKg: Number(r.pointsPerKg) || 0,
    carbonPerKg: Number(r.carbonPerKg) || 0
  })))
  uni.showToast({ title: '保存成功', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.sec-title { font-size:32rpx; font-weight:700; margin-bottom:10rpx; }
.tip { font-size:24rpx; color:#999; margin-bottom:24rpx; }
.rule-row { display:flex; align-items:center; gap:16rpx; padding:20rpx 0; border-bottom:2rpx solid #f0f0f0; }
.r-type { width:120rpx; font-size:28rpx; font-weight:700; }
.r-field { flex:1; display:flex; flex-direction:column; gap:6rpx; }
.r-label { font-size:22rpx; color:#888; }
.r-ipt { background:#F1F8E9; border-radius:12rpx; padding:14rpx 16rpx; text-align:center; font-size:28rpx; }
.btn-primary { margin-top:30rpx; }
</style>
