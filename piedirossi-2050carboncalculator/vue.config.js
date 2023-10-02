module.exports = {
  devServer: {
    proxy: 'http://localhost.ukcalc' // any changes to the api require an apache restart
    // proxy: 'http://localhost:9292' //webrick doesn't like being used as a proxy by default, always returns a 404
  },
  //very important, otherwise parts of the code will be publicly available through console.logs/errors/warnings
  productionSourceMap: false,

  //very important, otherwise all async imports are inserted as links with rel="prefetch"
  chainWebpack: config => {
    // remove the prefetch plugin
    // flag async import for insertion as prefetch link with /* webpackPrefetch: true */
    config.plugins.delete('prefetch') //activated by vue cli by default
  }
}
