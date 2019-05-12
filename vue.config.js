const path = require('path');

const frameSrc = path.resolve(__dirname, '../admin-frame');

module.exports = {
  // baseUrl: './',
  publicPath: process.env.VUE_APP_ROOT_URL + 'docflow',

  // pages: {
  //   index: 'src/main.js',
  //   details: 'src/details/main.js',
  // },

  // transpileDependencies: ['naf-core'],

  configureWebpack: {
    externals: {
      'element-ui': 'Element',
      vue: 'Vue',
    },
    resolve: {
      alias: {
        '@frame': frameSrc,
        '@naf': path.join(frameSrc, '/naf'),
        '@lib': path.join(frameSrc, '/lib'),
      },
    },
  },

  devServer: {
    port: 3003,
    disableHostCheck: true,
    before(app) {
      app.use((req, res, next) => {
        // eslint-disable-next-line no-console
        console.log(`[${req.method}]`, req.path);
        next();
      });
    },
    proxy: {
      '/platform/api/docflow': {
        // target: 'http://smart.localhost:8000',
        target: 'http://localhost:8301',
        pathRewrite: { '^/platform/api/docflow': '' },
        onProxyReq(proxyReq, req, res) {
          // add custom header to request
          // proxyReq.setHeader('x-tenant', '10201');
          proxyReq.setHeader('userid', '226217043733448926');
          // or log the req
        },
      },
      '/platform/api': {
        // target: 'http://smart.localhost:8000',
        target: 'http://smart.chinahuian.cn',
      },
      '/files': {
        target: 'http://smart.chinahuian.cn',
      },
      '/ddapi': {
        // target: 'http://smart.localhost:8008',
        target: 'http://smart.chinahuian.cn',
        // pathRewrite: { '^/ddapi': '' },
      },
    },
  },
};
