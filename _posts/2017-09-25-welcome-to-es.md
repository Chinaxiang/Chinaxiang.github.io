---
layout: post
title: Elasticsearch 简介
tags: search
date: 2017-09-25 17:00:00 +800
---

Elasticsearch 是一个分布式、可扩展、实时的搜索与数据分析引擎。

## 简介

Elasticsearch 使用 Lucene 作为内部引擎，但是在你使用它做全文搜索时，只需要使用统一开发好的API即可，而并不需要了解其背后复杂的 Lucene 的运行原理。  
当然 Elasticsearch 并不仅仅是 Lucene 那么简单，它不仅包括了全文搜索功能，还可以进行以下工作:

- 分布式实时文件存储，并将每一个字段都编入索引，使其可以被搜索。
- 实时分析的分布式搜索引擎。
- 可以扩展到成百上千台服务器，处理PB级别的结构化或非结构化数据。

相关网址：

- [Elasticsearch 官网](https://www.elastic.co)
- [Elasticsearch 源码](https://github.com/elastic/elasticsearch)
- [Elasticsearch 权威指南（中文版）](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html)
- [Elasticsearch 中文社区](https://elasticsearch.cn/)

## 为什么要学习ES?

最好的学习方式就是解决问题，本系列文章的诞生也是工作所迫，不是为了学习ES而写文章，而是为了工作的痛点而记录备忘和分享。

就职的公司需要重构已有的搜索服务，主要查询如下内容：

- 几百万企业用户和组织
- 用户每天要产生很多会话，消息
- 用户的任务，日程

我要做的事情就是：用户输入一个字符串，要返回给用户相关的用户，组织，讨论组，任务，日程，聊天记录等等。

因为ES高效，灵活，方便使用，所以打算基于ES进行搜索重构。

## 概念术语

一个新事物，它总要有一些新的词汇定义，明白这些词汇的含义你将能更好更快的接受新事物。

### cluster

代表集群，集群中有多个节点，其中有一个为主节点，这个主节点是可以通过选举产生的，主从节点是对于集群内部来说的。

es是去中心化的，字面上理解就是无中心节点，这是对于集群外部来说的，因为从外部来看es集群，在逻辑上是个整体，你与任何一个节点的通信和与整个es集群通信是等价的。

### shards

代表索引分片，es可以把一个完整的索引分成多个分片，这样的好处是可以把一个大的索引拆分成多个，分布到不同的节点上。构成分布式搜索。

### replicas

代表索引副本，es可以设置多个索引的副本，副本的作用一是提高系统的容错性，当某个节点某个分片损坏或丢失时可以从副本中恢复，二是提高es的查询效率，es会自动对搜索请求进行负载均衡。

### recovery

代表数据恢复或叫数据重新分布，es在有节点加入或退出时会根据机器的负载对索引分片进行重新分配，挂掉的节点重新启动时也会进行数据恢复。

### river

代表es的一个数据源，也是其它存储方式（如：数据库）同步数据到es的一个方法。  
它是以插件方式存在的一个es服务，通过读取river中的数据并把它索引到es中，官方的river有CouchDB的，RabbitMQ的，Twitter的，Wikipedia的。

### gateway

代表es索引快照的存储方式，es默认是先把索引存放到内存中，当内存满了时再持久化到本地硬盘。  
gateway对索引快照进行存储，当这个es集群关闭再重新启动时就会从gateway中读取索引备份数据。  
es支持多种类型的gateway，有本地文件系统（默认），分布式文件系统，Hadoop的HDFS和amazon的s3云存储服务。  

### discovery.zen

代表es的自动发现节点机制，es是一个基于p2p的系统，它先通过广播寻找存在的节点，再通过多播协议来进行节点之间的通信，同时也支持点对点的交互。

### transport

代表es内部节点或集群与客户端的交互方式，默认内部是使用tcp协议进行交互，同时它支持http协议（json格式）、thrift、servlet、memcached、zeroMQ等的传输协议（通过插件方式集成）。

## 索引

索引也属于概念术语，此处有意将其地位提升，因为我们所跟搜索打交道其实也就是在跟索引打交道。

索引是实际存储数据的地方，在ES中索引有名词和动词之分，这里所说的是名词（indices, 待查询数据的集合），还有动词（indexing, 建立索引之意）。

我们传统的数据存储是依托关系型数据库。  
数据库（databases） -> 表（tables） -> 行（rows） -> 列（columns） -> 不同类型的值（value）

在ES中有下面的对应关系。  
索引（indices） -> 类型（types） -> 文档（documents） -> 字段（fields） -> 不同类型的值（value）

索引相当于RDB中的数据库，ES集群可以建立多个索引。  
索引可以包含多个类型，即RDB中数据库中的表。  
类型可以包含多个文档，即RDB中表中的行。  
文档可以包含多个字段，即RDB中每行的列。  
字段对应各种类型的值，即RDB中列的不同类型的值。  

数据库是用来存储和查询的，同样ES也是用来存储和查询的。  
其实ES中的存储不叫存储，而叫索引。

与索引平级的内容是分片和副本，在创建索引的时候需要指定分片和副本的数量。

分片是将一个索引拆分，例如根据文档的hash值分配到不同的分片，副本是数据冗余，容错，为每个分片提供数据的备份。

### 文档

ES是面向文档(document oriented)的，知道NoSQL的同学很好理解文档，其实文档就是一个JSON对象：

```json
{
  "first_name" : "John",
  "last_name" :  "Smith",
  "age" :  25,
  "about" :  "I love to go rock climbing",
  "interests": [ "sports", "music" ]
}
```

JSON是ES数据传输的基本格式。我们索引数据需要使用JSON，我们查询索引需要使用JSON，查询的结果返回的还是JSON数据。

通常，每一个JSON对象都可以称为一个文档，但上面我们提到的和RDB行对应的文档有一些额外的属性。

ES的文档不只有数据。它还包含了元数据(metadata)——关于文档的信息。三个必须的元数据节点是：

- `_index` 文档存储的地方，索引，如website
- `_type` 文档代表的对象的分类，如blog
- `_id` 文档的唯一标识，在同一`_index`,`_type`下唯一

`_id`仅仅是一个字符串，它与`_index`和`_type`组合时，就可以在Elasticsearch中唯一标识一个文档。  
当创建一个文档，你可以自定义`_id`，也可以让Elasticsearch帮你自动生成。

如获取一篇文章的内容：

```
curl 'http://localhost:9200/website/blog/123?pretty'

{
  "_index" : "website",
  "_type" : "blog",
  "_id" : "123",
  "_version" : 1,
  "found" : true,
  "_source" : {
  "title" : "My first blog entry",
  "text" : "Just trying this out...",
  "date" : "2014/01/01"
  }
}
```

`_source`是文档的内容，文档有其他的一些属性。

### 类型

上面已经知道类型类似RDB的表，表一般是有表结构定义的，在ES中同样可以定义类型的结构，但这里叫做类型的映射，映射是可选的，ES默认会根据数据的类型自动构建合适的映射。

类型的映射(mapping)会告诉Elasticsearch不同的文档如何被索引和搜索。

映射(mapping)机制用于进行字段类型确认，将每个字段匹配为一种确定的数据类型(string, number, booleans, date等)。

```
curl -XGET 'http://localhost:9200/megacorp'

{
  "megacorp": {
  "aliases": {},
  "mappings": {
  "employee": {
  "properties": {
  "about": {
  "type": "string"
  },
  "age": {
  "type": "long"
  },
  "first_name": {
  "type": "string"
  },
  "interests": {
  "type": "string"
  },
  "last_name": {
  "type": "string"
  }
  }
  }
  },
  "settings": {
  "index": {
  "creation_date": "1493501236848",
  "number_of_shards": "5",
  "number_of_replicas": "1",
  "uuid": "bUOXe5jmRyahFH9lN2365g",
  "version": {
  "created": "2040499"
  }
  }
  },
  "warmers": {}
  }
}
```

Elasticsearch 支持 如下简单域(可以理解为字段，属性)类型：

- 字符串: string
- 整数 : byte, short, integer, long
- 浮点数: float, double
- 布尔型: boolean
- 日期: date

当你索引一个包含新域的文档--之前未曾出现-- Elasticsearch 会使用 动态映射 ，通过JSON中基本数据类型，尝试猜测域类型，使用如下规则：

- 布尔型: true 或者 false `boolean`
- 整数: 123 `long`
- 浮点数: 123.45 `double`
- 字符串，有效日期: 2014-09-15 `date`
- 字符串: foo bar `string`

尽管在很多情况下基本域数据类型 已经够用，但你经常需要为单独域自定义映射 ，特别是字符串域。

域最重要的属性是 type 。对于不是 string 的域，你一般只需要设置 type ：

```
{
  "number_of_clicks": {
  "type": "integer"
  }
}
```

默认， string 类型域会被全文索引（使用分词算法分词，可以模糊匹配）。就是说，它们的值在索引前，会通过一个分析器，针对于这个域的查询在搜索前也会经过一个分析器。

string 域映射的两个最重要 属性是 index 和 analyzer 。

index 属性控制怎样索引字符串。它可以是下面三个值：

- analyzed 首先分析字符串，然后索引它。换句话说，以全文索引这个域。
- not_analyzed 索引这个域，所以可以搜索到它，但索引指定的精确值。不对它进行分析。
- no Don’t index this field at all不索引这个域。这个域不会被搜索到。

string 域 index 属性默认是 analyzed 。如果我们想映射这个字段为一个精确值（比如用户登录名），我们需要设置它为 not_analyzed ：

```
{
  "username": {
  "type":   "string",
  "index":  "not_analyzed"
  }
}
```

其他简单类型（例如 long ， double ， date 等）也接受 index 参数，但有意义的值只有 no 和 not_analyzed ， 因为它们永远不会被分析。

analyzer 对于 analyzed 字符串域，用 analyzer 属性指定在搜索和索引时使用的分析器。默认，Elasticsearch 使用 `standard` 分析器， 但你可以指定一个内置的分析器替代它（或者也可以使用其他分词器，如IK中文分词器），例如 `whitespace` 、 `simple` 和 `english`：

```
{
  "title": {
  "type":   "string",
  "analyzer": "english"
  }
}
```

分词器对于搜索来说是很关键的，它是决定搜索准确性的重要因素，后面我们会再介绍分词的。

## 与ES交互

> Elasticsearch uses standard RESTful APIs and JSON. We also build and maintain clients in many languages such as Java, Python, .NET, and Groovy. Plus, our community has contributed many more. They’re easy to work with, feel natural to use, and, just like Elasticsearch, don't limit what you might want to do with them.

简言之，ES支持与多种语言进行交互。

如下内容摘自官网，没有实践。

### curl

```shell
curl -H "Content-Type: application/json" -XGET
'http://localhost:9200/social-*/_search' -d '{
  "query": {
  "match": {
    "message": "myProduct"
  }
  },
  "aggregations": {
  "top_10_states": {
    "terms": {
    "field": "state",
    "size": 10
    }
  }
  }
}'
```

### Java

```java
RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
          new HttpHost("localhost", 9200, "http")).build());
SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
searchSourceBuilder.query(QueryBuilders.matchAllQuery());      
searchSourceBuilder.aggregation(AggregationBuilders.terms("top_10_states").field("state").size(10));
SearchRequest searchRequest = new SearchRequest();
searchRequest.indices("social-*");
searchRequest.source(searchSourceBuilder);
SearchResponse searchResponse = client.search(searchRequest);
```

### Python

```
from elasticsearch import Elasticsearch
esclient = Elasticsearch(['localhost:9200'])
response = esclient.search(
	index='social-*',
	body={
	  "query": {
	    "match": {
	      "message": "myProduct"
	    }
	  },
	  "aggs": {
	    "top_10_states": {
	      "terms": {
	        "field": "state",
	        "size": 10
	      }
	    }
	  }
	}
)
```

### C Sharp

```
var client = new ElasticClient();
var searchResponse = client.Search<Tweet>(s => s
  .Index("social-*")
  .Query(q => q
    .Match(m => m
      .Field(f => f.Message)
      .Query("myProduct")
    )
  )
  .Aggregations(a => a
    .Terms("top_10_states", t => t
      .Field(f => f.State)
      .Size(10)
    )
  )
);
```

###  JavaScript

```js
var elasticsearch = require('elasticsearch');
var esclient = new elasticsearch.Client({
  host: 'localhost:9200'
});
esclient.search({
  index: 'social-*',
  body: {
  query: {
    match: { message: 'myProduct' }
  },
  aggs: {
    top_10_states: {
    terms: {
      field: 'state',
      size: 10
    }
    }
  }
  }
}
).then(function (response) {
  var hits = response.hits.hits;
}
);
```

### PHP

```php
$esclient = Elasticsearch\ClientBuilder::create()
        ->setHosts(["localhost:9200"])
        ->build();
$params = [
'index' => 'social-*',
'body' => [
  'query' => [
    'match' => [ 'message' => 'myProduct' ]
  ],
  'aggs' => [
    'top_10_states' => [
      'terms' => [
        'field' => 'state',
        'size' => 10,
      ]
    ]
  ]
]
];
$response = $esclient->search($params);
```

### Perl

```perl
use Search::Elasticsearch;
my $esclient = Search::Elasticsearch->new( nodes => 'localhost:9200' );
my $response = $esclient->search(
index => 'social-*',
body => {
    query => {
      match => { message => 'myProduct' }
    },
    aggs => {
      top_10_states => {
        terms => {
          field => 'state',
          size => 10
        }
      }
    }
  }
);
```

### Ruby

```ruby
require 'elasticsearch'
esclient = Elasticsearch::Client.new
response = esclient.search index: 'social-*', body: {
  query: {
  match: {
    message: 'myProduct'
  }
  },
  aggregations: {
  top_10_states: {
    terms: {
    field: 'state',
    size: 10
    }
  }
  }
}
```

## 分布式特性

Elasticsearch为分布式而生，而且它的设计隐藏了分布式本身的复杂性。

Elasticsearch在分布式概念上做了很大程度上的透明化，你不需要知道任何关于分布式系统、分片、集群发现或者其他大量的分布式概念。

Elasticsearch致力于隐藏分布式系统的复杂性。以下这些操作都是在底层自动完成的：

- 将你的文档分区到不同的容器或者分片(shards)中，它们可以存在于一个或多个节点中。
- 将分片均匀的分配到各个节点，对索引和搜索做负载均衡。
- 冗余每一个分片，防止硬件故障造成的数据丢失。
- 将集群中任意一个节点上的请求路由到相应数据所在的节点。
- 无论是增加节点，还是移除节点，分片都可以做到无缝的扩展和迁移。

Elasticsearch用于构建高可用和可扩展的系统。  
扩展的方式可以是购买更好的服务器(纵向扩展(vertical scale or scaling up))或者购买更多的服务器（横向扩展(horizontal scale or scaling out)）。

一个节点(node)就是一个Elasticsearch实例，而一个集群(cluster)由一个或多个节点组成，它们具有相同的`cluster.name`，它们协同工作，分享数据和负载。当加入新的节点或者删除一个节点时，集群就会感知到并平衡数据。

集群中一个节点会被选举为主节点(master),它将临时管理集群级别的一些变更，例如新建或删除索引、增加或移除节点等。
主节点不参与文档级别的变更或搜索，这意味着在流量增长的时候，该主节点不会成为集群的瓶颈。任何节点都可以成为主节点。

做为用户，我们能够与集群中的任何节点通信，包括主节点。
每一个节点都知道文档存在于哪个节点上，它们可以转发请求到相应的节点上。
我们访问的节点负责收集各节点返回的数据，最后一起返回给客户端。

索引只是一个概念，实际干活的是分片。
一个分片(shard)是一个最小级别“工作单元(worker unit)”,它只是保存了索引中所有数据的一部分。
现在我们只要知道分片就是一个Lucene实例，并且它本身就是一个完整的搜索引擎。
我们的文档存储在分片中，并且在分片中被索引，但是我们的应用程序不会直接与它们通信，取而代之的是，直接与索引通信。

分片是Elasticsearch在集群中分发数据的关键。
把分片想象成数据的容器。文档存储在分片中，然后分片分配到你集群中的节点上。
当你的集群扩容或缩小，Elasticsearch将会自动在你的节点间迁移分片，以使集群保持平衡。

理解这句话：**一个节点存在多个分片，一个索引包含多个分片，一个索引的分片可能存在于不同的节点上。**

分片可以是主分片(primary shard)或者是复制分片(replica shard)。
你索引中的每个文档属于一个单独的主分片和0个或多个复制分片，所以主分片的数量决定了索引最多能存储多少数据。

理论上主分片能存储的数据大小是没有限制的，限制取决于你实际的使用情况。
分片的最大容量完全取决于你的使用状况：硬件存储的大小、文档的大小和复杂度、如何索引和查询你的文档，以及你期望的响应时间。

复制分片只是主分片的一个副本，它可以防止硬件故障导致的数据丢失，同时可以提供读请求，比如搜索或者从别的shard取回文档。

当索引创建完成的时候，主分片的数量就固定了，但是复制分片的数量可以随时调整。

默认情况下，一个索引被分配5个主分片，一个复制分片。

本文没有实操，旨在对ES有一个简单的认识，做到心中有数。

后续会介绍ES的安装，分片及分发复制，索引类型配置，负载及扩容升级，分词器，API使用等。