<template>
  <view class="page">
    <view class="card">
      <view class="sec-title">积分商品管理</view>
      <view v-for="p in products" :key="p.id" class="goods-row">
        <view class="g-info">
          <text class="g-name">{{p.name}}</text>
          <text class="g-desc">{{p.desc}} · 库存 {{p.stock}}</text>
        </view>
        <view class="g-right">
          <text class="g-pts">{{p.pointsCost}} 积分</text>
          <button class="del" @click="del(p.id)">删除</button>
        </view>
      </view>

      <view class="add-form">
        <view class="sec-title" style="margin-top:20rpx;">新增商品</view>
        <input class="ipt" v-model="newP.name" placeholder="商品名称" />
        <input class="ipt" v-model="newP.desc" placeholder="商品描述" />
        <input class="ipt" type="number" v-model="newP.pointsCost" placeholder="所需积分" />
        <input class="ipt" type="number" v-model="newP.stock" placeholder="库存" />
        <button class="btn-primary" @click="add">添加商品</button>
      </view>
    </view>

    <view class="card">
      <view class="sec-title">低碳活动</view>
      <view v-for="a in activities" :key="a.id" class="act">
        <view class="act-info">
          <text class="act-title">{{a.title}}</text>
          <text class="act-desc">{{a.content}}</text>
        </view>
        <switch :checked="a.active" color="#2E7D32" @change="e=>toggleAct(a.id, e.detail.value)" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useStore } from '../../store/index.js'
const store = useStore()
const products = computed(() => store.products)
const activities = computed(() => store.activities)
const newP = reactive({ name:'', desc:'', pointsCost:0, stock:0, type:'item' })

const add = () => {
  if (!newP.name) return uni.showToast({ title:'请填写名称', icon:'none' })
  store.addProduct({
    name: newP.name, desc: newP.desc || '',
    pointsCost: Number(newP.pointsCost) || 0,
    stock: Number(newP.stock) || 0, type: 'item'
  })
  newP.name = ''; newP.desc = ''; newP.pointsCost = 0; newP.stock = 0
  uni.showToast({ title:'已添加', icon:'success' })
}
const del = (id) => {
  uni.showModal({ title:'删除', content:'确认删除该商品？', success:r => { if(r.confirm) store.deleteProduct(id) } })
}
const toggleAct = (id, val) => {
  const a = store.activities.find(x => x.id === id)
  if (a) { a.active = val; store.persist() }
}
</script>

<style lang="scss" scoped>
.sec-title { font-size:32rpx; font-weight:700; margin-bottom:20rpx; }
.goods-row { display:flex; justify-content:space-between; align-items:center; padding:20rpx 0; border-bottom:2rpx solid #f0f0f0; }
.g-info { flex:1; display:flex; flex-direction:column; gap:6rpx; }
.g-name { font-size:28rpx; font-weight:600; }
.g-desc { font-size:24rpx; color:#999; }
.g-right { display:flex; flex-direction:column; align-items:flex-end; gap:10rpx; }
.g-pts { color:#E65100; font-weight:700; font-size:26rpx; }
.del { background:#FFEBEE; color:#C62828; border-radius:10rpx; font-size:22rpx; padding:8rpx 20rpx; margin:0; }
.del::after { border:none; }
.add-form { margin-top:20rpx; }
.ipt { background:#F1F8E9; border-radius:12rpx; padding:18rpx 20rpx; font-size:28rpx; margin-bottom:16rpx; }
.btn-primary { margin-top:10rpx; }
.act { display:flex; justify-content:space-between; align-items:center; padding:20rpx 0; border-bottom:2rpx solid #f0f0f0; }
.act:last-child { border-bottom:none; }
.act-info { flex:1; display:flex; flex-direction:column; gap:6rpx; }
.act-title { font-size:28rpx; font-weight:600; }
.act-desc { font-size:24rpx; color:#999; }
</style>
