---
layout: post
title: Elasticsearch 实践三
tags: search
date: 2017-09-29 09:45:00 +800
---

前面对索引，集群有了大概的认识，本文我们将主要探讨一下搜索的原理，看ES是怎么分析和检索数据的。

## 确切值vs全文文本

Elasticsearch中的数据可以大致分为两种类型：确切值 和 全文文本。

确切值 `Foo`  和 `foo`  就并不相同。确切值 `2014`  和 `2014-09-15`  也不相同。

全文文本，从另一个角度来说是文本化的数据(常常以人类的语言书写)，比如一篇推文(Twitter的文章)或邮件正文。

确切值是很容易查询的，因为结果是二进制的 -- 要么匹配，要么不匹配。

而对于全文数据的查询来说，却有些微妙。我们不会去询问 这篇文档是否匹配查询要求？但是，我们会询问 这篇文档和查询的匹配程度如何？换句话说，对于查询条件，这篇文档的相关性有多高？

所谓的搜索引擎，如百度，谷歌，必应，他们就是处理人类语言，理解人类语言，预测并返回人类需要的结果。如下面的示例：

- 一个针对 "UK"  的查询将返回涉及 "United Kingdom"  的文档
- 一个针对 "jump"  的查询同时能够匹配 "jumped"  ，  "jumps"  ，  "jumping"  甚至 "leap"
- "johnny walker"  也能匹配 "Johnnie Walker"  ，  "johnnie depp"  及 "Johnny Depp"
- "fox news hunting"  能返回有关hunting on Fox News的故事，而 "fox hunting news"  也能返回关于fox hunting的新闻故
  事。

为了方便在全文文本字段中进行这些类型的查询，Elasticsearch首先对文本分析(analyzes)，然后使用结果建立一个倒排索
引。

## 倒排索引

Elasticsearch使用一种叫做倒排索引(inverted index)的结构来做快速的全文搜索。倒排索引由在文档中出现的唯一的单词列
表，以及对于每个单词在文档中的位置组成。

例如，我们有两个文档，每个文档 content  字段包含：

1. The quick brown fox jumped over the lazy dog
2. Quick brown foxes leap over lazy dogs in summer

为了创建倒排索引，我们首先切分每个文档的 content  字段为单独的单词。把所有的唯一词放入列表并排序，结果是这个样子的：

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/screenshot_20170929100237.png)

现在，如果我们想搜索 "quick brown"  ，我们只需要找到每个词在哪个文档中出现既可：

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/screenshot_20170929100357.png)

两个文档都匹配，但是第一个比第二个有更多的匹配项。 如果我们加入简单的相似度算法(similarity algorithm)，计算匹配
单词的数目，这样我们就可以说第一个文档比第二个匹配度更高。

但是在我们的倒排索引中还有些问题：

1. "Quick"  和 "quick"  被认为是不同的单词，但是用户可能认为它们是相同的。
2. "fox"  和 "foxes"  很相似，就像 "dog"  和 "dogs"  ——它们都是同根词。
3. "jumped"  和 "leap"  不是同根词，但意思相似——它们是同义词。

如果我们将词统一为标准格式，这样就可以找到不是确切匹配查询，但是足以相似从而可以关联的文档。例如：

1. "Quick"  可以转为小写成为 "quick"  。
2. "foxes"  可以被转为根形式 ""fox  。同理 "dogs"  可以被转为 "dog"  。
3. "jumped"  和 "leap"  同义就可以只索引为单个词 "jump"

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/screenshot_20170929101101.png)

这个标准化的过程叫做分词(analysis).

## 分析和分析器

分析(analysis)是这样一个过程：

1. 首先，切割一个文本块为适用于倒排索引单独的词(term)
2. 然后标准化这些词为标准形式，提高它们的可搜索性

这个工作是分析器(analyzer)完成的。一个分析器(analyzer)只是一个包装用于将三个功能放到一个包里。

**字符过滤器**

首先字符串经过字符过滤器(character filter)，它们的工作是在处理字符串。字符过滤器能够去除HTML标记，或者转换 "&"  为 "and"  。

**分词器**

下一步，分词器(tokenizer)被表征化（断词）为独立的词。一个简单的分词器(tokenizer)可以根据空格或逗号将单词分开
（中文会按字分）。

**表征过滤**

最后，每个词都通过所有表征过滤(token filters)，它可以修改词（例如将 "Quick"  转为小写），去掉词（例如停用词
像 "a"  、 "and"``"the"  等等），或者增加词（例如同义词像 "jump"  和 "leap"  ）

