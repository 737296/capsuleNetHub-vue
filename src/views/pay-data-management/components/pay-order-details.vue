<template>
  <div class="page-root">
    <Spin :fix="true" v-show="detailFieldListLoading"></Spin>
    <!-- 顶部详情 -->
    <div class="order-detail">
      <h1>订单信息</h1>
      <div class="detail-item">
        <DetailItem v-model="detailFieldList" />
      </div>
    </div>
    <!-- 账单详情 -->
    <div class="order-detail">
      <Tabs type="card">
        <TabPane label="支付账单详情">
          <template v-for="(paymentFields, index) in paymentFieldList">
            <div v-for="(v, idx) in paymentFields" :key="'p' + idx">
              <div class="flex">
                <img class="iconImage" :src="v.icon" />
                <DetailItem v-model="v.fieldList" />
              </div>
              <!-- 优惠明细 -->
              <template v-if="hasPaymentPromotion(paymentFields)">
                <div v-if="idx%2!==0" class="cxxq-detail">
                  <div v-if="paymentPromotionLoading" class="demo-spin-container">
                    <Spin></Spin>
                  </div>
                  <template v-if="getTableData(paymentFields, index) && getTableData(paymentFields, index).show">
                    <Table border stripe :row-class-name="rowClassName" :columns="columns1" :data="getTableData(paymentFields, index).data"></Table>
                    <div class="cxxq-title" @click="getPaymentPromotionDetail(paymentFields, index)">
                      收起优惠明细
                    </div>
                  </template>
                  <template v-else>
                    <div class="cxxq-title" @click="getPaymentPromotionDetail(paymentFields, index)">
                      查询优惠明细
                    </div>
                  </template>
                </div>
              </template>
              <!-- 分割线 -->
              <div v-if="idx%2!==0" class="split-line"></div>
            </div>
          </template>
          <template v-for="integralFields in integralFieldList">
            <div v-for="(v, idx) in integralFields" :key="'i' + idx">
              <div class="flex">
                <img class="iconImage" :src="v.icon" />
                <DetailItem v-model="v.fieldList" />
              </div>
              <div v-if="idx%2!==0" class="split-line"></div>
            </div>
          </template>
        </TabPane>
        <TabPane label="退单详情">
          <dev>
            <div>
              <DetailItem v-model="refundApplyList" />
            </div>
            <div  class="split-line"></div>
          </dev>
          <template v-for="refundFields in refundFieldList">
            <div v-for="(v, idx) in refundFields" :key="'r' + idx">
              <div class="flex">
                <img class="iconImage" :src="v.icon" />
                <DetailItem v-model="v.fieldList" />
              </div>
              <div v-if="idx%2!==0" class="split-line"></div>
            </div>
          </template>
        </TabPane>
        <TabPane label="商品详情"  >
          <div v-if=" productOrderList.length === 0" class="no-search">
            <img src="../images/nosearch.png" key="no-search" class="search" />
          </div>
          <template v-else v-for="productList in productOrderList">
            <div v-for="(v, idx) in productList" :key="'o' + idx">
              <div class="flex">
                <DetailItem v-model="v.products" />
              </div>
              <div class="split-line"></div>
            </div>
          </template>
        </TabPane>
         <TabPane label="企业付详情" v-if="isUseEnterprisePay">
            <template v-for="(enterprisePayList, idx) in enterprisePayFieldList">
               <Collapse v-model="value1" :key="'c' + idx">
                  <Panel :name="idx + ''">
                    <span v-if="idx==0">支付中台计算企业付明细</span>
                    <span v-if="idx==1">实际企业付明细</span>
                    <DetailItem slot="content" v-model="enterprisePayList.fieldList" />
                    <div slot="content" v-if="idx==0" :key="'c' + idx">
                        <Table border :columns="columns2" :data="enterprisePayGoodsDetail"></Table>
                    </div>
                  </Panel>
              </Collapse>
          </template>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
