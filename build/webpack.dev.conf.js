'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    host: process.env.HOST || config.dev.host,
    port: process.env.PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true,
    } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    // 模拟数据
    before (app) {
      app.get('/home/images', (req, res) => {
        res.json({
          'status': 200,
          'message': 'OK',
          'data': [
            {
              'img': '/static/1.jpg',
              'link': 'http://localhost:8080/nav1'
            },
            {
              'img': '/static/2.jpg',
              'link': 'http://localhost:8080/nav2'
            },
            {
              'img': '/static/3.jpg',
              'link': 'http://localhost:8080/nav3'
            }
          ]
        })
      })
      app.get('/home/placeholder', (req, res) => {
        res.json({
          'status': 200,
          'message': 'OK',
          'data': 'iphone X'
        })
      })
      app.get('/category/all', (req, res) => {
        res.json({
          'status': 200,
          'message': 'OK',
          'data': [
            {
              'id': 0,
              'name': '360',
              'logo': '/static/360.jpg'
            },
            {
              'id': 1,
              'name': 'honor',
              'logo': '/static/honor.jpg'
            },
            {
              'id': 2,
              'name': 'oneplus',
              'logo': '/static/oneplus.jpg'
            },
            {
              'id': 3,
              'name': 'samsung',
              'logo': '/static/samsung.jpg'
            },
            {
              'id': 4,
              'name': 'vivo',
              'logo': '/static/vivo.jpg'
            },
            {
              'id': 5,
              'name': 'xiaomi',
              'logo': '/static/xiaomi.jpg'
            }
          ]
        })
      })
      app.get('/productions/simple', (req, res) => {
        let params = req.query
        switch (params['category']) {
          case '360':
            res.json({
              'status': 200,
              'message': 'OK',
              'data': [
                {
                  'id': 0,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
                {
                  'id': 1,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
                {
                  'id': 2,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
                {
                  'id': 3,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
                {
                  'id': 4,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
                {
                  'id': 5,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
                {
                  'id': 6,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
                {
                  'id': 7,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
              ]
            })
            break
          case 'honor':
            res.json({
              'status': 200,
              'message': 'OK',
              'data': [
                {
                  'id': 8,
                  'name': 'HONOR 荣耀 畅玩6 2GB+16GB全网通4G手机 双卡双待 金色 全网通2GB+16GB',
                  'price': '￥699.00',
                  'review': '2300条评价 97%好评',
                  'img': '/static/honor6x1.jpg'
                },
                {
                  'id': 9,
                  'name': 'HONOR 荣耀 畅玩6 2GB+16GB全网通4G手机 双卡双待 金色 全网通2GB+16GB',
                  'price': '￥699.00',
                  'review': '2300条评价 97%好评',
                  'img': '/static/honor6x1.jpg'
                },
                {
                  'id': 10,
                  'name': 'HONOR 荣耀 畅玩6 2GB+16GB全网通4G手机 双卡双待 金色 全网通2GB+16GB',
                  'price': '￥699.00',
                  'review': '2300条评价 97%好评',
                  'img': '/static/honor6x1.jpg'
                }
              ]
            })
            break
          default:
            res.json({
              'status': 404,
              'message': '暂无商品',
              'data': []
            })
            break
        }
      })
      app.get('/productions/keywords', (req, res) => {
        let params = req.query
        switch (params['key']) {
          case '360':
            res.json({
              'status': 200,
              'message': 'OK',
              'data': [
                {
                  'id': 0,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
                {
                  'id': 1,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
                {
                  'id': 2,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
                {
                  'id': 3,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
                {
                  'id': 4,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
                {
                  'id': 5,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
                {
                  'id': 6,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
                {
                  'id': 7,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'price': '￥1899.00',
                  'review': '605条评价 98%好评',
                  'img': '/static/360n6pro1.jpg'
                },
              ]
            })
            break
          case 'honor':
            res.json({
              'status': 200,
              'message': 'OK',
              'data': [
                {
                  'id': 8,
                  'name': 'HONOR 荣耀 畅玩6 2GB+16GB全网通4G手机 双卡双待 金色 全网通2GB+16GB',
                  'price': '￥699.00',
                  'review': '2300条评价 97%好评',
                  'img': '/static/honor6x1.jpg'
                },
                {
                  'id': 9,
                  'name': 'HONOR 荣耀 畅玩6 2GB+16GB全网通4G手机 双卡双待 金色 全网通2GB+16GB',
                  'price': '￥699.00',
                  'review': '2300条评价 97%好评',
                  'img': '/static/honor6x1.jpg'
                },
                {
                  'id': 10,
                  'name': 'HONOR 荣耀 畅玩6 2GB+16GB全网通4G手机 双卡双待 金色 全网通2GB+16GB',
                  'price': '￥699.00',
                  'review': '2300条评价 97%好评',
                  'img': '/static/honor6x1.jpg'
                }
              ]
            })
            break
          default:
            res.json({
              'status': 404,
              'message': '暂无商品',
              'data': []
            })
            break
        }
      })
      app.get('/production/detail', (req, res) => {
        let params = req.query
        switch (params['id']) {
          case '0':
            res.json({
              'status': 200,
              'message': 'OK',
              'data': {
                'production': {
                  'id': 0,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'remark': '4050mAh大电池/1600万后置双摄/5.99英寸全面屏/骁龙660',
                  'price': '1899.00',
                  'type': [
                    {
                      'name': 'color',
                      'display': '颜色',
                      'selection': [
                        { 'name': '极夜黑', 'add': '0'},
                        { 'name': '深海蓝', 'add': '0'}
                      ]
                    },
                    {
                      'name': 'style',
                      'display': '机型',
                      'selection': [
                        { 'name': '裸机', 'add': '0'},
                        { 'name': '音乐套装', 'add': '100'}
                      ]
                    },
                    {
                      'name': 'storage',
                      'display': '版本',
                      'selection': [
                        { 'name': '4GB+64GB', 'add': '0'},
                        { 'name': '6GB+64GB', 'add': '200'},
                        { 'name': '6GB+128GB', 'add': '700'}
                      ]
                    }
                  ],
                  'images': [
                    '/static/360n6pro1_1.jpg',
                    '/static/360n6pro1_2.jpg',
                    '/static/360n6pro1_3.jpg',
                    '/static/360n6pro1_4.jpg',
                    '/static/360n6pro1_5.jpg',
                    '/static/360n6pro1_6.jpg'
                  ],
                  'shop': {
                    'name': '360手机官方旗舰店',
                    'logo': '/static/360.jpg',
                    'follower': '41.8万',
                    'all': '29',
                    'new': '10',
                    'link': '/shop/360'
                  }
                },
                'detail': {
                  'html': 'ok'
                },
                'review': {
                  'percent': '98%',
                  'count': '2854', // 全部
                  'star5': '2804', // 好评
                  'star3': '29', // 中评
                  'star1': '21', // 差评
                  'img': '235', // 有图
                  'list': [
                    {
                      'id': '1',
                      'author': {
                        'id': '100',
                        'name': '观***空',
                        'flag': '0'
                      },
                      'content': {
                        'hasImage': '1',
                        'text': '晒单必须支持, 性价比太好了, 最喜欢他的大电池,运行非常流畅,就是有点沉',
                        'imgList': [
                          '/static/360n6pro1_1.jpg',
                          '/static/360n6pro1_1.jpg',
                          '/static/360n6pro1_1.jpg',
                          '/static/360n6pro1_1.jpg',
                          '/static/360n6pro1_1.jpg'
                        ]
                      },
                      'star': 5, // 好评
                      'date': '2017-12-06',
                      'orderDate': '2017-12-05',
                      'productionType': '极夜黑,裸机'
                    },
                    {
                      'id': '2',
                      'author': {
                        'id': '103',
                        'name': 'j***r',
                        'flag': '0'
                      },
                      'content': {
                        'hasImage': '0',
                        'text': '蓝牙耳塞呢? 就一个手机一个充电器! 普通耳塞都没有了,广告送这送那你大爷',
                        'imgList': []
                      },
                      'star': 3, // 中评
                      'date': '2017-12-30',
                      'orderDate': '2017-12-28',
                      'productionType': '极夜黑,裸机'
                    },
                    {
                      'id': '3',
                      'author': {
                        'id': '109',
                        'name': 'a***J',
                        'flag': '0'
                      },
                      'content': {
                        'hasImage': '1',
                        'text': '背面是玻璃来的, 刚拿到半个小时就碎了',
                        'imgList': [
                          '/static/360n6pro1_1.jpg'
                        ]
                      },
                      'star': 1, // 差评
                      'date': '2017-12-14',
                      'orderDate': '2017-12-14',
                      'productionType': '极夜黑,裸机'
                    }
                  ]
                }
              }
            })
            break
          case '8':
            res.json({
              'status': 200,
              'message': 'OK',
              'data': {
                'production': {
                  'id': 0,
                  'name': '360手机 N6 Pro 全网通 6GB+64GB 极夜黑 移动联通电信4G手机 双卡双待',
                  'remark': '4050mAh大电池/1600万后置双摄/5.99英寸全面屏/骁龙660',
                  'price': '1899.00',
                  'type': [
                    {
                      'name': 'color',
                      'display': '颜色',
                      'selection': [
                        { 'name': '极夜黑', 'add': '0'},
                        { 'name': '深海蓝', 'add': '0'}
                      ]
                    },
                    {
                      'name': 'style',
                      'display': '机型',
                      'selection': [
                        { 'name': '裸机', 'add': '0'},
                        { 'name': '音乐套装', 'add': '100'}
                      ]
                    },
                    {
                      'name': 'storage',
                      'display': '版本',
                      'selection': [
                        { 'name': '4GB+64GB', 'add': '0'},
                        { 'name': '6GB+64GB', 'add': '200'},
                        { 'name': '6GB+128GB', 'add': '700'}
                      ]
                    }
                  ],
                  'images': [
                    '/static/360n6pro1_1.jpg',
                    '/static/360n6pro1_2.jpg',
                    '/static/360n6pro1_3.jpg',
                    '/static/360n6pro1_4.jpg',
                    '/static/360n6pro1_5.jpg',
                    '/static/360n6pro1_6.jpg'
                  ],
                  'shop': {
                    'name': '360手机官方旗舰店',
                    'logo': '/static/360.jpg',
                    'follower': '41.8万',
                    'all': '29',
                    'new': '10',
                    'link': '/shop/360'
                  }
                },
                'detail': {
                  'html': 'ok'
                },
                'review': {
                  'percent': '98%',
                  'count': '2854', // 全部
                  'star5': '2804', // 好评
                  'star3': '29', // 中评
                  'star1': '21', // 差评
                  'img': '235', // 有图
                  'list': [
                    {
                      'id': '1',
                      'author': {
                        'id': '100',
                        'name': '观***空',
                        'flag': '0'
                      },
                      'content': {
                        'hasImage': '1',
                        'text': '晒单必须支持, 性价比太好了, 最喜欢他的大电池,运行非常流畅,就是有点沉',
                        'imgList': [
                          '/static/360n6pro1_1.jpg',
                          '/static/360n6pro1_1.jpg',
                          '/static/360n6pro1_1.jpg',
                          '/static/360n6pro1_1.jpg',
                          '/static/360n6pro1_1.jpg'
                        ]
                      },
                      'star': 5, // 好评
                      'date': '2017-12-06',
                      'orderDate': '2017-12-05',
                      'productionType': '极夜黑,裸机'
                    },
                    {
                      'id': '2',
                      'author': {
                        'id': '103',
                        'name': 'j***r',
                        'flag': '0'
                      },
                      'content': {
                        'hasImage': '0',
                        'text': '蓝牙耳塞呢? 就一个手机一个充电器! 普通耳塞都没有了,广告送这送那你大爷',
                        'imgList': []
                      },
                      'star': 3, // 中评
                      'date': '2017-12-30',
                      'orderDate': '2017-12-28',
                      'productionType': '极夜黑,裸机'
                    },
                    {
                      'id': '3',
                      'author': {
                        'id': '109',
                        'name': 'a***J',
                        'flag': '0'
                      },
                      'content': {
                        'hasImage': '1',
                        'text': '背面是玻璃来的, 刚拿到半个小时就碎了',
                        'imgList': [
                          '/static/360n6pro1_1.jpg'
                        ]
                      },
                      'star': 1, // 差评
                      'date': '2017-12-14',
                      'orderDate': '2017-12-14',
                      'productionType': '极夜黑,裸机'
                    }
                  ]
                }
              }
            })
            break
          default:
            res.json({
              'status': 404,
              'message': '暂无商品',
              'data': {}
            })
            break
        }
      })
      app.get('/user/login', (req, res) => {
        let params = req.query
        let username = params['username']
        let password = params['password']
        if (username === 'test' && password === 'test') {
          res.json({
            'status': 200,
            'message': 'OK',
            'data': {
              'userId': '000001',
              'username': 'test',
              'avatar': '/static/360n6pro1.jpg',
              'registerTime': '3131131232',
              'gender': 'm',
              'phone': '123456789',
              'email': 'test@123.com'
            }
          })
        } else {
          res.json({
            'status': 201,
            'message': '用户名或密码错误',
            'data': {}
          })
        }
      })
      app.get('/user/register', (req, res) => {
        let params = req.query
        let username = params['username']
        let password = params['password']
        let repeatPassword = params['repeatPassword']
        if (password !== repeatPassword) {
          res.json({
            'status': 201,
            'message': '两次输入的密码不一致',
            'data': {}
          })
        } else {
          res.json({
            'status': 200,
            'message': 'OK',
            'data': {
              'userId': '000001',
              'username': username,
              'avatar': '/static/360n6pro1.jpg',
              'registerTime': '3131131232',
              'gender': 'm',
              'phone': '',
              'email': ''
            }
          })
        }
      })
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${config.dev.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
