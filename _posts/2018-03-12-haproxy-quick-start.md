---
layout: post
title: HAProxy快速入门（未完待续）
tags: tool
date: 2018-03-12 21:25:00 +800
---

## HAProxy简介

HAProxy是一个使用C语言编写的自由及开放源代码软件，其提供高可用性、负载均衡，以及基于TCP和HTTP的应用程序代理。

HAProxy功能

- HAProxy是TCP / HTTP反向代理服务器，尤其适合于高可用性环境
- 可以针对HTTP请求添加cookie，进行路由后端服务器
- 可平衡负载至后端服务器，并支持持久连接
- 支持基于cookie进行调度
- 支持所有主服务器故障切换至备用服务器
- 支持专用端口实现监控服务
- 支持不影响现有连接情况下停止接受新连接请求
- 可以在双向添加，修改或删除HTTP报文首部
- 支持基于pattern实现连接请求的访问控制
- 通过特定的URI为授权用户提供详细的状态信息
- 支持动态程序的反向代理
- 支持基于数据库的反向代理

## 相关概念

### 代理的作用

- 正向代理，反向代理
- 代理服务器，可以提供缓存功能加速客户端访问，同时可以对缓存数据进行有效性检查
- 内容路由：根据流量以及内容类型将请求转发至特定的服务器
- 转码器：支持压缩功能，将数据以压缩形式发送给客户端

补充一点。

> 什么是正向代理？

在家访问xxoo网站，不希望xxoo网站知道我们的真实ip，于是就找一个proxy，通过proxy来访问，此时proxy代表用户，xxoo网站获取到的IP是proxy的IP。

> 什么是反向代理？

xxoo网站有很多服务器提供服务，xxoo网站通过一个proxy对外提供一个IP接受用户的请求，然后将请求分发到下面的服务器，这里的proxy对于xxoo网站的其他服务器来说就是反向代理。

组合起来：

你 -> proxy(正向代理) -> proxy(反向代理) -> xxoo网站服务器集群


### 缓存的作用

- 减少访冗余内容传输
- 节省带宽，缓解网络瓶颈
- 降低了对原始服务器的请求压力
- 降低了传输延迟

### 负载均衡集群：

> 四层：

lvs, nginx(stream)，haproxy(mode tcp)

> 七层：

http: nginx(http, ngx_http_upstream_module), haproxy(mode http), httpd, ats, perlbal, pound...

## 安装HAProxy

### Ubuntu 16.04

> apt 安装

```
# apt search haproxy
Sorting... Done
Full Text Search... Done
haproxy/xenial-updates,xenial-security 1.6.3-1ubuntu0.1 amd64
  fast and reliable load balancing reverse proxy
...

# apt-get install haproxy
Reading package lists... Done
Building dependency tree       
Reading state information... Done
The following additional packages will be installed:
  liblua5.3-0
Suggested packages:
  vim-haproxy haproxy-doc
The following NEW packages will be installed:
  haproxy liblua5.3-0
0 upgraded, 2 newly installed, 0 to remove and 4 not upgraded.
Need to get 872 kB of archives.
After this operation, 1,997 kB of additional disk space will be used.
Do you want to continue? [Y/n] y
Get:1 http://mirrors.tuna.tsinghua.edu.cn/ubuntu xenial/main amd64 liblua5.3-0 amd64 5.3.1-1ubuntu2 [116 kB]
Get:2 http://mirrors.tuna.tsinghua.edu.cn/ubuntu xenial-updates/main amd64 haproxy amd64 1.6.3-1ubuntu0.1 [756 kB]
Fetched 872 kB in 0s (1,734 kB/s)
Selecting previously unselected package liblua5.3-0:amd64.
(Reading database ... 59387 files and directories currently installed.)
Preparing to unpack .../liblua5.3-0_5.3.1-1ubuntu2_amd64.deb ...
Unpacking liblua5.3-0:amd64 (5.3.1-1ubuntu2) ...
Selecting previously unselected package haproxy.
Preparing to unpack .../haproxy_1.6.3-1ubuntu0.1_amd64.deb ...
Unpacking haproxy (1.6.3-1ubuntu0.1) ...
Processing triggers for libc-bin (2.23-0ubuntu10) ...
Processing triggers for systemd (229-4ubuntu21.1) ...
Processing triggers for ureadahead (0.100.0-19) ...
Processing triggers for man-db (2.7.5-1) ...
Setting up liblua5.3-0:amd64 (5.3.1-1ubuntu2) ...
Setting up haproxy (1.6.3-1ubuntu0.1) ...
Processing triggers for libc-bin (2.23-0ubuntu10) ...
Processing triggers for systemd (229-4ubuntu21.1) ...
Processing triggers for ureadahead (0.100.0-19) ...
```

HAproxy组成

> 程序环境

- 主程序：/usr/sbin/haproxy
- 配置文件：/etc/haproxy/haproxy.cfg
- 服务文件：/lib/systemd/system/haproxy.service (ubuntu 16.04使用systemd启动)
- 日志切分配置：/etc/logrotate.d/haproxy
- halog: /usr/bin/halog
- /etc/init.d/haproxy (ubuntu 15之前使用的启动文件)

服务启停：

```
systemctl status haproxy
systemctl stop haproxy
systemctl start haproxy
systemctl restart haproxy
```

> haproxy.cfg

