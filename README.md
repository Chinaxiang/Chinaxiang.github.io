# Chinaxiang's Blog

> 使用 GitHub Pages 构建的博客系统。

GitHub Pages 是免费的静态资源托管服务，依托GitHub提供高效，稳定，安全的用户体验，因此借助巨人的肩膀让自己看得更远。

GitHub Pages有如下限制：

- GitHub Pages空间大小不能超过 1G（足够大了，写个文档、博客无需担心不够用）.
- GitHub Pages提供每月 100G 的带宽（能超过这个，我的年薪也能上 100W+ 了）.
- GitHub Pages提供每小时 10 次构建（谁没事一会提交一个版本呢？）.

通过 GitHub 管理自己的博客主打一个免费（最多自己再配置一个域名），GitHub 至少再存活个 100 年应该不成问题（不发生世界大战或外星人侵占地球的话）。

博客内容没有高深的内容，不期为别人提供什么帮助，纯粹是为了备忘，有可能是转载的，有可能是搬运重复的，欢迎吐槽交流。

如有侵犯您的相关权益，请及时联系我。

对于我博客中的任何内容，如有需要请随意拿走，不需要得到我的许可，只要你觉得有用就好。

如果想要联系我，可以扫下方二维码关注一下个人公众号，可以找到我。

![](./qrcode.jpg)

如果你也想通过 GitHub Pages 构建自己的站点，可以直接fork本项目，我也会提供我使用 GitHub Pages 的相关经验供参考。

## 分支介绍

- master: 博客主项目。
- init: 博客未自定义样式，仅仅覆盖了主题默认的一些配置项，增加了分页，SEO插件，准备自定义样式的阶段。
- custom: 自定义了样式后的阶段。

## Plugins

- [`jekyll-seo-tag`](https://github.com/jekyll/jekyll-seo-tag): 网站搜索优化的支持 [usage](https://github.com/jekyll/jekyll-seo-tag#usage)
- [`jekyll-feed`](https://github.com/jekyll/jekyll-feed): 提供feed.xml的支持
- [`jekyll-paginate`](https://github.com/jekyll/jekyll-paginate): 提供简单分页的支持

## 项目构建

GitHub Pages 支持Jekyll编译静态文件。

Jekyll 需要 Ruby 环境。

[Ruby 官网](https://www.ruby-lang.org/zh_cn/)

[Jekyll 官网](https://jekyllrb.com/)


我这里是使用的 rbenv 安装的 ruby 环境，使用起来还不错，这篇博文中有介绍：

[重新捡起我的个人站点，使用 Jekyll 快速构建个人网站](https://huangyanxiang.com/jekyll/tools/2024/10/05/%E6%8D%A1%E8%B5%B7%E6%88%91%E7%9A%84%E4%B8%AA%E4%BA%BA%E7%AB%99%E7%82%B9-%E4%BD%BF%E7%94%A8GitHub%E6%9E%84%E5%BB%BA%E5%85%8D%E8%B4%B9%E7%9A%84%E5%8D%9A%E5%AE%A2%E7%BD%91%E7%AB%99.html)

以下内容是安装完了 ruby 和 jekyll 之后执行的指令：

```shell
bundle exec jekyll serve
# => Now browse to http://localhost:4000
```

如果需要安装额外的插件，配置到 Gemfile 

```shell
bundle install
```



