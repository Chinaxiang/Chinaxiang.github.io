---
layout: post
title: SpringBoot实践(1)
tags: spring
date: 2018-03-06 09:06:00 +800
---

## 简介

Spring 官方网站本身使用Spring 框架开发，随着功能以及业务逻辑的日益复杂，应用伴随着大量的XML配置文件以及复杂的Bean依赖关系。 

随着Spring 3.0的发布，Spring IO团队逐渐开始摆脱XML配置文件，并且在开发过程中大量使用“约定优先配置”（convention over configuration）的思想来摆脱Spring框架中各种复杂的配置，衍生了Java Config。

Spring Boot正是在这样的一个背景下被抽象出来的开发框架，它本身并不提供Spring框架的核心特性以及扩展功能，只是用于快速、敏捷地开发新一代基于Spring框架的应用程序。也就是说，它并不是用来替代Spring的解决方案，而是和Spring框架紧密结合用于提升Spring开发者体验的工具。同时它集成了大量常用的第三方库配置（例如Jackson, JDBC, Mongo, Redis, Mail等等），Spring Boot应用中这些第三方库几乎可以零配置的开箱即用（out-of-the-box），大部分的Spring Boot应用都只需要非常少量的配置代码，开发者能够更加专注于业务逻辑。

Spring Boot不生成代码，且完全不需要XML配置。其主要目标如下： 

- 为所有的Spring开发工作提供一个更快、更广泛的入门经验。 
- 开箱即用，你也可以通过修改默认值来快速满足你的项目的需求。 
- 提供了一系列大型项目中常见的非功能性特性，如嵌入式服务器、安全、指标，健康检测、外部配置等。

[Spring Boot 官网](http://projects.spring.io/spring-boot/)

截止本文撰写时，Spring Boot发布的版本为 `2.0.0.RELEASE`.

## Hello World

让我们来写第一个Spring Boot程序吧。

到 http://start.spring.io/ 快速生成一个简单的maven工程。

![](http://qcdn.huangyanxiang.com/blog/screenshot_20180306101700.png)

> pom.xml

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.coder4j</groupId>
  <artifactId>sb</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <packaging>jar</packaging>

  <name>sb</name>
  <description>Demo project for Spring Boot</description>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.0.0.RELEASE</version>
    <relativePath/> <!-- lookup parent from repository -->
  </parent>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <java.version>1.8</java.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>


</project>
```

新建一个 `HelloController`

```
package com.coder4j.sb.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @RequestMapping
    public String home() {
        return "Hello World!";
    }
    
    @RequestMapping("/")
    public String home2() {
        return "Hello World 2!";
    }

    @RequestMapping({"/home3", "/h3"})
    public String home3() {
        return "Hello World 3!";
    }
}
```

执行 `SbApplication` 中的main函数，一个简单的SpringWeb应用就启动完成了。

访问 http://localhost:8080/xx

Hello World!

访问 http://localhost:8080/

Hello World 2!

注意URL与响应内容的区别，`@RequestMapping` 没有传入值，表示匹配所有的url, `@RequestMapping("/")` 表示匹配path `/`, 当然我们也可以指定多个 `@RequestMapping({"/home3", "/h3"})`.

## Controller

在上面的例子中，我们在Controller中使用 `@RestController` 注解，该注解是Spring 4.0引入的。查看源码可知其包含了 `@Controller` 和 `@ResponseBody` 注解。我们可以理解为 `@Controller` 的增强版。专门为RESTFUL接口而设计的，响应内容为JSON。

`@Controller` 用来响应页面，spring-boot 支持多种模版引擎包括： 

1. FreeMarker 
2. Groovy 
3. Thymeleaf （Spring 官网使用这个）
4. Mustache

关于Controller 方法可以接收参数使用`@RequestBody`、`@RequestParam`、`@ModelAttribute`、JSONObject、HttpEntity 等方式，皆与Spring的使用一样