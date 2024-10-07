---
layout: post
title:  kafka + kraft 集群搭建全过程（附操作实例）
date:   2024-08-07 10:28:26 +0800
tags: kafka kraft
---

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/1b110883-12e4-4c51-8a0b-19f448cfbcfa.png)

本文主要介绍 kafka + kraft 搭建过程，主要用途是为了日志采集，所以搭建相对比较简单暴力，不过也可以作为一个参考供大家学习，主打一个能用管跑（调优啊，参数解释啊，原理啊，太枯燥了，你自己搜吧）。

我们的日志采集架构比较传统，基于 filebeat -> kafka -> logstash -> local file -> nfs. 没有引入 ES 之类的流行的玩法，因为成本有限，人手有限，精力有限，哈哈，我是不会告诉你是因为研发习惯了 grep 日志文件的，咱也没啥动力去改变人家的习惯哈。

废话不多说，欢迎关注公&号：**新质程序猿**，可以获取到最新的资源哟。

kraft 协议是 kafka 自研的用于替代 zk 的分布式协调方案，因为可以少安装一个 zk，管理起来肯定方便不少，拥抱新东西呗！

## 机器规划

准备3台机器，我这里准备了 3 台 centos 系统，其他系统也可以，反正 java 是跨平台的。

- 10.100.8.201  nodeId=1 broker=9092 controller=9093
- 10.100.8.202  nodeId=2 broker=9092 controller=9093
- 10.100.8.203  nodeId=3 broker=9092 controller=9093

备注：controller 取代了之前的 zookeeper

## 内核优化

主要就是文件句柄啥的，不知道为啥操作系统把 ulimit 搞成 1024 那么小。

```
sysctl -a  -r "^net.(ipv4|core)"  > /tmp/sysctl_output.txt

cat << EOF > /etc/sysctl.d/custom.conf
net.core.somaxconn = 32768
net.core.netdev_max_backlog = 32768
net.ipv4.ip_local_port_range = 1024 65000
net.ipv4.tcp_max_syn_backlog = 16384
net.ipv4.tcp_max_tw_buckets = 30000
net.ipv4.tcp_timestamps = 0
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_syn_retries = 1
net.ipv4.tcp_synack_retries = 1
net.ipv4.tcp_fack = 1
net.ipv4.tcp_tw_recycle = 0
EOF

sysctl -p /etc/sysctl.d/custom.conf


ulimit -a > /tmp/limits.conf

cat << EOF >> /etc/security/limits.conf 
#### custom of file
* soft nproc 1000000
* hard nproc 1000000
* soft nofile 1000000
* hard nofile 1000000
EOF

ulimit -n 1000000
```

## 安装Java

如果公司对环境版本没啥要求，建议您直接上 OpenJDK, 免费又好用。Oracle 最后一个免费版本的JDK 是 8u202。

我这里直接安装 OpenJDK 11 了（yum源上已经有的），省却了配置环境变量的琐事。

```
yum makecache fast
yum list | grep openjdk
yum install -y java-11-openjdk

java -version
openjdk version "11.0.23" 2024-04-16 LTS
OpenJDK Runtime Environment (Red_Hat-11.0.23.0.9-2.el7_9) (build 11.0.23+9-LTS)
OpenJDK 64-Bit Server VM (Red_Hat-11.0.23.0.9-2.el7_9) (build 11.0.23+9-LTS, mixed mode, sharing)
```



## 安装Kafka

kafka 官网：https://kafka.apache.org/

下载地址：https://kafka.apache.org/downloads



### 执行安装脚本

我把安装过程写成了一个 bash 脚本，可以直接执行，当然，你也可以分步手动执行。脚本关键流程是：

- 读取传入的 ip 参数，3 台机器的 ip, 按序号 1-3 逗号分隔（根据 localIp 自动匹配编号）
- 下载资源包，我脚本里 hard code 的 3.8.0 的版本，你可以自行更改
- 解压，重命名至 `/usr/local/kafka` 目录
- 调整配置文件（根据你自己的需求适当调整部分配置）
- 配置服务自启
- 可选 调整启动内存 大小（kafka 不太占内存，有个4G足够了，主要占网络及磁盘IO）

