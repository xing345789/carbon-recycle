<template>
  <view class="login-wrap">
    <view class="bg-deco"></view>
    <view class="brand">
      <view class="logo">碳</view>
      <text class="title">碳索者</text>
      <text class="sub">校园回收 · 碳积分激励平台</text>
    </view>

    <view class="panel">
      <view class="tabs">
        <view :class="['tab', mode==='login' && 'on']" @click="mode='login'">登录</view>
        <view :class="['tab', mode==='register' && 'on']" @click="mode='register'">学生注册</view>
      </view>

      <view class="field">
        <text class="label">手机号</text>
        <input class="ipt" v-model="phone" placeholder="请输入手机号" maxlength="11" />
      </view>

      <view class="field">
        <text class="label">验证码</text>
        <view class="row">
          <input class="ipt flex" v-model="code" placeholder="验证码 1234" maxlength="6" />
          <view class="code-btn" @click="sendCode">{{cd>0? cd+'s' : '获取验证码'}}</view>
        </view>
      </view>

      <block v-if="mode==='register'">
        <view class="field">
          <text class="label">姓名</text>
          <input class="ipt" v-model="name" placeholder="真实姓名" />
        </view>
        <view class="field">
          <text class="label">学号</text>
          <input class="ipt" v-model="studentId" placeholder="11位学号" maxlength="11" />
        </view>
        <view class="field">
          <text class="label">学院</text>
          <picker :range="colleges" @change="e=>college=colleges[e.detail.value]">
            <view class="ipt picker">{{college || '选择学院'}}</view>
          </picker>
        </view>
        <view class="field">
          <text class="label">宿舍楼</text>
          <view class="bldgs">
            <view v-for="b in buildings" :key="b" :class="['bldg', building===b && 'on']" @click="building=b">{{b}}</view>
          </view>
        </view>
        <view class="field">
          <text class="label">宿舍号</text>
          <input class="ipt" v-model="room" placeholder="如 501" />
        </view>
      </block>

      <button class="btn-primary submit" @click="submit">{{mode==='login'?'登 录':'注 册 并 登 录'}}</button>

      <view class="quick">
        <text class="q-item" @click="quick('admin')">管理员入口</text>
        <text class="q-item" @click="quick('recycler')">回收员入口</text>
      </view>
      <view class="hint">演示账号：管理员 admin / 回收员 13800000001 / 验证码 1234</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from '../../store/index.js'
import { BUILDINGS, COLLEGES } from '../../utils/mock.js'

const store = useStore()
const mode = ref('login')
const phone = ref('')
const code = ref('')
const cd = ref(0)
const name = ref('')
const studentId = ref('')
const college = ref('')
const building = ref('')
const room = ref('')
const buildings = BUILDINGS
const colleges = COLLEGES

const sendCode = () => {
  if (cd.value > 0) return
  if (!/^1\d{10}$/.test(phone.value) && phone.value !== 'admin') {
    uni.showToast({ title: '请输入正确手机号', icon: 'none' })
    return
  }
  cd.value = 60
  const t = setInterval(() => { cd.value--; if (cd.value <= 0) clearInterval(t) }, 1000)
  uni.showToast({ title: '验证码已发送：1234', icon: 'none' })
}

const quick = (role) => {
  phone.value = role === 'admin' ? 'admin' : '13800000001'
  code.value = '1234'
  mode.value = 'login'
  submit()
}

const submit = () => {
  if (!phone.value) return uni.showToast({ title: '请输入手机号', icon: 'none' })
  if (code.value !== '1234') return uni.showToast({ title: '验证码错误（1234）', icon: 'none' })

  if (mode.value === 'login') {
    const u = store.login(phone.value)
    if (!u) return uni.showToast({ title: '用户不存在，请先注册', icon: 'none' })
    goHome(u.role)
  } else {
    if (!name.value || !studentId.value || studentId.value.length !== 11 || !college.value || !building.value || !room.value)
      return uni.showToast({ title: '请完整填写实名信息', icon: 'none' })
    if (store.users.find(u => u.phone === phone.value))
      return uni.showToast({ title: '该手机号已注册', icon: 'none' })
    const u = store.register({
      role: 'student', phone: phone.value, name: name.value,
      studentId: studentId.value, college: college.value,
      building: building.value, room: room.value
    })
    store.currentUser = u
    store.persist()
    goHome('student')
  }
}

const goHome = (role) => {
  const url = role === 'student' ? '/pages/student/home' :
              role === 'recycler' ? '/pages/recycler/home' : '/pages/admin/home'
  uni.reLaunch({ url })
}
</script>

<style lang="scss" scoped>
.login-wrap { min-height: 100vh; background: linear-gradient(180deg, #43A047, #2E7D32 40%, #F1F8E9 40%); padding: 0; position: relative; }
.bg-deco { position: absolute; top: -120rpx; right: -120rpx; width: 400rpx; height: 400rpx; background: rgba(255,255,255,0.1); border-radius: 50%; }
.brand { text-align: center; padding: 100rpx 0 60rpx; color: #fff; }
.logo { width: 140rpx; height: 140rpx; line-height: 140rpx; background: #fff; color: #2E7D32; border-radius: 36rpx; font-size: 80rpx; font-weight: 900; margin: 0 auto 20rpx; }
.title { display: block; font-size: 52rpx; font-weight: 800; letter-spacing: 8rpx; }
.sub { display: block; font-size: 26rpx; opacity: 0.9; margin-top: 10rpx; }
.panel { margin: 0 32rpx; background: #fff; border-radius: 32rpx; padding: 40rpx 32rpx; box-shadow: 0 20rpx 60rpx rgba(0,0,0,0.1); }
.tabs { display: flex; gap: 40rpx; margin-bottom: 30rpx; }
.tab { font-size: 32rpx; color: #999; padding-bottom: 12rpx; position: relative; }
.tab.on { color: #2E7D32; font-weight: 700; }
.tab.on::after { content:''; position:absolute; bottom:0; left:0; right:0; height:6rpx; background:#2E7D32; border-radius:3rpx; }
.field { margin-bottom: 28rpx; }
.label { display:block; font-size: 26rpx; color: #555; margin-bottom: 12rpx; }
.ipt { width:100%; background:#F1F8E9; border-radius:16rpx; padding:22rpx 24rpx; font-size:30rpx; border:2rpx solid transparent; }
.ipt:focus { border-color:#43A047; }
.row { display:flex; gap:16rpx; align-items:center; }
.flex { flex:1; }
.code-btn { background:#E8F5E9; color:#2E7D32; padding:22rpx 24rpx; border-radius:16rpx; font-size:26rpx; white-space:nowrap; }
.bldgs { display:flex; flex-wrap:wrap; gap:16rpx; }
.bldg { padding:16rpx 28rpx; background:#F1F8E9; border-radius:12rpx; font-size:28rpx; }
.bldg.on { background:#2E7D32; color:#fff; }
.picker { color:#333; }
.submit { margin-top:20rpx; }
.quick { display:flex; justify-content:space-between; margin-top:30rpx; }
.q-item { font-size:26rpx; color:#43A047; }
.hint { text-align:center; font-size:22rpx; color:#aaa; margin-top:20rpx; }
</style>
