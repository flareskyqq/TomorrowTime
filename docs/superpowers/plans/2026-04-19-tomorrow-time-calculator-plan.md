# 时间计算器 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一个微信小程序，用户可预设多个明天的时间点，计算从当前时间到所选时间点的时长（小时+分钟）。

**Architecture:** 原生微信小程序，单页面，所有逻辑在 pages/index 内完成，数据存本地 storage，无后端。

**Tech Stack:** 微信小程序原生框架（MINA），WXML/WXSS/JS，wx.setStorage/wx.getStorage

---

## 文件清单

| 文件 | 作用 |
|------|------|
| `TomorrowTime/app.js` | 小程序入口 |
| `TomorrowTime/app.json` | 全局配置（页面路由、窗口样式） |
| `TomorrowTime/app.wxss` | 全局样式（颜色变量） |
| `TomorrowTime/pages/index/index.js` | 页面逻辑（数据、方法、计算） |
| `TomorrowTime/pages/index/index.wxml` | 页面结构 |
| `TomorrowTime/pages/index/index.wxss` | 页面样式 |
| `TomorrowTime/pages/index/index.json` | 页面配置 |

---

## Task 1: 项目脚手架

创建微信小程序基础项目结构。

- [ ] **Step 1: 创建 app.js**

```javascript
App({
  onLaunch() {
    // 小程序启动
  }
})
```

- [ ] **Step 2: 创建 app.json**

```json
{
  "pages": ["pages/index/index"],
  "window": {
    "navigationBarTitleText": "时间计算器",
    "navigationBarBackgroundColor": "#1A73E8",
    "navigationBarTextStyle": "white"
  }
}
```

- [ ] **Step 3: 创建 app.wxss**

```wxss
page {
  --primary: #1A73E8;
  --primary-light: #E8F0FE;
  --text: #202124;
  --border: #DADCE0;
  --bg: #FFFFFF;
}
```

- [ ] **Step 4: 创建 pages/index/index.json**

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "时间计算器"
}
```

- [ ] **Step 5: 创建 pages/index/index.wxml（骨架）**

```xml
<view class="container">
  <text>时间计算器</text>
</view>
```

- [ ] **Step 6: 创建 pages/index/index.wxss（空）**

```wxss
/* page styles */
```

- [ ] **Step 7: 创建 pages/index/index.js（空）**

```javascript
Page({})
```

---

## Task 2: 预设时间列表

实现预设时间列表的显示、选中、空状态。

- [ ] **Step 1: 在 index.js 中定义初始数据**

```javascript
data: {
  presetTimes: [],       // 预设时间数组 [{hour: 8, minute: 30}, ...]
  selectedIndex: -1,      // 选中的索引，-1 表示未选中
  result: null           // 计算结果 {hours, minutes, isPast, targetTime}
}
```

- [ ] **Step 2: 在 onLoad 中从 storage 读取预设时间**

```javascript
onLoad() {
  const saved = wx.getStorageSync('presetTimes')
  if (saved) {
    this.setData({ presetTimes: saved })
  }
}
```

- [ ] **Step 3: 在 index.wxml 中实现列表渲染**

```xml
<view class="preset-list">
  <block wx:for="{{presetTimes}}" wx:key="index">
    <view
      class="preset-item {{selectedIndex === index ? 'selected' : ''}}"
      bindtap="onSelectTime"
      data-index="{{index}}"
    >
      <text>{{item.hour}}:{{item.minute < 10 ? '0' + item.minute : item.minute}}</text>
    </view>
  </block>
  <view wx:if="{{presetTimes.length === 0}}" class="empty-hint">
    暂无预设时间，请点击下方添加
  </view>
</view>
```

- [ ] **Step 4: 在 index.js 中实现 onSelectTime 方法**

```javascript
onSelectTime(e) {
  const index = e.currentTarget.dataset.index
  this.setData({
    selectedIndex: index,
    result: null
  })
}
```

- [ ] **Step 5: 在 index.wxss 中添加列表样式**

```wxss
.preset-list {
  padding: 16px;
  max-height: 300px;
}
.preset-item {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  font-size: 18px;
  color: var(--text);
}
.preset-item.selected {
  background: var(--primary-light);
  border-left: 4px solid var(--primary);
}
.empty-hint {
  text-align: center;
  color: #9AA0A6;
  padding: 32px;
  font-size: 14px;
}
```

- [ ] **Step 6: 提交**

---

## Task 3: 增加时间功能（弹窗 + 滚轮选择器）

实现底部弹窗 + 滚轮选择器 + 添加逻辑。

- [ ] **Step 1: 在 index.wxml 添加增加按钮**

```xml
<view class="add-section">
  <view class="add-btn" bindtap="onAddTime">
    <text>+</text> 添加时间
  </view>
