const mockdb = require('@andremao/mockdb');
const bodyParser = require('body-parser');

module.exports = {
  devServer: {
    before(app) {
      // 判断是否为开发环境
      if (process.env.NODE_ENV.toUpperCase() === 'DEVELOPMENT') {
        app.use(bodyParser.json(), mockdb.middleware());
      }
    },
  },
};
