/*
* 造的轮子
* */
let Utils = {
  // 对tempKeyArr中存在的kv进行赋值
  filterToChangeKV(originObj, tempKeyArr, injectObj) {
    tempKeyArr.map(key => {
      if (injectObj[key] !== undefined) {
        originObj[key] = injectObj[key];
      } else {
        console.error(key + " 不存在于用于注入的对象中");
      }
    })
  },

  getFormatNumber(num) {
    if (!num) return;

    if (num >= 10000)
      return (num / 10000).toFixed(1) + '万';
    else
      return num.toString();
  },

  /**
   * 对象复制
   */
  assign(a, b) {
    if (Object.assign) {
      return Object.assign(a, b);
    } else {
      for (var key in b) {
        a[key] = b[key]
      }
      return a;
    }
  }
}
export default Utils;