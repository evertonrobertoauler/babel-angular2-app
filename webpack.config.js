var webpack = require('webpack');
var path = require('path');

var defineObj = {
  ON_TEST: process.env.NODE_ENV === 'test',
  ON_DEVELOPMENT: process.env.NODE_ENV === 'development',
  ON_PRODUCTION: process.env.NODE_ENV === 'production'
};

var babelOptions = {
  optional: ['es7.decorators'],
  // HACK: Disable strict mode to compile angular2.
  // `angular2/es6/prod/src/change_detection/parser/ast.es6` has methods
  // called eval. They are compiled into `eval: function eval() {}` by
  // babel and webpack raises error for them in strict mode.
  // http://babeljs.io/docs/usage/transformers/other/strict/
  blacklist: ['strict'],
  plugins: [
    './transformers/disable-define',
    'angular2-type-annotation',
    './transformers/angular2-type-assertion',
    'angular2-at-annotation'
  ]
};

module.exports = {
  context: __dirname + '/src',
  entry: './app.ts',
  output: {
    path: path.join(__dirname, defineObj.ON_TEST ? '/test' : '/dist'),
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      // TODO: Use angular2 bundle.js.
      'angular2': 'angular2/es6/dev',
      'rtts_assert': 'rtts_assert/es6'
    },
    extensions: ['', '.webpack.js', '.web.js', '.js', '.es6']
  },
  module: {
    loaders: [
      {test: /\.(es6|ts)$/, loader: 'babel?' + JSON.stringify(babelOptions)},
      {test: /\.css/, loader: defineObj.ON_PRODUCTION ? "style!css?minimize" : "style!css"},
      {test: /\.html/, loader: "html"}
    ]
  },
  debug: !defineObj.ON_PRODUCTION,
  devtool: '#source-map',
  watchDelay: 200,
  plugins: [
    new webpack.DefinePlugin(defineObj)
  ]
};
