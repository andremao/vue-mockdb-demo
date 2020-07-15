<template>
  <div class="user">
    <h1>User List Page</h1>
    <h2>Create User</h2>
    <form @submit.prevent="createUser()">
      name:
      <input type="text" v-model.trim="createForm.name" />
      age:
      <input type="text" v-model.trim.number="createForm.age" />
      <button type="submit">添加</button>
    </form>
    <h2>Edit User</h2>
    <form @submit.prevent="updateUser()">
      name:
      <input type="text" v-model.trim="updateForm.name" />
      age:
      <input type="text" v-model.trim.number="updateForm.age" />
      <button type="submit">更新</button>
    </form>
    <h2>List Data</h2>
    <div style="padding: 0 20px;">
      <form @submit.prevent="search()">
        搜索条件：
        name:
        <input type="text" v-model.trim="searchForm.name" placeholder="请输入姓名..." />
        &nbsp;&nbsp;
        age:
        <select v-model="searchForm.ageType">
          <option value="eq" selected>=</option>
          <option value="gt">&gt;</option>
          <option value="lt">&lt;</option>
          <option value="ge">&ge;</option>
          <option value="le">&le;</option>
        </select>
        &nbsp;&nbsp;
        <input
          type="text"
          v-model.trim.number="searchForm.age"
          placeholder="请输入年龄..."
        />
        &nbsp;&nbsp;
        <button type="submit">搜索</button>
      </form>
    </div>
    <div v-if="users.length" style="padding: 20px;">
      <div v-for="(v, i) in users" :key="v.id">
        {{ i }}, {{ v }}，
        <a href @click.prevent="delUser(v)">删除</a>，
        <a href @click.prevent="toEditUser(v)">编辑</a>
      </div>
    </div>
    <div v-if="!users.length" style="padding: 20px; color: #ccc;">暂无数据</div>
    <div style="padding: 0 20px;">
      第{{ page }}页，
      共{{ sizes }}页，
      每页
      <select v-model="size">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      条，
      共{{ total }}条，
      <a href @click.prevent="prevPage()">上一页</a>，
      <a href @click.prevent="nextPage()">下一页</a>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
export default {
  name: 'UserIndex',
  data() {
    return {
      // 搜索表单
      searchForm: {
        name: '',
        age: '',
        ageType: 'eq',
      },
      // 激活的搜索表单，保存上一次有效搜索条件
      activeSearchForm: {},
      // 创建表单
      createForm: {
        name: '',
        age: '',
      },
      // 更新表单
      updateForm: {
        id: '',
        name: '',
        age: '',
      },
      users: [],
      page: 1,
      size: 10,
      total: 0,
    };
  },
  computed: {
    sizes() {
      return Math.ceil(this.total / this.size);
    },
  },
  watch: {
    size() {
      this.loadList();
    },
    page() {
      this.loadList();
    },
  },
  methods: {
    search() {
      this.activeSearchForm = cloneDeep(this.searchForm);
      // 把为空字符串的过滤掉
      for (const [k, v] of Object.entries(this.activeSearchForm)) {
        if (v === '') {
          Reflect.deleteProperty(this.activeSearchForm, k);
        }
      }
      // /把为空字符串的过滤掉

      if (this.page !== 1) {
        this.page = 1;
      } else {
        this.loadList();
      }
    },
    async updateUser() {
      const { id, ...data } = this.updateForm;
      const { data: res } = await this.$axios.patch(`/user/${id}`, data);
      console.log(res);
      this.loadList();
    },
    toEditUser(user) {
      this.updateForm = cloneDeep(user);
    },
    async delUser(user) {
      const { data: res } = await this.$axios.delete(`/user/${user.id}`);
      console.log(res);
      if (this.users.length <= 1 && this.page > 1) {
        this.page--;
      } else {
        this.loadList();
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    nextPage() {
      if (this.page < this.sizes) {
        this.page++;
      }
    },
    async createUser() {
      const { data: res } = await this.$axios.post(
        '/user/create',
        this.createForm,
      );
      console.log(res);
      this.createForm = {};
      this.loadList();
    },
    async loadList() {
      const { data: res } = await this.$axios.get('/user/list', {
        params: {
          page: this.page,
          size: this.size,
          ...this.activeSearchForm,
        },
      });
      console.log(res);
      this.users = res.data;
      this.total = res.total;
    },
  },
  mounted() {
    this.loadList();
  },
};
</script>
