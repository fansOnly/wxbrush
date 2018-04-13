//logs.js

let App = getApp()
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSyncync('logs') || []).map(function (log) {
        return App.Tools.formatTime(new Date(log))
      })
    })
  }
})
