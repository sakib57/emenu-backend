module.exports = {
  apps: [
    {
      name: 'emenu-api',
      script: 'npm run start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    stage: {
      user: 'devw',
      host: '138.68.149.185',
      ref: 'main',
      repo: 'git@gitlab.com:softify-devw/softify-emunuservices/emenu-backend.git',
      ssh_options: 'StrictHostKeyChecking=no',
      path: '/home/devw/emenu-prod/emenu-backend',
      'post-deploy':
        'git pull && npm install && npm run build && pm2 startOrGracefulReload pm2-ecosystem.config.js --env production && pm2 save',
    },
  },
};
