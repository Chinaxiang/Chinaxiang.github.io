---
layout: post
title: Welcome To Jekyll
tags: jekyll tool
---

欢迎来到Jekyll, 本文将带你初步领略Jekyll的风采。

## Jekyll 究竟是什么？

Transform your plain text into static websites and blogs.

Jekyll 是一个简单的静态站点生产器。根据它的规范，我们可以将我们书写的 Markdown （或者 Textile） 以及 Liquid 转化成一个完整的可发布的静态网站，你可以发布在任何你喜爱的服务器上。Jekyll 也可以运行在 GitHub Page 上，也就是说，你可以使用 GitHub 的服务来搭建你的项目页面、博客或者网站，而且是完全免费的。

官方网站：

- [Jekyll docs][jekyll-docs]
- [Jekyll’s GitHub repo][jekyll-gh]

## 快速指南

安装 Jekyll 相当简单，但是你得先做好一些准备工作，开始前你需要确保你在系统里已经有如下配置。

- Ruby: Jekyll需要Ruby环境
- RubyGems: 这货是Ruby的包管理工具，类似brew, yum之类的，我们可以通过它去安装Jekyll

安装好Ruby 和 RubyGems后，你只需要打开终端输入以下命令就可以了：

```shell
# Install Jekyll and Bundler through RubyGems
~ $ gem install jekyll bundler

# Create a new Jekyll site at ./myblog
~ $ jekyll new myblog

# Change into your new directory
~ $ cd myblog

# Build the site on the preview server
~/myblog $ bundle exec jekyll serve

# Now browse to http://localhost:4000
```

Bundler是Ruby的其他gems的管理者。

`jekyll new`命令会使用Jekyll minima主题构建一个Jekyll项目，如果你想要构建一个空白的项目，可以使用：

```shell
# Create a new blank Jekyll site at ./myblog
~ $ jekyll new myblog --blank 
```

一个Jekyll站点一般会添加一些有用的插件或依赖，这些插件或依赖配置在站点下的Gemfile文件中。

`bundle exec`处理Gemfile并管理相关依赖的，如果你的站点是空白的项目，没有什么依赖，可以只执行 `jekyll serve` 即可。

`jekyll serve` 会自动执行 `jekyll build` 命令，如果你不需要启动本地预览，你可以只执行 `jekyll build` 构建站点静态资源。

## 帮助文档

Jekyll的官网文档：[官方文档][jekyll-docs], 你也可以将此帮助文档构建到本地。

```shell
~ $ gem install jekyll-docs
~ $ jekyll docs
Configuration file: none
    Server address: http://127.0.0.1:4000
  Server running... press ctrl-c to stop.
```

如果你想查看jekyll相关命令的用法，你可以执行：

```shell
~ $ jekyll help new
~ $ jekyll help build
```

## 目录结构

```
.
├── _config.yml
├── _data
|   └── members.yml
├── _drafts
|   ├── begin-with-the-crazy-ideas.md
|   └── on-simplicity-in-technology.md
├── _includes
|   ├── footer.html
|   └── header.html
├── _layouts
|   ├── default.html
|   └── post.html
├── _posts
|   ├── 2007-10-29-why-every-programmer-should-play-nethack.md
|   └── 2009-04-26-barcamp-boston-4-roundup.md
├── _sass
|   ├── _base.scss
|   └── _layout.scss
├── _site
├── .jekyll-metadata
└── index.html # can also be an 'index.md' with valid YAML Frontmatter
```

上面的目录结构是jekyll项目定义的目录结构，当然不是必须都存在，比如我们创建的blank项目就只有如下目录结构：

```
.
├── _drafts
├── _layouts
├── _posts
└── index.html
```

当我们使用 `jekyll new myblog` 创建项目时，Jekyll 会使用默认的主题帮助我们构建一个项目，目录结构如下：

```
.
├── _config.yml
├── _posts
|   └── 20017-09-24-welcome-to-jekyll.markdown
├── .gitignore
├── 404.html
├── about.md
├── Gemfile
├── Gemfile.lock
└── index.md
```

构建的项目继承了默认主题的一些目录及文件，所以我们不需要创建任何文件就可以创建具有一定简陋样式的博客系统了。当然，我们是可以覆盖（重写）主题默认的配置，完全随你自己控制的。

