export const REST_URL = {
  // 登录
  LOGIN: '/ssoLogin', // 登录
  SSOLOGIN: '/getAuthorizationUrl',
  LOGOUT: '/logout', // 登出

  // 公共数据
  FORM_BRAND_SELECT: '/admin/brandBox',
  FORM_BUSINESS_SELECT: '/admin/businessBox',
  FORM_BUSINESSAPP_SELECT: '/admin/businessAppBoxByBusiness',
  FORM_APP_SELECT: '/admin/appNameBox',
  FORM_SIGNTYPE_SELECT: '/admin/signTypeBox',
  FORM_PORTALTYPE_SELECT: '/admin/portalTypeBox',
  FORM_PAYMENTCODE_SELECT: '/admin/paymentCodeBox',
  FORM_PAYTYPE_SELECT: '/admin/channelMethodBox',
  FORM_NEW_PAYTYPE_SELECT: '/admin/queryChannelPortalTypePrd',
  FORM_ROLE_SELECT: '/admin/roleAssign',
  MENU_TREE_SELECT: '/admin/getMenuTree',
  MENU_SELECT_MENTBOX: '/admin/financeDepartmentBox',

  // 业务侧APP管理
  QUERY_BUSINESS_TABLE: '/admin/queryBusiness',
  UPDATE_BUSINESS_DATA: '/admin/editBusiness',
  ADD_BUSINESS_DATA: '/admin/addBusiness',
  DEL_BUSINESS_DATA: '/admin/deleteBusiness',
  QUERY_EXTBUSINESS_TABLE: '/admin/echoBusiness',
  ADD_EXTBUSINESS_DATA: '/admin/addProductMaintenance',
  UPDATE_EXTBUSINESS_DATA: '/admin/editProductMaintenance',
  QUERY_EXTBUSINESSDETAILS_TABLE: '/admin/echoProduct',
  DEL_EXTBUSINESS_DATA: '/admin/deleteProductMaintenance',

  // 支付渠道规则限制
  QUERY_PAYCHANNEL_TABLE: '/admin/queryChannelRule',
  UPDATE_PAYCHANNEL_DATA: '/admin/editChannelRule',
  ADD_PAYCHANNEL_DATA: '/admin/addChannelRule',
  DEL_PAYCHANNEL_DATA: '/admin/deleteChannelRule',
  QUERY_EXTPRODUCT_TABLE: '/admin/queryGoodsRuleManagement',
  ADD_EXTPRODUCTRULE_DATA: '/admin/addGoodsRuleManagement',
  UPDATE_EXTPRODUCTRULE_DATA: '/admin/editGoodsRuleManagement',
  QUERY_EXTPRODUCTRULE_DATA: '/admin/echoGoodsRuleManagement',
  DEL_EXTPRODUCTRULE_DATA: '/admin/deleteGoodsRuleManagement',
  QUERY_EXTUSER_TABLE: '/admin/queryUsersRuleManagement',
  ADD_EXTUSERRULE_DATA: '/admin/addUsersRuleManagement',
  ADD_EXTUSERRULE_DATA_BAT: '/admin/enteringUsersRule',
  UPDATE_EXTUSERRULE_DATA: '/admin/editUsersRuleManagement',
  QUERY_EXTUSERRULE_DATA: '/admin/echoUsersRuleManagement',
  DEL_EXTUSERRULE_DATA: '/admin/deleteUsersRuleManagement',
  QUERY_PAYCHANNEL_GL_TABLE: '/admin/queryFinanceDepartment',
  UPDATE_PAYCHANNEL_GL_DATA: '/admin/editFinanceDepartment',
  ADD_PAYCHANNEL_GL_DATA: '/admin/addFinanceDepartment',
  DEL_PAYCHANNEL_GL_DATA: '/admin/deleteFinanceDepartment',
  QUERY_EXTPRODUCT_GL_TABLE: '/admin/queryFinanceDepartmentRule',
  ADD_EXTPRODUCTRULE_GL_DATA: '/admin/addFinanceDepartmentRule',
  UPDATE_EXTPRODUCTRULE_GL_DATA: '',
  DEL_EXTPRODUCTRULE_GL_DATA: '/admin/deleteFinanceDepartmentRule',

  // APP密钥维护
  QUERY_APPSECRET_TABLE: '/admin/queryAppKey',
  ADD_APPSECRET_DATA: '/admin/addAppKey',
  UPDATE_APPSECRET_DATA: '/admin/editAppKey',
  DEL_APPSECRET_DATA: '/admin/deleteAppKey',
  UPLOAD_MERCHANT_DATA: '/admin/paymentAppCertUpload',

  // 商号秘钥信息维护
  QUERY_ALIPAYMERCHANT_TABLE: '/admin/queryALIMerchant',
  ADD_ALIPAYMERCHANT_DATA: '/admin/addALIMerchant',
  UPDATE_ALIPAYMERCHANT_DATA: '/admin/editALIMerchant',
  DEL_ALIPAYMERCHANT_DATA: '/admin/deleteALIMerchant',
  QUERY_ALIPAYMERCHANT_DATA: '/admin/echoALIMerchant',
  EXPORT_ALIPAYMERCHANT_DATA: '/admin/ExcelListALI',
  QUERY_WEAPPMERCHANT_TABLE: '/admin/queryWXMerchant',
  ADD_WEAPPMERCHANT_DATA: '/admin/addWXMerchant',
  UPDATE_WEAPPMERCHANT_DATA: '/admin/editWXMerchant',
  DEL_WEAPPMERCHANT_DATA: '/admin/deleteWXMerchant',
  QUERY_WEAPPMERCHANT_DATA: '/admin/echoWXMerchant',
  UPLOAD_WEAPPMERCHANT_DATA: '/admin/merchantCertUpload',
  EXPORT_WEAPPMERCHANT_DATA: '/admin/ExcelListWX',

  // MC餐厅
  QUERY_MCSTOREPAY_TABLE: '/admin/queryStore',
  EXPORT_MCSTOREPAY_DATA: '/admin/downloadExcel',
  EXPORT_MCSTOREPAY_TEMPLATE: '/admin/downloadStoreExtTemplate',
  UPLOAD_MCSTOREPAY_FILE: '/admin/importRestaurantExcel',
  QUERY_STORE_EXTINFO: '/admin/getStoreExtInfo',
  UPDATE_STORE_EXTINFO: '/admin/editStoreExtInfo',

  // 支付数据查询
  QUERY_ORDER_TABLE: '/admin/queryOrder',
  QUERY_PAY_ORDER_TABLE: '/admin/queryPayOrder',
  QUERY_ORDER_DATA: '/admin/paymentDetails',
  QUERY_REFUND_APPLY_DATA: '/admin/queryApplyCancelOrder',
  QUERY_REFUNDORDER_DATA: '/admin/refundDetails',
  QUERY_ORDER_DETAILS_DATA: '/admin/payOrderDetail',
  QUERY_ABSORDER_TABLE: '/admin/queryExceptionOrder',
  QUERY_HIGH_RISK_TABLE: '/admin/queryHighRiskOrder',
  INTERVENE_ALL: '/admin/refundAll',
  INTERVENE_PART: '/admin/refundPart',
  BLOCK: '/admin/highRiskRefundCacheCleaning',
  QUERY_PAYMENT_PROMOTION_DETAIL: '/admin/paymentPromotionDetail',

  // 系统管理
  QUERY_USER_TABLE: '/admin/queryUser',
  UPDATE_USER_DATA: '/admin/updateUser',
  ADD_USER_DATA: '/admin/insertUser',
  DEL_USER_DATA: '/admin/deleteUser',
  QUERY_ROLE_TABLE: '/admin/queryRole',
  UPDATE_ROLE_DATA: '/admin/updateRole',
  ADD_ROLE_DATA: '/admin/insertRole',
  DEL_ROLE_DATA: '/admin/deleteRole',
  QUERY_ROLE_DATA: '/admin/echoRole',

  //二级商户进件申请
  QUERY_APPLICATION_LIST: "/admin/queryLegalList",
  ADD_Businesslicense: "/admin/uploadImage",
  addformtest: "/admin/saveMerchantInfo",
  addAllformtest: "/admin/createMerchant",
  QUERY_ACCOUNTBOOKS_LIST: "/admin/queryBalanceAccountList",
  addaccountbooks: "/admin/createBalanceAccount",
  queryMerchantDetail: "/admin/queryMerchantDetail",
  Checkallamount: "/admin/validateMerchant"


}
