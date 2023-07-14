module.exports = {
  apps: [
    {
      name: 'porest-nestjs-app',
      exec_mode: 'cluster',
      instances: 2,
      script: './dist/main.js',
      wait_ready: true,
      kill_timeout: 5000,
    },
  ],
};
