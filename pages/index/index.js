Page({
  data: {},
  // 获取头像
  onChooseAvatar(e) {
    console.info(e)
  },
  // 地图选址
  chooseLocation() {
    const that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    });
  },
})