// import commMixin from "@/mixin";
import baseApi from '../pay-order-list-api'
const getDefOrderFieldList = () => [
  {
    title: '交易号：',
    key: 'transactionNum',
    value: ''
  },
  {
    title: '订单编号：',
    key: 'orderId',
    value: ''
  },
  {
    title: '品牌：',
    key: 'brand',
    value: ''
  },
  {
    title: '业务编码：',
    key: 'business',
    value: ''
  },
  {
    title: '业务APP：',
    key: 'businessApp',
    value: ''
  },
  {
    title: '来源：',
    key: 'fromSystem',
    value: ''
  },
  {
    title: '订单金额：',
    key: 'orderAmount',
    value: ''
  },
  {
    title: '支付金额：',
    key: 'payAmount',
    value: ''
  },
  {
    title: '订单时间：',
    key: 'orderTime',
    value: ''
  },
  {
    title: '订单状态：',
    key: 'orderStatus',
    value: ''
  },
  {
    title: '送餐时间：',
    key: 'orderSendTime',
    value: ''
  },
  {
    title: '是否隔日单：',
    key: 'isAnotherDay',
    value: ''
  },
  {
    title: '餐厅编码：',
    key: 'storeCode',
    value: ''
  },
  {
    title: '手机号：',
    key: 'mobile',
    value: ''
  },
  {
    title: '用户编号：',
    key: 'userCode',
    value: ''
  },
  {
    title: '退单结果干预人：',
    key: 'interventionUser',
    value: ''
  },
  {
    title: '退单结果干预时间：',
    key: 'interventionDate',
    value: ''
  }
]
const getDefPaymentFieldList = () => [
  {
    // name: "支付序列",
    icon: require('../images/weapp.png'),
    fieldList: [
      {
        title: '业务编码：',
        key: 'business',
        value: ''
      },
      {
        title: '支付序号：',
        key: 'payNo',
        value: ''
      },
      {
        title: '网支号：',
        key: 'paymentNum',
        value: ''
      },
      {
        title: '支付金额：',
        key: 'payAmount',
        value: ''
      },
      {
        title: '支付方式：',
        key: 'channel',
        value: ''
      },
      {
        title: '支付产品编码：',
        key: 'productCode',
        value: ''
      },
      {
        title: '支付终端：',
        key: 'payPortalType',
        value: ''
      },
      {
        title: '支付APPID：',
        key: 'appId',
        value: ''
      },
      {
        title: '商户号：',
        key: 'merchantNum',
        value: ''
      },
      {
        title: '合作者ID：',
        key: 'partnerId',
        value: ''
      },
      {
        title: '外部订单编号：',
        key: 'thirdOrderId',
        value: ''
      },
      {
        title: '签约交易号：',
        key: 'signTransactionNum',
        value: ''
      }
    ]
  },
  {
    // name: "APPID",
    icon: require('../images/money.png'),
    fieldList: [
      {
        title: '付款用户账号：',
        key: 'payAccount',
        value: ''
      },
      {
        title: '付款用户ID：',
        key: 'payUserId',
        value: ''
      },
      {
        title: '用户支付金额：',
        key: 'userPayAmount',
        value: ''
      },
      {
        title: '支付时间：',
        key: 'payTime',
        value: ''
      },
      {
        title: '支付渠道流水号：',
        key: 'channelTradeNo',
        value: ''
      },
      {
        title: '付款方式：',
        key: 'payType',
        value: ''
      },
      {
        title: '百胜折扣：',
        key: 'yumDiscount',
        value: ''
      },
      {
        title: '第三方补贴：',
        key: 'channelContribute',
        value: ''
      },
      {
        title: '第三方补贴-合作：',
        key: 'coContribute',
        value: ''
      },
      {
        title: '营销活动-整单标识：',
        key: 'goodsTag',
        value: ''
      },
      {
        title: '营销活动-单品标识(单品linkId)：',
        key: 'discountGoodsId',
        value: ''
      }
    ]
  }
]

const getEnterprisePayFieldList = () => [
  {
    fieldList: [
      {
        title: '个人付金额（单位：分）：',
        key: 'personalPrice',
        value: ''
      },
      {
        title: '企业付金额（单位：分）：',
        key: 'enterprisePayPrice',
        value: ''
      }
    ]
  },
  {
    fieldList: [
      {
        title: '企业实际分摊金额（单位：分）：',
        key: 'aliEnterprisePayPrice',
        value: ''
      },
      {
        title: '个人实付金额（单位：分）：',
        key: 'aliPersonalPayPrice',
        value: ''
      },
      {
        title: '企业ID：',
        key: 'enterpriseId',
        value: ''
      }
    ]
  }
]