```
#!/bin/bash

IPS=$1

localIp=$(ip a |grep inet |awk '{print $2}'|grep ^1[0,7,9] |awk -F "/" '{print $1}' |head -n 1)

if [ "x$IPS" == "x" ]
then
  echo "Usage: bash install_kafka.sh IP1,IP2,IP3"
  exit 1
else
  echo "IPS is ${IPS}"
fi

NODE_ID=1
IP1=
IP2=
IP3=

ipArray=($(echo ${IPS} | sed 's/,/ /g'))
length=${#ipArray[*]}

if [ "x$length" == "x3" ]
then
  IP1=${ipArray[0]}
  IP2=${ipArray[1]}
  IP3=${ipArray[2]}
else
  echo "Usage: bash install_kafka.sh IP1,IP2,IP3"
  exit 1
fi

if [ "$localIp" == "$IP1" ]
then
  NODE_ID=1
elif [ "$localIp" == "$IP2" ]
then
  NODE_ID=2
elif [ "$localIp" == "$IP3" ]
then
  NODE_ID=3
else
  echo "localIp:$localIp not match $IPS"
  exit 1
fi

echo "NODE_ID=$NODE_ID, IP1=$IP1,IP2=$IP2,IP3=$IP3"

cd /opt

[ ! -f kafka_2.13-3.8.0.tgz ] && wget https://downloads.apache.org/kafka/3.8.0/kafka_2.13-3.8.0.tgz -N

mkdir -p /data/kafka-data

# unzip 
tar zxf kafka_2.13-3.8.0.tgz -C /usr/local
# rename
mv /usr/local/kafka_2.13-3.8.0 /usr/local/kafka

# add path info
cat > /usr/local/kafka/config/kraft/server.properties << EOF
process.roles=broker,controller
node.id=${NODE_ID}
controller.quorum.voters=1@${IP1}:9093,2@${IP2}:9093,3@${IP3}:9093
listeners=PLAINTEXT://:9092,CONTROLLER://:9093
inter.broker.listener.name=PLAINTEXT
advertised.listeners=PLAINTEXT://${localIp}:9092
controller.listener.names=CONTROLLER
listener.security.protocol.map=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,SSL:SSL,SASL_PLAINTEXT:SASL_PLAINTEXT,SASL_SSL:SASL_SSL
num.network.threads=8
num.io.threads=16
socket.send.buffer.bytes=102400
socket.receive.buffer.bytes=102400
socket.request.max.bytes=104857600
log.dirs=/data/kafka-data
num.partitions=3
num.recovery.threads.per.data.dir=1
offsets.topic.replication.factor=2
transaction.state.log.replication.factor=2
transaction.state.log.min.isr=1
log.flush.interval.ms=10000
log.retention.hours=24
log.segment.bytes=1073741824
log.retention.check.interval.ms=300000
default.replication.factor=2
EOF

echo "The kraft config: server.properties >>>"
cat /usr/local/kafka/config/kraft/server.properties


cat > /usr/lib/systemd/system/kafka.service << EOF
[Unit]
Description=Apache Kafka server
After=network.target

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/usr/local/kafka
ExecStart=/usr/local/kafka/bin/kafka-server-start.sh /usr/local/kafka/config/kraft/server.properties
ExecStop=/usr/local/kafka/bin/kafka-server-stop.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

echo "The service config: kafka.service >>>"
cat /usr/lib/systemd/system/kafka.service

# 调整内存设置，可选
sed -i 's#-Xmx1G -Xms1G#-Xmx4G -Xms4G#g' /usr/local/kafka/bin/kafka-server-start.sh
```

三台机器均执行上述脚本：

```
bash install.sh 10.100.8.201,10.100.8.202,10.100.8.203
```



### 格式化 kraft 存储

kraft 需要基于 uuid 作为存储格式化，首先生成一个 uuid （在任何一台机器上执行就行），或者也可以直接用我下面的也没关系(反正也没人知道，但是如果你有多个集群，请单独生成)。

```
cd /usr/local/kafka/
bin/kafka-storage.sh random-uuid
# 生成一个随机uuid
DlMxjaYFSz6pC3x5iVnmhA
```

在三台机器上分别使用上述生成的 uuid 进行格式化存储目录

```
# 3 台机器执行同样的操作
bin/kafka-storage.sh format -t DlMxjaYFSz6pC3x5iVnmhA -c /usr/local/kafka/config/kraft/server.properties
```



### 启动 kafka

通过systemd管理kafka启动.

```
systemctl daemon-reload
systemctl enable kafka
systemctl start kafka
 
 
# 停止/重启
systemctl stop kafka
systemctl restart kafka
```

