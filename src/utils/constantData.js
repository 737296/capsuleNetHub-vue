export const MENU_LIST = [
  {
    name: 'serviceAccessManagement',
    title: '业务接入管理',
    path: '/serviceAccessManagement',
    children: [
      {
        name: 'businessAppManagement',
        title: '业务侧APP管理',
        path: '/businessAppManagement',
        component: resolve => {
          require(['@/views/service-access-management/business-app-management.vue'], resolve)
        }
      }
    ]
  },
  {
    name: 'payListManagement',
    title: '支付列表配置',
    path: '/payListManagement',
    children: [
      {
        name: 'payChannelRuleManagement',
        title: '支付渠道规则限制',
        path: '/payChannelRuleManagement',
        component: resolve => {
          require(['@/views/pay-list-management/pay-channel-rule-management.vue'], resolve)
        }
      },
      {
        name: 'payChannelRuleGLManagement',
        title: '支付渠道规则(货劳)',
        path: '/payChannelRuleGLManagement',
        component: resolve => {
          require(['@/views/pay-list-management/pay-channel-rule-gl-management.vue'], resolve)
        }
      }
    ]
  },
  {
    name: 'appSecretKeyManagement',
    title: 'APP密钥维护',
    path: '/appSecretKeyManagement',
    children: [
      {
        name: 'appSecretManagement',
        title: 'APP密钥维护',
        path: '/appSecretManagement',
        component: resolve => {
          require(['@/views/app-secret-management/app-secret-management.vue'], resolve)
        }
      }
    ]
  },
  {
    name: 'merchantSecretKeyManagement',
    title: '商号秘钥信息维护',
    path: '/merchantSecretKeyManagement',
    children: [
      {
        name: 'alipayMerchantManagement',
        title: '支付宝1.0商户号维护',
        path: '/alipayMerchantManagement',
        component: resolve => {
          require(['@/views/merchant-secret-management/alipay-merchant-management.vue'], resolve)
        }
      },
      {
        name: 'weappMerchantManagement',
        title: '微信商户号维护',
        path: '/weappMerchantManagement',
        component: resolve => {
          require(['@/views/merchant-secret-management/weapp-merchant-management.vue'], resolve)
        }
      }
    ]
  },
  {
    name: 'mcStorePayManagement',
    title: 'MC餐厅收款账号',
    path: '/mcStorePayManagement',
    children: [
      {
        name: 'vPayUnionpayManagement',
        title: '餐厅收款账号报告',
        path: '/vPayUnionpayManagement',
        component: resolve => {
          require(['@/views/mcstore-pay-management/vpay-unionpay-management.vue'], resolve)
        }
      }
    ]
  },
  {
    name: 'merchantApplication',
    title: '二级商户进件管理',
    path: '/merchantApplication',
    children: [
      {
        name: 'merchantApplicationList',
        title: '商户法人列表',
        path: '/merchantApplicationList',
        component: resolve => {
          require(['@/views/merchant-application/applicationList.vue'], resolve)
        }
      }
    ]
  },
  {
    name: 'billRefund',
    title: '退款异常管理',
    path: '/billRefund',
    children: [
      {
        name: 'billRefundList',
        title: '退款异常列表',
        path: '/billRefundList',
        component: resolve => {
          require(['@/views/bill-refund/billRefundList.vue'], resolve)
        }
      }
    ]
  },
  {
    name: 'payDataManagement',
    title: '支付数据查询',
    path: '/payDataManagement',
    children: [
      {
        name: 'payOrderList',
        title: '支付订单列表',
        path: '/payOrderList',
        component: resolve => {
          require(['@/views/pay-data-management/pay-order-list.vue'], resolve)
        }
      },
      {
        name: 'payOrderListQuery',
        title: '支付订单列表查询',
        path: '/payOrderListQuery',
        component: resolve => {
          require(['@/views/pay-data-management/pay-order-list-query.vue'], resolve)
        }
      },
      {
        name: 'payAbnormalList',
        title: '异常支付查询',
        path: '/payAbnormalList',
        component: resolve => {
          require(['@/views/pay-data-management/pay-abnormal-list.vue'], resolve)
        }
      },
      {
        name: 'highRiskManagement',
        title: '高风险阻断管理',
        path: '/highRiskManagement',
        component: resolve => {
          require(['@/views/pay-data-management/high-risk-management.vue'], resolve)
        }
      }
    ]
  },
  {
    name: 'systemManagement',
    title: '系统管理',
    path: '/systemManagement',
    children: [
      {
        name: 'userManagement',
        title: '用户管理',
        path: '/userManagement',
        component: resolve => {
          require(['@/views/system-management/user-management.vue'], resolve)
        }
      },
      {
        name: 'roleManagement',
        title: '角色管理',
        path: '/roleManagement',
        component: resolve => {
          require(['@/views/system-management/role-management.vue'], resolve)
        }
      }
    ]
  },
  {
    name: 'exceptionData',
    title: '异常数据统计',
    path: '/exceptionData',
    children: [
      {
        name: 'exceptionShareDataList',
        title: '分账异常商户',
        path: '/exceptionShareDataList',
        component: resolve => {
          require(['@/views/exception-data/share/shareDataList.vue'], resolve)
        }
      }
    ]
  }
]
export const OTHER_ROUTER = [
  {
    path: '/payOrderDetails',
    title: '支付账单明细',
    name: 'payOrderDetails',
    component: resolve => {
      require(['@/views/pay-data-management/components/pay-order-details.vue'], resolve)
    }
  },

  {
    path: '/merchantAdd',
    title: '二级商户申请新增',
    name: 'merchantAdd',
    component: resolve => {
      require(['@/views/merchant-application/components/merchantAdd.vue'], resolve)
    }
  },

  {
    path: '/merchantEdit',
    title: '二级商户申请编辑',
    name: 'merchantEdit',
    component: resolve => {
      require(['@/views/merchant-application/components/merchantEdit.vue'], resolve)
    }
  },
  {
    path: '/merchantDetails',
    title: '二级商户申请详情',
    name: 'merchantDetails',
    component: resolve => {
      require(['@/views/merchant-application/components/merchantDetails.vue'], resolve)
    }
  },

  {
    path: '/accountBooksList',
    title: '二级商户电子账簿',
    name: 'accountBooksList',
    component: resolve => {
      require(['@/views/merchant-application/components/accountBooksList.vue'], resolve)
    }
  }

]