关于默认主题，你可以到github上查看：[Minima][minima].

那么Jekyll定义的目录都是用来干嘛的呢？

<table>
<thead>
<tr>
<th>File / Directory</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<p><code>_config.yml</code></p>
</td>
<td>
<p>
存储配置信息，可以通过`site.XX`很方便的读取到配置信息。
</p>
</td>
</tr>
<tr>
<td>
<p><code>_drafts</code></p>
</td>
<td>
<p>
草稿箱，未发布或未写完的文章可以先放置到这里。
</p>
</td>
</tr>
<tr>
<td>
<p><code>_includes</code></p>
</td>
<td>
<p>
一些共用的模板，如HTML的head部分，可以很方便的被其他文件引用。
<code>{% include head.html %}</code>
</p>
</td>
</tr>
<tr>
<td>
<p><code>_layouts</code></p>
</td>
<td>
<p>
可以定义一些模板框架，如<code>post.html</code>, 发布的文章内容会放置到 <code>post.html</code> 中的 <code>{{ content }}</code>.
</p>
</td>
</tr>
<tr>
<td>
<p><code>_posts</code></p>
</td>
<td>
<p>
文章都放置到这里，这里不要再创建目录，尽管放文件即可，文章的命名遵循如下规则：
<code>YEAR-MONTH-DAY-title.MARKUP</code>.
</p>
</td>
</tr>
<tr>
<td>
<p><code>_data</code></p>
</td>
<td>
<p>
这里你可以放置一些格式化的数据(using either the <code>.yml</code>,
<code>.yaml</code>, <code>.json</code> or <code>.csv</code>
formats and extensions). If there's a file
<code>members.yml</code> under the directory, then you can access
contents of the file through <code>site.data.members</code>.
</p>
</td>
</tr>
<tr>
<td>
<p><code>_sass</code></p>
</td>
<td>
<p>
These are sass partials that can be imported into your <code>main.scss</code>
which will then be processed into a single stylesheet
<code>main.css</code> that defines the styles to be used by your site.
</p>
</td>
</tr>
<tr>
<td>
<p><code>_site</code></p>
</td>
<td>
<p>
生成的静态资源文件都放置在这里. It’s probably a good idea to add this
to your <code>.gitignore</code> file.
</p>
</td>
</tr>
<tr>
<td>
<p><code>.jekyll-metadata</code></p>
</td>
<td>
<p>
This helps Jekyll keep track of which files have not been modified
since the site was last built, and which files will need to be
regenerated on the next build. This file will not be included in the
generated site. It’s probably a good idea to add this to your
<code>.gitignore</code> file.
</p>
</td>
</tr>
<tr>
<td>
<p><code>index.html</code> or <code>index.md</code> and other HTML,
Markdown, Textile files</p>
</td>
<td>
<p>
给这些文件提供<code>YAML Front Matter</code>配置, 它将会自动被Jekyll处理，并加载到_site目录下。
</p>
</td>
</tr>
<tr>
<td>
<p>Other Files/Folders</p>
</td>
<td>
<p>
除了上述列举的目录，文件外，如果你有其他文件或目录，Jekyll会自动将他们加载到_site目录下，如<code>css</code> and <code>images</code> 目录,
<code>favicon.ico</code> 文件。
</p>
</td>
</tr>
</tbody>
</table>

## 配置

Jekyll的配置有很多，但我们用到的不多，默认的基本就够我们使用的了，如果想了解，可以查阅文档。

[Configuration][configuration]

也可以参照我的博客项目了解`_config.yml`配置。

```yaml
# Welcome to Chinaxiang' personal page!
lang: zh_CN
title: 黄彦祥的个人网站
author: Chinaxiang
email: forkmail@qq.com
description: > 
  黄彦祥，90后程序猿一枚，热爱分享，喜欢折腾，乐于探索，勇于挑战自我，对新事物充满热情，广交天下有志之士，共谋IT发展大计。
baseurl: ""
url: "http://huangyanxiang.com"
github_username:  Chinaxiang
twitter_username: ""

minima:
  date_format: "%b %-d, %Y"

timezone: Asia/Shanghai

markdown: kramdown
theme: minima
plugins:
  - jekyll-feed
  - jekyll-seo-tag
  - jekyll-paginate

paginate: 15
paginate_path: "/blog/p:num"
```