Elasticsearch提供很多开箱即用的字符过滤器，分词器和表征过滤器。这些可以组合来创建自定义的分析器以应对不同的需
求。

Elasticsearch还附带了一些预装的分析器，你可以直接使用它们。下面我们列出了最重要的几个分析器，来演示这个
字符串分词后的表现差异：

```
Set the shape to semi-transparent by calling set_trans(5)
```

### 标准分析器

标准分析器是Elasticsearch默认使用的分析器。对于文本分析，它对于任何语言都是最佳选择（就是没啥特殊需
求，对于任何一个国家的语言，这个分析器就够用了）。它根据预定义的单词边界(word boundaries)
来切分文本，然后去掉大部分标点符号。最后，把所有词转为小写。

```
set, the, shape, to, semi, transparent, by, calling, set_trans, 5
```

### 简单分析器

简单分析器将非单个字母的文本切分，然后把每个词转为小写。

```
set, the, shape, to, semi, transparent, by, calling, set, trans
```

### 空格分析器

空格分析器依据空格切分文本。它不转换小写。

```
Set, the, shape, to, semi-transparent, by, calling, set_trans(5)
```

### 语言分析器

特定语言分析器适用于很多语言。它们能够考虑到特定语言的特性。例如， english  分析器自带一套英语停用词库——
像 and  或 the  这些与语义无关的通用词。

english  分析器将会产生以下结果：

```
set, shape, semi, transpar, call, set_tran, 5
```

注意 "transparent"  、 "calling"  和 "set_trans"  是如何转为词干的。

### 当分析器被使用

当我们索引(index)一个文档，全文字段会被分析为单独的词来创建倒排索引。不过，当我们在全文字段搜索(search)时，我
们要让查询字符串经过同样的分析流程处理，以确保这些词在索引中存在。

- 当你查询全文(full text)字段，查询将使用相同的分析器来分析查询字符串，以产生正确的词列表。
- 当你查询一个确切值(exact value)字段，查询将不分析查询字符串，但是你可以自己指定。

### 测试分析器

尤其当你是Elasticsearch新手时，对于如何分词以及存储到索引中理解起来比较困难。为了更好的理解如何进行，你可以使用 analyze  API来查看文本是如何被分析的。在查询字符串参数中指定要使用的分析器，被分析的文本做为请求体：

```
curl 'http://localhost:9200/_analyze?analyzer=standard&pretty' -d 'Text to analyze'
{
  "tokens" : [ {
    "token" : "text",
    "start_offset" : 0,
    "end_offset" : 4,
    "type" : "<ALPHANUM>",
    "position" : 0
  }, {
    "token" : "to",
    "start_offset" : 5,
    "end_offset" : 7,
    "type" : "<ALPHANUM>",
    "position" : 1
  }, {
    "token" : "analyze",
    "start_offset" : 8,
    "end_offset" : 15,
    "type" : "<ALPHANUM>",
    "position" : 2
  } ]
}

curl 'http://localhost:9200/_analyze?analyzer=english&pretty' -d 'Set the shape to semi-transparent by calling set_trans(5)'
{
  "tokens" : [ {
    "token" : "set",
    "start_offset" : 0,
    "end_offset" : 3,
    "type" : "<ALPHANUM>",
    "position" : 0
  }, {
    "token" : "shape",
    "start_offset" : 8,
    "end_offset" : 13,
    "type" : "<ALPHANUM>",
    "position" : 2
  }, {
    "token" : "semi",
    "start_offset" : 17,
    "end_offset" : 21,
    "type" : "<ALPHANUM>",
    "position" : 4
  }, {
    "token" : "transpar",
    "start_offset" : 22,
    "end_offset" : 33,
    "type" : "<ALPHANUM>",
    "position" : 5
  }, {
    "token" : "call",
    "start_offset" : 37,
    "end_offset" : 44,
    "type" : "<ALPHANUM>",
    "position" : 7
  }, {
    "token" : "set_tran",
    "start_offset" : 45,
    "end_offset" : 54,
    "type" : "<ALPHANUM>",
    "position" : 8
  }, {
    "token" : "5",
    "start_offset" : 55,
    "end_offset" : 56,
    "type" : "<NUM>",
    "position" : 9
  } ]
}
```

结果中每个节点代表一个词，token  是一个实际被存储在索引中的词。 position  指明词在原文本中是第几个出现的。 start_offset  和 end_offset  表示词在原文本中占据的位置。

analyze  API 对于理解Elasticsearch索引的内在细节是个非常有用的工具。

## 再议索引

