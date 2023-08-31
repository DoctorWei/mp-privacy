const app = getApp()

// 监听属性，并执行监听函数
const observer = function (data, key, val, fn) {
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      return val
    },
    set: function (newVal) {
      if (newVal === val) return
      fn && fn(newVal)
      val = newVal
    },
  })
}

// 设置监听器
const watch = function (ctx, obj) {
  Object.keys(obj).forEach(key => {
    observer(ctx, key, ctx[key], function (value) {
      obj[key].call(ctx, value)
    })
  })
}

Component({
  data: {
    show: false,
    name: ""
  },
  pageLifetimes: {
    hide() {
      app.globalData.showPrivacy = false
    },
    show() {
      const _ = this
      // 调用监听器，监听app.globalData.showPrivacy数据变化
      watch(app.globalData, {
        showPrivacy: function (newVal) {
          if (newVal && wx.getPrivacySetting) {
            wx.getPrivacySetting({
              success(res) {
                if (res.errMsg == "getPrivacySetting:ok") {
                  _.setData({
                    name: res.privacyContractName,
                    show: res.needAuthorization
                  })
                } else {
                  console.info(res)
                }
              }
            })
          } else {
            _.setData({
              show: false,
            })
          }
        }
      })
    }
  },
  methods: {
    openContract() {
      wx.openPrivacyContract()
    },
    disagreePrivacy() {
      app.globalData.showPrivacy = false
      // 用户点击拒绝后，开发者调用 resolve({ event:'disagree' }) 告知平台用户已经拒绝
      app.globalData.resolvePrivacyAuthorization({
        event: 'disagree'
      })
    },
    agreePrivacy() {
      // 用户点击同意后，开发者调用 resolve({ buttonId: 'agree-btn', event: 'agree' })  告知平台用户已经同意，参数传同意按钮的id。为确保用户有同意的操作，基础库在 resolve 被调用后，会去检查对应的同意按钮有没有被点击过。检查通过后，相关隐私接口会继续调用
      app.globalData.resolvePrivacyAuthorization({
        buttonId: 'agree-btn',
        event: 'agree'
      })
      app.globalData.showPrivacy = false
    },
    hideModal() {
      app.globalData.showPrivacy = false
    },
    catchtap() {}
  }
})