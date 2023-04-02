import { createProxyMiddleware } from 'http-proxy-middleware';
import { Express } from 'express';

export default function (app: Express) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8084',
      secure: false,
      changeOrigin: true
    })
  );
  app.use(
    '/commentapi',
    createProxyMiddleware({
      target: 'http://localhost:8086',
      secure: false,
      changeOrigin: true
    })
  );
};