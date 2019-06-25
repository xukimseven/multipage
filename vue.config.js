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

const config = {
  pages: Object.assign({}, pages, searchPages()),
  baseUrl: getBasePath(),
  assetsDir: getAssetsDir(),
  outputDir: path.join('templates', 'spa'),
  configureWebpack: {},
  devServer: devServer,
  css: {}
};

module.exports = config;