## 文件头配置

文件头配置是Jekyll很炫酷和方便的一个功能，可以给页面或文章指定文件头配置。你可以给首页指定 `_layout/home.html` 模板， 你可以给个人简介页面指定固定的地址 `permalink: /about.html`.

头文件配置就是在页面，文章的头部添加类似这样的内容：

```
---
layout: post
title: Blogging Like a Hacker
---
```

### Global Variables

下面的配置可以添加到普通页面或者文章页面。

- layout: 指定`_layout`中的一个模板，当然也可以不使用模板`layout: null`.
- permalink: 给页面或文章设置固定的地址。
- published: 如果不想发布某一篇文章，你可以设置此项为false.

### Variables for Posts

- date: 设置文章的发布时间，格式：`YYYY-MM-DD HH:MM:SS +/-TTTT`, hours, minutes, seconds, and timezone offset are optional.
- category: 设置文章的分类，单数
- categories: 设置文章的分类，可以用空格分隔表示多个
- tags: 设置文章的标签，可以用空格分隔表示多个

## 变量

在上面我们已经接触了一些配置变量，配置完了之后我们怎么使用配置过的变量呢，在这里需要简单的介绍一下。

更多详细的内容请移步官方文档：[Jekyll Variables][variables]

### Global Variables

- site: 站点级别的配置，如：`site.title`
- page: 页面级别的配置，如：`page.title`
- layout: `_layout/`目录下的文件的头文件配置，可以在父模板中获取定义的配置，如：`layout.desc`
- content: 获取子元素的内容，不包含头配置
- paginator: 如果使用了分页插件，可以读取到分页信息

### Site Variables

可以获取站点级别定义的变量。

- site.time: The current time (when you run the jekyll command).
- site.pages: 所有的页面集合，包含文章页面，首页等
- site.posts: 所有的文章集合
- site.data: `_data`目录下的数据集合，如:`site.data.githubs` 获取`_data/githubs.yml`中定义的数据
- site.categories.CATEGORY: 获取指定分类的文章列表
- site.tags.TAG: 获取指定标签的文章列表
- site.[CONFIGURATION_DATA]: 可以获取在`_config.yml`中配置的自定义变量

### Page Variables

可以获取页面级别定义的变量。

- page.content: 获取页面的内容
- page.title: 获取页面定义的title, 对于文章，如果没有定义，则取文件名中的title
- page.excerpt: 页面的摘要
- page.url: 页面的地址，不带域名的，如：`/2008/12/14/my-post.html`
- page.date: 页面的时间，可以自定义
- page.id: 页面的ID，也可以理解为页面的路径，如：`/2008/12/14/my-post`
- page.categories: 页面的分类，是个数组，如：`['java', 'tool']`
- page.tags: 页面的标签，是个数组，同上。
- page.next: 下一篇文章，如果没有了，返回`nil`
- page.previous: 上一篇文章。

### Paginator

如果使用了分页插件，可以获取到分页信息。

- paginator.per_page: 每页显示几条记录
- paginator.posts: 当前页的文章集合
- paginator.total_posts: 总共多少文章
- paginator.total_pages: 总共多少页
- paginator.page: 当前是第几页
- paginator.previous_page: 上一页页码
- paginator.previous_page_path: 上一页页面路径
- paginator.next_page: 下一页页码
- paginator.next_page_path: 下一页页面路径

分页信息只能在`index.html`中读取，比如你可以将分页信息放置到`/blog/index.html`.

本文先介绍这么多，避免单篇文章过长，休息片刻，稍后补充如下内容：

{% comment %}
- [Jekyll With Liquid]({% post_url 2017-09-20-jekyll-with-liquid %})
- [Jekyll With Useful Plugins]({% post_url 2017-09-20-jekyll-with-useful-plugins %})
{% endcomment %}

[jekyll-docs]: http://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[minima]:	   https://github.com/jekyll/minima
[configuration]: https://jekyllrb.com/docs/configuration
[variables]:	http://jekyllrb.com/docs/variables
