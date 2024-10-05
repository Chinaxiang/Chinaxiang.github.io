---
layout: post
title:  JetBrains 全家桶畅享
date:   2024-07-03 10:28:26 +0800
tags: tool jetbrains goland idea pycharm phpstorm
---

作为一名程序员（不是程序员的不用往下看了哈），怎么能没用过 `JetBrains` 全家桶呢？

没用过的请留下你的大名，让大伙劝劝你，哈哈哈。

我不算什么大牛，技术栈单薄，就只用过如下几种：

- golang
- java
- php
- python
- web

![](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/20241005214150.png)

其实我一般不追求太新的版本，至今JDK还停留在JDK1.8,莫嘲笑，够用就好。

因为换了电脑了，顺便把我的2019版升级一下（实在是不升不行了，毕竟差了那么些年）。

安装软件，相信大家都会了，最多注意下安装路径，一般建议放置到非C盘哈，你也知道Windows的尿性，动不动 C 盘就爆了。我这里安装到了 `D:\soft\` 下。


![](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/209a90b1-0d83-496e-a760-bb1c3106d322.png)


一路 Next 就可以安装完成了，按需安装即可，不用安装那么多。


![](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/67233241-5c63-4907-a3e8-ff5bd1d76033.png)


接下来应该是大家所关注的了，如何科学的使用IDE呢？

答案就是：`ja-netfilter`

好了，你也不需要了解太多，知道这个玩意能让你安心使用IDE即可。

下载下来之后，解压后得到这样的目录：


![](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/2eec5ea7-dede-47a3-a512-eb127f11311d.png)


看一下 readme.txt 内容：


![](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/4d6a3529-c615-4474-8f94-08f1da0ad07f.png)


英文，我就不翻译了，我的操作很简单，自动配置 vmoptions

直接执行 `scripts\install-all-users.vbs` 给所有用户进行配置（这个 vbs 脚本就是自动帮你去配置 javaagent）


![](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/96a19294-2b9b-4d84-854e-33b175e3209d.png)


等待片刻，出现一个弹框： Done 即表示配置成功。


![](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/de5e2bdf-b125-4fff-a73e-e924991cae8d.png)


访问如下地址获取最新的 license key

[https://jetbra.in/5d84466e31722979266057664941a71893322460](https://jetbra.in/5d84466e31722979266057664941a71893322460)


![](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/74303172-1240-45f2-a7fd-f1078348e311.png)


选择一个可用的链接点进去即可。


![](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/35328fc6-5749-4018-b921-d37b4f3d4f33.png)


拷贝激活码后，以次打开刚才安装的 IDE，填入 Active Code 逐个激活即可。

![](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/41733084-bf02-4d54-8e30-eb1a60035f4d.png)

![](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/d167d8d6-b42a-4652-bd32-bc74e603b6c7.png)

![](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/e766921f-3963-4401-962e-f4b56b8f7c3e.png)

![](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/2139edb3-8a1b-4706-a205-079d2c4379b5.png)

![](https://raw.githubusercontent.com/Chinaxiang/notepic/main/2024/5606ea39-d808-4e81-86e5-79e4e095f6d6.png)

好了，今天的分享到此结束，希望对你有所帮助。

如果你对我分享的内容感兴趣，欢迎关注公众号：新质程序猿，并设置星标（公众号不设置星标会收不到推送），公众号的内容会更实时哟，也更容易接收推送提醒。

![](https://huangyanxiang.com/qrcode.jpg)

