import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/


//所有权限通用路由表
//如首页和登录页和一些不用权限的公用页面
export const constantRouterMap = [
  {
    path: '/login',
    component: () =>
      import ('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () =>
      import ('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '主页',
    meta: {title: '主页'},
    children: [{
      path: 'dashboard',
      name: '主页',
      component: () =>
        import ('@/views/dashboard/index'),
      meta: {title: `主页`, role: ['admin', 'user']}
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/table',
    name: '用户管理',
    meta: {title: '用户管理', icon: 'user', role: ['admin', 'user']},
    children: [{
      path: 'table',
      name: '用户列表',
      component: () =>
        import ('@/views/fitness/user/list'),
      meta: {title: '用户列表', icon: 'nested', role: ['admin', 'user']}
    },
      {
        path: 'save',
        name: '添加用户',
        component: () =>
          import ('@/views/fitness/user/save'),
        meta: {title: '添加用户', icon: 'form', role: ['admin']}
      },
      {
        path: 'edit/:id',
        name: '添加用户',
        component: () =>
          import ('@/views/fitness/user/save'),
        meta: {title: '编辑用户', icon: 'form', role: ['admin']},
        hidden: true
      },
      {
        path: 'project/:id',
        name: '编辑用户项目',
        component: () =>
          import ('@/views/fitness/user/userProject'),
        meta: {title: '编辑用户', icon: 'tree', role: ['admin', 'user']},
        hidden: true
      }
    ]
  },
  {
    path: '/menu',
    component: Layout,
    redirect: '/menu/list',
    name: '菜单管理',
    meta: {title: '菜单管理', icon: 'link', role: ['admin']},
    children: [{
      path: 'list',
      name: '菜单列表',
      component: () =>
        import ('@/views/fitness/menu/list'),
      meta: {title: '菜单列表', icon: 'tree', role: ['admin', 'user']}
    },
      {
        path: 'save',
        name: '添加项目分类',
        component: () =>
          import ('@/views/fitness/menu/save'),
        meta: {title: '添加菜单分类', icon: 'table', role: ['admin']}
      },
      {
        path: 'edit/:id',
        name: '添加用户',
        component: () =>
          import ('@/views/fitness/user/save'),
        meta: {title: '编辑用户', icon: 'form', role: ['admin']},
        hidden: true
      }
    ]
  },

  {
    path: '/project',
    component: Layout,
    redirect: '/project/list',
    name: '项目管理',
    meta: {title: '项目管理', icon: 'example', role: ['admin', 'user']},
    children: [{
      path: 'list',
      name: '项目列表',
      component: () =>
        import ('@/views/fitness/project/list'),
      meta: {title: '项目列表', icon: 'nested', role: ['admin', 'user']}
    },
      {
        path: 'info/',
        name: '添加项目',
        component: () =>
          import('@/views/fitness/project/info'),
        meta: {title: '添加项目', icon: 'form', role: ['admin']},
      },
      {
        path: 'info/:id',
        name: '添加项目',
        component: () =>
          import('@/views/fitness/project/info'),
        meta: {title: '添加项目', noCache: true, role: ['admin']},
        hidden: true
      },
      {
        path: 'chapter/:id',
        name: 'FitnessProjectChapterEdit',
        component: () => import('@/views/fitness/project/chapter'),
        meta: {title: '编辑项目大纲', noCache: true, role: ['admin']},
        hidden: true
      },
      {
        path: 'publish/:id',
        name: 'FitnessProjectPublishEdit',
        component: () => import('@/views/fitness/project/publish'),
        meta: {title: '发布项目', noCache: true, role: ['admin']},
        hidden: true
      }
    ]
  },


  {path: '*', redirect: '/404', hidden: true}


]


export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

export const asyncRouterMap = []
