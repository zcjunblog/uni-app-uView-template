module.exports = {
  parser: require('postcss-comment'),
  plugins: [
    require('postcss-import'),
    // 目前该小程序只用于微信平台，无需autoprefixer
    // require('autoprefixer')({
    //   remove: process.env.UNI_PLATFORM !== 'h5'
    // }),
    require('@dcloudio/vue-cli-plugin-uni/packages/postcss')
  ]
}
