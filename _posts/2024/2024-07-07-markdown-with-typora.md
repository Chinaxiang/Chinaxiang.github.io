---
layout: post
title:  Markdown 编辑神器之 Typora 配合 PicGo 实现文章畅写
date:   2024-07-07 08:08:08 +0800
tags: tool markdown typora picgo
---

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/93e3cda1-e696-4251-bef1-be81c44e251b.jpeg)

作为技术人，如果你不会写 Markdown 真的需要好好反省一下，我媳妇（研发转测试了）已经被我喷了好几次了，哈哈哈，**键盘已经跪坏好几个了**。

废话不多说，Markdown 我就不介绍了，本文主要介绍 Markdown 编辑器 Typora 配合 Pico + OSS 实现图文并茂的博客畅写之路，欢迎点赞收藏备用。

## Typora

Typora 应该不少人已经知道了，就是一个 Markdown 所见即所得的编辑器，当然编辑器有很多种，看个人喜好吧，至今我公司还有一个大佬使用 vim 开发 Java 的呢，就问你服不服？？？

Typora 今天我就不给你推荐什么 破解版 了，因为我购买了正版的，哈哈哈，有时候我们都想用正版的，奈何钱包不允许啊，就像上一篇写的 Jetbrains 全家桶一样，不是我不想用正版，那是因为第一有点贵哈，第二好像破解的也用的很香。

我在 荔枝网站 上买的正版的，80来块钱，终身，支持 3 台设备，确实不贵哈，也基本够我用了，突然有种自豪感有没有，一个 Mac Pro, 一个 Mac Air(媳妇的)，一个为了搞 AI 绘画 而买的 4080 台式机（我是不会告诉大家我是大部分时间 Play Games 的） 。

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/5565b684-640d-4025-b77a-4ce5cb0d7156.png)

windows 版长这样，大家可以自行试用吧，不说太多了，不然又被审核为过度广告了。

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/0a139e08-b995-456b-b5b2-49c53b6abe2d.png)

## Picgo 介绍

大家还记得我之前写了一篇“什么？图床又挂了！试试我造的这款免费，稳定，完全自主可控的开源图床吧”吧，是我一直在用的自研（抄的，二开）的浏览器插件图床工具，现在依然在用，真的挺好用的，大家可以再适当改造改造，说不定可以大麦。

为什么还要用 Picgo 呢，因为 Picgo 也是一个知名的图床，并且能够和 Typora 集成，我的浏览器插件可做不到，所以，术业有专攻，承认别人优秀也是一种自信，开整吧。

大家自己下载安装就可以了，无难度。地址：

https://picgo.github.io/PicGo-Doc/

https://github.com/Molunerfinn/PicGo

安装完成，需要配置一下自己的 OSS 这样你的图片就可以自主可控了，再也不用担心外链失效或者敏感了（你懂的）。

## OSS 注册

能提供存储的运营商有很多，大家可以自行测试，我比较偏好 阿里云 OSS 还有 七牛云存储，先入为主吧，习惯罢了。

注册这一块，我也不需要介绍太多，注册一个阿里云账号，开通 OSS 产品即可，上一篇“什么？图床又挂了！试试我造的这款免费，稳定，完全自主可控的开源图床吧”中介绍了一些，大家可以参考。

主要是为了拿到 OSS 的 bucket， ak， sk 之类的参数。

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/72b326e9-0d93-4da9-b5b8-eb509a6bf1d7.png)


## PicGo 配置 OSS

打开 PicGo 客户端，图床设置 -> 阿里云OSS 配置，安装上面一个图中的配置即可，很简单，我就不啰嗦了，不会的私聊我（hyx2011）。

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/45b30df9-d26d-4f5b-8181-1dc1bcd2cbd3.png)

## Typora 配置 PicGo

这个也是一样毫无技术含量，打开Typora，文件 - 偏好设置 - 图像，看下图

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/b773dd21-1327-48bd-a061-64e50515bad9.png)

配置好之后，可以点击“验证图片上传选项”，也可以直接在 Typora 中直接 粘贴 一个本地的图片，或者直接微信截图文件，直接 Ctrl + V 即可。

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/c541b34c-aeb9-4dcc-a458-7fd6a7430350.png)

<br/>

<br/>


好了，今天的分享到此结束，希望对你有所帮助。

如果你对我分享的内容感兴趣，欢迎扫码关注公众号：**新质程序猿**，并设置星标，公众号的内容会更实时哟，也更容易接收推送提醒。

![](https://huangyanxiang.com/qrcode.jpg)