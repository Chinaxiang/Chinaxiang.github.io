---
layout: post
title: middleman构建API文档
tags: tool
date: 2017-10-10 17:25:00 +800
---

临时接到个任务，让帮公司搞一个对外API文档项目，当然第一时间想到使用markdown来写，通过github page发布。

搜罗了一圈，发现有其他公司使用middleman发布他们的API文档，所以我也使用middleman构建静态文档站点。

项目具体细节参见[GitHub Project](https://github.com/Chinaxiang/middleman)

本项目只是一个示例，你可以Fork & Clone使用。

项目GitHub Page地址：http://huangyanxiang.com/middleman

本项目有两个分支，master 和 gh-pages. master分支用来写源文件并构建gh-pages所需的静态资源，gh-pages仅仅用来存放middleman构建出来的静态资源供用户访问。

## middleman 的安装

middleman 是ruby下的一个静态站点生成工具，安装ruby是必须的。

https://ruby.taobao.org/mirrors/ruby/  

在安装过程中遇到了不少坑。

windows上我没有安装成功，太麻烦，不想折腾，在CentOS虚拟机上安装的。

ruby版本要大于2.2, 需要安装nodejs, zlib, openssl. 

ruby安装完成最好更新gem源，下载速度会提高不少：

```
#查看gem源
gem sources
# 删除默认的gem源 增加ruby-china作为gem源 
gem sources --remove https://rubygems.org/ -a http://gems.ruby-china.org/
# 查看当前的gem源
gem sources

# 清空源缓存
gem sources -c
# 更新源缓存
gem sources -u
```

下面的操作不一定需要，我在安装的时候碰到了异常，附加的一些操作。

zlib安装后还需要安装ruby需要的zlib库。

```
#ruby源码目录
cd ext/zlib
ruby ./extconf.rb
make
make install
```

openssl安装后还需要安装ruby需要的ssl库。

```
#ruby源码目录
cd ext/openssl
ruby ./extconf.rb
make
make install
```

如果提示找不到`include/ruby.h`, 请修改 `Makefile` 中所有的 `$(top_srcdir)/include/ruby.h` 为 `$(hdrdir)/ruby.h`.

安装完ruby后，一般都自带gem包管理器了。执行：

```
gem install middleman
```

## middleman 的使用

我只介绍本项目的使用。

安装完环境后，克隆本项目。

```
git clone git@github.com:Chinaxiang/middleman.git
cd middleman
rm -rf build
bundle exec middleman build

  create  build/stylesheets/print.css
  create  build/stylesheets/screen.css
  create  build/images/logo.png
  create  build/images/logo-blue.png
  create  build/images/navbar.png
  create  build/images/favicon.ico
  create  build/fonts/slate.woff
  create  build/fonts/slate.woff2
  create  build/fonts/slate.ttf
  create  build/fonts/slate.eot
  create  build/fonts/slate.svg
  create  build/javascripts/all_nosearch.js
  create  build/javascripts/all.js
  create  build/index.html
Project built successfully.
```

执行完之后，你就会发现静态文件已经生成到`build`目录中了。

把build目录中的内容放置到gh-pages分支中，就可以通过github-pages访问了。

如果你把项目fork到你的github账号下，并且开启了ssh认证.

将远程gh-pages分支拉下来：

```
git checkout origin/gh-pages
git checkout master
chmod +x deploy.sh
./deploy.sh
```

执行上述命令可以将master分支的文档构建的静态资源提交到gh-pages分支并发布到github上。

## 如何写文档

本项目是为了写API文档的，使用的是markdown语法。所有的文档放置在`source/includes`目录下，目录结构的组织全部配置在`source/index.html.md`中。

需要什么格式的内容，请参阅现有文档中的书写方式。