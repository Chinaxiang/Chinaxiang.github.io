---
layout: post
title:  Ansible Tower 安装教程（附破解方式）
date:   2024-07-09 10:28:26 +0800
tags: ansible tower tool
---


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/316aeaac-5f23-4295-a6b9-376b70d20332.png)

今天来分享一个自动化运维层面的一个软件——Ansible Tower




## 简介

公司在实现运维自动化的架构中用到了 Ansible，Ansible 脚本在部署中显得不太直观，不太方便管理。Ansible Tower 是将 Ansible 脚本项目化，界面化管理，更方便易用.

官方文档地址：[https://docs.ansible.com/ansible-tower/](https://docs.ansible.com/ansible-tower/)


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/aa6e77ac-64d7-4432-83ca-69848b7f7ff0.png)

Ansible Tower 其实就是一个图形化的任务调度，复杂部署，IT自动化的一个管理平台，属于发布配置管理系统，支持 Api 及界面操作（见下图）。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/0fcb9732-a36c-4fb5-8c90-0720835d9582.png)


常用的应用架构如下：


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/36474056-6e23-4107-bdd5-c0d60a248b3e.png)


Ansible Tower 可以通过界面从 git 拉取最新 playbook 实施服务部署，提高生产效率. 并且可以和企业已有的系统进行集成对接（下图是我们的运维自动化平台部分截图）。


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/623f1116-9f42-4025-ba63-f0332e8275b6.png)


由于内容较多，本文主要介绍安装（破解），后续再进一步介绍相关实践应用，如果对你有用，记得点赞，收藏，分享，如果觉得哪里写的不对或不好，欢迎留言指正，或公&号“新质程序猿”联系到我，认辱认骂。

## 下载软件


我们目前使用的还是 3.3.1 的，旧虽旧点，够用就好，本文档不保证其他版本，大家请见谅，后续有空再探究其他版本。


下载地址：

