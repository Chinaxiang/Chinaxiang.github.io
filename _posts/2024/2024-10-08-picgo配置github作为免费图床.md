---
layout: post
title:  PicGo 配置 GitHub 作为后端免费图床
date:   2024-10-08 23:28:26 +0800
tags: github picgo
---

![image-20241008221513799](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/image-20241008221513799.png)



PicGo 是一款很不错的图片上传客户端工具，它可以对接多种后端存储平台，比如 AWS S3, 阿里云 OSS, 七牛云，又拍云等等。



由于云平台可能涉及到存储或流量的收费，有没有免费的资源呢？当然有，因为个人站点是托管在 Github 上的，所以想到用 GitHub 来存储图片吧，第一免费，第二又不会涉及到跨域之类的无法显示，第三大厂可靠。



PicGo 设置 github 如下图（暂未配置）：



![image-20241008221346475](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/image-20241008221346475.png)



需要几个配置项：



- 图床配置名，起一个名字，比如 notepic

- 设定仓库名，自己在GitHub创建的仓库，比如 notepic
- 设定分支名，比如 master 或 main
- 设定 token，GitHub 开发者 token
- 设定存储路径，比如 2024/，按年份区分，避免数量太多不好找
- 设定自定义域名，用于访问图片资源



## 新建仓库



创建一个 notepic 仓库，名称随意



![image-20241008221906704](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/image-20241008221906704.png)





## 获取 token



登录个人账号，访问：https://github.com/settings/tokens/new

![image-20241008221922631](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/image-20241008221922631.png)





设置 token 的名称，过期时间和权限，没有过期时间就表示长久有效，权限，只需要选择 repo 即可



![image-20241008221936277](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/image-20241008221936277.png)





**记得保存好 token，只能看到这一次，下一次就看不到了，只能删掉重新创建。**



![image-20241008221943358](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/image-20241008221943358.png)



## 配置 PicGo



回到刚才的配置



![image-20241008221949640](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/image-20241008221949640.png)







**存储路径**，我这里配置的按年份分隔吧，不然太多图片不好查看，如果你图片太多，还可以再细分到季度之类的。



**设定自定义域名**，我这里直接使用 github 的 raw 域名，路径是：



https://raw.githubusercontent.com/ + 用户名/仓库名/分支名



比如我的：



https://raw.githubusercontent.com/Chinaxiang/notepic/main



## 上传测试



保存，选择上传位置到 github notepic



![image-20241008221959816](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/image-20241008221959816.png)



上传图片，得到图片地址：



[https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/AI%E7%A0%B4%E5%B1%80%E9%82%80%E8%AF%B7%E6%B5%B7%E6%8A%A5.jpg](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/AI破局邀请海报.jpg)



## 总结



本文比较简单，快速实践介绍了 picgo 配合 github 实现图片上传的功能，用来写博客不要太爽。