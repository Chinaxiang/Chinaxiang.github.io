---
layout: post
title: Java SSH 实践一
tags: tool java
---

我们经常使用一些ssh的终端工具如xshell,iterm,securecrt与远程服务器进行交互,那么有没有直接通过Java程序与远端服务器交互方式呢？此系列文章将带你走进Java SSH的世界。

Ganymed SSH2是一个纯Java实现SSH2协议的库，我们可以通过它使我们的Java程序直接连接ssh servers, 并且支持会话保持。

废话不多说，直接来实践吧。

## 引入类库

你可以通过Maven引入或者导入源码或者导入jar包。

> maven

```
<!-- https://mvnrepository.com/artifact/ch.ethz.ganymed/ganymed-ssh2 -->
<dependency>
    <groupId>ch.ethz.ganymed</groupId>
    <artifactId>ganymed-ssh2</artifactId>
    <version>262</version>
</dependency>
```

> 源码

https://github.com/hudson/ganymed-ssh-2

## 简单入门

为了让大家对它有个直观的认识，我们先从一个最简单的示例入手。

下面的例子实现连接我的Mac机器，执行一条命令，然后获取命令的输出。

```
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import ch.ethz.ssh2.Connection;
import ch.ethz.ssh2.Session;
import ch.ethz.ssh2.StreamGobbler;

public class Basic {
    public static void main(String[] args) {
        String hostname = "192.168.0.103";
        String username = "chinaxiang";
        String password = "asdf";
        try {
            Connection conn = new Connection(hostname);
            conn.connect();
            boolean isAuthenticated = conn.authenticateWithPassword(username, password);
            if (isAuthenticated == false)
                throw new IOException("Authentication failed.");
            Session sess = conn.openSession();
            sess.execCommand("uname -a && date && uptime && who");
            System.out.println("Here is some information about the remote host:");
            InputStream stdout = new StreamGobbler(sess.getStdout());
            BufferedReader br = new BufferedReader(new InputStreamReader(stdout));
            while (true) {
                String line = br.readLine();
                if (line == null)
                    break;
                System.out.println(line);
            }
            System.out.println("ExitCode: " + sess.getExitStatus());
            br.close();
            sess.close();
            conn.close();
        } catch (IOException e) {
            e.printStackTrace(System.err);
            System.exit(2);
        }
    }
}
```

执行，输出如下：

```
Here is some information about the remote host:
Darwin bogon 16.7.0 Darwin Kernel Version 16.7.0: Thu Jun 15 17:36:27 PDT 2017; root:xnu-3789.70.16~2/RELEASE_X86_64 x86_64
Sun Jan 21 22:37:48 CST 2018
22:37  up 73 days,  3:22, 3 users, load averages: 1.34 1.52 1.52
chinaxiang console  Nov  9 19:17 
chinaxiang ttys001  Jan  8 09:34 
chinaxiang ttys002  Jan 20 21:49 
ExitCode: null
```

## 密钥认证

为了避免不暴露密码，我们可以配置ssh免密码认证。

```
ssh-keygen -t rsa -P ''
ssh-copy-id user@ip
```

下面的示例是使用密钥免密码登录我的Mac机器。

```
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import ch.ethz.ssh2.Connection;
import ch.ethz.ssh2.Session;
import ch.ethz.ssh2.StreamGobbler;

public class PublicKeyAuthentication {
    public static void main(String[] args) {
        String hostname = "192.168.0.103";
        String username = "chinaxiang";
        File keyfile = new File("/Users/chinaxiang/.ssh/id_rsa"); // 密钥
        String keyfilePass = ""; // will be ignored if not needed
        try {
            Connection conn = new Connection(hostname);
            conn.connect();
            boolean isAuthenticated = conn.authenticateWithPublicKey(username, keyfile, keyfilePass);
            if (isAuthenticated == false)
                throw new IOException("Authentication failed.");
            Session sess = conn.openSession();
            sess.execCommand("uname -a && date && uptime && who");
            InputStream stdout = new StreamGobbler(sess.getStdout());
            BufferedReader br = new BufferedReader(new InputStreamReader(stdout));
            System.out.println("Here is some information about the remote host:");
            while (true) {
                String line = br.readLine();
                if (line == null)
                    break;
                System.out.println(line);
            }
            br.close();
            sess.close();
            conn.close();
        } catch (IOException e) {
            e.printStackTrace(System.err);
            System.exit(2);
        }
    }
}
```

输出内容如下：

```
Here is some information about the remote host:
Darwin bogon 16.7.0 Darwin Kernel Version 16.7.0: Thu Jun 15 17:36:27 PDT 2017; root:xnu-3789.70.16~2/RELEASE_X86_64 x86_64
Sun Jan 21 22:59:57 CST 2018
22:59  up 73 days,  3:44, 3 users, load averages: 1.45 1.56 1.56
chinaxiang console  Nov  9 19:17 
chinaxiang ttys001  Jan  8 09:34 
chinaxiang ttys002  Jan 20 21:49
```

## 获取stdout,stderr

上面我们只获取了标准输出，没有获取标准错误输出。

```
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import ch.ethz.ssh2.Connection;
import ch.ethz.ssh2.Session;
import ch.ethz.ssh2.StreamGobbler;

public class StdoutAndStderr {
    public static void main(String[] args) {
        String hostname = "192.168.0.103";
        String username = "chinaxiang";
        String password = "asdf";
        try {
            Connection conn = new Connection(hostname);
            conn.connect();
            boolean isAuthenticated = conn.authenticateWithPassword(username, password);
            if (isAuthenticated == false)
                throw new IOException("Authentication failed.");
            Session sess = conn.openSession();
            sess.execCommand("echo \"Text on STDOUT\"; echo \"Text on STDERR\" >&2");
            InputStream stdout = new StreamGobbler(sess.getStdout());
            InputStream stderr = new StreamGobbler(sess.getStderr());
            BufferedReader stdoutReader = new BufferedReader(new InputStreamReader(stdout));
            BufferedReader stderrReader = new BufferedReader(new InputStreamReader(stderr));
            System.out.println("Here is the output from stdout:");
            while (true) {
                String line = stdoutReader.readLine();
                if (line == null)
                    break;
                System.out.println(line);
            }
            System.out.println("Here is the output from stderr:");
            while (true) {
                String line = stderrReader.readLine();
                if (line == null)
                    break;
                System.out.println(line);
            }
            stdoutReader.close();
            stderrReader.close();
            sess.close();
            conn.close();
        } catch (IOException e) {
            e.printStackTrace(System.err);
            System.exit(2);
        }
    }
}
```

执行结果：

```
Here is the output from stdout:
Text on STDOUT
Here is the output from stderr:
Text on STDERR
```


