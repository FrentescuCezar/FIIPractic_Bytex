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
    '/api2',
    createProxyMiddleware({
      target: 'http://localhost:8082',
      secure: false,
      changeOrigin: true
    })
  );
};