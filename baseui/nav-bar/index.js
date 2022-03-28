// baseui/nav-bar/index.js
const globalData = getApp().globalData

Component({
  /**
   * 组件的属性列表
   */
  options:{
    
    // 允许存在多个插槽
    multipleSlots:true
  },
  properties: {
    title:{
      type:String,
      value:"默认标题"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight:globalData.statusBarHeight,
    navBarHeight:globalData.navBarHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleLeftClick:function(){
      // 这里发出事件时因为nav组件的left是插槽，不同人使用时功能可能会不同，
      // 所以不在此处直接做返回，而是发出点击事件
      this.triggerEvent('click')
    }
  }
})
