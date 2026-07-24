
> 写给没打过 CTF、甚至没认真看过 HTTP 请求的人。Reverse 那篇讲的是"没有源码怎么猜程序"，Web 这边反过来——**源码往往就在那儿，但你得知道浏览器和服务端哪一步出了岔子**。

### 先搞明白：Web 题到底在玩什么

CTF 里 Web 赛道的本质就一句话——**给你一个跑在服务器上的网站，让你用"它没预料到的用法"把 flag 掏出来**。

它考的不是你会不会写网站，而是你知不知道网站会在哪些地方漏。常见 flag 藏身处：

- 数据库里（SQL 注入把它查出来）
- 页面源码 / 注释 / Cookie / Response Header 里（看仔细点就有了）
- 服务端文件里（上传个马或者直接读 `/flag`）
- 内网某个服务后面（SSRF 打过去）

新手最容易有的误区：以为要先把 PHP/Java 学到精通才能打 Web。**不对**。你只需要能读懂"这段代码为什么能被我欺负"就够了，不用能写出来。

### 下场之前要补的地基（不用多，够用就行）

按"缺啥补啥"原则，下面这几块不碰的话做题会一直懵：

1. **HTTP 协议常识** —— 请求方法（GET/POST）、Header（Cookie、User-Agent、Referer）、状态码、URL 编码。至少要会用浏览器 F12 的 Network 面板。
2. **HTML 表单 + 一点 PHP 语法** —— Web 题 PHP 占大半，能认出 `$_GET`、`$_POST`、`include()`、`system()` 这种关键字就够起步。
3. **Linux 基础命令** —— `ls`、`cat`、`curl`、`grep`、`find`，以后写 payload 要用。
4. **Python 脚本能力** —— 不用多深，`requests` 发请求 + 正则抠 flag 就能解决一半自动化题。

> 💡 地基不用一次性补完，**边做题边查**效率最高，看到不懂的协议字段再去搜，比抱着 RFC 啃三天有用。

### Web 题六大常客（新手 80% 时间都在跟这几个打交道）

#### 1. SQL 注入（SQLi）
- **场景**：参数拼进数据库查询没过滤，比如 `?id=1'`
- **套路**：Union 回显 → 布尔盲注 → 时间盲注，一步步从库名摸到表再到 flag
- **工具**：`sqlmap` 能自动化，但新手建议先手注几道，懂原理再用工具

#### 2. XSS（跨站脚本）
- **场景**：你输进去的东西原样跑到页面 HTML 里了
- **套路**：`<script>alert(1)</script>` 先测，弹窗就说明能插 JS；偷 Cookie、打 admin、跳钓鱼
- **分类**：反射型（一次）、存储型（存库里）、DOM 型（前端自己拼的）

#### 3. 文件上传
- **场景**：头像/附件上传处没拦住
- **套路**：`.php` 被拦就试 `.php5`/`.phtml`，MIME 改 `image/jpeg`，加 `GIF89a` 头骗内容检测
- **后续**：上传成功拿 shell，`?cmd=cat /flag`

#### 4. 命令执行 / 代码注入（RCE）
- **场景**：`system($_GET['cmd'])` 这种代码直接把用户输入送进系统
- **套路**：`;`、`|`、`&&` 分隔命令，`cat /flag` 直接读

#### 5. SSRF（服务端请求伪造）
- **场景**：服务端帮你发请求（比如"在线图片抓取"功能）
- **套路**：让服务器去访问 `127.0.0.1:3306` 或 `file:///flag`，探内网、打 Redis

#### 6. 反序列化
- **场景**：PHP 的 `unserialize()`、Python 的 `pickle` 直接反序列化用户输入
- **套路**：构造恶意对象，靠 `__destruct()`/`__wakeup()` 触发执行链
- **注意**：这题是 Web 里门槛最高的，新手可以先放一放

> 📌 还有两个高频配角：SSTI（模板注入，`{{7 * 7}}` 测）、逻辑漏洞（改 `user_id=` 越权），新手迟早会撞上。

### 工具链：不用多，这几样够打半年

| 工具 | 干啥用 |
|---|---|
| **Burp Suite Community** | 拦请求、改包、Repeater 重放，Web 题灵魂 |
| **sqlmap** | SQL 注入自动化，`-u` + `--dbs` 起步 |
| **dirsearch / gobuster** | 扫目录，找 `admin.php`、`/flag.txt` 这种藏起来的 |
| **蚁剑 / 冰蝎** | 连 WebShell 用（国内赛常见） |
| **Python + requests** | 自己写脚本批量刷 |

>装个 Kali 或者 Ubuntu 就行，Windows 也能凑合，WSL2 也行。
### 练习路线（按这个顺序走，不会被劝退）

1. **DVWA**（Low → Medium）→ 把 SQLi / XSS / 上传 / CSRF 每个手打一遍
2. **SQLi-Labs**（前 10 关）→ 专练注入，盲注一定要亲手注出几个字符
3. **Upload-Labs**（前 8 关）→ 上传绕过的各种姿势摸一遍
4. **CTFshow / Bugku / 攻防世界** 新手区 → 每天 1-2 道，攒感觉
5. **PortSwigger Web Security Academy** → 英文但质量顶，Burp 官方出的

> ⚠️ 避坑三条：
> - 别一上来就看 writeup 抄 payload，**卡一小时以上再看**，否则永远学不会"怎么发现漏洞点"
> - 别 Web / Reverse / Pwn 一起学，新手先钉 Web + Misc，三个月后再开花
> - AI 可以帮你解释一段 PHP 为什么有洞，但**别让它替你想 payload**——本末倒置，赛场上 AI 可不陪你

### 第一道题怎么上手

随便找一道 CTFshow 的 Web 签到题或者 Bugku "SQL 注入 1"：

1. 浏览器打开，F12 看 Network，点一下页面，看请求长啥样
2. 参数后面加个 `'` 试试，报错了就有戏
3. 丢 Burp 里 Repeater 慢慢调，union 查库名 → 查表 → 查字段 → 拿 flag
4. 拿到 flag 格式一般是 `flag{xxxxxx}`，复制到提交框

做不出来就去看 writeup，**看完一定要自己再手打一遍**，不然下次换个皮肤你还不会。
### 顺手的资源

- [CTF Wiki - Web](https://ctf-wiki.org/) —— 中文，题型最全
- [PortSwigger Academy](https://portswigger.net/web-security) —— 练 Burp + Web 漏洞天花板
- CTFtime —— 查近期比赛
- BUUOJ / 攻防世界 —— 老牌 OJ，题量大
> 最后一句：Web 题的乐趣在于"哦原来这行代码还能这么欺负"——先做出第一道签到题，后面就停不下来了。