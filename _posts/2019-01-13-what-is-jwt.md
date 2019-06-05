---
layout: post
title: 什么是JWT？
tags: tool
date: 2019-01-13 10:25:00 +800
---

JWT其实是三个英语单词JSON Web Token的缩写。通过全名你可能就有一个基本的认知了。token一般都是用来认证的，比如我们系统中常用的用户登录token可以用来认证该用户是否登录。jwt也是经常作为一种安全的token使用。

## JWT定义

JWT是一种用于双方之间传递安全信息的简洁的、URL安全的表述性声明规范。JWT作为一个开放的标准（RFC 7519），定义了一种简洁的，自包含的方法用于通信双方之间以Json对象的形式安全的传递信息。因为数字签名的存在，这些信息是可信的，JWT可以使用HMAC算法或者是RSA的公私秘钥对进行签名。

- 简洁(Compact): 可以通过URL，POST参数或者在HTTP header发送，因为数据量小，传输速度也很快
- 自包含(Self-contained)：负载中包含了所有用户所需要的信息，避免了多次查询数据库

## JWT构成

### JWT结构

JWT主要包含三个部分，之间用英语句号'.'隔开

- Header 头部
- Payload 负载
- Signature 签名

注意,顺序是 header.payload.signature

最终的结构有点像这样:

```
leftso.com.blog
```

当然真实的jwt不可能是这么简单的明文。

### JWT的头部

在header中通常包含了两部分：token类型和采用的加密算法。如下:

```
{
  "alg": "HS256",
  "typ": "JWT"
}
```

上面的JSON内容指定了当前采用的加密方式为HS256,token的类型为jwt

将上面的内容进行base64编码,可以得到我们JWT的头部,编码后如下:

```
ewogICJhbGciOiAiSFMyNTYiLAogICJ0eXAiOiAiSldUIgp9ICA=
```

### JWT的负载

负载（Payload）为JWT的第二部分。JWT的标准所定义了一下几个基本字段

- iss: 该JWT的签发者
- sub: 该JWT所面向的用户
- aud: 接收该JWT的一方
- exp(expires): 什么时候过期，这里是一个Unix时间戳
- iat(issued at): 在什么时候签发的

除了标准定义的字段外,我们还要定义一些我们在业务处理中需要用到的字段,例如用户token一般可以包含用户登录的token或者用户的id,一个简单的例子如下:

```
{
    "iss": "Lefto.com",
    "iat": 1500218077,
    "exp": 1500218077,
    "aud": "www.leftso.com",
    "sub": "leftso@qq.com",
    "user_id": "dc2c4eefe2d141490b6ca612e252f92e",
    "user_token": "09f7f25cdb003699cee05759e7934fb2"
}
```

上面的user_id、user_token都是我们自己定义的字段

现在我们需要将负载这整个部分进行base64编码,编码后结果如下:

```
ewogICAgImlzcyI6ICJMZWZ0by5jb20iLAogICAgImlhdCI6IDE1MDAyMTgwNzcsCiAgICAiZXhwIjogMTUwMDIxODA3NywKICAgICJhdWQiOiAid3d3LmxlZnRzby5jb20iLAogICAgInN1YiI6ICJsZWZ0c29AcXEuY29tIiwKICAgICJ1c2VyX2lkIjogImRjMmM0ZWVmZTJkMTQxNDkwYjZjYTYxMmUyNTJmOTJlIiwKICAgICJ1c2VyX3Rva2VuIjogIjA5ZjdmMjVjZGIwMDM2OTljZWUwNTc1OWU3OTM0ZmIyIgp9
```

### Signature（签名）

签名其实是对JWT的头部和负载整合的一个签名验证，首先需要将头部和负载通过.链接起来就像这样:header.Payload,上述的例子链接起来之后就是这样的:

```
ewogICJhbGciOiAiSFMyNTYiLAogICJ0eXAiOiAiSldUIgp9ICA=.ewogICAgImlzcyI6ICJMZWZ0by5jb20iLAogICAgImlhdCI6IDE1MDAyMTgwNzcsCiAgICAiZXhwIjogMTUwMDIxODA3NywKICAgICJhdWQiOiAid3d3LmxlZnRzby5jb20iLAogICAgInN1YiI6ICJsZWZ0c29AcXEuY29tIiwKICAgICJ1c2VyX2lkIjogImRjMmM0ZWVmZTJkMTQxNDkwYjZjYTYxMmUyNTJmOTJlIiwKICAgICJ1c2VyX3Rva2VuIjogIjA5ZjdmMjVjZGIwMDM2OTljZWUwNTc1OWU3OTM0ZmIyIgp9
```

由于HMacSHA256加密算法需要一个key,我们这里key暂时用leftso吧

加密后的内容为:

```
686855c578362e762248f22e2cc1213dc7a6aff8ebda52247780eb6b5ae91877
```

其实加密的内容也就是JWT的签名,类似我们对某个文件进行MD5加密然后接收到文件进行md5对比一样.只是这里的HMacSHA256算法需要一个key,当然这个key应该是使用者和接收者都知道的。

对上面的签名内容进行base64编码得到最终的签名

```
Njg2ODU1YzU3ODM2MmU3NjIyNDhmMjJlMmNjMTIxM2RjN2E2YWZmOGViZGE1MjI0Nzc4MGViNmI1YWU5MTg3Nw==
```

### 最终的JWT

```
ewogICJhbGciOiAiSFMyNTYiLAogICJ0eXAiOiAiSldUIgp9ICA=.ewogICAgImlzcyI6ICJMZWZ0by5jb20iLAogICAgImlhdCI6IDE1MDAyMTgwNzcsCiAgICAiZXhwIjogMTUwMDIxODA3NywKICAgICJhdWQiOiAid3d3LmxlZnRzby5jb20iLAogICAgInN1YiI6ICJsZWZ0c29AcXEuY29tIiwKICAgICJ1c2VyX2lkIjogImRjMmM0ZWVmZTJkMTQxNDkwYjZjYTYxMmUyNTJmOTJlIiwKICAgICJ1c2VyX3Rva2VuIjogIjA5ZjdmMjVjZGIwMDM2OTljZWUwNTc1OWU3OTM0ZmIyIgp9.Njg2ODU1YzU3ODM2MmU3NjIyNDhmMjJlMmNjMTIxM2RjN2E2YWZmOGViZGE1MjI0Nzc4MGViNmI1YWU5MTg3Nw==
```

通过上面的一个简单的说明您是否对JWT有一个简单额认知了呢？