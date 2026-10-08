// 模拟初始数据
export const BUILDINGS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6-A', 'H6-B']
export const COLLEGES = ['智能学院', '航空学院', '软通学院', '汽轨学院', '能源学院', '国教学院', '经管学院', '机械学院', '艺术学院']
export const TYPES = ['纸箱', '塑料瓶', '书本', '旧衣服', '其他']

export const DEFAULT_RULES = [
  { type: '纸箱', pointsPerKg: 1, carbonPerKg: 1.5 },
  { type: '塑料瓶', pointsPerKg: 1, carbonPerKg: 0.8 },
  { type: '书本', pointsPerKg: 1, carbonPerKg: 2.0 },
  { type: '旧衣服', pointsPerKg: 1, carbonPerKg: 0.6 },
  { type: '其他', pointsPerKg: 1, carbonPerKg: 0.3 }
]

export const DEFAULT_PRODUCTS = [
  { id: 1, name: '环保布袋', pointsCost: 10, stock: 100, type: 'item', desc: '可循环使用购物袋' },
  { id: 2, name: '多肉盆栽', pointsCost: 30, stock: 50, type: 'item', desc: '桌面绿植' },
  { id: 3, name: '1学分兑换', pointsCost: 20, stock: 999, type: 'right', desc: '20积分兑换1个实践学分' }
]

export const DEFAULT_USERS = [
  { id: 1, role: 'admin', phone: 'admin', name: '系统管理员', points: 0, createdAt: '2026-01-01' },
  { id: 2, role: 'recycler', phone: '13800000001', name: '王回收', points: 0, createdAt: '2026-01-01' },
  { id: 3, role: 'recycler', phone: '13800000002', name: '李回收', points: 0, createdAt: '2026-01-01' }
]

// 根据当前月份动态生成活动
const CN_MONTHS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
const currentMonth = new Date().getMonth()
const cnMonth = CN_MONTHS[currentMonth]
export const DEFAULT_ACTIVITIES = [
  { id: 1, title: `绿色${cnMonth}月·回收双倍积分`, content: `${currentMonth + 1}月期间所有回收积分翻倍`, active: true }
]

// 生成订单号
export function genOrderNo() {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return 'CR' + d.getFullYear() + pad(d.getMonth()+1) + pad(d.getDate()) +
    pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds()) +
    String(Math.floor(Math.random()*1000)).padStart(3,'0')
}

export function now() { return new Date().toLocaleString('zh-CN') }
