module.exports = {
  root: true,
  parser: 'babel-eslint',//解析器，这里我们使用babel-eslint
  parserOptions: {
    sourceType: 'module'//类型为module，因为代码使用了使用了ECMAScript模块
  },
  env: {
    browser: true,//预定义的全局变量，这里是浏览器环境
  },
  globals: {
    'chrome':true
  },
  extends: 'standard', //扩展，可以通过字符串或者一个数组来扩展规则
  plugins: [
   'html',
   'standard',
   'promise'
  ],
  'rules': {
   'arrow-parens': 0,
   'generator-star-spacing': 0,
   'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
   "semi" : 0,
    "quotes": "off",
    "eol-last":0,
    "space-before-blocks": 0,
    "no-trailing-spaces": 0,
    "quotes": [2, "single","avoid-escape"],
    "no-spaced-func": [2],
    "space-before-function-paren":0,
    "spaced-comment": 0,
    "no-multiple-empty-lines": [2, {"max": 10}],
    "react/prop-types": [0]
  }
}
