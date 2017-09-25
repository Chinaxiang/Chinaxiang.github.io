---
layout: post
title: ES 简介
tags: search
date: 2017-09-25 17:00:00 +800
---

Elasticsearch 是一个分布式、可扩展、实时的搜索与数据分析引擎。

## 简介

Elasticsearch 使用 Lucene 作为内部引擎，但是在你使用它做全文搜索时，只需要使用统一开发好的API即可，而并不需要了解其背后复杂的 Lucene 的运行原理。  
当然 Elasticsearch 并不仅仅是 Lucene 那么简单，它不仅包括了全文搜索功能，还可以进行以下工作:

- 分布式实时文件存储，并将每一个字段都编入索引，使其可以被搜索。
- 实时分析的分布式搜索引擎。
- 可以扩展到成百上万台服务器，处理PB级别的结构化或非结构化数据。

相关网址：

- [Elasticsearch 官网](https://www.elastic.co)
- [Elasticsearch 源码](https://github.com/elastic/elasticsearch)
- [Elasticsearch 权威指南（中文版）](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html)
- [Elasticsearch 中文社区](https://elasticsearch.cn/)

## 为什么要学习ES?

最好的学习方式就是解决问题，本系列文章的诞生也是工作所迫，不是为了学习ES而写文章，而是为了工作的痛点而记录备忘和分享。

就职的公司需要重构已有的搜索服务，主要查询如下内容：

- 几百万用户和组织
- 用户每天要产生很多会话，消息
- 用户的任务，日程

我要做的事情就是：用户输入一个字符串，要返回给用户相关的用户，组织，讨论组，任务，日程，聊天记录等等。

因为ES高效，灵活，方便使用，所以打算基于ES进行搜索重构。

## 概念术语

一个新事物，它总要有一些新的词汇定义，明白这些词汇的含义你将能更好更快的接受新事物。



