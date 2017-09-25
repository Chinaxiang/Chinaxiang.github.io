---
layout: post
title: Jekyll With Usefule Plugins
tags: jekyll tool
---

Jekyll 有很多有用的插件，比如分页，SEO优化等，另外Jekyll中可以使用一些Liquid没有定义的filter，可以让我们的站点更加好用。

## Filters

Jekyll添加了自己的一些方法，如：

{% raw %}

```
{{ "/assets/style.css" | relative_url }}
/my-baseurl/assets/style.css

{{ "/assets/style.css" | absolute_url }}
http://example.com/my-baseurl/assets/style.css

{{ site.members | where:"graduation_year","2014" }}
{{ site.members | where_exp:"item", "item.graduation_year == 2014" }}

{{ "http://foo.com/?q=foo, \bar?" | uri_escape }}
http://foo.com/?q=foo,%20%5Cbar?

{{ page.content | number_of_words }}
1337

{{ site.posts | sort: 'author' }}
```

## Tags

Jekyll支持额外的标签。

### include

导入其他文件。待导入的文件都需要放置到`_includes`目录下。

```
{% include footer.html %}
```

### highlight

代码高亮支持。

```
{% highlight ruby %}
def foo
  puts 'foo'
end
{% endhighlight %}
```

Line numbers

```
{% highlight ruby linenos %}
def foo
  puts 'foo'
end
{% endhighlight %}
```

## Pagination

如果文章较多，我们可以引入分页插件。

本地需要安装Pagination插件：

```
gem install jekyll-paginate
```

需要在`_config.yml`中配置一下：

```
plugins:
  - jekyll-paginate

paginate: 15
paginate_path: "/blog/p:num"
```

`Gemfile`中最好也配置一下：

```
# If you have any plugins, put them here!
group :jekyll_plugins do
   gem "jekyll-paginate"
end
```

分页只能在`index.html`文件中使用，所以我这创建了`/blog/index.html`

里面的核心内容如下：

```
文章列表
{% assign posts = paginator.posts | sort: 'date' %}
{% for post in posts %}
  {{ post.title }}
  {{ post.excerpt | remove: '<p>' | remove: '</p>'  }}
  {{ post.date | date: site.minima.date_format }}
{% endfor %}

页码跳转
{% if paginator.total_pages > 1 %}
<nav aria-label="Page navigation">
  <ul class="pagination">
    {% if paginator.previous_page %}
      <li>
        <a href="{{ paginator.previous_page_path | prepend: site.baseurl | replace: '//', '/' }}" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
    {% else %}
      <li class="disabled"><a href="javascript:;" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
    {% endif %}

    {% assign curPage = paginator.page %}
    {% assign totalPage = paginator.total_pages %}
    {% assign leftPage = totalPage | minus: curPage %}
    {% if totalPage > 7 %}
      {% if curPage < 4 %}
        {% assign start = 1 %}
        {% assign end = 7 %}
      {% else %}
        {% if leftPage < 3 %}
          {% assign start = totalPage | minus: 6 %}
          {% assign end = totalPage %}
        {% else %}
          {% assign start = curPage | minus: 3 %}
          {% assign end = curPage | plus: 3 %}
        {% endif %}
      {% endif %}
      {% assign pageList = (start..end) %}
    {% else %}
      {% assign pageList = (1..totalPage) %}
    {% endif %}

    {% for page in pageList %}
      {% if page == paginator.page %}
        <li class="active"><a href="javascript:;">{{ page }}</a></li>
      {% elsif page == 1 %}
        <li><a href="{{ "/blog" }}">1</a></li>
      {% else %}
        <li><a href="{{ site.paginate_path | prepend: site.baseurl | replace: '//', '/' | replace: ':num', page }}">{{ page }}</a></li>
      {% endif %}
    {% endfor %}

    {% if paginator.next_page %}
      <li>
        <a href="{{ paginator.next_page_path | prepend: site.baseurl | replace: '//', '/' }}" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    {% else %}
      <li class="disabled"><a href="javascript:;" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
    {% endif %}
    
  </ul>
</nav>
{% endif %}

```

## SEO

博客的话，我们当然想被搜索引擎很好的收录，可以引入SEO插件。

本地需要安装：

```
gem install jekyll-seo-tag
```

同样配置`_config.yml`

```
plugins:
  - jekyll-seo-tag
```

配置`Gemfile`

```
# If you have any plugins, put them here!
group :jekyll_plugins do
   gem "jekyll-seo-tag", "~> 2.1"
end
```

使用比较简单，在你的html模板的head标签下：

```
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
{% seo %}
```

## Tag Posts

一般的博客文章我们都会给他们打上标签，便于管理和系统查看，我们可以通过Jekyll的标签功能实现博客分类的目的，不过这需要做不少的内容。

标签文章列表需要有一个单独的导航页面，我的都建到`/tags/`目录下，如：`/tags/jekyll.html`

里面的核心内容：

```
{% assign posts = site.tags.jekyll | sort: 'date' %}
{% for post in posts %}
  {{ post.title }}
  {{ post.excerpt | remove: '<p>' | remove: '</p>'  }}
  {{ post.date | date: site.minima.date_format }}
{% endfor %}
```

标签和分类功能类似，可以使用相同的导航索引，我之所以没有使用category, categories是因为我不想让文章的url太长。

标签和分类的文章列表都不支持分页，尽量合理控制文章数目，避免列表过长影响体验。

{% endraw %}