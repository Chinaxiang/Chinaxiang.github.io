---
layout: post
title: Ubuntu iptables 配置
tags: ubuntu unix iptables
---

Ubuntu 默认有装iptables，可通过`dpkg -l`或`which iptables`确认。

Ubuntu默认没有iptables配置文件，需通过 

```
iptables-save > /etc/network/iptables.up.rules
```

生成。

iptables配置文件路径及文件名建议为 `/etc/network/iptables.up.rules`, 因为执行 `iptables-apply` 默认指向该文件，也可以通过 `-w` 参数指定文件。

Ubuntu 没有重启iptables的命令，执行 `iptables-apply` 生效。

Ubuntu iptables默认重启服务器后清空，需在 `/etc/network/interfaces` 里写入 `pre-up iptables-restore < /etc/network/iptables.up.rules` 才会开机生效。

几个iptables命令：

> 允许所有访问22端口

```
# iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

> 拒绝所有访问22端口

```
# iptables -A INPUT -p tcp --dport 22 -j DROP
```

> 只允许10.0.0.2访问22端口

```
# iptables -A INPUT -p tcp --dport 22 -s 10.0.0.2 -j ACCEPT
```