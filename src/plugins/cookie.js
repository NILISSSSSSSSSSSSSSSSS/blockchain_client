//获取cookie、
export function getCookie(name) {
var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
if (arr = document.cookie.match(reg))
  return (arr[2]);
else
  return null;
}

//设置cookie,增加到vue实例方便全局调用
export function setCookie (c_name, value) {
  console.log(c_name, value)
var exdate = new Date();
exdate.setDate(exdate.getDate() + 1);//1代表1天过期
document.cookie = c_name + "=" + escape(value) + (";expires="+exdate.toGMTString());
console.log(document.cookie)
};

//删除cookie
export function delCookie (name) {
var exp = new Date();
exp.setTime(exp.getTime() - 1);
var cval = getCookie(name);
if (cval != null)
  document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};