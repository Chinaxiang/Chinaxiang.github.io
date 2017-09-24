---
layout: post
title: Jekyll With Liquid
tags: jekyll tool liquid
---

Jekyll的模板中可以使用Liquid语法进行取值，计算和数据处理，如果仅仅只为了使用Jekyll撰写博客文章，你可以不需要了解liquid, 但是如果你需要定制Jekyll的主题，灵活的控制你的站点，你确实有必要了解一些liquid相关的语法。

Liquid和大多数模板语言类似，也是比较简单的。

官方网址：

- [GitHub Project](https://github.com/Shopify/liquid)
- [GitHub Pages Doc](http://shopify.github.io/liquid/basics/introduction/)
- [官网](https://help.shopify.com/themes/liquid/basics)

## 概览

Liquid可以分为objects, tags, and filters.

使用英文双大括号对objects进行取值。

获取页面的标题:

```
{{ page.title }}
```

标签，例如：条件控制，循环，都是包裹在`{%` 和 `%}`中的。

如果user不为空，则输出user.name:

```
{% if user %}
  Hello {{ user.name }}!
{% endif %}
```

对于filter, 你可以理解为提供了一系列常用的方法，并且支持管道操作。

对url地址添加`.html`后缀：

```
{{ "/my/fancy/url" | append: ".html" }}
```

输出：

```
/my/fancy/url.html
```

首字母大写，然后在前面添加`Hello `:

```
{{ "adam!" | capitalize | prepend: "Hello " }}
```

输出：

```
Hello Adam!
```

是不是很easy?

## 操作符

Liquid包含如下操作符：

<table>
  <tbody>
    <tr>
      <td><code>==</code></td>
      <td>equals</td>
    </tr>
    <tr>
      <td><code>!=</code></td>
      <td>does not equal</td>
    </tr>
    <tr>
      <td><code>&gt;</code></td>
      <td>greater than</td>
    </tr>
    <tr>
      <td><code>&lt;</code></td>
      <td>less than</td>
    </tr>
    <tr>
      <td><code>&gt;=</code></td>
      <td>greater than or equal to</td>
    </tr>
    <tr>
      <td><code>&lt;=</code></td>
      <td>less than or equal to</td>
    </tr>
    <tr>
      <td><code>or</code></td>
      <td>logical or</td>
    </tr>
    <tr>
      <td><code>and</code></td>
      <td>logical and</td>
    </tr>
  </tbody>
</table>

举个栗子，你一看就懂得。

```
{% if product.title == "Awesome Shoes" %}
  These shoes are awesome!
{% endif %}

{% if product.type == "Shirt" or product.type == "Shoes" %}
  This is a shirt or a pair of shoes.
{% endif %}
```

另外还有一个操作符：`contains`, 它可以判断字符串的包含，还可以判断数组中的字符串包含关系（如果数组中是非字符串的，是不能判断出来的）。

```
{% if product.title contains 'Pack' %}
  This product's title contains the word Pack.
{% endif %}

{% if product.tags contains 'Hello' %}
  This product has been tagged with 'Hello'.
{% endif %}
```

## 数据类型

和大多数语言一样，Liquid也有常用的数据类型。

### Boolean

`true` or `false`

```
{% assign foo = true %}
{% assign bar = false %}
```

### Number

统一都叫数字，不分整型，浮点型了

```
{% assign my_int = 25 %}
{% assign my_float = 39.756 %}
```

### String

使用单引号或双引号包裹的字符串。

```
{% assign my_string = "Hello World!" %}
```

### Nil

类似js的undefined.

### Array

Liquid中无法单独定义出数组，不过你可以使用filter处理得到数组。

数组的取值采用普遍接受的索引取值方式：

```
{{ site.users[0] }}
{{ site.users[1] }}
{{ site.users[3] }}
```

对于数组比较常用的还有遍历操作：

```
{% for user in site.users %}
  {{ user }}
{% endfor %}
```

### Truthy and Falsy

这两个不叫数据类型，但是是条件判断的依据，他们叫：真 和 假。什么时候是真？什么时候是假？很简单，你只需要记着：Nil 和 false 是假，其他的都是真就对了，包括0，空字符串都是真。

<table>
  <thead>
    <tr>
      <th>&nbsp;</th>
      <th style="text-align: center">truthy</th>
      <th style="text-align: center">falsy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>true</td>
      <td style="text-align: center">•</td>
      <td style="text-align: center">&nbsp;</td>
    </tr>
    <tr>
      <td>false</td>
      <td style="text-align: center">&nbsp;</td>
      <td style="text-align: center">•</td>
    </tr>
    <tr>
      <td>nil</td>
      <td style="text-align: center">&nbsp;</td>
      <td style="text-align: center">•</td>
    </tr>
    <tr>
      <td>string</td>
      <td style="text-align: center">•</td>
      <td style="text-align: center">&nbsp;</td>
    </tr>
    <tr>
      <td>empty string</td>
      <td style="text-align: center">•</td>
      <td style="text-align: center">&nbsp;</td>
    </tr>
    <tr>
      <td>0</td>
      <td style="text-align: center">•</td>
      <td style="text-align: center">&nbsp;</td>
    </tr>
    <tr>
      <td>integer</td>
      <td style="text-align: center">•</td>
      <td style="text-align: center">&nbsp;</td>
    </tr>
    <tr>
      <td>float</td>
      <td style="text-align: center">•</td>
      <td style="text-align: center">&nbsp;</td>
    </tr>
    <tr>
      <td>array</td>
      <td style="text-align: center">•</td>
      <td style="text-align: center">&nbsp;</td>
    </tr>
    <tr>
      <td>empty array</td>
      <td style="text-align: center">•</td>
      <td style="text-align: center">&nbsp;</td>
    </tr>
    <tr>
      <td>page</td>
      <td style="text-align: center">•</td>
      <td style="text-align: center">&nbsp;</td>
    </tr>
    <tr>
      <td>EmptyDrop</td>
      <td style="text-align: center">•</td>
      <td style="text-align: center">&nbsp;</td>
    </tr>
  </tbody>
</table>

> 未完待续




