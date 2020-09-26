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

{% raw %}
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
{% if product.title contains "Pack" %}
  This title of product contains the word Pack.
{% endif %}

{% if product.tags contains "Hello" %}
  This product has been tagged with Hello.
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

## Tags

Tags你可以理解为Liquid的关键词，如条件判断if, 循环语句for, Tag是 `{%` 和 `%}` 包裹起来的。

### 注释

注释是不会被Liquid引擎处理的。Liquid的注释既可以作用于单行，又可以作用于多行。

```
{% comment %} line comment {% endcomment %}
{% comment %}
block comment
{% endcomment %}
```

### 条件流程控制

直接看例子吧。

```
{% if product.title == 'Awesome Shoes' %}
  These shoes are awesome!
{% endif %}

{% unless product.title == 'Awesome Shoes' %}
  These shoes are not awesome.
{% endunless %}

equals

{% if product.title != 'Awesome Shoes' %}
  These shoes are not awesome.
{% endif %}

{% if customer.name == 'kevin' %}
  Hey Kevin!
{% elsif customer.name == 'anonymous' %}
  Hey Anonymous!
{% else %}
  Hi Stranger!
{% endif %}

{% assign handle = 'cake' %}
{% case handle %}
  {% when 'cake' %}
     This is a cake
  {% when 'cookie' %}
     This is a cookie
  {% else %}
     This is not a cake nor a cookie
{% endcase %}
```

### 循环遍历

```
{% for i in (1..5) %}
  {% if i == 4 %}
    {% break %}
  {% else %}
    {{ i }}
  {% endif %}
{% endfor %}

{% for i in (1..5) %}
  {% if i == 4 %}
    {% continue %}
  {% else %}
    {{ i }}
  {% endif %}
{% endfor %}

limit

<!-- if array = [1,2,3,4,5,6] -->
{% for item in array limit:2 %}
  {{ item }}
{% endfor %}

1 2

offset

<!-- if array = [1,2,3,4,5,6] -->
{% for item in array offset:2 %}
  {{ item }}
{% endfor %}

3 4 5 6

range

{% for i in (3..5) %}
  {{ i }}
{% endfor %}

{% assign num = 4 %}
{% for i in (1..num) %}
  {{ i }}
{% endfor %}

3 4 5
1 2 3 4

reversed

<!-- if array = [1,2,3,4,5,6] -->
{% for item in array reversed %}
  {{ item }}
{% endfor %}

6 5 4 3 2 1
```

cycle, 周期循环的意思。

```
{% cycle 'one', 'two', 'three' %}
{% cycle 'one', 'two', 'three' %}
{% cycle 'one', 'two', 'three' %}
{% cycle 'one', 'two', 'three' %}

one
two
three
one

```

tablerow, 快速构建表格的行。

```
<table>
{% tablerow product in collection.products %}
  {{ product.title }}
{% endtablerow %}
</table>

<table>
  <tr class="row1">
    <td class="col1">
      Cool Shirt
    </td>
    <td class="col2">
      Alien Poster
    </td>
    <td class="col3">
      Batman Poster
    </td>
    <td class="col4">
      Bullseye Shirt
    </td>
    <td class="col5">
      Another Classic Vinyl
    </td>
    <td class="col6">
      Awesome Jeans
    </td>
  </tr>
</table>

{% tablerow product in collection.products cols:2 %}
  {{ product.title }}
{% endtablerow %}

<table>
  <tr class="row1">
    <td class="col1">
      Cool Shirt
    </td>
    <td class="col2">
      Alien Poster
    </td>
  </tr>
  <tr class="row2">
    <td class="col1">
      Batman Poster
    </td>
    <td class="col2">
      Bullseye Shirt
    </td>
  </tr>
  <tr class="row3">
    <td class="col1">
      Another Classic Vinyl
    </td>
    <td class="col2">
      Awesome Jeans
    </td>
  </tr>
</table>

{% tablerow product in collection.products cols:2 limit:3 %}
  {{ product.title }}
{% endtablerow %}

{% tablerow product in collection.products cols:2 offset:3 %}
  {{ product.title }}
{% endtablerow %}

<!--variable number example-->

{% assign num = 4 %}
<table>
{% tablerow i in (1..num) %}
  {{ i }}
{% endtablerow %}
</table>

<!--literal number example-->

<table>
{% tablerow i in (3..5) %}
  {{ i }}
{% endtablerow %}
</table>
```

### 变量

Liquid, 支持变量的定义和计算。

