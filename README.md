# dt-uniapp专用模板

内置了Vuex,Vant Weapp和小程序更新机制,开箱即用

无需再手动挂载api,tools,config,store,内嵌封装好的request请求文件,根据项目真是情况定制错误拦截机制...

# 使用

## 1.安装项目模板

`` vue create -p dcloudio/uni-preset-vue 项目名称``

## 2.选择自定义模板

![使用自定义模板](http://yanxuan.nosdn.127.net/2a8f418e2e5633228a739a58eef77cd7.png)

## 3.填入仓库地址

模板地址即仓库地址:

![模板地址](http://yanxuan.nosdn.127.net/46ea1808bbeff69a0f9fe601b878287c.png)

![填入仓库地址](http://yanxuan.nosdn.127.net/f2322eb9f87d15eb41afc2bfcb4dffca.png)

## 4.安装所需插件

```npm install sass-loader node-sass --save-dev ```

```
如若出现node-sass被墙无法安装,解决方法:
npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/ --save-dev
```

## 5.运行、发布uni-app

``npm run dev:%PLATFORM%``

`` npm run build:%PLATFORM%``