日志目录位于：`/usr/local/kafka/logs/` 下，如果出错可以查看日志。

我遇到的错误是主机间端口不通，因为默认系统安装了 firewalld 防火墙，把 firewalld 关闭即可，或者可以开放 9092,9093 端口也可以。

```
systemctl stop firewalld
systemctl disable firewalld
```



## 功能验证

集群搭建好可以进行简单的验证。



### 创建查看topic

```
# 使用默认选项快速创建 topic，默认分区数（上述配置的为3），默认副本数2
bin/kafka-topics.sh --create --topic test --bootstrap-server localhost:9092
# 输出
Created topic test.

# 查看 topic 详情
bin/kafka-topics.sh --describe --topic test --bootstrap-server localhost:9092
# 输出，3分区2副本
Topic: test    TopicId: lybpwIyGSAyyJC2PKNTEAQ    PartitionCount: 3    ReplicationFactor: 2    Configs: flush.ms=10000,segment.bytes=1073741824
    Topic: test    Partition: 0    Leader: 1    Replicas: 1,2    Isr: 1,2    Elr:     LastKnownElr: 
    Topic: test    Partition: 1    Leader: 2    Replicas: 2,3    Isr: 2,3    Elr:     LastKnownElr: 
    Topic: test    Partition: 2    Leader: 3    Replicas: 3,1    Isr: 3,1    Elr:     LastKnownElr:

# 创建指定分区数和副本的 topic
bin/kafka-topics.sh --create --topic test2 --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
bin/kafka-topics.sh --describe --topic test2 --bootstrap-server localhost:9092
Topic: test2    TopicId: tzeNkvuFQXWpY96Hma9AXw    PartitionCount: 3    ReplicationFactor: 1    Configs: flush.ms=10000,segment.bytes=1073741824
    Topic: test2    Partition: 0    Leader: 3    Replicas: 3    Isr: 3    Elr:     LastKnownElr: 
    Topic: test2    Partition: 1    Leader: 1    Replicas: 1    Isr: 1    Elr:     LastKnownElr: 
    Topic: test2    Partition: 2    Leader: 2    Replicas: 2    Isr: 2    Elr:     LastKnownElr:
 
# 查看 topic 列表
bin/kafka-topics.sh --list --bootstrap-server localhost:9092
# 输出
test
test2
```

分区 Partition 是从 0 开始标号的，0-2，表示3个分区

Leader 的数字对应 nodeId, 1 表示该分区在 node.id=1 机器上

Replicas 表示当前副本位置，如果有多个副本，比如 2 个副本，Replicas 可能是：2,3 表示当前分区有 2 个副本，分别位于 2, 3 节点上

Isr 表示当前与 Leader 保持一致的副本，如果有 2,3 副本，Isr 这里只有 2，则副本 3 正在同步中



### 生产消费消息

kafka 提供有 生产者脚本 和 消费者脚本，同时开启2个终端，边生产边消费

```
# 终端1负责生产消息，选择 topic test2
bin/kafka-console-producer.sh --topic test2 --bootstrap-server localhost:9092
>a
>b
>c
 
 
# 终端2负责消费消息
bin/kafka-console-consumer.sh --topic test2 --from-beginning --bootstrap-server localhost:9092
a
b
c
```



### 修改分区数

已存在的 topic 支持修改其 分区数，修改分区数比较简单，但**只能增加不能减少**分区数，增加分区数不需要做任何操作，已存在的数据不变，新产生的消息会按照新的分区数量进行分区选择。

```
# 修改 test2 分区数为4
bin/kafka-topics.sh --bootstrap-server localhost:9092 --alter --topic test2 --partitions 4
# 查看分区
bin/kafka-topics.sh --describe --topic test2 --bootstrap-server localhost:9092
Topic: test2    TopicId: tzeNkvuFQXWpY96Hma9AXw    PartitionCount: 4    ReplicationFactor: 1    Configs: flush.ms=10000,segment.bytes=1073741824
    Topic: test2    Partition: 0    Leader: 3    Replicas: 3    Isr: 3    Elr:     LastKnownElr: 
    Topic: test2    Partition: 1    Leader: 1    Replicas: 1    Isr: 1    Elr:     LastKnownElr: 
    Topic: test2    Partition: 2    Leader: 2    Replicas: 2    Isr: 2    Elr:     LastKnownElr: 
    Topic: test2    Partition: 3    Leader: 3    Replicas: 3    Isr: 3    Elr:     LastKnownElr: 
```



