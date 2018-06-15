---
layout: post
title: Docker Registry简单使用
tags: tool docker devops
date: 2017-11-21 09:25:00 +800
---

简单记录使用Docker Registry.

我的需求很简单，本地搭建一个简单的私有仓库，供我远端的机器使用，避免来回找镜像麻烦，并且一些镜像可能需要翻墙，找到不容易，存到本地备份。

## 拉取Registry镜像

从Docker Hub上可以获取官方的Registry的镜像，Registry 默认的对外服务端口是 5000，如果我们宿主机上运行的 Registry 需要对外提供服务，可以通过映射端口的方式提供。

```
docker pull registry
```

## 运行镜像

你可以在linux, mac, windows上运行。

### windows

```
docker run -d -p 5000:5000 -v g:/registry:/var/lib/registry --restart always --name registry registry
35cab89bb547a2d7d6d50b690c56e2723656cf0baac0745f63d2d67214e2dd44

docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
35cab89bb547        registry            "/entrypoint.sh /e..."   20 seconds ago      Up 18 seconds       0.0.0.0:5000->5000/tcp   registry
```

## 验证

我们可以使用registry提供的API方式进行验证。

```
curl http://127.0.0.1:5000/v2/_catalog
repositories":[]}
```

还没有任何镜像在私有仓库中。

我们上传一个进去。

```
docker tag registry 127.0.0.1:5000/registry
docker push 127.0.0.1:5000/registry
The push refers to a repository [127.0.0.1:5000/registry]
9113493eaae1: Pushed
621c2399d41a: Pushed
59e80739ed3f: Pushed
febf19f93653: Pushed
e53f74215d12: Pushed
latest: digest: sha256:feb40d14cd33e646b9985e2d6754ed66616fedb840226c4d917ef53d616dcd6c size: 1364
```

我们可以到上面挂在的本地目录中去查看镜像。

```
g:/registry

docker
  /registry
    /v2
      /blobs
        # 分层存储的实际文件
      /repositories # 
        /registry # registry镜像目录
          /_layers
          /_manifests
            /revisions
            /tags
              /latest # 版本
          /_uploads
```

## 远程访问

私有镜像仓库就是为了给远程机器提供镜像存储的，当然需要远程机器能够访问。

### 设置

由于我没有使用SSL加密，docker默认是采用SSL进行仓库访问的，所以远程机器需要配置非安全访问仓库地址。

> linux

修改或创建 `/etc/docker/daemon.json`, 添加如下设置。

```
{
  "insecure-registries": ["192.168.0.105:5000"]
}
```

> mac or win

对于mac or win客户端，直接找到设置-> Daemon, 找到insecure registries, 添加上仓库的地址即可，非80记得带上端口。

### 验证

```
# 查看仓库列表
curl http://192.168.0.105:5000/v2/_catalog
# 查看registry镜像的版本列表
curl http://192.168.0.105:5000/v2/registry/tags/list

docker pull 192.168.0.105:5000/registry
```

好，至此，我们简单的私有镜像仓库就搭建完毕了，开始尽情塞一些好用的镜像吧。

后续我会简单介绍一下Registry API的使用。

