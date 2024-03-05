import{_ as s,o as n,c as a,S as l}from"./chunks/framework.59c3ae61.js";const g=JSON.parse('{"title":"服务器部署前端项目","description":"","frontmatter":{"isTimeLine":true,"title":"服务器部署前端项目","date":"2023-10-16T00:00:00.000Z","tags":["前端","开发经验"],"categories":["开发经验"]},"headers":[],"relativePath":"frontend/exp/服务器部署前端项目.md","filePath":"frontend/exp/服务器部署前端项目.md","lastUpdated":1709648450000}'),p={name:"frontend/exp/服务器部署前端项目.md"},e=l(`<h1 id="服务器部署前端项目" tabindex="-1">服务器部署前端项目 <a class="header-anchor" href="#服务器部署前端项目" aria-label="Permalink to &quot;服务器部署前端项目&quot;">​</a></h1><h2 id="安装-nginx" tabindex="-1">安装 Nginx <a class="header-anchor" href="#安装-nginx" aria-label="Permalink to &quot;安装 Nginx&quot;">​</a></h2><ol><li>购买云服务器ECS 首先，我们需要登录阿里云或腾讯云官网，进行云服务器ECS的选购。</li></ol><p>在购买过程中，我们需要选择操作系统，建议选择Linux操作系统，如CentOS、Ubantu等。</p><p>此外，还需要选择地域、实例规格、配置网络等，根据实际需求进行选择。</p><ol start="2"><li><p>登录服务器 购买成功后，可以通过远程连接工具（如 Xshell）连接到刚刚购买的云服务器ECS。</p></li><li><p>安装nginx 在登录到服务器后，首先需要安装 nginx。根据操作系统的不同，安装方法也略有不同。</p></li></ol><p>这里以CentOS为例：</p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">yum</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">nginx</span></span></code></pre></div><p>安装完 nginx 后，可以通过以下命令验证 nginx 是否已经正确安装：</p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">nginx</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-v</span></span></code></pre></div><p>如果能够显示 nginx 的版本信息，则说明已经安装成功。</p><p>可以使用下面的的命令启动 nginx 的服务。</p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">service</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">nginx</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">start</span></span></code></pre></div><p>此时访问服务器的公网 IP 就可以看到 nginx 的默认页面。</p><h2 id="配置-nginx" tabindex="-1">配置 nginx <a class="header-anchor" href="#配置-nginx" aria-label="Permalink to &quot;配置 nginx&quot;">​</a></h2><p>在安装完 nginx 后，还需要进行一些配置。</p><ol><li>修改配置文件</li></ol><p>nginx 的配置文件通常位于 <code>/etc/nginx</code> 目录下，文件名为 <code>nginx.conf</code>。可以使用 Xftp 打开该文件进行编辑。根据自己的需求，对配置文件进行相应的修改。</p><p>自定义的配置文件放在/etc/nginx/nginx.conf（配置vue项目的地方）</p><p>项目文件存放在/usr/share/nginx/任意项目名/ (存放vue项目的地方)</p><p>日志文件存放在/var/log/nginx/</p><p>还有一些其他的安装文件都在/etc/nginx</p><p><strong>以下是常见的配置项：</strong></p><div class="language-text"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">user nginx;：指定NGINX进程的运行用户。在这个例子中，NGINX将以nginx用户的身份运行。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">worker_processes auto;：指定NGINX启动的工作进程数。auto表示根据系统的CPU核心数自动确定进程数。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">error_log /var/log/nginx/error.log;：指定NGINX错误日志的路径和文件名。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">pid /run/nginx.pid;：指定NGINX进程ID文件的路径和文件名。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">include /usr/share/nginx/modules/*.conf;：加载动态模块的配置文件。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">events { ... }：定义NGINX的事件模块配置。在这个例子中，设置了最大的并发连接数为1024。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">http { ... }：定义NGINX的HTTP模块配置。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">log_format main ...：定义了日志格式，其中包含了请求的各种信息，如远程地址、请求时间、请求内容等。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">access_log /var/log/nginx/access.log main;：指定访问日志的路径和文件名，并使用上面定义的main格式进行记录。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">sendfile on;：启用文件传输优化，提高文件传输效率。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">tcp_nopush on;：启用TCP nopush模式，减少网络传输延迟。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">tcp_nodelay on;：启用TCP nodelay模式，减少网络传输延迟。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">keepalive_timeout 65;：设置HTTP keep-alive连接的超时时间。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">types_hash_max_size 2048;：设置MIME类型哈希表的最大大小。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">include /etc/nginx/mime.types;：加载MIME类型配置文件。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">default_type application/octet-stream;：设置默认的MIME类型。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">include /etc/nginx/conf.d/*.conf;：从/etc/nginx/conf.d目录中加载模块化的配置文件。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">server { ... }：定义一个服务器块，用于处理特定的监听端口和域名。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">listen 7890;：监听的端口号。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">server_name _;：指定服务器的名称，这里使用下划线表示匹配任意域名。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">root /usr/share/nginx/terminal-index;：指定服务器的根目录。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">include /etc/nginx/default.d/*.conf;：加载默认服务器块的配置文件。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">location / { ... }：处理根路径的请求。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">error_page 404 /404.html;：指定404错误页面的路径。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">location = /40x.html { ... }：处理特定的错误页面。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">error_page 500 502 503 504 /50x.html;：指定500、502、503和504错误页面的路径。</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">location = /50x.html { ... }：# 处理特定的错误页面。</span></span></code></pre></div><ol start="2"><li>配置虚拟主机 虚拟主机是指在一台服务器上运行多个网站，每个网站有独立的域名和内容。在 nginx 中，可以通过配置虚拟主机来实现这一功能。</li></ol><p>在 <code>nginx.conf</code> 文件中，可以使用 <code>server</code> 块配置虚拟主机。每个 <code>server</code> 块包含一个域名和相应的配置。</p><p>例如，配置一个名为www.example.com的虚拟主机，可以添加以下代码：</p><div class="language-text"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">server {</span></span>
<span class="line"><span style="color:#A6ACCD;">  listen       端口;</span></span>
<span class="line"><span style="color:#A6ACCD;">  server_name  访问域名;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  location / {</span></span>
<span class="line"><span style="color:#A6ACCD;">      root   线上静态路径; //示例 /usr/share/nginx/html </span></span>
<span class="line"><span style="color:#A6ACCD;">      index  index.html index.htm;</span></span>
<span class="line"><span style="color:#A6ACCD;">      try_files $uri $uri/ /index.html;  //解决子页面适配，刷新404问题</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>其中，<code>listen</code> 指定监听的端口，<code>server_name</code> 指定域名，<code>root</code>指定网站的根目录，<code>…</code>代表其他配置项。</p><p>然后将项目打包后生成的 dist 目录中的文件放到 root 指定的路径中。</p><p>如果配置文件后执行出错，可以使用 <code>nginx -t</code> 检查报错原因。</p><ol start="3"><li>重启 nginx 在配置完 nginx 后，为了使配置生效，需要重启nginx。可以使用以下命令重启：</li></ol><div class="language-SHELL"><button title="Copy Code" class="copy"></button><span class="lang">SHELL</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">service</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">nginx</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">restart</span></span></code></pre></div><ol start="4"><li>访问网站</li></ol><p>在配置完 nginx 并重启后，还需要去对应服务器实例的防火墙查看是否放行了监听的端口。</p><p>之后就可以通过浏览器访问配置的网站，验证配置是否成功。</p><p>在浏览器地址栏中输入配置的域名，如果成功访问到网站的首页，则表明配置成功。</p><ol start="5"><li>添加 SSL 证书</li></ol><p>如果网站需要加入 SSL 证书，可以在 nginx 配置中添加以下代码：</p><div class="language-text"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">listen       443 ssl http2 default_server;</span></span>
<span class="line"><span style="color:#A6ACCD;">  server_name  _;</span></span>
<span class="line"><span style="color:#A6ACCD;">  root         /usr/share/nginx/html;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  ssl_certificate &quot;/etc/pki/nginx/server.pem&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;">  ssl_certificate_key &quot;/etc/pki/nginx/private/server.key&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;">  ssl_session_cache shared:SSL:1m;</span></span>
<span class="line"><span style="color:#A6ACCD;">  ssl_session_timeout  10m;</span></span>
<span class="line"><span style="color:#A6ACCD;">  ssl_ciphers PROFILE=SYSTEM;</span></span>
<span class="line"><span style="color:#A6ACCD;">  ssl_prefer_server_ciphers on;</span></span></code></pre></div><p>然后将域名的证书添加到上方路径的文件夹中，重启 nginx 服务，就可以将网站的协议改为 https 了。</p>`,41),o=[e];function t(c,i,r,C,A,y){return n(),a("div",null,o)}const D=s(p,[["render",t]]);export{g as __pageData,D as default};
