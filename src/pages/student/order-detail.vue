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
        <view class="o-row"><text class="k">预约时间</text><text class="v">{{order.appointmentTime}}</text></view>
        <view class="o-row"><text class="k">地址</text><text class="v">{{order.building}} {{order.room}}室</text></view>
        <view class="o-row" v-if="order.recyclerName"><text class="k">回收员</text><text class="v">{{order.recyclerName}}</text></view>
        <view class="o-row" v-if="order.actualWeight"><text class="k">实际重量</text><text class="v green">{{order.actualWeight}} kg</text></view>
        <view class="o-row" v-if="order.pointsEarned"><text class="k">获得积分</text><text class="v green">+{{order.pointsEarned}}</text></view>
      </view>
    </view>

    <!-- 称重确认 -->
    <view class="card" v-if="order.status==='completed' && !order.weightConfirmed">
      <view class="sec-title">称重确认</view>
      <view class="confirm-box">
        <text>实际称重重量：</text>
        <text class="big green">{{order.actualWeight}} kg</text>
        <text>将获得积分：+{{order.pointsEarned}}</text>
      </view>
      <button class="btn-primary" @click="confirmWeight">确认重量无误</button>
    </view>

    <!-- 评价 -->
    <view class="card" v-if="order.status==='completed' && order.weightConfirmed && !order.rating">
      <view class="sec-title">评价回收员</view>
      <view class="stars">
        <text v-for="n in 5" :key="n" class="star" :class="{on:n<=rating}" @click="rating=n">★</text>
      </view>
      <textarea class="comment" v-model="comment" placeholder="写下您的评价..." maxlength="200" />
      <button class="btn-primary" @click="submitRate">提交评价</button>
    </view>

    <view class="card" v-if="order.rating">
      <view class="sec-title">我的评价</view>
      <view class="stars">
        <text v-for="n in 5" :key="n" class="star" :class="{on:n<=order.rating}">★</text>
      </view>
      <view class="comment-text" v-if="order.comment">{{order.comment}}</view>
    </view>

    <!-- 异常 -->
    <view class="card" v-if="order.status==='exception'">
      <view class="sec-title">异常说明</view>
      <view class="exc">{{order.exception?.reason}}</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useStore } from '../../store/index.js'
const store = useStore()
const id = ref(0)
const rating = ref(0)
const comment = ref('')
const order = computed(() => store.orders.find(o => o.id === id.value))
const statusText = (s) => ({pending:'待接单', accepted:'已接单', completed:'已完成', exception:'异常'})[s]

onLoad((q) => { id.value = Number(q.id) })

const confirmWeight = () => {
  const o = store.orders.find(x => x.id === id.value)
  if (o) { o.weightConfirmed = true; store.persist() }
  uni.showToast({ title: '已确认', icon: 'success' })
}
const submitRate = () => {
  if (!rating.value) return uni.showToast({ title: '请评分', icon: 'none' })
  store.rateOrder(id.value, rating.value, comment.value)
  uni.showToast({ title: '评价成功', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.o-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:16rpx; }
.o-no { font-size:24rpx; color:#999; }
.o-body { display:flex; flex-direction:column; gap:12rpx; }
.o-row { display:flex; gap:16rpx; font-size:28rpx; }
.k { color:#888; min-width:160rpx; }
.v { flex:1; }
.green { color:#2E7D32; font-weight:700; }
.sec-title { font-size:32rpx; font-weight:700; margin-bottom:20rpx; }
.confirm-box { background:#E8F5E9; border-radius:16rpx; padding:28rpx; margin-bottom:20rpx; display:flex; flex-direction:column; gap:8rpx; }
.big { font-size:48rpx; font-weight:900; }
.stars { display:flex; gap:12rpx; margin-bottom:20rpx; }
.star { font-size:56rpx; color:#ddd; }
.star.on { color:#FFA726; }
.comment { width:100%; background:#F1F8E9; border-radius:16rpx; padding:20rpx; min-height:160rpx; font-size:28rpx; margin-bottom:20rpx; }
.comment-text { background:#F1F8E9; padding:20rpx; border-radius:12rpx; font-size:28rpx; }
.exc { background:#FFEBEE; color:#C62828; padding:20rpx; border-radius:12rpx; font-size:28rpx; }
</style>