[https://releases.ansible.com/ansible-tower/setup-bundle/](https://releases.ansible.com/ansible-tower/setup-bundle/)

我们这里选择这个 3.6.6-1 吧，适用于 CentOS 操作系统。

[https://releases.ansible.com/ansible-tower/setup-bundle/ansible-tower-setup-bundle-3.6.6-1.tar.gz](https://releases.ansible.com/ansible-tower/setup-bundle/ansible-tower-setup-bundle-3.6.6-1.tar.gz)

如遇个人文章中任何资源找不到，请公&号“新质程序猿”联系我。


## 安装软件

首先准备一台主机 CentOS 系统

> 注意：Tower 安装过程包括安装一些依赖软件，如 PostgreSQL、RabbitMQ、NGINX 和其他一些软件，所以 Tower 需要在一个独立的虚拟机或云实例上安装，而不能和其他应用程序位于同一个机器上（相关的监控和日志程序除外）。

tower 安装软件一览：

- rabbitmq 5672/15672/25672
- memcached
- postgresql 5432
- nginx 443/80
- supervisord (如下进程通过 supervisor 管理)
  - exit-event-listener
  - awx-callback-receiver
  - awx-dispatcher
  - awx-channels-worker
  - awx-daphne
  - awx-uwsgi


```
tar -zxvf ansible-tower-setup-bundle-3.6.6-1.tar.gz -C /opt/
cd /opt/ansible-tower-setup-bundle-3.6.6-1
```

配置一下 inventory, 告诉安装脚本一些配置：单机版只更改其中的 password 即可。

```
[tower]
localhost ansible_connection=local

[database]

[all:vars]
admin_password='admin123'

pg_host=''
pg_port=''

pg_database='awx'
pg_username='awx'
pg_password='123456'
pg_sslmode='prefer'  # set to 'verify-full' for client-side enforced SSL

rabbitmq_username=tower
rabbitmq_password='123456'
rabbitmq_cookie=cookiemonster

# Isolated Tower nodes automatically generate an RSA key for authentication;
# To disable this behavior, set this value to false
# isolated_key_generation=true


# SSL-related variables

# If set, this will install a custom CA certificate to the system trust store.
# custom_ca_cert=/path/to/ca.crt

# Certificate and key to install in nginx for the web UI and API
# web_server_ssl_cert=/path/to/tower.cert
# web_server_ssl_key=/path/to/tower.key

# Use SSL for RabbitMQ inter-node communication.  Because RabbitMQ never
# communicates outside the cluster, a private CA and certificates will be
# created, and do not need to be supplied.
# rabbitmq_use_ssl=False

# Server-side SSL settings for PostgreSQL (when we are installing it).
# postgres_use_ssl=False
# postgres_ssl_cert=/path/to/pgsql.crt
# postgres_ssl_key=/path/to/pgsql.key
```

执行安装：

```
# 需要先安装 ansible, yum直接安装
yum info ansible
# 安装 ansible
yum install -y ansible
# 我安装的版本
ansible --version
ansible 2.9.27
  config file = /etc/ansible/ansible.cfg
  configured module search path = [u'/root/.ansible/plugins/modules', u'/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/lib/python2.7/site-packages/ansible
  executable location = /bin/ansible
  python version = 2.7.5 (default, Jun 20 2019, 20:27:34) [GCC 4.8.5 20150623 (Red Hat 4.8.5-36)]

# 直接安装
bash setup.sh
```


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/68854b4b-b731-4de0-aa85-d1687222cb2c.png)

**问题：** 如果安装过程报错，我遇到的错误是 yum 源连不上导致的，尝试替换为阿里云的源。

```
# 备份
cp CentOS-SCLo-scl.repo{,.bak}
cp CentOS-SCLo-scl-rh.repo{,.bak}

# 替换为 aliyun 源
# CentOS-SCLo-scl.repo 内容如下
[centos-sclo-sclo]
name=CentOS-7 - SCLo sclo
baseurl=https://mirrors.aliyun.com/centos/7/sclo/$basearch/sclo/
gpgcheck=0
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-SCLo

# CentOS-SCLo-scl-rh.repo 内容如下
[centos-sclo-rh]
name=CentOS-7 - SCLo rh
baseurl=https://mirrors.aliyun.com/centos/7/sclo/$basearch/rh/
gpgcheck=0
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-SCLo
```

没激活之前，登录是需要填写 license 的。

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/e4bff26d-a286-4d68-ad44-64e2c9eb2939.png)

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/8db60ef5-0b04-4822-8253-068341623760.png)

## 破解一下

安装成功后，破解一下吧。简直不要太简单哈！！！！

```
echo 'so easy' > /var/lib/awx/i18n.db

ansible-tower-service restart
```


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/44542aed-45ea-4d4b-82dd-43b10484f2e9.png)


![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/d73b5e32-d3ea-49ba-8f3a-9d466298edc6.png)

## 启停软件

Tower 安装了一系列的软件，主要：

- systemd 管理的如下服务
  - rabbitmq
  - memcached
  - postgresql
  - nginx
  - supervisord
- supervisor 管理的如下服务
  - exit-event-listener
  - awx-callback-receiver
  - awx-dispatcher
  - awx-channels-worker
  - awx-daphne
  - awx-uwsgi

启停的逻辑包装成了一个 可执行命令 ansible-tower-service

```
ansible-tower-service --help
Ansible Tower service helper utility
Usage: /bin/ansible-tower-service {start|stop|restart|status}
```

## Docker 运行

在 hub 仓库里搜到了一个，但是版本是 3.2 的，并且需要 license

[https://hub.docker.com/r/ybalt/ansible-tower](https://hub.docker.com/r/ybalt/ansible-tower)

[https://github.com/ybalt/ansible-tower](https://github.com/ybalt/ansible-tower)

也简单尝试了一下构建，但没有成功，由于时间关系就先不管它了，后面会想办法构建出来一个可用的镜像。

如果你有可靠的资源，也可以分享给大家。

好了，今天的分享就是这些，主要介绍了 CentOS 安装 Ansible Tower 的过程，当然还有科学手段分享。

