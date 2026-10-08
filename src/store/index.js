import { defineStore } from 'pinia'
import { storage, KEYS } from '../utils/storage.js'
import { DEFAULT_USERS, DEFAULT_RULES, DEFAULT_PRODUCTS, DEFAULT_ACTIVITIES, genOrderNo, now } from '../utils/mock.js'

export const useStore = defineStore('main', {
  state: () => ({
    users: [],
    currentUser: null,
    orders: [],
    products: [],
    rules: [],
    activities: [],
    records: [],
    exchanges: []
  }),
  getters: {
    students: s => s.users.filter(u => u.role === 'student'),
    recyclers: s => s.users.filter(u => u.role === 'recycler'),
    pendingOrders: s => s.orders.filter(o => o.status === 'pending'),
    myOrders: (s) => (userId) => s.orders.filter(o => o.userId === userId),
    myTasks: (s) => (rId) => s.orders.filter(o => o.recyclerId === rId)
  },
  actions: {
    init() {
      this.users = storage.get(KEYS.USERS, DEFAULT_USERS)
      // 兼容旧缓存：回收员手机号去掉 'r' 前缀
      let usersChanged = false
      this.users.forEach(u => {
        if (u.role === 'recycler' && u.phone && u.phone.startsWith('r')) {
          u.phone = u.phone.slice(1)
          usersChanged = true
        }
      })
      if (usersChanged) storage.set(KEYS.USERS, this.users)
      this.orders = storage.get(KEYS.ORDERS, [])
      // 过滤掉已废弃的商品（食堂/单车/图书馆/笔记本），兼容旧缓存数据
      const cachedProducts = storage.get(KEYS.PRODUCTS, DEFAULT_PRODUCTS)
      const deprecated = ['食堂', '单车', '图书馆', '笔记本']
      const filtered = cachedProducts.filter(p => !deprecated.some(k => (p.name || '').includes(k)))
      // 补全缺失的默认商品（如新上线的"1学分兑换"）
      const existingNames = new Set(filtered.map(p => p.name))
      DEFAULT_PRODUCTS.forEach(dp => {
        if (!existingNames.has(dp.name)) filtered.push(dp)
      })
      this.products = filtered
      this.rules = storage.get(KEYS.RULES, DEFAULT_RULES)
      // 活动按月动态生成，直接使用默认活动（确保名称随当前月份更新）
      const cachedActivities = storage.get(KEYS.ACTIVITIES, DEFAULT_ACTIVITIES)
      this.activities = DEFAULT_ACTIVITIES.map((def, i) => {
        const cached = cachedActivities[i]
        return cached ? { ...def, active: cached.active } : def
      })
      this.records = storage.get(KEYS.RECORDS, [])
      this.exchanges = storage.get(KEYS.EXCHANGES, [])
      this.currentUser = storage.get(KEYS.CURRENT, null)
      // 兼容旧缓存：currentUser 手机号也去掉 'r' 前缀
      if (this.currentUser && this.currentUser.role === 'recycler' && this.currentUser.phone && this.currentUser.phone.startsWith('r')) {
        this.currentUser.phone = this.currentUser.phone.slice(1)
        storage.set(KEYS.CURRENT, this.currentUser)
      }
      // 将清理/更新后的商品与活动写回缓存
      storage.set(KEYS.PRODUCTS, this.products)
      storage.set(KEYS.ACTIVITIES, this.activities)
    },
    persist() {
      storage.set(KEYS.USERS, this.users)
      storage.set(KEYS.ORDERS, this.orders)
      storage.set(KEYS.PRODUCTS, this.products)
      storage.set(KEYS.RULES, this.rules)
      storage.set(KEYS.ACTIVITIES, this.activities)
      storage.set(KEYS.RECORDS, this.records)
      storage.set(KEYS.EXCHANGES, this.exchanges)
      if (this.currentUser) storage.set(KEYS.CURRENT, this.currentUser)
      else storage.remove(KEYS.CURRENT)
    },
    // 注册
    register(user) {
      const u = { id: Date.now(), points: 0, createdAt: now(), ...user }
      this.users.push(u)
      this.persist()
      return u
    },
    // 登录
    login(phone) {
      // 管理员/回收员用手机号匹配，学生用手机号匹配
      let u = this.users.find(x => x.phone === phone)
      if (u) {
        this.currentUser = u
        this.persist()
        return u
      }
      return null
    },
    logout() {
      this.currentUser = null
      this.persist()
    },
    updateCurrent(patch) {
      Object.assign(this.currentUser, patch)
      const idx = this.users.findIndex(u => u.id === this.currentUser.id)
      if (idx >= 0) this.users[idx] = this.currentUser
      this.persist()
    },
    // 提交预约
    createOrder(data) {
      const order = {
        id: Date.now(),
        orderNo: genOrderNo(),
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        phone: this.currentUser.phone,
        studentId: this.currentUser.studentId || '',
        building: this.currentUser.building,
        room: this.currentUser.room,
        types: data.types,
        weight: data.weight,
        appointmentTime: data.appointmentTime,
        status: 'pending',
        recyclerId: null,
        recyclerName: '',
        actualWeight: 0,
        categoryResult: [],
        pointsEarned: 0,
        rating: 0,
        comment: '',
        exception: null,
        createdAt: now(),
        acceptedAt: '',
        completedAt: ''
      }
      this.orders.unshift(order)
      this.persist()
      return order
    },
    // 接单
    acceptOrder(orderId) {
      const o = this.orders.find(x => x.id === orderId)
      if (!o || o.status !== 'pending') return false
      o.status = 'accepted'
      o.recyclerId = this.currentUser.id
      o.recyclerName = this.currentUser.name
      o.acceptedAt = now()
      this.persist()
      return true
    },
    // 称重完成
    completeOrder(orderId, actualWeight, categoryResult) {
      const o = this.orders.find(x => x.id === orderId)
      if (!o) return false
      o.actualWeight = actualWeight
      o.categoryResult = categoryResult
      // 按类型平均积分系数计算
      let points = 0
      categoryResult.forEach(c => {
        const rule = this.rules.find(r => r.type === c.type)
        if (rule) points += rule.pointsPerKg * c.weight
      })
      // 双倍积分活动
      const active = this.activities.find(a => a.active && a.title.includes('双倍'))
      if (active) points *= 2
      o.pointsEarned = Math.round(points)
      o.status = 'completed'
      o.completedAt = now()
      // 给用户加积分
      const student = this.users.find(u => u.id === o.userId)
      if (student) {
        student.points += o.pointsEarned
        if (this.currentUser && this.currentUser.id === student.id) this.currentUser.points = student.points
      }
      // 积分流水
      this.records.unshift({
        id: Date.now(),
        userId: o.userId,
        orderId: o.id,
        change: o.pointsEarned,
        type: '回收获得',
        balance: student ? student.points : o.pointsEarned,
        time: now()
      })
      this.persist()
      return true
    },
    // 异常上报
    reportException(orderId, reason) {
      const o = this.orders.find(x => x.id === orderId)
      if (!o) return false
      o.status = 'exception'
      o.exception = { reason, time: now() }
      this.persist()
      return true
    },
    // 管理员处理异常
    resolveException(orderId, action) {
      const o = this.orders.find(x => x.id === orderId)
      if (!o) return false
      if (action === 'complete') { o.status = 'completed'; o.completedAt = now() }
      else if (action === 'cancel') { o.status = 'pending' }
      o.exception = null
      this.persist()
      return true
    },
    // 评价
    rateOrder(orderId, rating, comment) {
      const o = this.orders.find(x => x.id === orderId)
      if (!o) return false
      o.rating = rating
      o.comment = comment
      this.persist()
      return true
    },
    // 积分兑换
    exchange(productId) {
      const p = this.products.find(x => x.id === productId)
      const u = this.currentUser
      if (!p || p.stock <= 0) return { ok: false, msg: '库存不足' }
      if (u.points < p.pointsCost) return { ok: false, msg: '积分不足' }
      u.points -= p.pointsCost
      p.stock -= 1
      const idx = this.users.findIndex(x => x.id === u.id)
      if (idx >= 0) this.users[idx].points = u.points
      this.exchanges.unshift({
        id: Date.now(), userId: u.id, productId, productName: p.name,
        pointsCost: p.pointsCost, time: now()
      })
      this.records.unshift({
        id: Date.now()+1, userId: u.id, change: -p.pointsCost,
        type: `兑换：${p.name}`, balance: u.points, time: now()
      })
      this.persist()
      return { ok: true }
    },
    // 保存积分规则
    saveRules(rules) {
      this.rules = rules
      this.persist()
    },
    // 商品管理
    addProduct(p) { this.products.push({ id: Date.now(), ...p }); this.persist() },
    updateProduct(id, patch) {
      const p = this.products.find(x => x.id === id)
      if (p) { Object.assign(p, patch); this.persist() }
    },
    deleteProduct(id) {
      this.products = this.products.filter(x => x.id !== id)
      this.persist()
    },
    // 删除用户
    deleteUser(id) {
      this.users = this.users.filter(u => u.id !== id)
      this.persist()
    },
    // 统计
    statsByType() {
      const map = {}
      this.orders.filter(o => o.status === 'completed').forEach(o => {
        o.categoryResult.forEach(c => {
          map[c.type] = (map[c.type] || 0) + c.weight
        })
      })
      return this.rules.map(r => ({ type: r.type, weight: +(map[r.type] || 0).toFixed(2) }))
    },
    totalCarbon() {
      let c = 0
      this.orders.filter(o => o.status === 'completed').forEach(o => {
        o.categoryResult.forEach(cr => {
          const rule = this.rules.find(r => r.type === cr.type)
          if (rule) c += rule.carbonPerKg * cr.weight
        })
      })
      return +c.toFixed(2)
    }
  }
})