```
assign

{% assign my_variable = false %}
{% if my_variable != true %}
  This statement is valid.
{% endif %}

{% assign foo = "bar" %}
{{ foo }}

capture

{% capture my_variable %}I am being captured.{% endcapture %}
{{ my_variable }}

I am being captured.

{% assign favorite_food = 'pizza' %}
{% assign age = 35 %}

{% capture about_me %}
I am {{ age }} and my favorite food is {{ favorite_food }}.
{% endcapture %}

{{ about_me }}

I am 35 and my favourite food is pizza.

Creates a new number variable, and increases its value by one every time it is called. 
The initial value is 0.

{% increment my_counter %}
{% increment my_counter %}
{% increment my_counter %}

0
1
2

Variables created through the increment tag are independent from variables created through assign or capture.

{% assign var = 10 %}
{% increment var %}
{% increment var %}
{% increment var %}
{{ var }}

0
1
2
10

{% decrement variable %}
{% decrement variable %}
{% decrement variable %}

-1
-2
-3
```

## Filters

Liquid提供了一些常用的过滤器（方法）。

### abs

```
{{ -17 | abs }}
17

{{ "-19.86" | abs }}
19.86
```

### append, prepend

```
{% assign filename = "/index.html" %}
{{ "website.com" | append: filename }}
website.com/index.html
```

### capitalize

首字母大写。

```
{{ "title" | capitalize }}
Title
{{ "my great title" | capitalize }}
My great title
```

### date

```
{{ article.published_at | date: "%a, %b %d, %y" }}
Fri, Jul 17, 15
{{ article.published_at | date: "%Y" }}
2015
{{ "March 14, 2016" | date: "%b %d, %y" }}
Mar 14, 16

To get the current time, pass the special word "now" (or "today") to date:
This page was last updated at {{ "now" | date: "%Y-%m-%d %H:%M" }}.
This page was last updated at 2017-06-29 14:45.
```

### default

```
{{ product_price | default: 2.99 }}
2.99
{% assign product_price = 4.99 %}
{{ product_price | default: 2.99 }}
4.99
{% assign product_price = "" %}
{{ product_price | default: 2.99 }}
2.99
```

### lstrip, rstrip, strip

去除句子首部的空白字符。

```
{{ "          So much room for activities!          " | lstrip }}
So much room for activities!          
```

去除句子尾部的空白字符。

```
{{ "          So much room for activities!          " | rstrip }}
          So much room for activities!
```

去除首尾的空白字符。

```
{{ "          So much room for activities!          " | strip }}
So much room for activities!
```

### plus, minus, times, divided_by

加，减，乘，除运算。

```
{{ 16 | divided_by: 4 }}
4
{{ 5 | divided_by: 3 }}
1
{{ 20 | divided_by: 7.0 }}
2.857142857142857
{% assign my_integer = 7 %}
{% assign my_float = my_integer | times: 1.0 %}
{{ 20 | divided_by: my_float }}
2.857142857142857
```

### remove, remove_first

```
{{ "I strained to see the train through the rain" | remove: "rain" }}
I sted to see the t through the 
{{ "I strained to see the train through the rain" | remove_first: "rain" }}
I sted to see the train through the rain
```

### replace, replace_first

```
{{ "Take my protein pills and put my helmet on" | replace: "my", "your" }}
Take your protein pills and put your helmet on
{% assign my_string = "Take my protein pills and put my helmet on" %}
{{ my_string | replace_first: "my", "your" }}
Take your protein pills and put my helmet on
```

### slice

Returns a substring of 1 character beginning at the index specified by the argument passed in. An optional second argument specifies the length of the substring to be returned.

截取指定长度的字符串，第二个表示长度，第一个表示索引，从0开始，如果为负数，从后面往前数，从-1开始。

```
{{ "Liquid" | slice: 0 }}
L
{{ "Liquid" | slice: 2 }}
q
{{ "Liquid" | slice: 2, 5 }}
quid
{{ "Liquid" | slice: -3, 2 }}
ui
```

### split

Divides an input string into an array using the argument as a separator. split is commonly used to convert comma-separated items from a string to an array.

分割字符串组成一个数组。

```
{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}

{% for member in beatles %}
  {{ member }}
{% endfor %}


  John

  Paul

  George

  Ringo
```

当然这里没有列举完所有的filter, 这些是相对比较常用的，记着这些，如果满足不了需求，再去官方文档上翻阅翻阅。

{% endraw %}