在前面的文章中我们介绍过类型的映射默认是由ES自动生成的，同时，我们是可以更改映射的，一个比较常见的更改就是更改分析器。

当Elasticsearch在你的文档中探测到一个新的字符串字段，它将自动设置它为全文 string  字段并用 standard  分析器分析。
你不可能总是想要这样做。也许你想使用一个更适合这个数据的语言分析器。或者，你只想把字符串字段当作一个普通的字
段——不做任何分析，只存储确切值，就像字符串类型的用户ID或者内部状态字段或者标签。

Elasticsearch支持以下简单字段类型：

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/screenshot_20170929105246.png)

当你索引一个包含新字段的文档——一个之前没有的字段——Elasticsearch将使用动态映射猜测字段类型，这类型来自于
JSON的基本数据类型，使用以下规则：

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/screenshot_20170929105408.png)

如果你索引一个带引号的数字—— "123"  ，它将被映射为 "string"  类型，而不是 "long"  类型。然而，如果
字段已经被映射为 "long"  类型，Elasticsearch将尝试转换字符串为long，并在转换失败时会抛出异常。

在ES简介一文我们介绍过类型的映射，这里又赘述了一遍强化记忆。

我们知道类型的字段有三个重要的属性，type, index 和 analyzer. type就不用说了，index再赘述一点：

