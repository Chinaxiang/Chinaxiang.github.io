---
layout: post
title:  tinyproxy 快速搭建 http 代理
date:   2024-08-26 08:28:26 +0800
tags: tinyproxy tool
---

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/a3497bf9-896c-4922-983d-998115c4e5d1.png)

公司内网 IT 新给搭的几台线下虚拟机没有公网访问权限，但是可以连通其他有公网访问权限的主机，于是想到可以通过在有公网权限的机器上架设代理服务器的方式实现网络访问。

说干就干，于是找到了这个又小又好用的 Tinyproxy. 

Tinyproxy 是一个 轻量级 HTTP/HTTPS 代理软件，它被用于 HTTP 服务器 应用网关 等场景。

官网：

https://github.com/tinyproxy/tinyproxy

文档：

https://tinyproxy.github.io/

## 安装

安装方式的话，首先我会推荐你看当前操作系统包管理工具里有没有现成的，如 yum, dnf, apt 等，我这里使用的 centos 是直接有的。

```
# yum search tinyproxy

Installed Packages
Name        : tinyproxy
Arch        : x86_64
Version     : 1.8.3
Release     : 2.el7
Size        : 133 k
Repo        : installed
From repo   : epel
Summary     : A small, efficient HTTP/SSL proxy daemon
URL         : https://www.banu.com/tinyproxy/
License     : GPLv2+
Description : tinyproxy is a small, efficient HTTP/SSL proxy daemon that is very useful in a
            : small network setting, where a larger proxy like Squid would either be too
            : resource intensive, or a security risk.
```

我是直接使用 yum 安装的，自动通过 systemd 管理，比较方便。

```
# yum install -y tinyproxy
# systemctl enable tinyproxy
# systemctl start tinyproxy

# netstat -antp | grep LISTEN | grep 8888
tcp        0      0 0.0.0.0:8888            0.0.0.0:*               LISTEN      1622/tinyproxy 
```

如果你用的任何其他系统都可以通过编译源码的方式实现安装。

首先下载源码，可以到 release 页面下载最新的 包。

https://github.com/tinyproxy/tinyproxy/releases

下载到机器之后，确保机器上有 gcc, make 命令，没有就装呗。

```
# yum install -y gcc make

# tar -zxf tinyproxy-1.11.2.tar.gz
# cd tinyproxy-1.11.2

# ./autogen.sh
# ./configure
# make
# make install
```

编译安装后，默认是会安装到 /usr/local/bin 目录下，不过你可以在编译的时候指定 --prefix 更改改造路径，更多编译指令也可以通过 ./configure -h 进行查看。

## 配置文件

tinyproxy 启动需要一个配置文件，包管理器安装的一般在 /etc/tinyproxy/tinyproxy.conf，编译安装的在 /usr/local/etc/tinyproxy/tinyproxy.conf, 当然配置文件放置在哪里都可以，因为启动的时候可以通过 -c 参数指定。

tinyproxy 所需的必须参数不多，最简的配置文件只需要一行就可以了。

```
Port 8888
```

更多配置项说明，大家可以看官网文档。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/a8354811-edff-4b9c-bd78-4e18abe08bcc.png)

## 启动和使用

systemd 管理的启动方式在 安装 步骤就介绍了，这里主要介绍自己手动编译的启动，我们可以直接使用命令行方式启动。

```
# 查看帮助
# tinyproxy -h

# 前台启动
# tinyproxy -d -c tinyproxy.conf
```

启动之后，使用也非常简单，例如本地访问 HTTP 请求使用代理

```
# http_proxy=127.0.0.1:8888 curl baidu.com
# http_proxy=10.255.1.103:8888 curl baidu.com
```

也可以配置为全局方式 /etc/profile, 覆盖 HTTP/SSL 等代理

```
export all_proxy=10.255.1.103:8888
```

更多设置代理的方式可以参见：

https://www.golinuxcloud.com/set-up-proxy-http-proxy-environment-variable/

列举一些示例：http_proxy, https_proxy, ftp_proxy, all_proxy, no_proxy

```
export http_proxy=http://proxy_server_address:port
export https_proxy=https://proxy_server_address:port
export ftp_proxy=http://proxy_server_address:port
export https_proxy=https://proxy_server_address:port
export http_proxy=http://username:password@proxy_server_address:port
export https_proxy=https://username:password@proxy_server_address:port
export http_proxy=http://domain\\username:password@proxy_server_address:port
export https_proxy=https://domain\\username:password@proxy_server_address:port

export no_proxy=".example.com,.local,localhost"

curl -U username:password -x http://proxy_server_address:port http://example.com

wget -e use_proxy=yes -e http_proxy=http://proxy_server_address:port http://example.com

wget -e use_proxy=yes -e http_proxy=http://username:password@proxy_server_address:port http://example.com

```

## 总结

今天主要分享工作中用到的一个小工具，很小很实用，希望能帮到你。

