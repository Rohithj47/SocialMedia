const configs = {
    development: {
        SERVER_URI: 'http://localhost:3000/api',
        IMG_URI : 'http://localhost:3000/images/',
        SOCKET_URI : 'ws://localhost:3000'
    },
    production: {
        SERVER_URI: 'http://https://instafacechat.herokuapp.com/api',
        IMG_URI : 'http://instafacechat.herokuapp.com/images/',
        SOCKET_URI : 'ws://instafacechat.herokuapp.com'
    },
  };
  
module.exports.config = configs[process.env.NODE_ENV];