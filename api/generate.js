// fs模块 用来导出.json文件
const fs = require('fs')
// 读取swagger.json文件
const json = require('./swagger.json')
// console.log(json.paths)

let urls = {} // 前端所需的 最终产物
let apiArr = [] // 整理swagger数据的临时数组
let tagsArr = [] // 接口按swagger标签分类 - 未去重
for(let key  in json.paths){
    // 把tag提到最外层
    let tag
    if(json.paths[key].get){
        tag = 'get'
    }else if(json.paths[key].post){
        tag = 'post'
    }else if(json.paths[key].delete){
        tag = 'delete'
    }else if(json.paths[key].put){
        tag = 'put'
    }
    // 整理成所需的数据结构
    apiArr.push({
        url: key,
        tag: json.paths[key][tag].tags[0],
        method: json.paths[key]
    })
    tagsArr.push(json.paths[key][tag].tags[0])
}
// 接口分类 按swagger标签分类 - 已去掉重复标签 (一个实体为一个分类)
let tags =  Array.from(new Set(tagsArr))
// console.log(tags)
// 整理urls基本数据结构
for(let i = 0; i < tags.length; i++ ){
    urls[tags[i]] = {}
}
// console.log(urls)
// count用来命名
let count = 0
for(let i = 0; i < apiArr.length; i++ ){
    count++
    // 列出不同的方法类型 get put post delete
    for(let key  in apiArr[i].method){
        urls[apiArr[i].tag][`${key}${count}`] =  [ key.toString() , apiArr[i].url]
    }
}
// 得出最终所需的urls
console.log(urls)
// 导出urls为.json文件
fs.writeFile('swagger.json',JSON.stringify(urls, null, '\t'),'utf8',function(error){
    if(error){
        console.log(error);
        return false;
    }
    console.log('写入成功');
})
