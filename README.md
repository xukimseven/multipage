## 1、关于多页

H5前端采用 VUE CLI 3.X 作为项目搭建工具，以 VUE.js 作为开发框架。VUE默认为单页应用，通过框架配备的路由工具进行页面跳转。通过打包结果来看，单页的含义指的是代码在程序最终运行的时候全部都被打包在一个或多个js和css文件中，通过link和script-src的方式被引用到一个html文件中。

这样子的结果有好有坏。好处就是在用户端http请求页面的时候，请求的资源被汇总了。节省了请求的时间，流量成本等等。坏处就是，如果项目中有其他无关用户的页面，比如后台管理部分，同样会被打包在代码中，让用户请求了无关文件。虽然不影响使用，但这恰恰与之前的好处相违背。

传统的解决方法是，创建多个vue项目，不同端代码写在不同的项目中。如用户端就在client项目中编写，后台管理端则在manager项目中编写。这是在项目级别进行的代码区分，太过庞大，浪费资源又不便管理。所以，在对webpack与vue目录结构的理解之后，我们可以使用 VUE CLI 将项目配置成多页应用。通过一个项目创建多个page进行项目的模块管理。

## 2、vue-cli中配置多页

利用 VUE CLI 3 创建一个基本的vue项目，选择需要的依赖库，如 Babel、Router、vuex、sass等，等待拉取创建一个基础的项目。一个基础的项目目录结构如下：

```text
.
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── assets
│   │   └── logo.png
│   ├── components
│   │   └── HelloWorld.vue
│   ├── views
│   │   ├── About.vue
│   │   └── Home.vue
│   ├── App.vue
│   ├── main.js
│   ├── router.js
│   └── store.js
├── babel.config.js
├── package.json
├── package-lock.json
└── README.md
```

为了能够配置多页，需要在上面目录结构中添加如下文件夹或文件，结果如下：

```text
.
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── assets
│   │   └── logo.png
│   ├── components
│   │   └── HelloWorld.vue
│   ├── views
│   │   ├── About.vue
│   │   └── Home.vue
│   │
│   ├── pages (* 多页的根目录，页面的区分在这个文件夹中体现 *)
│   │
│   ├── App.vue
│   ├── main.js
│   ├── router.js
│   └── store.js
├── babel.config.js
├── package.json
├── package-lock.json
│
├── vue.config.js (* 多页配置文件 *)
│
└── README.md
```

### (1) vue.config.js 的配置内容：

```javascript
var glob = require('glob');
var path = require('path');
var fs = require('fs');

var pagesPath = path.resolve(__dirname, './src/pages');
var root = path.dirname(__dirname);
console.log(path.join(root, 'templates'));
var searchPages = function (){
  var pages = {};
  var entryFiles = glob.sync(pagesPath + '/*/entry.js');
  entryFiles.forEach((filePath) => {
    var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.length);
    var basename = path.basename(path.dirname(filePath));
    var htmlName = basename + '.html';
    pages[basename] = {
      entry: filePath,
      template: filePath.replace(filename, htmlName),
      filename: htmlName
    };
  });
  console.log(pages);
  return pages;
};
var pages = {};

var isProd = function (){
  return process.env.NODE_ENV === 'production';
};
var getBasePath = function (){
  return isProd() ? '' : '/spa/';
};
var getAssetsDir = function (){
  return './static/';
};

var devServer =
  {
    public: 'localhost:8080',
    host: '0.0.0.0',
    port: 8080,
    compress: true,
    publicPath: '/spa/',
    disableHostCheck: true,
    // https: {
    //   key: fs.readFileSync('..../privkey.pem'),
    //   cert: fs.readFileSync('..../fullchain.pem')
    // },
  };

module.exports = {
  pages: Object.assign({}, pages, searchPages()),
  baseUrl: getBasePath(),
  assetsDir: getAssetsDir(),
  outputDir: path.join('templates', 'spa'),
  configureWebpack: {},
  devServer: devServer,
  css: {}
};
```

配置介绍：配置基于webpack，使用 node.js 的文件系统等方法。目的是为了对 webpack 打包和编译结果的进行一些划分和操作。

```text
searchPages 方法：遍历src的pages文件夹中的每个包含 entry.js 的文件夹，将文件夹中的代码分别打包，并按文件夹名对打包结果进行区分。

isProd 方法：用于同意区分 开发环境 与 生产环境。

getBasePath 方法：根据环境的区分进行最终代码的打包路径

getAssetsDir 方法：打包的静态文件保存路径

devServer 对象：开发服务器的相关配置，包括ip的配置、端口的配置、ssl证书的配置以及代理的配置等

config 对象：整合上述的方法与对象，outputDir将会在build的时候在根目录创建一个 template 文件夹，其中是相关的文件打包情况。
```

