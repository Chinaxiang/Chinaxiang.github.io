---
layout: post
title: Elasticsearch 实践一
tags: search
date: 2017-09-27 10:52:00 +800
---

在前面两篇文章中我们知道了ES的基本概念和安装，还没有真正使用ES, 本篇文章就以一个实例来简单入门ES的使用。

我们就以博客文章作为我们的数据资源吧。

<table>
<thead>
<tr>
<th>字段</th>
<th>内容</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<p>title</p>
</td>
<td>
<p>Elasticsearch 简介</p>
</td>
</tr>
<tr>
<td>
<p>author</p>
</td>
<td>
<p>China祥</p>
</td>
</tr>
<tr>
<td>
<p>date</p>
</td>
<td>
<p>2017-09-25 17:00:00</p>
</td>
</tr>
<tr>
<td>
<p>content</p>
</td>
<td>
<p>Elasticsearch 是一个分布式、可扩展、实时的搜索与数据分析引擎。</p>
</td>
</tr>
<tr>
<td>
<p>view</p>
</td>
<td>
<p>520</p>
</td>
</tr>
</tbody>
</table>

## 索引

索引可以自动创建或者手动创建。

### 自动创建索引

我们知道，ES中文档归属于类型，类型归属于索引（名词），并且文档需要唯一id, 所以我们要想把我们的博客索引（动词）到ES中，需要指定索引，类型和id。

索引的名字必须是全部小写，不能以下划线开头，不能包含逗号。

```
curl -XPUT 'http://localhost:9200/blog/es/1?pretty' -d '
{
  "title": "Elasticsearch 简介",
  "author": "China祥",
  "date": "2017-09-25 17:00:00",
  "content": "Elasticsearch 是一个分布式、可扩展、实时的搜索与数据分析引擎。",
  "view": 520
}'

响应
{
  "_index" : "blog",
  "_type" : "es",
  "_id" : "1",
  "_version" : 1,
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "created" : true
}
```

索引成功，ES默认创建的索引会分配5个分片，1套副本，我们的blog索引应该在集群中有5个主分片和5个副本分片，上面响应的内容中的分片信息表示我们的文档分布到一个主分片和一个副分片上。

Elasticsearch中每个文档都有版本号，每当文档变化（包括删除）都会使_version增加。

通过head插件查看集群状态。


5个主分片和5个副分片均匀的分布在两台机器上。

使用API查看集群索引情况：

```
curl 'http://localhost:9200/_cat/indices?v'
health status index pri rep docs.count docs.deleted store.size pri.store.size 
green  open   blog    5   1          1            0     10.3kb          5.1kb
```

字段的意思我就不解释了，一看就懂。

使用API查看blog索引情况：

```
curl 'http://localhost:9200/blog?pretty'
{
  "blog" : {
    "aliases" : { },
    "mappings" : {
      "es" : {
        "properties" : {
          "author" : {
            "type" : "string"
          },
          "content" : {
            "type" : "string"
          },
          "date" : {
            "type" : "string"
          },
          "title" : {
            "type" : "string"
          },
          "view" : {
            "type" : "long"
          }
        }
      }
    },
    "settings" : {
      "index" : {
        "creation_date" : "1493476075976",
        "number_of_shards" : "5",
        "number_of_replicas" : "1",
        "uuid" : "4V3CIzB1QaWk2ZjridHD4w",
        "version" : {
          "created" : "2040499"
        }
      }
    },
    "warmers" : { }
  }
}
```

如果我们的数据没有自然ID，我们可以让Elasticsearch自动为我们生成。请求结构发生了变化：PUT方法变成了POST方法。

```
curl -XPOST 'http://localhost:9200/blog/es?pretty' -d '
{
  "title": "Elasticsearch 简介",
  "author": "China祥",
  "date": "2017-09-25 17:00:00",
  "content": "Elasticsearch 是一个分布式、可扩展、实时的搜索与数据分析引擎。",
  "view": 520
}'

响应
{
  "_index" : "blog",
  "_type" : "es",
  "_id" : "AVyN0uHFG5-coKOZVPlw",
  "_version" : 1,
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "created" : true
}
```