const getIntegralFieldList = () => [
  {
    // name: "扣除积",
    icon: require('../images/weapp.png'),
    fieldList: [
      {
        title: '业务编码：',
        key: 'business',
        value: ''
      },
      {
        title: '支付序号：',
        key: 'payNo',
        value: ''
      },
      {
        title: '网支号：',
        key: 'paymentNum',
        value: ''
      },
      {
        title: '支付方式：',
        key: 'channel',
        value: ''
      },
      {
        title: '支付产品编码：',
        key: 'productCode',
        value: ''
      },
      {
        title: '支付终端：',
        key: 'payPortalType',
        value: ''
      },
      {
        title: '支付金额：',
        key: 'payAmount',
        value: ''
      },
      {
        title: '商户号：',
        key: 'appId',
        value: ''
      }
    ]
  },
  {
    // name: "扣除积",
    icon: require('../images/integral.png'),
    fieldList: [
      {
        title: '扣除积分：',
        key: 'point',
        value: ''
      },
      {
        title: '活动ID：',
        key: 'activityId',
        value: ''
      },
      {
        title: '券码：',
        key: 'couponCode',
        value: ''
      },
      // {
      //   title: '券码类型：',
      //   key: 'couponType',
      //   value: ''
      // },
      {
        title: '券码折扣力度：',
        key: 'discountLevel',
        value: ''
      },
      {
        title: '核销码：',
        key: 'ruleCode',
        value: ''
      },
      {
        title: '核销时间：',
        key: 'useTime',
        value: ''
      },
      {
        title: '开票金额：',
        key: 'paymentPriceA',
        value: ''
      },
      {
        title: '第三方补贴：',
        key: 'paymentPriceB',
        value: ''
      },
      {
        title: '折扣金额：',
        key: 'discount',
        value: ''
      },
      {
        title: '抵扣金额：',
        key: 'deductionAmount',
        value: ''
      },
      {
        title: '是否预付券：',
        key: 'preCouponFlag',
        value: ''
      },
      {
        title: '是否PRIME：',
        key: 'primeFlag',
        value: ''
      }
    ]
  }
]

const getRefundApplyList = () => [
  {
    title: '客服申请退单时间：',
    key: 'applyTime',
    value: ''
  },
  {
    title: '申请退单理由：',
    key: 'applyReason',
    value: ''
  },
  {
    title: '餐厅确认退单时间：',
    key: 'cancelTime',
    value: ''
  },
  {
    title: '餐厅拒绝退单时间：',
    key: 'refuseTime',
    value: ''
  },
  {
    title: '拒绝退单理由：',
    key: 'refuseReason',
    value: ''
  }
]
const getRefundFieldList = () => [
  {
    // name: "APPID",
    icon: require('../images/weapp.png'),
    fieldList: [
      {
        title: '支付序号：',
        key: 'payNo',
        value: ''
      },
      {
        title: '网支号：',
        key: 'paymentNum',
        value: ''
      },
      {
        title: '支付方式：',
        key: 'channel',
        value: ''
      }
      //   {
      //     title: '支付渠道流水号：',
      //     key: 'channelTradeNo',
      //     value: ''
      //   }
    ]
  },
  {
    // name: "扣除积",
    icon: require('../images/money.png'),
    fieldList: [
      {
        title: '退款外部订单编号：',
        key: 'refundOrderId',
        value: ''
      },
      {
        title: '退款申请时间：',
        key: 'refundApplyTime',
        value: ''
      },
      {
        title: '退款类型：',
        // key: 'refundTypeShow',
        key: 'refundType',
        value: ''
      },
      {
        title: '退款发起系统：',
        key: 'refundSystem',
        value: ''
      },
      {
        title: '退款发起者：',
        key: 'refundStaff',
        value: ''
      },
      {
        title: '退款原因：',
        key: 'refundReason',
        value: ''
      },
      {
        title: '退款金额：',
        key: 'refundAmount',
        value: ''
      },
      {
        title: '退款网支号：',
        key: 'refundNum',
        value: ''
      },
      {
        title: '退款批次号：',
        key: 'refundBatchNum',
        value: ''
      },
      {
        title: '退款状态：',
        key: 'refundStatus',
        value: ''
      },
      {
        title: '退款处理时间：',
        key: 'refundProcessTime',
        value: ''
      },
      {
        title: '退款失败原因：',
        key: 'nonRefundReason',
        value: ''
      }
    ]
  }
]

