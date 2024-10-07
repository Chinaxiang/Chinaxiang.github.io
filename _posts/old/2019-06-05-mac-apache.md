---
layout: post
title: Mac Apache配置
tags: tool
---

mac自带有apache服务器。

## Apache路径

> 配置路径

```
cd /etc/apache2
ls
extra                   httpd.conf.bak          httpd.conf~previous     mime.types              other
httpd.conf              httpd.conf.pre-update   magic                   original                users
```

> 工作路径

```
/Library/WebServer/
```

## 启动服务

```
sudo apachectl start/restart   #启动apache
sudo apachectl stop            #停止apache
```

