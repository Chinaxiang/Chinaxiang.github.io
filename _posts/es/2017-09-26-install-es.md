---
layout: post
title: Elasticsearch 安装
tags: search
date: 2017-09-26 16:39:00 +800
---

在上文对ES有了大概认识后，我们就该实操一下了，ES的安装非常简单。

{% raw %}

Elasticsearch 是用JAVA开发的，所以需要安装最新版被JAVA运行环境。

本文测试环境以Centos 6.5 x64为基础，不同的系统安装整体步骤是大差不差的。

## 安装JDK

为了方便，我直接使用openjdk了。

```shell
# yum search jdk
...
java-1.8.0-openjdk.x86_64 : OpenJDK Runtime Environment
...
# yum install -y java-1.8.0-openjdk.x86_64
```

环境变量可以不配置，yum安装的JDK一般都是可以直接使用的。

```shell
# java -version
openjdk version "1.8.0_141"
OpenJDK Runtime Environment (build 1.8.0_141-b16)
OpenJDK 64-Bit Server VM (build 25.141-b16, mixed mode)
```

## 下载安装包

先使用2.4.4的玩玩。

[elasticsearch-2.4.4.tar.gz](https://download.elasticsearch.org/elasticsearch/release/org/elasticsearch/distribution/tar/elasticsearch/2.4.4/elasticsearch-2.4.4.tar.gz)

关于ES的版本为什么直接从2.x->5.x是因为：为了ELK（ElasticSearch, Logstash, Kibana）技术栈的版本统一，免的给用户带来混乱。

## 安装

解压缩文件

```shell
# tar zvxf elasticsearch-2.4.4.tar.gz
```

直接运行ES，会报错：don't run elasticsearch as root.

```shell
# cd elasticsearch-2.4.4
# bin/elasticsearch
...
Exception in thread "main" java.lang.RuntimeException: don't run elasticsearch as root.
...
```

创建一个普通用户，如: es

```shell
新建用户，并建一个跟用户名相同的组
# useradd -U es
修改用户密码
# passwd es
连续输入两次相同的密码
将安装包放到es用户下去操作
# mv elasticsearch-2.4.4.tar.gz /home/es/
切换到es用户
# su es
切换到es用户目录下
$ cd
$ tar zvxf elasticsearch-2.4.4.tar.gz
$ cd elasticsearch-2.4.4
运行
$ bin/elasticsearch

OpenJDK 64-Bit Server VM warning: If the number of processors is expected to increase from one, then you should configure the number of parallel GC threads appropriately using -XX:ParallelGCThreads=N
[2017-06-08 17:23:38,337][WARN ][bootstrap                ] unable to install syscall filter: seccomp unavailable: requires kernel 3.5+ with CONFIG_SECCOMP and CONFIG_SECCOMP_FILTER compiled in
[2017-06-08 17:23:38,702][INFO ][node                     ] [Human Torch II] version[2.4.4], pid[54882], build[fcbb46d/2017-01-03T11:33:16Z]
[2017-06-08 17:23:38,702][INFO ][node                     ] [Human Torch II] initializing ...
[2017-06-08 17:23:39,604][INFO ][plugins                  ] [Human Torch II] modules [reindex, lang-expression, lang-groovy], plugins [], sites []
[2017-06-08 17:23:39,636][INFO ][env                      ] [Human Torch II] using [1] data paths, mounts [[/ (/dev/mapper/vg_master-lv_root)]], net usable_space [14.7gb], net total_space [17.2gb], spins? [possibly], types [ext4]
[2017-06-08 17:23:39,636][INFO ][env                      ] [Human Torch II] heap size [1015.6mb], compressed ordinary object pointers [true]
[2017-06-08 17:23:39,637][WARN ][env                      ] [Human Torch II] max file descriptors [4096] for elasticsearch process likely too low, consider increasing to at least [65536]
[2017-06-08 17:23:42,659][INFO ][node                     ] [Human Torch II] initialized
[2017-06-08 17:23:42,664][INFO ][node                     ] [Human Torch II] starting ...
[2017-06-08 17:23:42,833][INFO ][transport                ] [Human Torch II] publish_address {127.0.0.1:9300}, bound_addresses {[::1]:9300}, {127.0.0.1:9300}
[2017-06-08 17:23:42,842][INFO ][discovery                ] [Human Torch II] elasticsearch/QooSQe6gQ3-9jCD4Yyms8w
[2017-06-08 17:23:45,938][INFO ][cluster.service          ] [Human Torch II] new_master {Human Torch II}{QooSQe6gQ3-9jCD4Yyms8w}{127.0.0.1}{127.0.0.1:9300}, reason: zen-disco-join(elected_as_master, [0] joins received)
[2017-06-08 17:23:45,970][INFO ][http                     ] [Human Torch II] publish_address {127.0.0.1:9200}, bound_addresses {[::1]:9200}, {127.0.0.1:9200}
[2017-06-08 17:23:45,970][INFO ][node                     ] [Human Torch II] started
[2017-06-08 17:23:46,029][INFO ][gateway                  ] [Human Torch II] recovered [0] indices into cluster_state
```

安装就是这么简单，一个ES实例就正常启动了。

打开一个新的终端页面：

```shell
# curl 'http://localhost:9200/?pretty'
{
  "name" : "Human Torch II",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "wZgLRd5YSl-yuKwE8lPsPQ",
  "version" : {
    "number" : "2.4.4",
    "build_hash" : "fcbb46dfd45562a9cf00c604b30849a6dec6b017",
    "build_timestamp" : "2017-01-03T11:33:16Z",
    "build_snapshot" : false,
    "lucene_version" : "5.5.2"
  },
  "tagline" : "You Know, for Search"
}
```

如果想在后台以守护进程模式运行，添加`-d`参数。

执行`ctrl + c`可以结束刚才我们启动的实例。

做如下步骤，可以在浏览器中访问：

1. 关闭es, `ctrl + c` 即可
2. 关闭防火墙或开放指定端口
3. 配置 `elasticsearch.yml` 中 `network.host` (注意配置文件格式不是以#开头的要空一格， `:`后要空一格) 为`network.host: 0.0.0.0`

```shell
$ vi config/elasticsearch.yml
......
# network.host: 192.168.0.1
network.host: 0.0.0.0
......
```

4. 重新启动

重新启动的输出和默认的有细微的区别，绑定了特定的IP.

```shell
...
[2017-06-08 17:36:13,852][INFO ][transport                ] [The Grip] publish_address {192.168.163.128:9300}, bound_addresses {[::]:9300}
[2017-06-08 17:36:17,019][INFO ][http                     ] [The Grip] publish_address {192.168.163.128:9200}, bound_addresses {[::]:9200}
...
```


## 集群和节点

节点(node)是一个运行着的ES实例，上面我们启动的就是一个节点，虽然一台机器上可以启动多个实例，但没有实际使用价值。

集群(cluster)是一组具有相同 `cluster.name` 的节点集合，他们协同工作，共享数据并提供故障转移和扩展功能，当然一个节点也可以组成一个集群。

你最好找一个合适的名字来替代 `cluster.name` 的默认值，比如`my_search`，这样可以防止一个新启动的节点加入到相同网络中的另一个同名的集群中。

你可以通过修改 `config/` 目录下的 `elasticsearch.yml` 文件，然后重启ELasticsearch来做到这一点。

同样，最好也修改你的节点名字。就像你现在可能发现的那样，Elasticsearch 会在你的节点启动的时候随机给它指定一个名字`Human Torch II`。

通过配置`node.name`可以很容易更改节点的名字。

Elasticsearch 默认被配置为使用单播发现，以防止节点无意中加入集群。只有在同一台机器上运行的节点才会自动组成集群。

如果不是同一台机器上的实例需要组成集群，可以配置 `discovery.zen.ping.unicast.hosts: ["host1", "host2:port"]`.

你可以为 Elasticsearch 提供一些它应该去尝试连接的节点列表。 当一个节点联系到单播列表中的成员时，它就会得到整个集群所有节点的状态，然后它会联系 master 节点，并加入集群。

这意味着你的单播列表不需要包含你的集群中的所有节点 它只是需要足够的节点，当一个新节点联系上其中一个并且说上话就可以了。

给出我在两台机器上运行的三个实例的配置：

192.168.163.128/master

```
cluster.name: my_search
node.name: node-master
network.host: 0.0.0.0
```

master是hostname, 并不一定是master.

在这台机器上使用相同的es安装包可以直接启动两个实例。

```
$ bin/elasticsearch
...
[2017-06-08 17:36:13,852][INFO ][transport                ] [The Grip] publish_address {192.168.163.128:9300}, bound_addresses {[::]:9300}
[2017-06-08 17:36:17,019][INFO ][http                     ] [The Grip] publish_address {192.168.163.128:9200}, bound_addresses {[::]:9200}
...
```

另开一个终端，再启动一次：

```
$ bin/elasticsearch
...
[2017-06-08 17:36:13,852][INFO ][transport                ] [The Grip] publish_address {192.168.163.128:9301}, bound_addresses {[::]:9301}
[2017-06-08 17:36:17,019][INFO ][http                     ] [The Grip] publish_address {192.168.163.128:9201}, bound_addresses {[::]:9201}
...
```

它会自动将端口加1，避免端口冲突。

启动的时候，第一个终端会打印出这样的日志信息：

```
[2017-06-08 18:29:10,786][INFO ][cluster.service          ] [node-master] added {{node-master}{dghFncPgR4OjKeTJ_ESW7Q}{192.168.163.128}{192.168.163.128:9301},}, reason: zen-disco-join(join from node[{node-master}{dghFncPgR4OjKeTJ_ESW7Q}{192.168.163.128}{192.168.163.128:9301}])
```

同一台机器可以启动多台实例，他们的数据默认存储在安装目录的`data/`目录下。

第一台的数据目录：`data/my_search/nodes/0/`, 第二台的数据目录：`data/my_search/nodes/1/`.

但是他们的日志都是输出到一起的。

这俩个实例并且具有相同的节点名称。虽然没问题，但显然是不太好的，知道就行。


192.168.163.130/slave1

```
cluster.name: my_search
node.name: node-slave1
network.host: 0.0.0.0
discovery.zen.ping.unicast.hosts: ["127.0.0.1", "[::1]", "192.168.163.128"]
```

第二台机器比第一台机器多配置了一个单播地址，启动的时候会跟`192.168.163.128`取得会话，告诉master, 新节点加入了。

启动的时候前俩台的控制台都会打印节点加入信息：

```
[2017-06-08 18:22:35,931][INFO ][cluster.service          ] [node-master] added {{node-slave1}{eY45vfUqSSuPMfXVOjguhA}{192.168.163.130}{192.168.163.130:9300},}, reason: zen-disco-join(join from node[{node-slave1}{eY45vfUqSSuPMfXVOjguhA}{192.168.163.130}{192.168.163.130:9300}])
```

我们可以通过浏览器或者新的终端查看集群的状态：

```
curl 'http://localhost:9200/_cluster/health?pretty'
{
  "cluster_name" : "my_search",
  "status" : "green",
  "timed_out" : false,
  "number_of_nodes" : 3,
  "number_of_data_nodes" : 3,
  "active_primary_shards" : 0,
  "active_shards" : 0,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 0,
  "delayed_unassigned_shards" : 0,
  "number_of_pending_tasks" : 0,
  "number_of_in_flight_fetch" : 0,
  "task_max_waiting_in_queue_millis" : 0,
  "active_shards_percent_as_number" : 100.0
}
```

两台机器，运行了三个节点的空集群就准备就绪了。


`elasticsearch.yml` 中还可以配置数据的存储目录，日志的存储目录，插件的存储目录，就不再赘述了。

## 安装head插件

head 是集群管理工具、数据可视化、增删改查工具。

- [GitHub 项目地址](https://github.com/mobz/elasticsearch-head)
- [帮助指南](http://mobz.github.io/elasticsearch-head/)

安装比较简单。

### 命令安装

上面我启动了3个实例，现在我将master上的两个实例全部关闭，把head装到master机器上。

```
bin/plugin install mobz/elasticsearch-head
-> Installing mobz/elasticsearch-head...
Trying https://github.com/mobz/elasticsearch-head/archive/master.zip ...
Downloading ..............................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................DONE
Verifying https://github.com/mobz/elasticsearch-head/archive/master.zip checksums if available ...
NOTE: Unable to verify checksum for downloaded plugin (unable to find .sha1 or .md5 file to verify)
Installed head into /home/es/elasticsearch-2.4.4/plugins/head
ll plugins
total 4
drwxrwxr-x. 6 es es 4096 Jun  9 10:18 head
重新启动master上的es
bin/elasticsearch
```

浏览器访问：`http://192.168.163.128:9200/_plugin/head/`


大家会发现只有一个`node-master`节点，因为我把master的两个实例都关了，现在的es master是slave1, 而master的节点没有配置单播通知host, 所以master就是一个节点的集群。配置一下，再次启动。


带有星号的是es master节点。

### 包安装

ES的插件都放置在`plugins`目录下，如上面的`plugins/head/`目录，你可以直接下载github上的head包，将其放置到head目录下即可。

这其实和试用`bin/plugin install`命令是相同的。

另外还有一种方式就是将head项目作为独立的web服务，其实这个也很好理解，head项目就是一个静态页面，它所请求的数据都是通过调用es提供的API接口完成的，你可以直接打开项目的index.html, 它会发出一系列Ajax请求到`localhost:9200`, 如果你能解决跨域问题，当然是可以作为独立web服务存在的，或者后面你对es的API非常熟悉了，你自己也可以构建一个head项目（不就是请求一下接口，包装一下数据，展示一下嘛）。

因为该插件可以对数据进行，增删改查。故生产环境尽量不要使用，如果要使用，最少要限制IP地址。尽量不要使用。

目前，我们的集群数据仍然是空的，接下来，我们会逐步让数据丰富起来。

{% endraw %}