const mockjs = require('mockjs');
const service = require('@andremao/mockdb').service('goods');

module.exports = {
  requests: [
    {
      type: 'get',
      url: '/goods/list',
      handle(req, res) {
        const { list } = service.getState();

        // 如果json文件中没有数据，则自动生成100条
        if (!list || !list.length) {
          service.insert(
            mockjs.mock({
              'list|100': [
                { id: '@GUID()', title: '@CTITLE()', 'price|100-1000': 1 },
              ],
            }).list,
          );
        }
        // /如果json文件中没有数据，则自动生成100条

        const result = service.pagedQuery({ page: 1, size: 100 });

        res.json({
          code: 200,
          message: 'ok',
          ...result,
        });
      },
    },
  ],
};