### 修改副本数

新增副本数需要准备一个 json 格式的文件，指定各分区的副本分布情况，例如我们增加 test 主题 的 partition0 分区到 1,2,3 三个节点：

```
bin/kafka-topics.sh --describe --topic test --bootstrap-server localhost:9092
Topic: test    TopicId: lybpwIyGSAyyJC2PKNTEAQ    PartitionCount: 3    ReplicationFactor: 2    Configs: flush.ms=10000,segment.bytes=1073741824
    Topic: test    Partition: 0    Leader: 1    Replicas: 1,2    Isr: 1,2    Elr:     LastKnownElr: 
    Topic: test    Partition: 1    Leader: 2    Replicas: 2,3    Isr: 2,3    Elr:     LastKnownElr: 
    Topic: test    Partition: 2    Leader: 3    Replicas: 3,1    Isr: 3,1    Elr:     LastKnownElr:

# 准备 json 文件
cat > increase-replicas.json << EOF
{"version":1,"partitions":[{"topic":"test","partition":0,"replicas":[1,2,3]}]}
EOF

# 执行副本调整
bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092 --reassignment-json-file increase-replicas.json --execute
Current partition replica assignment
# 输出的是当前分区重置前的配置，可以使用这个json文件回退
{"version":1,"partitions":[{"topic":"test","partition":0,"replicas":[1,2],"log_dirs":["any","any"]}]}

Save this to use as the --reassignment-json-file option during rollback
Successfully started partition reassignment for test-0

# 再次查看
bin/kafka-topics.sh --describe --topic test --bootstrap-server localhost:9092                                               
Topic: test    TopicId: lybpwIyGSAyyJC2PKNTEAQ    PartitionCount: 3    ReplicationFactor: 3    Configs: flush.ms=10000,segment.bytes=1073741824
    Topic: test    Partition: 0    Leader: 1    Replicas: 1,2,3    Isr: 1,2,3    Elr:     LastKnownElr: 
    Topic: test    Partition: 1    Leader: 2    Replicas: 2,3    Isr: 2,3    Elr:     LastKnownElr: 
    Topic: test    Partition: 2    Leader: 3    Replicas: 3,1    Isr: 3,1    Elr:     LastKnownElr:
```

如果需要将各个分区都进行新增，更改对应的 json 文件即可。

如果需要将副本进行减少，同样修改 json 文件即可。



### 分区迁移

分区迁移可以应用上述修改副本数的逻辑来处理，修改对应的json文件，指定新的分区即可，例如将 partition 1 从 node 2,3 迁移至 node 1,3

```
cat > reassign-partitions.json << EOF
{"version":1,"partitions":[{"topic":"test","partition":1,"replicas":[1,3]}]}
EOF

bin/kafka-topics.sh --describe --topic test --bootstrap-server localhost:9092                                               
Topic: test    TopicId: lybpwIyGSAyyJC2PKNTEAQ    PartitionCount: 3    ReplicationFactor: 3    Configs: flush.ms=10000,segment.bytes=1073741824
    Topic: test    Partition: 0    Leader: 1    Replicas: 1,2,3    Isr: 1,2,3    Elr:     LastKnownElr: 
    Topic: test    Partition: 1    Leader: 2    Replicas: 2,3    Isr: 2,3    Elr:     LastKnownElr: 
    Topic: test    Partition: 2    Leader: 3    Replicas: 3,1    Isr: 3,1    Elr:     LastKnownElr:

bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092 --reassignment-json-file reassign-partitions.json --execute
Current partition replica assignment
# 当前状态，可以使用这个json进行回退
{"version":1,"partitions":[{"topic":"test","partition":1,"replicas":[2,3],"log_dirs":["any","any"]}]}

Save this to use as the --reassignment-json-file option during rollback
Successfully started partition reassignment for test-1

# 再次查看
bin/kafka-topics.sh --describe --topic test --bootstrap-server localhost:9092                                                 
Topic: test    TopicId: lybpwIyGSAyyJC2PKNTEAQ    PartitionCount: 3    ReplicationFactor: 3    Configs: flush.ms=10000,segment.bytes=1073741824
    Topic: test    Partition: 0    Leader: 1    Replicas: 1,2,3    Isr: 1,2,3    Elr:     LastKnownElr: 
    Topic: test    Partition: 1    Leader: 1    Replicas: 1,3    Isr: 3,1    Elr:     LastKnownElr: 
    Topic: test    Partition: 2    Leader: 3    Replicas: 3,1    Isr: 3,1    Elr:     LastKnownElr:
```



