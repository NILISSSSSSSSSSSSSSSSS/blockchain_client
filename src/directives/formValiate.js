import Vue from 'vue'

const IP_REGEX = '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.' +
'(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
'(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
'(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$'

// 注册一个全局自定义指令 `v-checkParam`
export const checkParam = Vue.directive('checkParam', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding, vNode) {

    el = el.getElementsByTagName('input')[0];
    function valiate() {
      let flag = false;
      let isRequired = binding.value.required
      if (isRequired) {
        if (el.value) {
          let regex = binding.value.regex;
          if(regex){
            if (el.value.match(regex)) {
              flag = true
            }else{
              flag = false
            }
          }else{
            flag = false
          }
        }else{
          flag = false
        }
      }else{
        falg = true
      }
      // 判断正则
      console.log(flag);

      if(flag){
        if(newNode){
          newNode.innerHTML = "<span class='el-input__suffix-inner'><i class='el-input__icon el-icon-success'></i></span>"
        }else{
          var newNode = document.createElement('span');
          newNode.className = 'el-input__suffix';
          newNode.innerHTML = "<span class='el-input__suffix-inner'><i class='el-input__icon el-icon-success'></i></span>"
          el.parentNode.insertBefore(newNode, el.nextSibling);
        }
      }else{
        if(newNode){
          newNode.innerHTML = "<span class='el-input__suffix-inner'><i class='el-input__icon el-icon-error'></i></span>"
        }else{
          var newNode = document.createElement('span');
          newNode.className = 'el-input__suffix';
          newNode.innerHTML = "<span class='el-input__suffix-inner'><i class='el-input__icon el-icon-error'></i></span>"
          el.parentNode.insertBefore(newNode, el.nextSibling);
        }
      }
      flag && el.setAttribute('suffixicon', 'el-icon-success')
      !flag && el.setAttribute('suffixicon', 'el-icon-error')
    }
    valiate()
    el.addEventListener('keyup', function (event) {
        // 判断是否是否必填
        valiate();
    })
  }
})

// 注册一个全局自定义指令 `v-checkSubmit`
export const checkSubmit = Vue.directive('checkSubmit', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding, vNode) {
    el.addEventListener('click', function (event) {
      let elements = document.getElementsByClassName('v-check')
      var evObj = document.createEvent('Event')
      evObj.initEvent('keyup', true, true)
      for (let element of elements) {
        element.dispatchEvent(evObj)
      }
      let errorInputs = document.getElementsByClassName('input-error');
      if(errorInputs.length === 0){
        vNode.context.submit();
      }
    })
  }
})

