module.exports = {
  apps: [{
    name: "elc_application",
    script: 'npm',
    args: "start",
  }, {
    name: "elc_miner",
    script: "./observeMiner.js",
    env: {
      "NODE_ENV": "PRD"
    },
  }, {
    name: "elc_XRP_WS_Testnet_Application",
    script: "./xrp.ws.js"
  }
    // {
    //   name: "elc_XRP_WS_Appliaction",
    //   script: "./xrp.ws.js",
    //   env: {
    //     "NODE_ENV": "PRD"
    //   }
    // }
  ],

  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
};
