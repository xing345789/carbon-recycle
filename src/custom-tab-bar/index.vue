<template>
  <view class="tabbar">
    <view v-for="item in tabs" :key="item.pagePath" class="tab-item" :class="{active: current===item.pagePath}" @click="switchTo(item.pagePath)">
      <text class="ico">{{item.ico}}</text>
      <text class="txt">{{item.text}}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return { current: '' }
  },
  created() {
    this.updateCurrent()
  },
  pageLifetimes: {
    show() { this.updateCurrent() }
  },
  methods: {
    updateCurrent() {
      const pages = getCurrentPages()
      if (pages.length) {
        const p = pages[pages.length - 1]
        this.current = '/' + p.route
      }
    },
    switchTo(url) {
      uni.switchTab({ url })
    }
  },
  computed: {
    role() {
      try {
        const u = uni.getStorageSync('cr_current_user')
        return u ? JSON.parse(u).role : 'student'
      } catch(e) { return 'student' }
    },
    tabs() {
      if (this.role === 'recycler') {
        return [
          { pagePath: '/pages/recycler/home', text: '接单', ico: '📋' },
          { pagePath: '/pages/recycler/tasks', text: '任务', ico: '🚚' },
          { pagePath: '/pages/recycler/profile', text: '我的', ico: '👤' }
        ]
      }
      if (this.role === 'admin') {
        return [
          { pagePath: '/pages/admin/home', text: '后台', ico: '📊' },
          { pagePath: '/pages/admin/orders', text: '订单', ico: '📋' },
          { pagePath: '/pages/admin/users', text: '用户', ico: '👥' }
        ]
      }
      return [
        { pagePath: '/pages/student/home', text: '首页', ico: '🏠' },
        { pagePath: '/pages/student/booking', text: '预约', ico: '📦' },
        { pagePath: '/pages/student/orders', text: '订单', ico: '📋' },
        { pagePath: '/pages/student/profile', text: '我的', ico: '👤' }
      ]
    }
  },
  methods: {
    switchTo(url) {
      uni.switchTab({ url })
    }
  }
}
</script>

<style lang="scss" scoped>
.tabbar { position: fixed; bottom: 0; left: 0; right: 0; height: 110rpx; background: #fff; display: flex; box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.06); padding-bottom: env(safe-area-inset-bottom); z-index: 999; }
.tab-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4rpx; }
.ico { font-size: 40rpx; }
.txt { font-size: 22rpx; color: #999; }
.tab-item.active .txt { color: #2E7D32; font-weight: 700; }
</style>