生成的`_id`为`AVyN0uHFG5-coKOZVPlw`.

事实上，你可以通过在  `config/elasticsearch.yml`  中添加下面的配置来防止自动创建索引。

```
action.auto_create_index: false
```

### 手动创建索引

虽说ES可以帮我们自动创建索引，不过有时我们想自己控制。

提示: Elasticsearch 提供了优化好的默认配置。除非你明白这些配置的行为和为什么要这么做，请不要修改这些配置。

下面我们创建具有2个分片2份副本的blog2索引。

```
curl -XPUT 'http://localhost:9200/blog2?pretty' -d '
{
  "settings": {
    "number_of_shards" :   2,
    "number_of_replicas" : 2
  }
}'

响应
{
  "acknowledged" : true
}
```

查看索引情况：

```
curl 'http://localhost:9200/_cat/indices?v'
health status index pri rep docs.count docs.deleted store.size pri.store.size 
green  open   blog    5   1          2            0     19.2kb          9.6kb 
yellow open   blog2   2   2          0            0       520b           260b
```

blog2索引2个主分片，2份副本，之所以health是yellow(亚健康)，是因为我只有两个实例，一个实例放一份数据，还有一份副本没有可用的实例去分配，直到当另外一个节点加入到这个集群后才能分配。一旦那份复制在第三个节点上被分配，这个索引的健康状态就会变成绿色。

通过head查看更明了

### 索引配置

在创建索引的时候我们可以指定相关配置。

下面是两个最重要的设置：

- `number_of_shards`: 定义一个索引的主分片个数，默认值是 `5`。这个配置在索引创建后不能修改。
- `number_of_replicas`: 每个主分片的复制分片个数，默认是 `1`。这个配置可以随时在活跃的索引上修改。

例如，我们可以动态修改上面的blog2索引复制分片份数：

```
curl -XPUT 'http://localhost:9200/blog2/_settings?pretty' -d '
{
  "number_of_replicas": 1
}'

响应
{
  "acknowledged" : true
}
```

这时我们的blog2分片的健康状况就是绿色了，因为两份数据可以分别存放在两台实例上。

索引另一个可配置的项是analysis即分析器，它是搜索引擎很重要的内容，后续我们单独再介绍吧，目前只使用ES默认的即可。

### 删除索引

用以下的请求来 删除索引:

- `DELETE /my_index`
- `DELETE /index_one,index_two` 删除多个索引
- `DELETE /index_*` 删除index_ 开头的索引
- `DELETE /_all` 删除所有索引
- `DELETE /*` 删除所有索引

对一些人来说，能够用单个命令来删除所有数据可能会导致可怕的后果。如果你想要避免意外的大量删除, 你可以在你的 `elasticsearch.yml` 做如下配置：

```
action.destructive_requires_name: true
```

这个设置使删除只限于特定名称指向的数据, 而不允许通过指定 `_all` 或通配符来删除指定索引库。

删除blog2索引：

```
curl -XDELETE 'http://localhost:9200/blog2?pretty'

响应
{
  "acknowledged" : true
}
```

## 类型

索引包含1个或多个类型，类型相当于数据库的表，对于表我们比较熟悉，表有字段类型定义，同样类型也有字段类型定义，不过它叫映射（mappings）.

类型也是会自动创建的，如上面我们的blog索引下的es类型，类型的映射关系也会智能匹配，如我们创建的博客索引映射关系：

```
查看blog类型映射
curl 'http://localhost:9200/blog/_mapping?pretty'
{
  "blog" : {
    "mappings" : {
      "es" : {
        "properties" : {
          "author" : {
            "type" : "string"
          },
          "content" : {
            "type" : "string"
          },
          "date" : {
            "type" : "string"
          },
          "title" : {
            "type" : "string"
          },
          "view" : {
            "type" : "long"
          }
        }
      }
    }
  }
}
查看es类型映射
curl 'http://localhost:9200/blog/_mapping/es?pretty'
{
  "blog" : {
    "mappings" : {
      "es" : {
        "properties" : {
          "author" : {
            "type" : "string"
          },
          "content" : {
            "type" : "string"
          },
          "date" : {
            "type" : "string"
          },
          "title" : {
            "type" : "string"
          },
          "view" : {
            "type" : "long"
          }
        }
      }
    }
  }
}
```