const getProductList = () => [
  {
    products: [{
      title: 'linkId：',
      key: 'goodsId',
      value: ''
    },
    {
      title: '商品名称：',
      key: 'goodsName',
      value: ''
    },
    {
      title: '数量：',
      key: 'quantity',
      value: ''
    },
    {
      title: '价格：',
      key: 'price',
      value: ''
    },
    {
      title: '营销标识：',
      key: 'promotionFlag',
      value: ''
    }]
  }
]
const getTableColumn = () => [
  {
    title: '优惠Id',
    key: 'promotionId'
  },
  {
    title: '优惠名称',
    key: 'promotionName'
  },
  {
    title: '活动Id',
    key: 'activityId'
  },
  {
    title: '优惠类型',
    key: 'promotionType'
  },
  {
    title: '优惠金额',
    key: 'amount'
  },
  {
    title: '百胜折扣',
    key: 'yumDiscount'
  },
  {
    title: '第三方补贴',
    key: 'channelContribute'
  },
  {
    title: '第三方补贴——合作',
    key: 'coContribute'
  }
]
const getEnterprisePayTableColumn = () => [
  {
    title: '商品Id',
    key: 'goodsId',
    width: 100,
    align: 'center'
  },
  {
    title: '货劳分类',
    key: 'financeDepartmentCode',
    width: 100,
    align: 'center'
  },
  {
    title: '税率',
    key: 'taxRate',
    width: 100,
    align: 'center'
  },
  {
    title: '商品名称',
    key: 'goodsName',
    width: 144,
    align: 'center'
  },
  {
    title: '数量',
    key: 'quantity',
    width: 100,
    align: 'center'
  },
  {
    title: '商品原价（单位：分）',
    key: 'price',
    width: 150,
    align: 'center'
  },
  {
    title: '商品券后优惠价（单位：分）',
    key: 'realPrice',
    width: 200,
    align: 'center'
  },
  {
    title: '是否支持企业付',
    key: 'supportEnterprisePay',
    width: 150,
    align: 'center',
    render: (h, { row, column }) => {
      return h('span', {}, row[column.key] ? '是' : '否')
    }
  },
  {
    title: 'V金分摊金额（单位：分）',
    key: 'vgPayApportionPrice',
    width: 200,
    align: 'center'
  },
  {
    title: '礼品卡分摊金额（单位：分）',
    key: 'yumCardApportionPrice',
    width: 200,
    align: 'center'
  },
  {
    title: '最终支付金额（单位：分）',
    key: 'finalNeedPayPrice',
    width: 200,
    align: 'center'
  }
]
export default {
  name: 'payOrderDetails',
  components: {
    DetailItem: (resolve) => require(['./pay-order-details-item.vue'], resolve)
  },
  // mixins: [commMixin],
  data () {
    return {
      detailFieldList: getDefOrderFieldList(),
      productOrderList: [],
      paymentFieldList: [],
      refundApplyList: getRefundApplyList(),
      refundFieldList: [],
      integralFieldList: [],
      refundApplyListLoading: false,
      detailFieldListLoading: false,
      refundFieldListLoading: false,
      productListLoading: false,
      paymentPromotionData: {},
      columns1: getTableColumn(),
      columns2: getEnterprisePayTableColumn(),
      paymentPromotionLoading: false,
      isUseEnterprisePay: false,
      enterprisePayFieldList: getEnterprisePayFieldList(),
      enterprisePayGoodsDetail: {},
      value1: ['0', '1']
    }
  },
  created () {
    if (this.$route && this.$route.query) {
      this.getOrderDetail(this.$route.query)
    }
  },
  methods: {
    getOrderDetail ({ orderId, transactionNum }) {
      this.detailFieldListLoading = true
      baseApi
        .getDetails({
          orderId,
          transactionNum
        })
        .then(({ data }) => {
          if (+data.code === 200) {
            this.detailDataHandle(data.data)
            this.getRefundApplyListData(data.data)
            this.getRefundDetails(data.data)
            this.getOrderDetailsData(data.data)
            this.getEnterprisePayListData(data.data)
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch((err) => {
          this.$Message.error(`查询失败！${err.message}`)
          console.log(err)
        })
        .finally(() => {
          this.detailFieldListLoading = false
        })
    },
    detailDataHandle (data) {
      console.log('data1===========', data)
      this.detailFieldList = getDefOrderFieldList().map((v) => {
        v.value = data[v.key]
        v.key === 'isAnotherDay' && (v.value = v.value ? '是' : '否')
        if ((v.key === 'interventionDate' || v.key === 'interventionUser') && v.value === null) {
          return {}
        } else {
          return v
        }
      })
      console.log('this.detailFieldList', this.detailFieldList)
      if (data.payment) {
        this.paymentFieldList = data.payment.map((item) => {
          return getDefPaymentFieldList().map((v) => {
            v.fieldList.forEach((field) => {
              field.value = item[field.key]
            })
            return v
          })
        })
      }
      if (data.vcp) {
        this.integralFieldList = data.vcp.map((item) => {
          return getIntegralFieldList().map((v) => {
            v.fieldList.forEach((field) => {
              field.value = item[field.key]
            })
            return v
          })
        })
      }
    },
    getEnterprisePayListData (data) {
      if (data.enterprisePayDetailDTO) {
        this.enterprisePayGoodsDetail = data.enterprisePayDetailDTO.goodsDetailDTOList
        this.isUseEnterprisePay = data.enterprisePayDetailDTO.useEnterprisePay
        this.enterprisePayFieldList = getEnterprisePayFieldList().map((v) => {
          v.fieldList.forEach((field) => {
            if (field.key === 'enterpriseId') {
              field.value = data.enterprisePayDetailDTO[field.key] === null ? ' ' : data.enterprisePayDetailDTO[field.key]
            } else {
              field.value = data.enterprisePayDetailDTO[field.key] === null ? '0' : data.enterprisePayDetailDTO[field.key]
            }
          })
          return v
        })
      }
      console.log('enterprisePay===========', this.enterprisePayFieldList)
    },
    getRefundApplyListData (data3) {
      this.refundApplyListLoading = true
      baseApi
        .getOrderApply({
          orderId: data3.orderId,
          business: data3.business
        })
        .then(({ data }) => {
          if (+data.code === 200) {
            this.refundApplyListHandle(data.data)
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch((err) => {
          this.$Message.error(`查询失败！${err.message}`)
          console.log(err)
        })
        .finally(() => {
          this.refundApplyListLoading = false
        })
    },
    refundApplyListHandle (data) {
      this.refundApplyList = getRefundApplyList().map((v) => {
        v.value = data[v.key]
        if (data.applyOrderFlag === 1) {
          if ((v.key === 'applyTime' || v.key === 'applyReason' || v.key === 'cancelTime' || v.key === 'refuseTime' || v.key === 'refuseReason') && v.value === null) {
            return {}
          } else {
            return v
          }
        } else if (data.applyOrderFlag === 0) {
          return null
        }
        console.log('this.refundApplyList', this.refundApplyList)
      })
    },

    getRefundDetails (data1) {
      this.refundFieldListLoading = true
      baseApi
        .getRefundDetails({
          transactionNum: data1.transactionNum,
          brand: data1.brand,
          business: data1.business,
          businessApp: data1.businessApp
        })
        .then(({ data }) => {
          if (+data.code === 200) {
            this.refundDetailDataHandle(data.data)
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch((err) => {
          this.$Message.error(`查询失败！${err.message}`)
          console.log(err)
        })
        .finally(() => {
          this.refundFieldListLoading = false
        })
    },
    refundDetailDataHandle (data) {
      if (data) {
        let list = data
        console.log('data2===========', data)
        // list = list.map((item)=>{
        //   if(item.refundType === 1) {
        //     item.refundTypeShow = '普通'
        //   } else if(item.refundType === 2) {
        //     item.refundTypeShow = '紧急'
        //   } else{
        //     item.refundTypeShow = '--'
        //   }
        //   return item
        // })
        this.refundFieldList = list.map((item) => {
          return getRefundFieldList().map((v) => {
            v.fieldList.forEach((field) => {
              field.value = item[field.key]
            })
            return v
          })
        })
      }
    },
    getOrderDetailsData (data2) {
      this.productListLoading = true
      baseApi
        .getOrderDetailsData({
          transactionNum: data2.transactionNum
        })
        .then(({ data }) => {
          if (+data.code === 200) {
            this.getOrderDetailsDataHandle(data.data)
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch((err) => {
          this.$Message.error(`查询失败！${err.message}`)
          console.log(err)
        })
        .finally(() => {
          this.productListLoading = false
        })
    },
    getOrderDetailsDataHandle (data) {
      if (data) {
        let list = data
        this.productOrderList = list.map((item) => {
          return getProductList().map((v) => {
            v.products.forEach((product) => {
              product.value = item[product.key]
            })
            return v
          })
        })
        console.log('this.productOrderList', this.productOrderList)
      }
    },
    // 获取支付订单促销详情
    getPaymentPromotionDetail (paymentFields, index) {
      let { transactionNum } = this.$route.query
      // 获取网支号
      let paymentNum = paymentFields[0].fieldList[2].value
      let key = paymentNum + index
      let value = this.paymentPromotionData[key]
      if (value) {
        // 关闭
        value.show = !value.show
        this.$forceUpdate()
        return
      }
      this.paymentPromotionLoading = true
      baseApi
        .getPaymentPromotionDetail({
          transactionNum: transactionNum,
          paymentNum: paymentNum
        })
        .then(({ data }) => {
          if (+data.code === 200) {
            let item = {
              show: true,
              data: data.data
            }
            this.paymentPromotionData[key] = item
            // console.log(this.paymentPromotionData)
            this.$forceUpdate()
          } else {
            return Promise.reject(new Error(data.msg))
          }
        })
        .catch((err) => {
          this.$Message.error(`查询失败！${err.message}`)
          console.log(err)
        })
        .finally(() => {
          this.paymentPromotionLoading = false
        })
    },
    getTableData (paymentFields, index) {
      // 获取网支号
      let paymentNum = paymentFields[0].fieldList[2].value
      let key = paymentNum + index
      let res = this.paymentPromotionData[key]
      // console.log('getTableData', res)
      return res
    },
    // 判断是否显示优惠明细按钮
    hasPaymentPromotion (paymentFields) {
      // let goodsTag = paymentFields[1].fieldList[9].value
      // let discountGoodsId = paymentFields[1].fieldList[10].value
      // return goodsTag || discountGoodsId
      let yumDiscount = paymentFields[1].fieldList[6].value
      let channelContribute = paymentFields[1].fieldList[7].value
      let coContribute = paymentFields[1].fieldList[8].value
      if ((yumDiscount === 0 && channelContribute === 0 && coContribute === 0) || (yumDiscount === '0' && channelContribute === '0' && coContribute === '0')) {
        return false
      }
      return yumDiscount || channelContribute || coContribute
    }
  }
}

</script>

<style lang="less" scoped>
.page-root {
  overflow: hidden;
  overflow-y: auto;
}
.order-detail {
  margin: 20px;
  .detail-item {
    padding: 0px 20px;
  }
  .split-line {
    height: 1px;
    background-color: #e9eaec;
  }
  .flex {
    margin: 20px;
    // align-items: end;
    align-items: flex-start;
  }
  .iconImage {
    margin-top: 18px;
  }
  .cxxq-detail {
    margin: 0 80px 20px 80px;
    .cxxq-title {
      font-weight: 600;
      color: #1c2438;
      font-size: 13px;
      margin-top: 20px;
      color: blue;
      cursor: pointer;
    }
  }
}
.no-search{
  display: flex;
  align-items: center;
  justify-content: center;
  // background-image:  url('../images/nosearch.png');
  // background-size: cover;
  // background-position: center;
}
.search{
  width: 98px;
  height: 64px;
  margin-top: 100px;
}
.demo-spin-container{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