### 删除topic

删除 topic, 先是标记 delete, 然后再逐步清理（需要点时间）

```
bin/kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic test2
 
 
ls -al /data/kafka-data/
drwxr-xr-x 2 root root 4096 Feb  5 15:50 test2-1.6e1e7b914dcf44d79e9e56c78b79d4b4-delete
drwxr-xr-x 2 root root 4096 Feb  5 15:50 test2-2.ffcfc0f6ac5e4b31a7fd9ac7e7de8b45-delete
drwxr-xr-x 2 root root 4096 Feb  5 17:23 test2-3.2b03b24f16bb45aeaaf36ac8f66251f8-delete

# 再次查看就会没有了
```

如果不希望 topic 被删除，可以在 `server.properties` 中新增一个配置项：新版本默认是 true, 支持删除 topic.

```
delete.topic.enable=false
```



## 性能测试

kafka 自带了性能测试工具，对 阿里云 c6r.2xlarge 8c16g 320G ESSD 进行了简单的测试：



### 生产测试

```
bin/kafka-producer-perf-test.sh --producer-props bootstrap.servers="10.100.8.201:9092,10.100.8.202:9092,10.100.8.203:9092" --topic test --num-records 10000000 --record-size 512 --throughput 10000000 --print-metrics
863242 records sent, 172648.4 records/sec (84.30 MB/sec), 106.5 ms avg latency, 500.0 ms max latency.
993109 records sent, 198621.8 records/sec (96.98 MB/sec), 1.6 ms avg latency, 15.0 ms max latency.
1029992 records sent, 205998.4 records/sec (100.59 MB/sec), 0.6 ms avg latency, 8.0 ms max latency.
1023433 records sent, 204686.6 records/sec (99.94 MB/sec), 0.5 ms avg latency, 9.0 ms max latency.
1023123 records sent, 204624.6 records/sec (99.91 MB/sec), 0.5 ms avg latency, 7.0 ms max latency.
1021540 records sent, 204308.0 records/sec (99.76 MB/sec), 0.5 ms avg latency, 14.0 ms max latency.
1009024 records sent, 201804.8 records/sec (98.54 MB/sec), 2.5 ms avg latency, 270.0 ms max latency.
1006730 records sent, 201346.0 records/sec (98.31 MB/sec), 5.2 ms avg latency, 504.0 ms max latency.
1022330 records sent, 204466.0 records/sec (99.84 MB/sec), 0.5 ms avg latency, 10.0 ms max latency.
10000000 records sent, 200276.381406 records/sec (97.79 MB/sec), 10.49 ms avg latency, 504.00 ms max latency, 1 ms 50th, 76 ms 95th, 228 ms 99th, 244 ms 99.9th.
```

设置每条消息 512bytes, 总共 10000000 条， 平均每秒写入 100MB，换算一下：1分钟6G，1小时360G，性能基本 OK。



### 消费测试

```
bin/kafka-consumer-perf-test.sh --bootstrap-server "10.100.8.201:9092,10.100.8.202:9092,10.100.8.203:9092" --topic test --messages 10000000
start.time, end.time, data.consumed.in.MB, MB.sec, data.consumed.in.nMsg, nMsg.sec, rebalance.time.ms, fetch.time.ms, fetch.MB.sec, fetch.nMsg.sec
2024-08-06 18:54:43:339, 2024-08-06 18:54:57:295, 4882.8306, 349.8732, 10000037, 716540.3411, 3856, 10100, 483.4486, 990102.6733
```

每秒消费 350M 10s 消费 3.5G，性能可以。

资料参考：https://www.cnblogs.com/arli/p/12574524.html



## 监控

可以通过 内部监控系统 对其端口进行监控：

- 9092，broker port
- 9093，controller port

可以部署一个 kafka ui 对多套kafka集群进行查看。

https://github.com/provectus/kafka-ui

当然，更流行的可能是基于 `prometheus + exporter` 的形式，内容太多了，回头再聊。

今天先分享到这里，有任何问题欢迎关注鄙人公&号：新质程序猿 找到我，我准备的有丰厚大礼包哟。