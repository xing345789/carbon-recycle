<template>
  <view class="page" v-if="order">
    <view class="card">
      <view class="o-head">
        <text class="o-no">{{order.orderNo}}</text>
        <text :class="['tag', 'tag-'+order.status]">{{statusText(order.status)}}</text>
      </view>
      <view class="o-body">
        <view class="o-row"><text class="k">类型</text><text class="v">{{order.types.join('、')}}</text></view>
        <view class="o-row"><text class="k">预估重量</text><text class="v">{{order.weight}} kg</text></view>
        <view class="o-row"><text class="k">地址</text><text class="v">{{order.building}} {{order.room}}室</text></view>
        <view class="o-row"><text class="k">联系人</text><text class="v">{{order.userName}} {{order.phone}}</text></view>
      </view>
    </view>

    <!-- 现场称重与分类 -->
    <view class="card" v-if="order.status==='accepted'">
      <view class="sec-title">现场称重</view>
      <view class="field">
        <text class="label">实际总重量 (kg)</text>
        <input class="ipt" type="digit" v-model="actualWeight" placeholder="请输入实际称重重量" />
      </view>

      <view class="sec-title" style="margin-top:20rpx;">现场分类</view>
      <view v-for="(c,i) in categories" :key="i" class="cat-row">
        <text class="cat-type">{{c.type}}</text>
        <input class="cat-ipt" type="digit" v-model="c.weight" placeholder="0" />
        <text class="cat-u">kg</text>
      </view>
      <view class="tip">分类总重应等于实际重量</view>

      <view class="sec-title" style="margin-top:20rpx;">称重照片</view>
      <button class="photo-btn" @click="takePhoto">📷 上传称重照片</button>
      <view v-if="photos.length" class="photos">
        <image v-for="(p,i) in photos" :key="i" :src="p" class="photo" mode="aspectFill" />
      </view>

      <button class="btn-primary" @click="complete">确认完成并发放积分</button>
    </view>

    <!-- 异常上报 -->
    <view class="card" v-if="order.status==='accepted'">
      <view class="sec-title">异常上报</view>
      <textarea class="exc-ipt" v-model="excReason" placeholder="如物品不符、用户不在等，请说明..." maxlength="200" />
      <button class="exc-btn" @click="reportExc">上报异常</button>
    </view>

    <!-- 已完成展示 -->
    <view class="card" v-if="order.status==='completed'">
      <view class="sec-title">完成信息</view>
      <view class="o-row"><text class="k">实际重量</text><text class="v green">{{order.actualWeight}} kg</text></view>
      <view class="o-row" v-for="c in order.categoryResult" :key="c.type">
        <text class="k">{{c.type}}</text><text class="v">{{c.weight}} kg</text>
      </view>
      <view class="o-row"><text class="k">发放积分</text><text class="v green">+{{order.pointsEarned}}</text></view>
    </view>

    <view class="card" v-if="order.status==='exception'">
      <view class="sec-title">异常信息</view>
      <view class="exc">{{order.exception?.reason}}</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useStore } from '../../store/index.js'
import { TYPES } from '../../utils/mock.js'
const store = useStore()
const id = ref(0)
const actualWeight = ref('')
const categories = ref(TYPES.map(t => ({ type: t, weight: '' })))
const excReason = ref('')
const photos = ref([])
const order = computed(() => store.orders.find(o => o.id === id.value))
const statusText = (s) => ({pending:'待接单', accepted:'进行中', completed:'已完成', exception:'异常'})[s]

onLoad((q) => { id.value = Number(q.id) })

const takePhoto = () => {
  uni.chooseImage({
    count: 3,
    success: (res) => { photos.value = photos.value.concat(res.tempFilePaths) }
  })
}

const complete = () => {
  const w = parseFloat(actualWeight.value)
  if (!w || w <= 0) return uni.showToast({ title: '请输入实际重量', icon: 'none' })
  const cats = categories.value.filter(c => parseFloat(c.weight) > 0).map(c => ({ type: c.type, weight: parseFloat(c.weight) }))
  if (!cats.length) return uni.showToast({ title: '请填写分类重量', icon: 'none' })
  store.completeOrder(id.value, w, cats)
  uni.showToast({ title: '订单已完成，积分已发放', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1000)
}

const reportExc = () => {
  if (!excReason.value) return uni.showToast({ title: '请填写异常原因', icon: 'none' })
  store.reportException(id.value, excReason.value)
  uni.showToast({ title: '已上报，等待处理', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.o-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:16rpx; }
.o-no { font-size:24rpx; color:#999; }
.o-body { display:flex; flex-direction:column; gap:12rpx; }
.o-row { display:flex; gap:16rpx; font-size:28rpx; padding:8rpx 0; }
.k { color:#888; min-width:160rpx; }
.v { flex:1; }
.green { color:#2E7D32; font-weight:700; }
.sec-title { font-size:32rpx; font-weight:700; margin-bottom:16rpx; }
.field { margin-bottom:20rpx; }
.label { display:block; font-size:26rpx; color:#555; margin-bottom:12rpx; }
.ipt { background:#F1F8E9; border-radius:16rpx; padding:20rpx 24rpx; font-size:30rpx; }
.cat-row { display:flex; align-items:center; gap:16rpx; margin-bottom:16rpx; }
.cat-type { width:120rpx; font-size:28rpx; font-weight:600; }
.cat-ipt { flex:1; background:#F1F8E9; border-radius:12rpx; padding:16rpx 20rpx; text-align:center; }
.cat-u { width:60rpx; color:#888; }
.tip { font-size:24rpx; color:#999; text-align:right; margin-bottom:10rpx; }
.photo-btn { background:#E8F5E9; color:#2E7D32; border-radius:16rpx; font-size:28rpx; margin-bottom:16rpx; }
.photo-btn::after { border:none; }
.photos { display:flex; gap:12rpx; flex-wrap:wrap; }
.photo { width:160rpx; height:160rpx; border-radius:12rpx; }
.exc-ipt { width:100%; background:#F1F8E9; border-radius:16rpx; padding:20rpx; min-height:160rpx; font-size:28rpx; margin-bottom:16rpx; }
.exc-btn { background:#FFEBEE; color:#C62828; border-radius:16rpx; font-size:28rpx; }
.exc-btn::after { border:none; }
.exc { background:#FFEBEE; color:#C62828; padding:20rpx; border-radius:12rpx; font-size:28rpx; }
</style>
