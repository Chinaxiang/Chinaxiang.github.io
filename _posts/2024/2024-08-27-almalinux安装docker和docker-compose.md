---
layout: post
title:  AlmaLinux 替代 CentOS 7 并安装 docker & docker-compose
date:   2024-08-27 07:38:26 +0800
tags: centos almalinux tool docker docker-compose
---

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/dad07a2a-df46-4e39-b92b-a0bca162219f.png)

之前一直喜欢用 CentOS 7 ，但是很多新工具，新软件 yum 源上不更新了，于是想到有没有什么系统比较贴合 CentOS 的使用习惯，又能保持更新呢？





哈哈，还真有，是时候接纳一下新系统了，搜索了一下 Almalinux 好像是平替 CentOS 最佳解决方案之一，接下来一些实操内容可能就会直接基于 Almalinux 了，今天先来体验一下 Almalinux 安装 Docker 吧！

尝试 Almalinux 推荐 2 种方式，一种可以直接在个人电脑上通过 virtual box 或者其他虚拟机软件安装虚拟机，另一种是直接在云平台上快速开一台。

关于 virtual box 安装虚拟机的教程，可以查阅我之前的一篇文章（往前翻翻就找到了）

关于在云平台上快速开一台虚拟机的教程，也可以查阅我之前的一篇文章（往前翻翻就找到了）

almalinux os 的下载可以到 某云 mirrors 进行下载，速度快，体验好。

[https://developer.aliyun.com/mirror/](https://developer.aliyun.com/mirror/)


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/cfeeea37-ee0a-4487-8251-0325de3e22f5.png)

我选择的是 AlmaLinux-9.4-x86_64-minimal 版本，也有桌面版，不过我也不需要，最小化安装足矣。

[https://mirrors.aliyun.com/almalinux/9.4/isos/x86_64/AlmaLinux-9.4-x86_64-minimal.iso](https://mirrors.aliyun.com/almalinux/9.4/isos/x86_64/AlmaLinux-9.4-x86_64-minimal.iso)

我在 virtual box 上已经安装好了一台 almalinux 9.4 ，今天分享的内容就以 virtual box 安装的为准吧。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/4ef15a68-b2df-4c10-b0f4-f5e5355961da.png)

docker 我就不过多介绍了，知道容器化的应该都知道（不知道跳过就好），我们直接来安装。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/38841265-69d0-4d85-b76b-ccce1db4f57f.png)

安装过程比较简单，关键步骤只需要如下步骤：

1. 添加 docker-ce 仓库源（官方源或某云镜像源，根据自己网络情况来）  
2. 替换仓库源下载地址，可选，根据自己网络情况  
3. 查看可安装的版本，可选，默认安装是当前源上最新版  
4. 安装并启动 docker  
5. 验证 docker

```
# 官方源
dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
# 某云源
dnf config-manager --add-repo=https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
# 下载地址替换为某云加速下载
sed -i 's+download.docker.com+mirrors.aliyun.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo
# 列出当前可用版本
yum list docker-ce.x86_64 --showduplicates | sort -r
# 下载最新版本（yum 和 dnf 命令可以通用）
dnf install docker-ce
# 启动
systemctl start docker
# 验证
systemctl status docker

docker version
```

安装过程会同步安装相关的依赖包，如 docker-ce-cli, containerd.io


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/1a09f2dc-21e7-4f21-b908-c44748731825.png)

通过 systemd 管理 docker 启动，docker version 可以查看当前版本信息。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/29678b1f-ec86-4b99-81cd-ed423bd3f745.png)

安装完 docker, 安装 docker-compose 更加简单， docker-compose 是一个 golang 开发的二进制文件，只需要下载到主机 bin 目录下即可（/usr/bin, /usr/local/bin 等等）。

下载地址：

[https://github.com/docker/compose/releases](https://github.com/docker/compose/releases)


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/e9196dce-e77d-4152-b423-3e79421d1efd.png)

下载完成记得转移至 bin 目录下，并赋予可执行权限（755）

```
mv docker-compose-linux-x86_64 /usr/bin/docker-compose
chmod a+x /usr/bin/docker-compose
```

好了，今天分享的内容比较简单，第一引入了新的操作系统 AlmaLinux (一个兼容 CentOS 的比较好用的操作系统)，第二，在新装的操作系统上快速安装 docker & docker-compose 环境。