### (2) pages的详细内容：

pages的目录结构一般如下：

```text
pages
└── index
    ├── components
    │   └── Component.vue
    ├── views
    │   └── Index.vue
    ├── App.vue
    ├── entry.js
    ├── router.js
    ├── index.html
    └── store.js
```

与 index 文件夹同级的可以是多个文件夹。根据 vue.config.js 的配置，严格按照 文件夹名为打包后的页面html名的方式进行创建文件。每个文件夹中独立包含了一个vue页面所必要的入口文件 entry.js ，pagename.html ，App.vue 等相关文件或文件夹。

### (3) 目录结构介绍：

```text
components：组件文件夹，在文件夹中管理各种组件。（* 组件的命名一般以大写字母开头的驼峰命名 *）

views：视图页面文件夹，管理代表该page中的路由对应的vue文件。

App.vue：vue的入口页面

entry.js：vue的入口文件

router.js：路由配置文件

index.html：vue页面模板文件

store.js：vuex状态管理器
```

## 3、最终的目录结构

完成上述操作后，其实可以对目录结构进行调整，删除一些不必要的文件与文件夹。最终的目录结构如下：

```text
.
├── public
│   └── favicon.ico
├── src
│   └── pages (* 多页的根目录，页面的区分在这个文件夹中体现 *)
│		└── index
│    		├── components
│    		│   └── Component.vue
│    		├── views
│    		│   └── Index.vue
│    		├── App.vue
│    		├── entry.js
│    		├── router.js
│    		├── index.html
│    		└── store.js
├── babel.config.js
├── package.json
├── package-lock.json
├── vue.config.js (* 多页配置文件 *)
└── README.md
```

## 4、开发服务器的ssl证书配置

在讲到 vue.config.js 的配置的时候有提到，在 devServer 对象中有提到。利用 node.js 的文件系统将服务器或本地的 ssl 证书密钥文件引入项目，实现在 dev 环境使用 https ，避免一些跨域问题。

```javascript
var devServer ={
	...,
    https: {
      key: fs.readFileSync('..../privkey.pem'),
      cert: fs.readFileSync('..../fullchain.pem')
    },
  };
```

## 5、关联服务器

使用 ide 或 vscode 开发 vue 项目时，可以方便得将项目部署在服务器上进行类似于小程序开发的畅快体验。

在 linux 服务器上安装 node，vue 等项目需要运行环境，等待项目部署。

### (1) 使用webstrom等IDE：

在工具栏找到 Tools > Deployment > Configurations ，选择 SFTP 并配置相关内容。

​​![](http://blogimg.since1105.wang/multipage000.png)

​​![](http://blogimg.since1105.wang/multipage001.png)

​​![](http://blogimg.since1105.wang/multipage02.png)

配置好之后，选中除 node_modules 以外的文件上传至服务器（ctrl+shift+alt+x）。在工具栏找到 Tools > Start SSH session... 连接上服务器。进入服务器上的vue项目文件夹，使用 npm install 安装好所需要的依赖，之后 npm run serve 运行代码。

此后，在本地ide中开发项目，将会自动上传至服务器，在服务器中进行 dev serve 的运行，使用服务器的 ip 或 配置的域名访问。

注意，如果没有 nginx 做转发的话，域名或ip后面必须带上端口号。如 https://1.1.1.1:8080/spa/index/#/

### (2) 使用 VSCode 进行项目开发：

首先，在插件商城中找到并安装插件 —— sftp。

在 ctrl+shift+p 的输入框中输入，sftp:config ，回车进入配置文件。

复制以下代码覆盖原来的内容：

```json
{
    "host": "1.1.1.1",
    "port": 22,
    "username": "root",
    "password": "123456",
    "protocol": "sftp", 
    "agent": null,
    "privateKeyPath": null, 
    "passphrase": null, 
    "passive": false, 
    "interactiveAuth": true,
    "remotePath": "/var/www/xxx",
    "uploadOnSave": true,
    "syncMode": "update",
    "ignore": [
        "**/.vscode/**",
        "**/.git/**",
        "**/.DS_Store"
    ],
    "watcher": {
        "files": "glob",
        "autoUpload": true,
        "autoDelete": true
    }
}
```

修改为项目的相关配置，保存即可。

此后，保存代码即可产生与 ide 开发相类似的效果。

***强烈推荐成熟的 IDE 开发项目。***