```
global
  log /dev/log    local0
  log /dev/log    local1 notice
  chroot /var/lib/haproxy
  stats socket /run/haproxy/admin.sock mode 660 level admin
  stats timeout 30s
  user haproxy
  group haproxy
  daemon

  # Default SSL material locations
  ca-base /etc/ssl/certs
  crt-base /etc/ssl/private

  # Default ciphers to use on SSL-enabled listening sockets.
  # For more information, see ciphers(1SSL). This list is from:
  #  https://hynek.me/articles/hardening-your-web-servers-ssl-ciphers/
  ssl-default-bind-ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:ECDH+3DES:DH+3DES:RSA+AESGCM:RSA+AES:RSA+3DES:!aNULL:!MD5:!DSS
  ssl-default-bind-options no-sslv3

defaults
  log     global
  mode    http
  option  httplog
  option  dontlognull
  timeout connect 5000
  timeout client  50000
  timeout server  50000
  errorfile 400 /etc/haproxy/errors/400.http
  errorfile 403 /etc/haproxy/errors/403.http
  errorfile 408 /etc/haproxy/errors/408.http
  errorfile 500 /etc/haproxy/errors/500.http
  errorfile 502 /etc/haproxy/errors/502.http
  errorfile 503 /etc/haproxy/errors/503.http
  errorfile 504 /etc/haproxy/errors/504.http
```

> haproxy.service

```
[Unit]
Description=HAProxy Load Balancer
Documentation=man:haproxy(1)
Documentation=file:/usr/share/doc/haproxy/configuration.txt.gz
After=network.target syslog.service
Wants=syslog.service

[Service]
Environment=CONFIG=/etc/haproxy/haproxy.cfg
EnvironmentFile=-/etc/default/haproxy
ExecStartPre=/usr/sbin/haproxy -f ${CONFIG} -c -q
ExecStart=/usr/sbin/haproxy-systemd-wrapper -f ${CONFIG} -p /run/haproxy.pid $EXTRAOPTS
ExecReload=/usr/sbin/haproxy -c -f ${CONFIG}
ExecReload=/bin/kill -USR2 $MAINPID
KillMode=mixed
Restart=always

[Install]
WantedBy=multi-user.target
```

> `haproxy -h`

```
# haproxy -h
HA-Proxy version 1.6.3 2015/12/25
Copyright 2000-2015 Willy Tarreau <willy@haproxy.org>

Usage : haproxy [-f <cfgfile>]* [ -vdVD ] [ -n <maxconn> ] [ -N <maxpconn> ]
        [ -p <pidfile> ] [ -m <max megs> ] [ -C <dir> ] [-- <cfgfile>*]
        -v displays version ; -vv shows known build options.
        -d enters debug mode ; -db only disables background mode.
        -dM[<byte>] poisons memory with <byte> (defaults to 0x50)
        -V enters verbose mode (disables quiet mode)
        -D goes daemon ; -C changes to <dir> before loading files.
        -q quiet mode : don't display messages
        -c check mode : only check config files and exit
        -n sets the maximum total # of connections (2000)
        -m limits the usable amount of memory (in MB)
        -N sets the default, per-proxy maximum # of connections (2000)
        -L set local peer name (default to hostname)
        -p writes pids of all children to this file
        -de disables epoll() usage even when available
        -dp disables poll() usage even when available
        -dS disables splice usage (broken on old kernels)
        -dV disables SSL verify on servers side
        -sf/-st [pid ]* finishes/terminates old pids.
```

## 配置

配置分为命令行配置(优先级最高)和配置文件(haproxy.cfg).

haproxy.cfg主要有两部分组成：global和proxies配置段

> global：全局配置段

- 进程及安全配置相关的参数
- 性能调整相关参数
- Debug参数

> proxies：代理配置段

- defaults：为frontend, backend, listen提供默认配置
- fronted：前端，相当于nginx, server {}
- backend：后端，相当于nginx, upstream {}
- listen：同时拥有前端和后端,适用于一对一环境

### 一个例子

我们已经安装了HAProxy, 但HAProxy不是web服务器，所以我们再安装一个nginx配合测试（其他文章会再介绍nginx的）。

```
# apt-get install nginx
Reading package lists... Done
Building dependency tree       
Reading state information... Done
The following additional packages will be installed:
  fontconfig-config fonts-dejavu-core libfontconfig1 libgd3 libjbig0 libjpeg-turbo8 libjpeg8 libtiff5 libvpx3 libxpm4 libxslt1.1 nginx-common nginx-core
Suggested packages:
  libgd-tools fcgiwrap nginx-doc ssl-cert
The following NEW packages will be installed:
  fontconfig-config fonts-dejavu-core libfontconfig1 libgd3 libjbig0 libjpeg-turbo8 libjpeg8 libtiff5 libvpx3 libxpm4 libxslt1.1 nginx nginx-common nginx-core
0 upgraded, 14 newly installed, 0 to remove and 4 not upgraded.
Need to get 3,000 kB of archives.
After this operation, 9,783 kB of additional disk space will be used.
Do you want to continue? [Y/n] y
...
```

安装完成，访问一下：http://192.168.111.11/ （根据你自己的机器IP更改）

我们开始配置HAProxy来访问nginx.

```
# cd /etc/haproxy
# cp haproxy.cfg haproxy.cfg.default
# vim haproxy.cfg
```

更改haproxy.cfg内容如下：

```
global
    daemon
    maxconn 256

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend http-in
    bind *:81
    default_backend servers

backend servers
    server server1 127.0.0.1:80 maxconn 32
```

reload or restart haproxy.

```
systemctl reload haproxy
```

访问：http://192.168.111.11:81/

上面的haproxy.cfg还可以使用如下的配置替代：

```
global
    daemon
    maxconn 256

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

listen http-in
    bind *:81
    server server1 127.0.0.1:80 maxconn 32
```

### 引用与转义

### 变量

### 时间格式

### 全局配置

### 代理配置




## 参考资料

- https://www.cnblogs.com/qige2017/p/7783402.html
- http://www.ttlsa.com/linux/haproxy-study-tutorial
- http://cbonte.github.io/haproxy-dconv/1.6/configuration.html
