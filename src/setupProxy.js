const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const target = 'DOMAIN';

const options = {
  target,
  changeOrigin: true,
};

module.exports = (app) => {
  app.use('/api.php', createProxyMiddleware(options));
  app.use('/apiLobby.php', createProxyMiddleware(options));
  app.use('/lang', express.static('lang'));
};
