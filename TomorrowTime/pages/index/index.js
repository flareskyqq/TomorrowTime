Page({
  data: {
    presetTimes: [],       // 预设时间数组 [{hour: 8, minute: 30}, ...]
    selectedIndex: -1,      // 选中的索引，-1 表示未选中
    result: null,            // 计算结果
    showPicker: false,
    pickerValue: [0, 0],    // [hourIndex, minuteIndex]
    hours: Array.from({length: 24}, (_, i) => i),  // [0,1,2,...,23]
    minutes: Array.from({length: 60}, (_, i) => i), // [0,1,2,...,59]
    touchStartX: 0
  },

  onLoad() {
    const saved = wx.getStorageSync('presetTimes')
    if (saved) {
      // 确保加载时也排序
      const sorted = saved.sort((a, b) => {
        if (a.hour !== b.hour) return a.hour - b.hour
        return a.minute - b.minute
      })
      this.setData({ presetTimes: sorted })
    }
  },

  onSelectTime(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      selectedIndex: index,
      result: null
    })
  },

  onAddTime() {
    const now = new Date()
    let defaultHour = now.getHours() + 1
    if (defaultHour >= 24) defaultHour = 0
    const defaultMinute = now.getMinutes()
    this.setData({
      showPicker: true,
      pickerValue: [defaultHour, defaultMinute]
    })
  },

  onPickerChange(e) {
    this.setData({ pickerValue: e.detail.value })
  },

  onConfirmPicker() {
    const [hour, minute] = this.data.pickerValue
    const newTime = { hour, minute }
    const updated = [...this.data.presetTimes, newTime].sort((a, b) => {
      if (a.hour !== b.hour) return a.hour - b.hour
      return a.minute - b.minute
    })
    wx.setStorageSync('presetTimes', updated)
    this.setData({
      presetTimes: updated,
      showPicker: false
    })
  },

  onCancelPicker() {
    this.setData({ showPicker: false })
  },

  onTouchStart(e) {
    this.touchStartX = e.touches[0].clientX
  },
  onTouchEnd(e) {
    const deltaX = e.changedTouches[0].clientX - this.touchStartX
    if (deltaX < -50) {
      const index = e.currentTarget.dataset.index
      const updated = this.data.presetTimes.map((item, i) =>
        i === index ? { ...item, showDelete: true } : { ...item, showDelete: false }
      )
      this.setData({ presetTimes: updated })
    } else if (deltaX > 50) {
      const updated = this.data.presetTimes.map(item => ({ ...item, showDelete: false }))
      this.setData({ presetTimes: updated })
    }
  },
  onDeleteTime(e) {
    const index = e.currentTarget.dataset.index
    const updated = this.data.presetTimes.filter((_, i) => i !== index)
    wx.setStorageSync('presetTimes', updated)
    this.setData({
      presetTimes: updated,
      selectedIndex: -1,
      result: null
    })
  },

  onCalculate() {
    if (this.data.selectedIndex === -1) return
    const { hour, minute } = this.data.presetTimes[this.data.selectedIndex]
    const now = new Date()

    // 目标时间：明天的 hour:minute
    const target = new Date(now)
    target.setDate(target.getDate() + 1)
    target.setHours(hour, minute, 0, 0)

    let diffMs = target - now
    let isPast = false
    if (diffMs < 0) {
      isPast = true
      diffMs = Math.abs(diffMs)
    }

    const totalMinutes = Math.floor(diffMs / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    const prefix = isPast ? '已过 ' : '还剩 '
    const display = `距离明天 ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute} ${prefix}${hours} 小时 ${minutes} 分钟`

    this.setData({
      result: { hours, minutes, isPast, targetTime: `${hour}:${minute < 10 ? '0' + minute : minute}`, display }
    })
  }
})