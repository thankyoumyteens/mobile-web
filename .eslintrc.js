// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 变量定义但未使用
    'no-unused-vars': 0,
    // 不检测文件末尾是否有空行
    'eol-last': 0,
    // 函数左括号是否有空格
    'space-before-function-paren': 0,
    // 关闭缩进限制
    'indent': 'off',
    // 关闭 ===
    'eqeqeq': 'off'
  }
}
