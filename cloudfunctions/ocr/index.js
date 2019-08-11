// 云函数入口文件
const cloud = require('wx-server-sdk')
const tencentcloud = require("tencentcloud-sdk-nodejs");

const OcrClient = tencentcloud.ocr.v20181119.Client;
const models = tencentcloud.ocr.v20181119.Models;

const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let cred = new Credential("AKIDlcLvKePUo26yeAbK1ZxBE8wZ2PfkEvxp", "wjT3SgjaGnIdo370sdR5XpBbpriRHyvo");
  let httpProfile = new HttpProfile();
  httpProfile.endpoint = "ocr.tencentcloudapi.com";
  let clientProfile = new ClientProfile();
  clientProfile.httpProfile = httpProfile;
  let client = new OcrClient(cred, "ap-guangzhou", clientProfile);

  let req = new models.GeneralAccurateOCRRequest();

  let params = `{"ImageBase64":"${event.base64}"}`;
  req.from_json_string(params);

  return new Promise((resolve, reject) => {
    client.GeneralAccurateOCR(req, function (errMsg, response) {
      const _ = db.command
      const wxContext = cloud.getWXContext()
      if (errMsg) {
        reject(errMsg);
      }
      db.collection("user")
        .where({
          _openid: wxContext.OPENID
        })
        .update({
          data: {
            times: _.inc(-1)
          }
        })
        .then(res => {
          resolve(response.to_json_string());
        });
    });
  })
}





