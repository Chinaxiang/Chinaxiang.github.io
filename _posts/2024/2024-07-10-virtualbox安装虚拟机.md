---
layout: post
title:  VirtualBox 安装虚拟机详细教程（附 centos 和 windows 实操全过程）
date:   2024-07-10 10:28:26 +0800
tags: virtualbox centos windows tool
---

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/ac1caae7-5c44-4fbc-8a6a-1ffce5185614.png)

大家好，本文主要介绍 VirtualBox 虚拟机软件安装 Linux 和 Windows 的操作过程，欢迎点赞，收藏，关注，评论区互动。

如有任何问题可以通过 公&号：**新质程序猿** 找到我，欢迎互撩。

VirtualBox 是啥？是一个很著名的虚拟机软件，常见的还有 VMware，Parallels Desktop等。

VirtualBox 的特点：

- 免费，包括企业版
- 支持非常广泛的操作系统
- 支持GPU虚拟化

官方网站：

https://www.virtualbox.org/

下载地址：

https://www.virtualbox.org/wiki/Downloads

本文所用版本：

https://download.virtualbox.org/virtualbox/7.0.18/VirtualBox-7.0.18-162988-Win.exe

附上网盘地址：

https://pan.quark.cn/s/e20a33a8dbaf

## 软件安装

双击.exe 文件


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/ac1caae7-5c44-4fbc-8a6a-1ffce5185614.png)

一路 **下一步**


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/209e95d0-d5be-4066-9cfd-f2c42177c482.png)

警告网络会中断，不管他，点击“是”


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/40ba3d78-70d2-4a25-ae8a-5e6526ba7b94.png)

提示缺少依赖，先不用管，继续“是”


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/149dfb35-32f7-48f5-972d-11bf0ae6595e.png)

点击“安装”


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/dc1400fa-e97e-40b0-9312-c7d44f3916ee.png)


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/02f8454c-98ba-4cc6-af80-d610b1716c9c.png)

完成，立即运行


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/2c279701-4d2e-49d9-92ba-050bd11eb5f3.png)

运行界面如下图


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/73aa1006-74ba-4d7e-ba12-958766ba1ef3.png)



## 安装CentOS

从网上下载一个 centos 的 ISO 镜像，可以从阿里云镜像源下载：

http://mirrors.aliyun.com/

https://mirrors.aliyun.com/centos/7.9.2009/isos/x86_64/CentOS-7-x86_64-Minimal-2207-02.iso

附网盘地址：

https://pan.quark.cn/s/55c8e8e4d282


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/2749bff1-8832-4982-8888-e768be0aaf4c.png)

点击 新建，填好 名称，文件夹，系统iso文件，可以直接自动安装，下一步


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/a0377c46-1888-437c-91f0-ec8ab785b2ae.png)

配置自动安装，下一步


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/4c9291fd-69b8-4856-a7fb-94ef8c93ee58.png)

配置硬件，这里根据个人情况选择，我这里配置为：4C4G


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/43d07663-b723-4c1f-b938-f332cddda8c3.png)

配置虚拟磁盘，配置40G，根据个人情况，至少20，不会立即占40G，预分配的，用多少占多少。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/3ce7f267-d446-4c4a-bfef-90d9bd148396.png)

确认信息，点击完成。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/6179eb26-3927-49dd-b0e2-19764a08d22b.png)

我这里自动安装好像没生效，双击左侧的CentOS7,启动安装过程，如果提示你选择ISO光盘，再手动选择一下 ISO 挂载路径即可。

正常安装会弹出如下界面，鼠标点进去，回车，Install CentOS 7，会提示你鼠标会独占，没关系。

鼠标想切出来，按一下右侧的 Ctrl 按键即可将鼠标从安装界面释放出来，右侧的通知框内容可以叉掉。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/53a039f9-3e16-40f1-85f7-503c7950f8dc.png)

选择语言，直接 Continue 就行，接下来就跟正常安装操作系统一样了。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/b92487ca-5ef2-4e62-95cf-53709da7b36e.png)

选择时区，时区建议选择 Asia/Shanghai, KeyBoard, Language 无所谓，SoftWare 不用管


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/75516a8b-4cca-499d-a6cb-1f3dcb74b725.png)

选择 Asia/Shanghai 时区，不然时间跟本地不一致


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/e1777028-e440-44a4-8f07-3ac4335a73f3.png)



点击 NETWORK & HOST NAME 配置网络，直接打开 ON，默认会分配一个虚拟的IP, 我这里自动分配的是：10.0.2.15，其他先不用管。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/7eeb9311-589b-4245-822e-e16ccc805b2b.png)