在ES 简介一文中我们也提到过类型，对于没有特殊要求情况下，默认的映射即可满足我们的需求，不过还是比较建议根据实际业务需要构建合适的类型映射。

如上面我们博客文章的日期，我们应该指定为date类型更合适。对于已经有映射的字段，我们不能对其进行更改和删除，不过我们可以新增映射关系。

```
curl -XPUT 'http://localhost:9200/blog/_mapping/es?pretty' -d '
{
  "properties" : {
    "date" : {
      "type" : "date"
    }
  }
}'

响应
{
  "error" : {
    "root_cause" : [ {
      "type" : "remote_transport_exception",
      "reason" : "[node-slave1][192.168.163.130:9300][indices:admin/mapping/put]"
    } ],
    "type" : "illegal_argument_exception",
    "reason" : "mapper [date] of different type, current_type [string], merged_type [date]"
  },
  "status" : 400
}
```

我们可以新增一个字段：

```
curl -XPUT 'http://localhost:9200/blog/_mapping/es?pretty' -d '
{
  "properties" : {
    "update" : {
      "type" : "date"
    }
  }
}'

{
  "acknowledged" : true
}

curl 'http://localhost:9200/blog/_mapping/es?pretty'
{
  "blog" : {
    "mappings" : {
      "es" : {
        "properties" : {
          "author" : {
            "type" : "string"
          },
          "content" : {
            "type" : "string"
          },
          "date" : {
            "type" : "string"
          },
          "title" : {
            "type" : "string"
          },
          "update" : {
            "type" : "date",
            "format" : "strict_date_optional_time||epoch_millis"
          },
          "view" : {
            "type" : "long"
          }
        }
      }
    }
  }
}
```

我们可以在创建索引或更新索引时配置类型映射。

```
curl -XPUT 'http://localhost:9200/blog2?pretty' -d '
{
  "mappings": {
    "es" : {
      "properties" : {
        "author" : {
          "type" : "string"
        },
        "content" : {
          "type" : "string"
        },
        "date" : {
          "type" : "date"
        },
        "title" : {
          "type" : "string"
        },
        "view" : {
          "type" : "long"
        }
      }
    }
  }
}'

{
  "acknowledged" : true
}

curl 'http://localhost:9200/blog2/_mapping/es?pretty'
{
  "blog2" : {
    "mappings" : {
      "es" : {
        "properties" : {
          "author" : {
            "type" : "string"
          },
          "content" : {
            "type" : "string"
          },
          "date" : {
            "type" : "date",
            "format" : "strict_date_optional_time||epoch_millis"
          },
          "title" : {
            "type" : "string"
          },
          "view" : {
            "type" : "long"
          }
        }
      }
    }
  }
}
```

在ES简介一文中对类型做过介绍不再过多赘述，这里再补充一点复合域（字段）的内容。

除了我们提到的简单标量数据类型， JSON 还有 null 值，数组，和对象，这些 Elasticsearch 都是支持的。

多值域

很有可能，我们希望 tag 域 包含多个标签。我们可以以数组的形式索引标签：

```
{ 
  "tag": [ "search", "nosql" ]
}
```

数组中所有的值必须是相同数据类型的。你不能将日期和字符串混在一起。如果你通过索引数组来创建新的域，Elasticsearch 会用数组中第一个值的数据类型作为这个域的类型。

数组是以多值域索引的，可以被搜索到。

空域

当然，数组可以为空。 这相当于存在零个值。 事实上，在 Lucene 中是不能存储 null 值的，所以我们认为存在 null 值的域为空域。

下面三种域被认为是空的，它们将不会被索引：

