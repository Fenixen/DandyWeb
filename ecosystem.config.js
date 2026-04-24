// PM2 alternative for running Dandy's Wear on a Raspberry Pi without Docker.
module.exports = {
  apps: [
    {
      name: 'dandys-wear',
      script: 'npm',
      args: 'start',
      cwd: '/home/pi/dandys-wear',
      autorestart: true,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