![](https://bytesops.oss-cn-hangzhou.aliyuncs.com/picgo/screenshot_20170929110037.png)

其他简单类型—— long  、 double  、 date  等等——也接受 index  参数，但相应的值只能是 no  和 not_analyzed  ，它们
的值不能被分析。

index属性就是用来定义字符串类型是全文字段还是确切值的以及其他类型能否被确切搜到。

本文既然介绍了分析器，正好拉着类型映射一起探讨下。

对于 analyzed  类型的字符串字段，使用 analyzer  参数来指定哪一种分析器将在搜索和索引的时候使用。默认的，
Elasticsearch使用 standard  分析器，但是你可以通过指定一个内建的分析器来更改它，例
如 whitespace  、 simple  或 english  。

Lucene 中，一个文档由一组简单的键值对组成，一个字段至少需要有一个值，但是任何字段都可以有多个值。类似的，一个
单独的字符串可能在分析过程中被转换成多个值。Lucene 不关心这些值是字符串，数字或日期，所有的值都被当成字节，当我们在 Lucene 中索引一个文档时，每个字段的值都被加到相关字段的倒排索引中。

因为 Lucene 没有文档类型的概念，每个文档的类型名被储存在一个叫  `_type`  的元数据字段上。当我们搜索一种特殊类型的
文档时，Elasticsearch 简单的通过  `_type`  字段来过滤出这些文档。

Lucene 同样没有映射的概念。映射是 Elasticsearch 将复杂 JSON 文档映射成 Lucene 需要的扁平化数据的方式。
例如， user  类型中  name  字段的映射声明这个字段是一个  string  类型，在被加入倒排索引之前，它的数据需要通过
whitespace  分析器来分析。

```
{
  "name": {
    "type": "string",
    "analyzer": "whitespace"
  }
}
```

同时，我们可以自定义分析器

### 自定义分析器

虽然 Elasticsearch 内置了一系列的分析器，但是真正的强大之处在于定制你自己的分析器。你可以通过在配置文件中组合字
符过滤器，分词器和表征过滤器，来满足特定数据的需求。

在上面，我们提到 分析器 是三个顺序执行的组件的结合（字符过滤器，分词器，表征过滤器）。

**字符过滤器**

字符过滤器是让字符串在被分词前变得更加“整洁”。例如，如果我们的文本是 HTML 格式，它可能会包含一些我们不
想被索引的 HTML 标签，诸如  `&lt;p&gt;` 或  `&lt;div&gt;`  。

我们可以使用  `html_strip`  字符过滤器 来删除所有的 HTML 标签，并且将 HTML 实体转换成对应的 Unicode 字符，
比如将  `&Aacute;`  转成  `Á`  。

一个分析器可能包含零到多个字符过滤器。

**分词器**

一个分析器 必须 包含一个分词器。分词器将字符串分割成单独的词（terms）或表征（tokens）。 standard  分析器使
用  standard  分词器将字符串分割成单独的字词，删除大部分标点符号，但是现存的其他分词器会有不同的行为特
征。

例如， keyword  分词器输出和它接收到的相同的字符串，不做任何分词处理。[ whitespace  分词器]只通过空格来分割
文本。[ pattern  分词器]可以通过正则表达式来分割文本。

**表征过滤器**

分词结果的 表征流 会根据各自的情况，传递给特定的表征过滤器。

表征过滤器可能修改，添加或删除表征。我们已经提过  lowercase  和  stop  表征过滤器，但是 Elasticsearch 中有更
多的选择。 stemmer  表征过滤器将单词转化为他们的根形态（root form）。 ascii_folding  表征过滤器会删除变音符
号，比如从  très  转为  tres  。  ngram  和  edge_ngram  可以让表征更适合特殊匹配情况或自动完成。

下面我们阐述一下如何创建一个自定义分析器并使用。

自定义分析器是在索引设置中进行的。

```
PUT /my_index
{
  "settings": {
    "analysis": {
      "char_filter": { ... custom character filters ... },
      "tokenizer": { ... custom tokenizers ... },
      "filter": { ... custom token filters ... },
      "analyzer": { ... custom analyzers ... }
    }
  }
}
```

作为例子，我们来配置一个这样的分析器：

1. 用  html_strip  字符过滤器去除所有的 HTML 标签
2. 将  &  替换成  and  ，使用一个自定义的  mapping  字符过滤器
3. 使用  standard  分词器分割单词
4. 使用  lowercase  表征过滤器将词转为小写
5. 用  stop  表征过滤器去除一些自定义停用词。

```
curl -XPUT 'http://localhost:9200/my_index?pretty' -d '
{
  "settings": {
    "analysis": {
      "char_filter": {
        "&_to_and": {
          "type": "mapping",
          "mappings": [ "&=> and "]
        }
      },
      "filter": {
        "my_stopwords": {
          "type": "stop",
          "stopwords": [ "the", "a" ]
        }
      },
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "char_filter": [ "html_strip", "&_to_and" ],
          "tokenizer": "standard",
          "filter": [ "lowercase", "my_stopwords" ]
        }
      }
    }
  }
}'
```

创建索引后，用  analyze  API 来测试新的分析器：

```
curl 'http://localhost:9200/my_index/_analyze?analyzer=my_analyzer&pretty' -d 'The quick & brown fox'

{
  "tokens" : [ {
    "token" : "quick",
    "start_offset" : 4,
    "end_offset" : 9,
    "type" : "<ALPHANUM>",
    "position" : 1
  }, {
    "token" : "and",
    "start_offset" : 10,
    "end_offset" : 11,
    "type" : "<ALPHANUM>",
    "position" : 2
  }, {
    "token" : "brown",
    "start_offset" : 12,
    "end_offset" : 17,
    "type" : "<ALPHANUM>",
    "position" : 3
  }, {
    "token" : "fox",
    "start_offset" : 18,
    "end_offset" : 21,
    "type" : "<ALPHANUM>",
    "position" : 4
  } ]
}
```

除非我们告诉 Elasticsearch 在哪里使用，否则分析器不会起作用。我们可以通过下面的映射将它应用在一个  string  类型的
字段上：

```
curl -XPUT 'http://localhost:9200/my_index/_mapping/my_type?pretty' -d '
{
  "properties": {
    "title": {
      "type": "string",
      "analyzer": "my_analyzer"
    }
  }
}'

curl 'http://localhost:9200/my_index/_mapping?pretty'
{
  "my_index" : {
    "mappings" : {
      "my_type" : {
        "properties" : {
          "title" : {
            "type" : "string",
            "analyzer" : "my_analyzer"
          }
        }
      }
    }
  }
}
```

## IK分词器

分词，英语分词很好分，就是按固定的英文的空格，或者“-”。中文分词就稍微有点复杂了，当前比较流行的中文分词器还是IK分词器。

[项目地址](https://github.com/medcl/elasticsearch-analysis-ik)

我们使用标准分词器测试中文分词：

```
curl 'http://localhost:9200/_analyze?analyzer=standard&pretty' -d '我是一个中国人'
{
  "tokens" : [ {
    "token" : "我",
    "start_offset" : 0,
    "end_offset" : 1,
    "type" : "<IDEOGRAPHIC>",
    "position" : 0
  }, {
    "token" : "是",
    "start_offset" : 1,
    "end_offset" : 2,
    "type" : "<IDEOGRAPHIC>",
    "position" : 1
  }, {
    "token" : "一",
    "start_offset" : 2,
    "end_offset" : 3,
    "type" : "<IDEOGRAPHIC>",
    "position" : 2
  }, {
    "token" : "个",
    "start_offset" : 3,
    "end_offset" : 4,
    "type" : "<IDEOGRAPHIC>",
    "position" : 3
  }, {
    "token" : "中",
    "start_offset" : 4,
    "end_offset" : 5,
    "type" : "<IDEOGRAPHIC>",
    "position" : 4
  }, {
    "token" : "国",
    "start_offset" : 5,
    "end_offset" : 6,
    "type" : "<IDEOGRAPHIC>",
    "position" : 5
  }, {
    "token" : "人",
    "start_offset" : 6,
    "end_offset" : 7,
    "type" : "<IDEOGRAPHIC>",
    "position" : 6
  } ]
}
```

每个字一个词，哈哈，好像不是我想要的。

我使用的ES是2.4.4，ES IK提供的发行包没有对于2.4.4的，不过没关系，你只需要将其解压修改其中的`plugin-descriptor.properties`的`elasticsearch.version=2.4.5`为`elasticsearch.version=2.4.4`即可。

在这里我使用自己打包的。

把2.x版本的ik项目下到本地。

在elasticsearch-analysis-ik-2.x目录下，修改pom.xml中的`elasticsearch.version`为2.4.4, 执行

```
mvn clean package -DskipTests
```

等待maven打包完成，构建成功后，你可以看到有一个：`target/releases/elasticsearch-analysis-ik-1.10.5.zip`

将zip包中的内容解压到es的`plugins/ik`目录下.

```
[es@master ik]$ pwd
/home/es/elasticsearch-2.4.4/plugins/ik
[es@master ik]$ ll
total 1412
-rw-r--r--. 1 es es 263965 Jun 29  2017 commons-codec-1.9.jar
-rw-r--r--. 1 es es  61829 Mar 20 20:53 commons-logging-1.2.jar
drwxr-xr-x. 3 es es   4096 Sep 29  2017 config
-rw-r--r--. 1 es es  56010 Sep 29  2017 elasticsearch-analysis-ik-1.10.5.jar
-rw-r--r--. 1 es es 720931 Sep 29  2017 httpclient-4.4.1.jar
-rw-r--r--. 1 es es 322234 Sep 29  2017 httpcore-4.4.1.jar
-rw-r--r--. 1 es es   2667 Sep 29  2017 plugin-descriptor.properties
```

启动es.

```
bin/elasticsearch
...
[2017-06-11 16:18:10,442][INFO ][ik-analyzer              ] try load config from /home/es/elasticsearch-2.4.4/config/analysis-ik/IKAnalyzer.cfg.xml
[2017-06-11 16:18:10,443][INFO ][ik-analyzer              ] try load config from /home/es/elasticsearch-2.4.4/plugins/ik/config/IKAnalyzer.cfg.xml
[2017-06-11 16:18:11,455][INFO ][ik-analyzer              ] [Dict Loading] custom/mydict.dic
[2017-06-11 16:18:11,461][INFO ][ik-analyzer              ] [Dict Loading] custom/single_word_low_freq.dic
[2017-06-11 16:18:11,464][INFO ][ik-analyzer              ] [Dict Loading] custom/ext_stopword.dic
...
```

再次执行上述的分词测试：

```
curl 'http://localhost:9200/_analyze?analyzer=ik&pretty' -d '我是一个中国人'
{
  "tokens" : [ {
    "token" : "我",
    "start_offset" : 0,
    "end_offset" : 1,
    "type" : "CN_CHAR",
    "position" : 0
  }, {
    "token" : "一个中国",
    "start_offset" : 2,
    "end_offset" : 6,
    "type" : "CN_WORD",
    "position" : 1
  }, {
    "token" : "一个",
    "start_offset" : 2,
    "end_offset" : 4,
    "type" : "CN_WORD",
    "position" : 2
  }, {
    "token" : "一",
    "start_offset" : 2,
    "end_offset" : 3,
    "type" : "TYPE_CNUM",
    "position" : 3
  }, {
    "token" : "个中",
    "start_offset" : 3,
    "end_offset" : 5,
    "type" : "CN_WORD",
    "position" : 4
  }, {
    "token" : "个",
    "start_offset" : 3,
    "end_offset" : 4,
    "type" : "COUNT",
    "position" : 5
  }, {
    "token" : "中国人",
    "start_offset" : 4,
    "end_offset" : 7,
    "type" : "CN_WORD",
    "position" : 6
  }, {
    "token" : "中国",
    "start_offset" : 4,
    "end_offset" : 6,
    "type" : "CN_WORD",
    "position" : 7
  }, {
    "token" : "国人",
    "start_offset" : 5,
    "end_offset" : 7,
    "type" : "CN_WORD",
    "position" : 8
  } ]
}
```

解析的还可以，至少分出了词组短语。

将zip包按同样的方式安装到其他实例上即可。

有兴趣研究分词的可以自行研究一下。