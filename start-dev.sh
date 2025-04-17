#!/bin/bash

# 清理端口
echo "Cleaning up ports..."
lsof -ti:3000,3001,3002,8080 | xargs kill -9 2>/dev/null || true

# 等待端口完全释放
sleep 2

# 启动开发服务器
echo "Starting development servers..."
pnpm dev