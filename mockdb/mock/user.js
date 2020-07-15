const service = require('@andremao/mockdb').service('user');
const mockjs = require('mockjs');

module.exports = {
  requests: [
    {
      type: 'post',
      url: '/user/create',
      handle(req, res) {
        console.log(req.body, 'req.body');
        const user = service.insert(req.body);
        res.json({
          code: 200,
          message: 'ok',
          data: user,
        });
      },
    },
    {
      type: 'delete',
      url: '/user/:id',
      handle(req, res) {
        console.log(req.params, 'req.params');
        res.json({
          code: 200,
          message: 'ok',
          user: service.delete(req.params.id),
        });
      },
    },
    {
      type: 'patch',
      url: '/user/:id',
      handle(req, res) {
        console.log(req.params, 'req.params');
        console.log(req.body, 'req.body');
        res.json({
          code: 200,
          message: 'ok',
          user: service.patchUpdate(req.params.id, req.body),
        });
      },
    },
    {
      type: 'get',
      url: '/user/list',
      handle(req, res) {
        console.log(req.query, 'req.query');

        // 如果json文件中没有数据，则自动生成100条
        const { list } = service.getState();
        if (!list || !list.length) {
          service.insert(
            mockjs.mock({
              'list|100': [{ name: '@CNAME()', 'age|15-60': 1, id: '@GUID()' }],
            }).list,
          );
        }
        // /如果json文件中没有数据，则自动生成100条

        const { page, size, name, age, ageType } = req.query;
        const conditions = {};
        if (name) {
          conditions.like = { name };
        }
        if (age != null) {
          conditions[ageType] = { age: parseInt(age) };
        }
        const result = service.pagedQuery({ page, size, ...conditions });
        res.json({
          code: 200,
          message: 'ok',
          ...result,
        });
      },
    },
  ],
};
