const singleSpaAngularWebpack =
  require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  config.output = {
    ...config.output,
    filename: 'root-angular.js',
  };

  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);
  singleSpaWebpackConfig.module.rules.push({
    test: /\.(png|jpeg|svg|gif|woff|woff2|ttf|eot)$/i,
    loader:'file-loader',
    options:{
      outputPath : 'assets/',
      publicPath: '/assets/'
    }
  })
  // Feel free to modify this webpack config however you'd like to
  return singleSpaWebpackConfig;
};
