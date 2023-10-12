const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api', // 匹配需要代理的请求路径
    createProxyMiddleware({
      target: 'http://localhost:5000', // 后端地址
      changeOrigin: true, // 修改请求头中的 Origin 以适应目标地址
    })
  )
}