</view>
```

- [ ] **Step 2: 在 index.wxml 添加时间选择弹窗**

```xml
<view wx:if="{{showPicker}}" class="picker-mask" bindtap="onCancelPicker">
  <view class="picker-panel" catchtap="">
    <view class="picker-header">
      <text class="cancel-btn" bindtap="onCancelPicker">取消</text>
      <text class="title">选择时间</text>
      <text class="confirm-btn" bindtap="onConfirmPicker">确定</text>
    </view>
    <picker-view
      class="wheel-picker"
      value="{{pickerValue}}"
      bindchange="onPickerChange"
    >
      <picker-view-column>
        <view wx:for="{{hours}}" wx:key="index" class="picker-item">{{item}}时</view>
      </picker-view-column>
      <picker-view-column>
        <view wx:for="{{minutes}}" wx:key="index" class="picker-item">{{item}}分</view>
      </picker-view-column>
    </picker-view>
  </view>
</view>
```

- [ ] **Step 3: 在 index.js data 中添加选择器相关数据**

```javascript
showPicker: false,
pickerValue: [0, 0],    // [hourIndex, minuteIndex]
hours: Array.from({length: 24}, (_, i) => i),  // [0,1,2,...,23]
minutes: Array.from({length: 60}, (_, i) => i), // [0,1,2,...,59]
```

- [ ] **Step 4: 在 index.js 中实现 onAddTime（打开弹窗）**

```javascript
onAddTime() {
  // 默认值：当前时间顺延1小时
  const now = new Date()
  let defaultHour = now.getHours() + 1
  if (defaultHour >= 24) defaultHour = 0
  const defaultMinute = now.getMinutes()
  this.setData({
    showPicker: true,
    pickerValue: [defaultHour, defaultMinute]
  })
}
```

- [ ] **Step 5: 在 index.js 中实现 onPickerChange**

```javascript
onPickerChange(e) {
  this.setData({ pickerValue: e.detail.value })
}
```

- [ ] **Step 6: 在 index.js 中实现 onConfirmPicker（确认添加）**

```javascript
onConfirmPicker() {
  const [hour, minute] = this.data.pickerValue
  const newTime = { hour, minute }
  const updated = [...this.data.presetTimes, newTime]
  wx.setStorageSync('presetTimes', updated)
  this.setData({
    presetTimes: updated,
    showPicker: false
  })
}
```

- [ ] **Step 7: 在 index.js 中实现 onCancelPicker**

```javascript
onCancelPicker() {
  this.setData({ showPicker: false })
}
```

- [ ] **Step 8: 在 index.wxss 中添加弹窗样式**

```wxss
.add-section {
  padding: 0 16px 16px;
}
.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 16px;
  padding: 12px;
  border: 1px dashed var(--primary);
  border-radius: 8px;
}
.picker-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
}
.picker-panel {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  padding-bottom: env(safe-area-inset-bottom);
}
.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border);
}
.cancel-btn { color: #666; font-size: 16px; }
.confirm-btn { color: var(--primary); font-size: 16px; font-weight: bold; }
.title { font-size: 16px; color: var(--text); }
.wheel-picker {
  height: 200px;
  font-size: 18px;
}
.picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}
```

- [ ] **Step 9: 提交**

---

## Task 4: 删除时间功能

实现左滑删除功能。

- [ ] **Step 1: 在 index.wxml 修改 preset-item 支持左滑**

```xml
<view
  class="preset-item-wrapper {{item.showDelete ? 'show-delete' : ''}}"
  bindtouchstart="onTouchStart"
  bindtouchmove="onTouchMove"
  bindtouchend="onTouchEnd"
  data-index="{{index}}"
>
  <view
    class="preset-item {{selectedIndex === index ? 'selected' : ''}}"
    bindtap="onSelectTime"
    data-index="{{index}}"
  >
    <text>{{item.hour}}:{{item.minute < 10 ? '0' + item.minute : item.minute}}</text>
  </view>
  <view class="delete-btn" bindtap="onDeleteTime" data-index="{{index}}">删除</view>