开始安装，这个页面可以设置 root 密码，也可以再添加一个普通用户。

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/1b490d51-45ee-4ba2-b0f1-dc09b1cba1d0.png)

比如，我创建了一个 panda 用户


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/9d536e03-0807-4ac6-a9b1-e31055abafb9.png)

安装完毕，点击 Reboot， 重启即可。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/1f0c8001-34c2-4adb-b194-8ee930ec7e4d.png)

进入到系统，使用 root 账户登录。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/6ae8386c-31bb-428f-a694-001145aaa6af.png)

登录成功，ping baidu.com 网络正常。

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/54358270-3a2b-48de-b3c9-df1c9ae1d8d0.png)

需要关闭虚拟机可以执行：shutdown now, 或者点窗口的❌。

## 安装Windows

接下来，我们来实操安装一下 Windows 10.

同样点 新建，配置名称，安装路径，虚拟光盘，安装光盘可以在官网下载，我用到的放到了这个网盘里了，按需索取。

官网地址：

https://www.microsoft.com/zh-cn/software-download/windows10

附网盘地址：

https://pan.quark.cn/s/6f4229042a4e


记得勾住“跳过自动安装”，自己体验一下安装的过程。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/285cbb48-6f25-4a38-8b02-addbb20af8d0.png)

CPU内存，同样 4C4G


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/ff1812bf-fe38-43fe-8b7b-310a343ff4de.png)

虚拟磁盘，至少50G，常用建议可以配置100G，以Windows的尿性，分分钟不够用。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/658e006b-a5b6-4231-9e6d-28b76adc07af.png)

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/f85b0345-9016-46f6-bccd-c623367ff249.png)

配置完成，启动。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/455460a5-c65f-486b-9926-8337c17ad6ea.png)

熟悉的界面，按步骤，下一步。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/401f9ae3-5ae5-4580-b247-faa62e527d53.png)
没有密钥，选择“我没有产品密钥”即可。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/1b5938fc-fdca-400b-abe9-8d3105b640cb.png)

选择 专业版。其他的也行，个人喜好。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/b4a2ab81-7118-4001-a800-2bdd62bcbee0.png)

接受条款，下一步。

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/3b2415ca-e298-4694-8078-be302b17e575.png)

选择“自定义：仅安装 Windows（高级）”


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/dcc7bbca-c398-442b-a600-10d82f1f2375.png)

选择磁盘，下一步


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/7fb8c5bf-4c85-4e7e-a7f3-fe646c17c91b.png)

等待安装


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/d2b71260-c773-466b-a211-dda0f27cc80e.png)

重启安装中。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/bc9ab98c-c992-439f-abd2-3addd0b2656e.png)

配置，按步骤来。

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/f285baae-b64e-4080-99e4-38343e5ae671.png)

没有账户，选择“脱机账户”，有账户也可以登录微软账号。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/14cfcda0-fa5f-4b8f-8d5f-5d7204c39efb.png)

根据自己的情况来，我这里选择左下方的“有限的体验”，先不管他。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/de3ad612-0278-43c7-b017-5cd149905e3b.png)

设置用户名，随意，比如我设置的 dragon


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/dfc40b95-42ba-4334-8cf4-60dd167a8e8d.png)

设置密码及安全问题。

三个问题自己选，答案自己填。

按需勾选即可。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/f54c118b-0294-4638-b99e-202f5a540c1e.png)

按需勾选，也可以跳过。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/92dd1777-79d3-4d10-9234-915d56f34239.png)

以后再说。

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/48a1e44a-84cc-4afe-bd16-236126ce8430.png)

进入到主页面，推销浏览器……


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/68ffd031-f7c9-4dbc-b79d-c2c45ba1d903.png)

试了一下可以上网。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/e17c1843-ec5e-45bd-8b41-ce7b15256947.png)

看一下磁盘，50G 不太够啊。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/5175b697-9331-434e-93d2-311c0868e9b4.png)

可以选择去激活。

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/77fb65a8-60b8-4e5f-beea-89d97450df13.png)

填入产品密钥，你有的话，没有也可以找我（嘻嘻嘻）


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/ec8f9d6e-319c-47a5-9c63-43b424678862.png)

一切正常，开启套娃模式，win11 里 跑 win10, 开心的飞起。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/f7fec9a6-02be-4dde-acbd-5d04f9ae283a.png)

## 总结

好了，今天的分享主要是截图，介绍了安装 VirtualBox，并使用 VirtualBox 安装了 CentOS 和 Windows 10.

你学废了嘛，欢迎点赞，收藏，关注，评论。

有任何问题，可以通过公&号：**新质程序猿** 找到我。

下期再见。