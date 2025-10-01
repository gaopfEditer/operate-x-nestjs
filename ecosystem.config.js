module.exports = {
    apps: [{
      name: 'gitee-nestjs-2022',
      script: 'dist/main.js',
      instances: 'max', // 使用所有CPU核心
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3101
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    }]
  }