</view>
```

- [ ] **Step 2: 在 index.js 中实现 touch 滑动逻辑**

```javascript
touchStartX: 0,
onTouchStart(e) {
  this.touchStartX = e.touches[0].clientX
},
onTouchMove(e) {},
onTouchEnd(e) {
  const deltaX = e.changedTouches[0].clientX - this.touchStartX
  if (deltaX < -50) {
    // 左滑，显示删除
    const index = e.currentTarget.dataset.index
    const updated = this.data.presetTimes.map((item, i) =>
      i === index ? { ...item, showDelete: true } : item
    )
    this.setData({ presetTimes: updated })
  } else if (deltaX > 50) {
    // 右滑，隐藏删除
    const index = e.currentTarget.dataset.index
    const updated = this.data.presetTimes.map((item, i) =>
      i === index ? { ...item, showDelete: false } : item
    )
    this.setData({ presetTimes: updated })
  }
},
```

- [ ] **Step 3: 在 index.js 中实现 onDeleteTime**

```javascript
onDeleteTime(e) {
  const index = e.currentTarget.dataset.index
  const updated = this.data.presetTimes.filter((_, i) => i !== index)
  wx.setStorageSync('presetTimes', updated)
  this.setData({
    presetTimes: updated,
    selectedIndex: -1,
    result: null
  })
}
```

- [ ] **Step 4: 在 index.wxss 中添加删除样式**

```wxss
.preset-item-wrapper {
  position: relative;
  overflow: hidden;
}
.preset-item {
  background: white;
  transition: transform 0.2s;
}
.preset-item-wrapper.show-delete .preset-item {
  transform: translateX(-60px);
}
.delete-btn {
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 60px;
  background: #F44336;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
```

- [ ] **Step 5: 提交**

---

## Task 5: 计算功能

实现从当前时间到明天选中时间点的时长计算。

- [ ] **Step 1: 在 index.wxml 添加计算按钮和结果区域**

```xml
<view class="calc-section">
  <button
    class="calc-btn {{selectedIndex === -1 ? 'disabled' : ''}}"
    bindtap="onCalculate"
    disabled="{{selectedIndex === -1}}"
  >计算</button>

  <view wx:if="{{result}}" class="result-card">
    <text class="result-text">{{result.display}}</text>
  </view>
</view>
```

- [ ] **Step 2: 在 index.js 中实现 onCalculate**

```javascript
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
  const display = `距离明天 ${hour}:${minute < 10 ? '0' + minute : minute} ${prefix}${hours} 小时 ${minutes} 分钟`

  this.setData({
    result: { hours, minutes, isPast, targetTime: `${hour}:${minute < 10 ? '0' + minute : minute}`, display }
  })
}
```

- [ ] **Step 3: 在 index.wxss 中添加计算区域样式**

```wxss
.calc-section {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.calc-btn {
  width: 80%;
  background: var(--primary);
  color: white;
  border-radius: 24px;
  font-size: 16px;
  padding: 12px;
  border: none;
}
.calc-btn.disabled {
  background: #DADCE0;
  color: #9AA0A6;
}
.result-card {
  width: 90%;
  background: var(--primary-light);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}
.result-text {
  font-size: 18px;
  color: var(--text);
  line-height: 1.6;
}
```

- [ ] **Step 4: 提交**

---

## Task 6: 样式美化 + 细节完善

完善整体样式，调整间距、字体、交互细节。

- [ ] **Step 1: 更新 app.wxss 全局样式**

```wxss
page {
  --primary: #1A73E8;
  --primary-light: #E8F0FE;
  --text: #202124;
  --border: #DADCE0;
  --bg: #FFFFFF;
  background: #F5F5F5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

- [ ] **Step 2: 在 index.wxml 外层添加 container 包裹**

```xml
<view class="page">
  <view class="container">
    <!-- 内容 -->
  </view>
</view>
```

- [ ] **Step 3: 更新 index.wxss**

```wxss
.page {
  min-height: 100vh;
  background: #F5F5F5;
}
.container {
  background: white;
  margin: 0;
  padding: 0;
}
```

- [ ] **Step 4: 提交**

---

## Task 7: 微信开发者工具验证

在微信开发者工具中打开项目，验证所有功能正常。

- [ ] **Step 1: 在项目根目录创建 README.md 说明如何运行**

```markdown
# 时间计算器

微信小程序，克隆后用微信开发者工具打开本目录即可运行。

## 功能
- 预设多个明天的时间点
- 滚轮式选择器添加时间
- 左滑删除时间
- 计算从当前时间到明天所选时间点的时长
```

- [ ] **Step 2: 提交**

---

## 自检清单

- [ ] Spec 中每项功能都有对应 task 实现
- [ ] 无 placeholder / TODO
- [ ] 计算逻辑覆盖跨天、跨月情况
- [ ] storage 读写 key 统一为 `presetTimes`
- [ ] 颜色变量统一使用 CSS Variables
