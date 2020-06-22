# dt-uniapp专用模板

内置了Vuex,Vant Weapp和小程序更新机制,开箱即用

无需再手动挂载api,tools,config,store,内嵌封装好的request请求文件,根据项目真是情况定制错误拦截机制...

# 使用

## 1.安装项目模板

`` vue create -p dcloudio/uni-preset-vue 项目名称``

## 2.选择自定义模板

![使用自定义模板](https://i.loli.net/2020/06/22/BaJomUEzZqPVCRA.png)

## 3.填入仓库地址

模板地址即仓库地址:

![模板地址](https://i.loli.net/2020/06/22/Sk4Tv3yEHPZX2W5.png)

![填入仓库地址](https://i.loli.net/2020/06/22/9rC32NhUWvujdSA.png)

## 4.安装所需插件

```npm i sass-loader ```

```
node-sass被墙解决方法:
npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
```

## 5.运行、发布uni-app

``npm run dev:%PLATFORM%``

`` npm run build:%PLATFORM%``

