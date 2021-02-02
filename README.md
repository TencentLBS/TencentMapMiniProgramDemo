# 微信小程序-地图示例
微信小程序-地图示例

## 准备工作

1. 前往 [腾讯位置服务后台](https://lbs.qq.com/dev/console/key/add) 申请开发者密钥;
2. 打开源代码`pages/map/event/event.js`，将开发者密钥填入key：
```
const qqmapsdk = new QQMapWX({
	key: '申请来的开发者密钥' // 必填
});
```
3. 编译，根据console提示，将所需插件逐一安装;

## 参考文档
- [微信小程序JavaScript SDK开发指南](http://lbs.qq.com/qqmap_wx_jssdk/index.html)