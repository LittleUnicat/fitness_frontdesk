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
export const constantRouterMap = [{
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
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () =>
        import ('@/views/dashboard/index')
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/table',
    name: '用户管理',
    meta: {title: '用户管理', icon: 'example'},
    children: [{
      path: 'table',
      name: '用户列表',
      component: () =>
        import ('@/views/fitness/user/list'),
      meta: {title: '用户列表', icon: 'table'}
    },
      {
        path: 'save',
        name: '添加用户',
        component: () =>
          import ('@/views/fitness/user/save'),
        meta: {title: '添加用户', icon: 'tree'}
      },
      {
        path: 'edit/:id',
        name: '添加用户',
        component: () =>
          import ('@/views/fitness/user/save'),
        meta: {title: '编辑用户', icon: 'tree'},
        hidden: true
      }
    ]
  },

  {
    path: '/menu',
    component: Layout,
    redirect: '/menu/list',
    name: '菜单管理',
    meta: {title: '菜单管理', icon: 'example'},
    children: [{
      path: 'list',
      name: '菜单列表',
      component: () =>
        import ('@/views/fitness/menu/list'),
      meta: {title: '菜单列表', icon: 'table'}
    },
      {
        path: 'save',
        name: '添加项目分类',
        component: () =>
          import ('@/views/fitness/menu/save'),
        meta: {title: '添加菜单分类', icon: 'tree'}
      },
      {
        path: 'edit/:id',
        name: '添加用户',
        component: () =>
          import ('@/views/fitness/user/save'),
        meta: {title: '编辑用户', icon: 'tree'},
        hidden: true
      }
    ]
  },

  {
    path: '/project',
    component: Layout,
    redirect: '/project/list',
    name: '项目管理',
    meta: {title: '项目管理', icon: 'example'},
    children: [{
      path: 'list',
      name: '项目列表',
      component: () =>
        import ('@/views/fitness/project/list'),
      meta: {title: '项目列表', icon: 'table'}
    },
      {
        path: 'info/',
        name: '添加项目',
        component: () =>
          import('@/views/fitness/project/info'),
        meta: {title: '添加项目', icon: 'link'},
      },
      {
        path: 'info/:id',
        name: '添加项目',
        component: () =>
          import('@/views/fitness/project/info'),
        meta: {title: '添加项目', noCache: true},
        hidden: true
      },
      {
        path: 'chapter/:id',
        name: 'FitnessProjectChapterEdit',
        component: () => import('@/views/fitness/project/chapter'),
        meta: {title: '编辑项目大纲', noCache: true},
        hidden: true
      },
      {
        path: 'publish/:id',
        name: 'FitnessProjectPublishEdit',
        component: () => import('@/views/fitness/project/publish'),
        meta: {title: '发布项目', noCache: true},
        hidden: true
      }
    ]
  },


  {
    path: '/form',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Form',
      component: () =>
        import ('@/views/form/index'),
      meta: {title: 'Form', icon: 'form'}
    }]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [{
      path: 'menu1',
      component: () =>
        import ('@/views/nested/menu1/index'), // Parent router-view
      name: 'Menu1',
      meta: {title: 'Menu1'},
      children: [{
        path: 'menu1-1',
        component: () =>
          import ('@/views/nested/menu1/menu1-1'),
        name: 'Menu1-1',
        meta: {title: 'Menu1-1'}
      },
        {
          path: 'menu1-2',
          component: () =>
            import ('@/views/nested/menu1/menu1-2'),
          name: 'Menu1-2',
          meta: {title: 'Menu1-2'},
          children: [{
            path: 'menu1-2-1',
            component: () =>
              import ('@/views/nested/menu1/menu1-2/menu1-2-1'),
            name: 'Menu1-2-1',
            meta: {title: 'Menu1-2-1'}
          },
            {
              path: 'menu1-2-2',
              component: () =>
                import ('@/views/nested/menu1/menu1-2/menu1-2-2'),
              name: 'Menu1-2-2',
              meta: {title: 'Menu1-2-2'}
            }
          ]
        },
        {
          path: 'menu1-3',
          component: () =>
            import ('@/views/nested/menu1/menu1-3'),
          name: 'Menu1-3',
          meta: {title: 'Menu1-3'}
        }
      ]
    },
      {
        path: 'menu2',
        component: () =>
          import ('@/views/nested/menu2/index'),
        meta: {title: 'menu2'}
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [{
      path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
      meta: {title: 'External Link', icon: 'link'}
    }]
  },

  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
