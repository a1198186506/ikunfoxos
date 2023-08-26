# 坤狐小系统
## 目前只做到网页内容抓取部分，api抓取需要定制化，不适合大部分通用场景
### 功能上可以实现指定标签、父元素下子元素下标、类名嵌套抓取，抓取规则和dom树是一样的，值得注意的是父元素嵌套的越多那么子元素抓取的信息准确性就越高

## issue
目前由electron-builder直接打包出来的可执行文件运行起来是没问题的，但由其打包出来的安装包安装之后再运行会出现不能调起服务的情况

## 安装包
```
npm install
```

### 运行vue项目和electron窗体(这里要注意把根目录下main.js的主窗口文件路径改成vue3项目编译完成后出来的本地地址)
```
npm run dev
```

### 打包vue3项目文件到dist文件夹
```
npm run build
```

### 将整个窗体程序打包成安装程序和可执行程序
```
npm run electron-builder
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
