// components/area-header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:'默认标题'
    },
    showRight:{
      type:Boolean,
      value:true
    },
    rightText:{
      type:"String",
      value:"更多"
    }
    // isShow:{
    //   type:Boolean,
    //   value:false
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleRightClick:function(){
      // 发出click自定义事件
      this.triggerEvent("click")
    }
  }
})
