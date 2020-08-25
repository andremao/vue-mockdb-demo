const service = require('@andremao/mockdb').service('user.json');
const mockjs = require('mockjs');

module.exports = {
  requests: [
    {
      method: 'post',
      url: '/api/user',
      handler(req, res) {
        console.log(req.body, 'req.body');
        const user = service.create(req.body);
        res.json({
          code: 200,
          message: 'ok',
          data: user,
        });
      },
    },
    {
      active: false, // 未激活
      method: 'delete',
      url: '/api/user/:id',
      handler(req, res) {
        console.log(req.params, 'req.params');
        res.json({
          code: 200,
          message: 'ok',
          user: service.delete(req.params.id),
        });
      },
    },
    {
      method: 'patch',
      url: '/api/user/:id',
      handler(req, res) {
        console.log(req.params, 'req.params');
        console.log(req.body, 'req.body');
        res.json({
          code: 200,
          message: 'ok',
          user: service.patch(req.params.id, req.body),
        });
      },
    },
    {
      method: 'get',
      url: '/api/users',
      handler(req, res) {
        console.log(req.query, 'req.query');

        // // 如果json文件中没有数据，则自动生成100条
        // const { list } = service.getState();
        // if (!list || !list.length) {
        //   service.insert(
        //     mockjs.mock({
        //       'list|100': [{ name: '@CNAME()', 'age|15-60': 1, id: '@GUID()' }],
        //     }).list,
        //   );
        // }
        // // /如果json文件中没有数据，则自动生成100条

        const { page, size, name, ageType } = req.query;
        const age = parseInt(req.query.age);
        const result = service.pagingQuery({
          page,
          size,
          // 就是数组的 filter 方法的回调函数
          filter(user) {
            const results = [];
            if (name) {
              results.push(user.name.includes(name));
            }
            if (!isNaN(age)) {
              switch (ageType) {
                case 'eq':
                  results.push(user.age === age);
                  break;
                case 'ne':
                  results.push(user.age !== age);
                  break;
                case 'gt':
                  results.push(user.age > age);
                  break;
                case 'lt':
                  results.push(user.age < age);
                  break;
                case 'ge':
                  results.push(user.age >= age);
                  break;
                case 'le':
                  results.push(user.age <= age);
                  break;
                default:
                  break;
              }
            }
            return results.every(v => v);
          },
          // 就是数组的 sort 方法的回调函数
          sort(user1, user2) {
            // 何时把 user1 放到 user2 后面? 当 user1.age > user2.age 时
            if (user1.age > user2.age) return 1;
            // 何时把 user1 放到 user2 前面? 当 user1.age > user2.age 时
            if (user1.age < user2.age) return -1;
            // 何时不用换位置? 当 user1.age === user2.age 时
            return 0;

            // 补充顺明:
            // 1 上面的代码等价：return user1.age - user2.age; 虽然代码量少，但不推荐，因为可读性差
            // 2 不要直接使用 return user1.age > user2.age; 因为在不同运行环境下执行结果可能不一致，有坑！！！
          },
        });
        res.json({
          code: 200,
          message: 'ok',
          ...result,
        });
      },
    },
  ],
};
