// 本地存储封装
export const storage = {
  get(key, def = null) {
    try {
      const v = uni.getStorageSync(key)
      return v === '' || v === null || v === undefined ? def : JSON.parse(v)
    } catch (e) { return def }
  },
  set(key, val) {
    uni.setStorageSync(key, JSON.stringify(val))
  },
  remove(key) { uni.removeStorageSync(key) }
}

export const KEYS = {
  USERS: 'cr_users',
  CURRENT: 'cr_current_user',
  ORDERS: 'cr_orders',
  PRODUCTS: 'cr_products',
  RULES: 'cr_points_rules',
  ACTIVITIES: 'cr_activities',
  RECORDS: 'cr_points_records',
  EXCHANGES: 'cr_exchanges'
}
