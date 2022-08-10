const configs = {
    development: {
        SERVER_URI: 'http://localhost:3000/api',
        IMG_URI : 'http://localhost:3000/images/',
        SOCKET_URI : 'ws://localhost:3000'
    },
    production: {
        SERVER_URI: '/api',
        IMG_URI : '/images/'
    },
  };
  
module.exports.config = configs[process.env.NODE_ENV];