```
{
  "null_value":               null,
  "empty_array":              [],
  "array_with_null_value":    [ null ]
}
```

多层级对象

我们讨论的最后一个 JSON 原生数据类是 对象。

内部对象 经常用于 嵌入一个实体或对象到其它对象中。例如，与其在 tweet 文档中包含 user_name 和 user_id 域，我们也可以这样写：

```
curl -XPUT 'http://localhost:9200/website/tweet/1?pretty' -d '
{
  "tweet":"Elasticsearch is very flexible",
  "user": {
    "id":  "@johnsmith",
    "gender": "male",
    "age":  26,
    "name": {
      "full": "John Smith",
      "first": "John",
      "last": "Smith"
    }
  }
}'

{
  "_index" : "website",
  "_type" : "tweet",
  "_id" : "1",
  "_version" : 1,
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "created" : true
}
```

Elasticsearch 会动态 监测新的对象域并映射它们为 对象 ，在 properties 属性下列出内部域：

```
curl 'http://localhost:9200/website/_mapping/tweet?pretty'
{
  "website" : {
    "mappings" : {
      "tweet" : {
        "properties" : {
          "tweet" : {
            "type" : "string"
          },
          "user" : {
            "properties" : {
              "age" : {
                "type" : "long"
              },
              "gender" : {
                "type" : "string"
              },
              "id" : {
                "type" : "string"
              },
              "name" : {
                "properties" : {
                  "first" : {
                    "type" : "string"
                  },
                  "full" : {
                    "type" : "string"
                  },
                  "last" : {
                    "type" : "string"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

内部对象是如何索引的?

Lucene 不理解内部对象。 Lucene 文档是由一组键值对列表组成的。为了能让 Elasticsearch 有效地索引内部类，它把我们的文档转化成这样：

```
{
  "tweet":            [elasticsearch, flexible, very],
  "user.id":          [@johnsmith],
  "user.gender":      [male],
  "user.age":         [26],
  "user.name.full":   [john, smith],
  "user.name.first":  [john],
  "user.name.last":   [smith]
}
```

内部域 可以通过名称引用（例如， first ）。为了区分同名的两个域，我们可以使用全 路径 （例如， `user.name.first` ） 或 type 名加路径（ `tweet.user.name.first` ）。

内部对象数组

最后，考虑包含 内部对象的数组是如何被索引的。 假设我们有个 followers 数组：

```
{
  "followers": [
    { "age": 35, "name": "Mary White"},
    { "age": 26, "name": "Alex Jones"},
    { "age": 19, "name": "Lisa Smith"}
  ]
}
```

这个文档会像我们之前描述的那样被扁平化处理，结果如下所示：

```
{
  "followers.age":    [19, 26, 35],
  "followers.name":   [alex, jones, lisa, smith, mary, white]
}
```

{age: 35} 和 {name: Mary White} 之间的相关性已经丢失了，因为每个多值域只是一包无序的值，而不是有序数组。

我们可以回答这个问题：有一个26岁的追随者？

但是我们不能得到一个准确的答案：是否有一个26岁 名字叫 Alex Jones 的追随者？

## 集群健康

我们前面多次见到green, yellow这些字眼，在这里顺便给大家介绍一下集群健康的内容吧。

ES提供API接口用来查询集群的健康情况：

```
curl 'http://localhost:9200/_cluster/health?pretty'
{
  "cluster_name" : "my_search",
  "status" : "green",
  "timed_out" : false,
  "number_of_nodes" : 2,
  "number_of_data_nodes" : 2,
  "active_primary_shards" : 15,
  "active_shards" : 30,
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

`status` 就是集群的状态，分为：green, yellow, red.

`status` 是我们最感兴趣的字段

`status` 字段提供一个综合的指标来表示集群的的服务状况。三种颜色各自的含义：

- green 所有主要分片和复制分片都可用
- yellow 所有主要分片可用，但不是所有复制分片都可用
- red 不是所有的主要分片都可用

其他字段看名称差不多知道个大概意思。

本文介绍了索引，类型及映射相关的内容，后续文章会继续实践ES.
