# Blog

> 使用GitHub Pages构建的博客系统，使用了默认的主题 [minima](https://jekyll.github.io/minima/) 并重构。

GitHub Pages是免费的静态资源托管服务，依托GitHub提供高效，稳定，安全的用户体验，因此借助巨人的肩膀让自己看得更远。

GitHub Pages有如下限制：

- GitHub Pages空间大小不能超过1G（足够大了，写个文档、博客无需担心不够用）.
- GitHub Pages提供每月100G的带宽（能超过这个，我的年薪也能上100W+了）.
- GitHub Pages提供每小时10次构建（谁没事一会提交一个版本呢？）.

之前就想过通过GitHub管理自己的博客，直到最近才有空闲时间来做这个事情。
博客内容没有高深的内容，不期为别人提供什么帮助，纯粹是为了备忘，有可能是转载的，有可能是累赘重复的，欢迎吐槽。
如有侵犯您的相关权益，请及时联系我。

对于我博客中的任何内容，如有需要请随意拿走，不需要得到我的许可，只要你觉得有用就好。

如果你也想通过GitHub Pages构建自己的站点，可以直接fork本项目，我也会提供我使用GitHub Pages的相关经验供参考。

分支介绍：

- master: 博客主项目。
- init: 博客未自定义样式，仅仅覆盖了主题默认的一些配置项，增加了分页，SEO插件，准备自定义样式的阶段。
- custom: 自定义了样式后的阶段。

Plugins

- [`jekyll-seo-tag`](https://github.com/jekyll/jekyll-seo-tag): 网站搜索优化的支持 [usage](https://github.com/jekyll/jekyll-seo-tag#usage)
- [`jekyll-feed`](https://github.com/jekyll/jekyll-feed): 提供feed.xml的支持
- [`jekyll-paginate`](https://github.com/jekyll/jekyll-paginate): 提供简单分页的支持

Jekyll

GitHub Pages支持Jekyll编译静态文件。

Jekyll需要Ruby环境。
[Jekyll官网](https://jekyllrb.com/)

```shell
~ $ gem install jekyll bundler
~ $ jekyll new my-awesome-site
~ $ cd my-awesome-site
~/my-awesome-site $ bundle exec jekyll serve
# => Now browse to http://localhost:4000
```


