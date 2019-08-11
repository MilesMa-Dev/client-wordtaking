// 获取每日奖励
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return new Promise((resolve, reject) => {
    db.collection("user")
      .where({
        _openid: wxContext.OPENID
      })
      .update({
        data: {
          times: _.inc(1)
        }
      })
      .then(res => {
        resolve({ code: 0, review: true });
      }).catch(res => {
        reject({ code: -1 });
      });
  })
}