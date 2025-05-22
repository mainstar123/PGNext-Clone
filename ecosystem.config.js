/**
 * This is the pm2 echo system config file to start the app
 * in linux web app using pm2 with following start up command
 * pm2 --no-daemon start /home/site/wwwroot/ecosystem.config.js
 */

 module.exports = {
    apps: [
      {
        name: "perfect-game-diamondkast-next-js-site",
        script: "./node_modules/next/dist/bin/next",
        args: "start -p " + (process.env.PORT || 3000),
        watch: false,
        autorestart: true,
      },
    ],
  };
  