<template>
  <view class="page">
    <view class="card">
      <view class="field">
        <text class="label">回收物类型（可多选）</text>
        <view class="types">
          <view v-for="t in types" :key="t" :class="['chip', sel.includes(t) && 'on']" @click="toggle(t)">{{t}}</view>
        </view>
      </view>
      <view class="field">
        <text class="label">预估重量 (kg)</text>
        <view class="weight-row">
          <slider :value="weight" :min="0.5" :max="50" :step="0.5" activeColor="#43A047" @change="e=>weight=e.detail.value" style="flex:1" />
          <text class="w-val">{{weight}} kg</text>
        </view>
      </view>
      <view class="field">
        <text class="label">预约上门时间</text>
        <picker mode="date" :value="date" @change="e=>date=e.detail.value">
          <picker mode="time" :value="time" @change="e=>time=e.detail.value">
            <view class="ipt">{{date}} {{time}}</view>
          </picker>
        </picker>
      </view>
      <view class="field">
        <text class="label">上门地址</text>
        <view class="addr">{{user.building}} 栋 {{user.room}} 室</view>
      </view>
      <view class="estimate">
        <text>预估积分：</text>
        <text class="est-num">≈ {{estPoints}}</text>
      </view>
      <button class="btn-primary" @click="submit">立即下单</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../../store/index.js'
import { TYPES } from '../../utils/mock.js'

const store = useStore()
const types = TYPES
const sel = ref([])
const weight = ref(5)
const date = ref(new Date().toISOString().slice(0,10))
const time = ref('14:00')
const user = computed(() => store.currentUser || {})

const toggle = (t) => {
  const i = sel.value.indexOf(t)
  if (i >= 0) sel.value.splice(i, 1)
  else sel.value.push(t)
}

const estPoints = computed(() => {
  if (!sel.value.length) return 0
  const avg = sel.value.reduce((s, t) => {
    const r = store.rules.find(x => x.type === t)
    return s + (r ? r.pointsPerKg : 0)
  }, 0) / sel.value.length
  return Math.round(avg * weight.value)
})

const submit = () => {
  if (!sel.value.length) return uni.showToast({ title: '请选择回收物类型', icon: 'none' })
  store.createOrder({
    types: sel.value, weight: weight.value,
    appointmentTime: `${date.value} ${time.value}`
  })
  uni.showToast({ title: '预约成功', icon: 'success' })
  setTimeout(() => uni.switchTab({ url: '/pages/student/orders' }), 800)
}
</script>

<style lang="scss" scoped>
.field { margin-bottom: 30rpx; }
.label { display:block; font-size:28rpx; font-weight:600; margin-bottom:16rpx; }
.types { display:flex; flex-wrap:wrap; gap:16rpx; }
.chip { padding:16rpx 32rpx; background:#F1F8E9; border-radius:999rpx; font-size:28rpx; border:2rpx solid transparent; }
.chip.on { background:#E8F5E9; border-color:#43A047; color:#2E7D32; font-weight:700; }
.weight-row { display:flex; align-items:center; gap:16rpx; }
.w-val { font-size:32rpx; font-weight:700; color:#2E7D32; min-width:120rpx; text-align:right; }
.ipt { background:#F1F8E9; border-radius:16rpx; padding:22rpx 24rpx; font-size:30rpx; }
.addr { background:#F1F8E9; border-radius:16rpx; padding:22rpx 24rpx; font-size:30rpx; }
.estimate { background:#FFF8E1; border-radius:16rpx; padding:24rpx; margin:20rpx 0; font-size:28rpx; }
.est-num { color:#E65100; font-weight:800; font-size:36rpx; }
</style>
