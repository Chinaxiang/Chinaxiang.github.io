---
layout: post
title: Ubuntu开机自启管理
tags: tool linux
date: 2018-02-22 09:25:00 +800
---

目前，在 Ubuntu 中有三种方法控制一个 Service 是否在开机自动启动 —— SysV, Upstart 和 Systemd。其中 Systemd 是在 Ubuntu 15.04 才引入 Ubuntu 中，下面一一介绍他们是如何来控制一个 Service 在开机或重启时自动启动。

## SysV

使用 SysV 来控制的 Service 的脚本都是放置在 `/etc/init.d/` 目录下的，之后使用 `update-rc.d` 这个工具来控制相应 Service 的 enable 与 disable.

```
ls /etc/init.d/
acpid     atd            dbus       friendly-recovery  irqbalance  networking  procps    rcS     resolvconf  screen-cleanup  skeleton  udev          umountroot
apparmor  console-setup  dns-clean  grub-common        killprocs   ondemand    rc        README  rsync       sendsigs        ssh       umountfs      unattended-upgrades
apport    cron           docker     halt               kmod        pppd-dns    rc.local  reboot  rsyslog     single          sudo      umountnfs.sh  urandom
```

上面这些都是可以使用 `update-rc.d` 来控制 enable/disable 的 Service, 下面介绍如何使用 `update-rc.d` 来控制这些 Service。

### Disable service

Disable 一个 service, 即是在开机或者重启机器时不要启动这个 service.

```
update-rc.d -f service_name remove
```

其中, service_name 为要 disable 的 service 的名称.

缺点: 使用这种方法 disable 掉一个 service，当使用 apt-get 对这个 service 的软件包进行更新后，上面的操作就会失效，即在下次开机或者重启机器时，这个 service 又会自动启动。

解决方法: 在最近的 update-rc.d 版本中，update-rc.d 新增了两个参数 —— enable 和 disable, 使用 disable 参数即可 disable 一个 service, 并且即使这个 service 的软件包在之后进行了更新，其状态也不会变为 enable.

```
update-rc.d service_name disable
```

### Enable service

Enable 一个 service, 即是在开机或者重启机器的时候，自动启动这个 service.

```
update-rc.d service_name defaults
```

其中，service_name 为要 enable 的 service 的名称；另外，关键字 defaults 表示在 runlevel 为 2,3,4,5 时 enable 这个 service, 而在 runlevel 为 0,1,6 时 disable 这个 service, 因为我们通常使用的 runlevel 都是在 2-5 之间，所以使用 defaults 关键字就可以 enable 我们想要的 service 了。

如果执行上述命令时得到如下错误:

```
System start/stop links for /etc/init.d/service_name already exist.
```

则改用如下命令即可:

```
update-rc.d service_name enable
```

update-rc.d 还有很多功能，例如，它可以精确地控制一个 service 在何种 runlevel 下 enable 或 disable, 甚至还可以控制 service 启动的优先级，如果你对此感兴趣的话，可以通过 man update-rc.d 来查看 update-rc.d 的更多功能。

## Upstart

使用 Upstart 来控制的 service 都在 /etc/init/ 目录下放置有相应的 .conf 配置文件。由于在 Ubuntu 14.04 中使用 Upstart 来控制的 service 比较少，因此，对于一个 service, 如果你不确定其是否有 Upstart 来管控，可以使用下面格式的命令来进行查看:

```
initctl status service_name
# or
status service_name
```

如果一个 service 不是由 Upstart 来管控，将会提示如下的错误:

```
status: Unknown job: service_name
```

### Disable service

要 Disable 一个有 Upstart 管控的 service 十分简单，只要按照如下格式执行命令即可:

```
echo "manual" | tee /etc/init/service_name.override
```

其中，service_name 为要 disable 掉的 service 的名称。上面的命令只是在 `/etc/init/` 目录下添加一个 `service_name.override` 文件，并向该文件中输入内容 `manual`。这样就可以 disable 掉 service_name 这个 service 了(助记:英文 manual 表示手工，暗示了该 service 为手工启动，而不是在开机或重启机器时自动启动).

### Enable service

要 Enable 一个 service 更加简单，只要将 /etc/init/ 目录下的 .override 文件删除掉即可.

```
rm /etc/init/service_name.override
```

### 临时 enable/disable service

上面所介绍的方法都是永久性的 enable/disable 一个 service, 如果只是想临时 enable/disable 一个 service, 就要使用 service 这个命令了。service 这个工具的一个优点是，无论是对于 SysV 的脚本，还是对于 Upstart 的 job,都可以使用 service 来统一的管理。

```
service service_name start
service service_name stop
```

另外，如果你想要 enable/disable 的 service 由 Upstart 管控，你还可以使用 Upstart 风格的管理方法:

```
initctl start service_name
# or
start service_name

initctl stop service_name
# or
stop service_name
```

具体的细节，贴上大神的总结。

http://blog.fens.me/linux-upstart/

## Systemd

Systemd 是在 Ubuntu 15.04 才引入 Ubuntu 中。

Systemd 的优点是功能强大，使用方便，缺点是体系庞大，非常复杂。事实上，现在还有很多人反对使用 Systemd，理由就是它过于复杂，与操作系统的其他部分强耦合，违反"keep simple, keep stupid"的Unix 哲学。

![](http://www.ruanyifeng.com/blogimg/asset/2016/bg2016030703.png)

（上图为 Systemd 架构图）

Systemd 并不是一个命令，而是一组命令，涉及到系统管理的方方面面。

具体的细节，贴上阮大神的文章。

http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html

http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-part-two.html
