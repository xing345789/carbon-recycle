<script>
import { useStore } from './store/index.js'
export default {
  onLaunch() {
    const store = useStore()
    store.init()
    const cu = store.currentUser
    if (cu && cu.role) {
      const page = cu.role === 'student' ? '/pages/student/home' :
                   cu.role === 'recycler' ? '/pages/recycler/home' : '/pages/admin/home'
      uni.reLaunch({ url: page })
    } else {
      uni.reLaunch({ url: '/pages/login/login' })
    }
  }
}
</script>

<style lang="scss">
@import './uni.scss';
page {
  background-color: #F1F8E9;
  font-size: 30rpx;
  color: #1B3A1B;
  font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
}
.page { padding-bottom: 140rpx; }
view, text, button { box-sizing: border-box; }
</style>
