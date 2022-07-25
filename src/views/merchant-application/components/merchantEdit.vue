<template>
  <div>
    <div class="order-detail">
      <Button type="primary"
              @click="handleAllSubmit()">提交所有保存信息</Button>
      <br />
      <br />
      <Tabs value="name1">
        <TabPane label="基本信息"
                 name="name1">
          <div :style="{ padding: '50px 300px' }">
            <Card style="width: 90%">
              <template #title>
                <h3 style="text-align: center">基本信息</h3>
                <br />
              </template>

              <Form :model="formAllData"
                    :label-width="150"
                    disabled>
                <div class="main">
                  <FormItem label="主体类型"> 企业 </FormItem>
                  <Notification :count="5" />
                  <FormItem label="商户简称">
                    <Input v-model="formAllData.shortName" />
                  </FormItem>
                  <FormItem label="企业英文">
                    <Input v-model="formAllData.englishName" />
                  </FormItem>
                </div>
                <FormItem>
                  <Button type="primary"
                          @click="handleSubmit()">保存</Button>
                  <Button @click="handleReset(1)"
                          style="margin-left: 8px">清空</Button>
                </FormItem>
              </Form>
            </Card>
          </div>
        </TabPane>
        <TabPane label="营业执照信息"
                 name="name2">
          <div :style="{ padding: '2% 20%' }">
            <!-- 营业执照信息 -->
            <Card style="width: 90%">
              <template #title>
                <h3 style="text-align: center">营业执照信息</h3>
                <br />
              </template>
              <Form :model="formAllData"
                    :label-width="150">
                <div class="main">
                  <FormItem label="营业执照扫描件">
                    <Upload action="//jsonplaceholder.typicode.com/posts/"
                            :form="['jpg', 'jpeg', 'png', 'gif']"
                            :before-upload="handleUpload">
                      <Button icon="ios-cloud-upload-outline"
                              @click="filesign(1)">上传图片</Button>
                    </Upload>
                    <div v-if="file !== null && this.fileSign==1">
                      待上传文件名: {{ file.name }}
                      <a type="text"
                         @click="upload('businessLicenseCopy')"
                         :loading="loadingStatus">{{
                          loadingStatus ? "上传中" : "上传"
                      }}</a>
                    </div>

                    <div class="demo-upload-list"
                         v-if="formAllData.businessLicenseCopy!=null? true:false">

                      <img :src="businessLicenseCopyImg" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline"
                              @click="modalview = true"></Icon>
                        <!-- <Icon type="ios-trash-outline"
                              @click="modal = true"></Icon> -->
                      </div>
                      <Modal v-model="modalview"
                             title="图片细节"
                             width="1000">
                        <div><img :src="businessLicenseCopyImg" /></div>
                      </Modal>
                    </div>

                  </FormItem>
                  <FormItem label="营业执照注册号">
                    <Input type="text"
                           v-model="formAllData.businessLicenseNumber" />
                  </FormItem>
                  <FormItem label="营业执照公司名称">
                    <Input type="text"
                           v-model="formAllData.businessLicenseCompanyName" />
                  </FormItem>
                  <FormItem label="营业执照注册地址">
                    <Input type="text"
                           v-model="formAllData.businessLicenseCompanyAddress" />
                  </FormItem>
                  <FormItem label="营业期限">
                    <!-- <DatePicker type="date"
                                format="yyyy-MM-dd"
                                placeholder="开始时间"
                                v-model="businessLicenseStartTime">
                    </DatePicker> -->

                    <DatePicker type="date"
                                placeholder="结束时间"
                                v-model="formAllData.businessLicenseValidTime"
                                :disabled='businessLicenseTimeSwitch'
                                :readonly='businessLicenseTimeSwitch'>
                    </DatePicker>
                    <!-- <RadioGroup v-model="businessLicenseRadioGroup">
                      <Radio label="短期"
                             @click.native="businessLicenseRadioGroupChange(1)"></Radio>
                      <Radio label="长期"
                             @click.native="businessLicenseRadioGroupChange(2)"></Radio>

                    </RadioGroup> -->
                  </FormItem>
                </div>
                <FormItem>
                  <Button type="primary"
                          @click="handleSubmit()">保存</Button>
                  <Button @click="handleReset(2)"
                          style="margin-left: 8px">清空</Button>
                </FormItem>
              </Form>
            </Card>
          </div>
        </TabPane>
        <TabPane label="组织结构信息">
          <div :style="{ padding: '50px 300px' }">
            <!-- 组织结构信息 -->
            <Card style="width: 90%">
              <template #title>
                <h3 style="text-align: center">组织结构信息</h3>
                <br />
              </template>
              <Form :label-width="150">
                <div class="main">
                  <FormItem label="组织结构代码证件照">
                    <Upload action="//jsonplaceholder.typicode.com/posts/"
                            :form="['jpg', 'jpeg', 'png', 'gif']"
                            :before-upload="handleUpload">
                      <Button icon="ios-cloud-upload-outline"
                              @click="filesign(2)">上传图片</Button>
                    </Upload>
                    <div v-if="file !== null && fileSign==2">
                      待上传文件名: {{ file.name }}
                      <a type="text"
                         @click="upload('organizationCertCopy')"
                         :loading="loadingStatus">{{
                          loadingStatus ? "上传中" : "上传"
                      }}</a>
                    </div>
                    <div class="demo-upload-list"
                         v-if="formAllData.organizationCertCopy!=null? true:false">
                      <img :src="organizationCertCopyImg" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline"
                              @click="modalview1 = true"></Icon>
                        <!-- <Icon type="ios-trash-outline"
                              @click="modal = true"></Icon> -->
                      </div>
                      <Modal v-model="modalview1"
                             title="图片细节"
                             width="1000">
                        <div><img :src="organizationCertCopyImg" /></div>
                      </Modal>
                    </div>

                  </FormItem>
                  <FormItem label="组织结构代码">
                    <Input type="text"
                           v-model="formAllData.organizationCertNumber" />
                  </FormItem>

                  <FormItem label="组织结构代码有效期">
                    <!-- <DatePicker type="date"
                                placeholder="开始时间"
                                v-model="organizationCertStartTime">
                    </DatePicker> -->

                    <DatePicker type="date"
                                placeholder="结束时间"
                                v-model="formAllData.organizationCertValidTime"
                                :disabled='organizationCertTimeSwitch'
                                :readonly='organizationCertTimeSwitch'>
                    </DatePicker>
                    <!-- <RadioGroup v-model="organizationCertRadioGroup">
                      <Radio label="短期"
                             @click.native="organizationCertRadioGroupChange(1)"></Radio>
                      <Radio label="长期"
                             @click.native="organizationCertRadioGroupChange(2)"></Radio>

                    </RadioGroup> -->
                  </FormItem>
                </div>
                <FormItem>
                  <Button type="primary"
                          @click="handleSubmit()">保存</Button>
                  <Button @click="handleReset(3)"
                          style="margin-left: 8px">清空</Button>
                </FormItem>
              </Form>
            </Card>
          </div>
        </TabPane>
        <TabPane label="税务登记信息">
          <div :style="{ padding: '50px 300px' }">
            <!-- 税务登记信息 -->
            <Card style="width: 90%">
              <template #title>
                <h3 style="text-align: center">税务登记信息</h3>
                <br />
              </template>
              <Form :label-width="150">
                <div class="main">
                  <FormItem label="税务登记证照片">
                    <Upload action="//jsonplaceholder.typicode.com/posts/"
                            :form="['jpg', 'jpeg', 'png', 'gif']"
                            :before-upload="handleUpload">
                      <Button icon="ios-cloud-upload-outline"
                              @click="filesign(3)">上传图片</Button>
                    </Upload>
                    <div v-if="file !== null && fileSign==3">
                      待上传文件名: {{ file.name }}
                      <a type="text"
                         @click="upload('taxRegistrationCertCopy')"
                         :loading="loadingStatus">{{
                          loadingStatus ? "上传中" : "上传"
                      }}</a>
                    </div>
                    <div class="demo-upload-list"
                         v-if="formAllData.taxRegistrationCertCopy!=null? true:false">
                      <img :src="taxRegistrationCertCopyImg" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline"
                              @click="modalview2 = true"></Icon>
                        <!-- <Icon type="ios-trash-outline"
                              @click="modal = true"></Icon> -->
                      </div>
                      <Modal v-model="modalview2"
                             title="图片细节"
                             width="1000">
                        <div><img :src="taxRegistrationCertCopyImg" /></div>
                      </Modal>
                    </div>
                  </FormItem>
                  <FormItem label="税务登记号">
                    <Input v-model="formAllData.taxRegistrationCertNumber" />
                  </FormItem>
                </div>
                <FormItem>
                  <Button type="primary"
                          @click="handleSubmit()">保存</Button>
                  <Button @click="handleReset(4)"
                          style="margin-left: 8px">清空</Button>
                </FormItem>
              </Form>
            </Card>
          </div>
        </TabPane>
        <TabPane label="绑定账户信息">
          <div :style="{ padding: '50px 300px' }">
            <!-- 绑定账户信息 -->
            <Card style="width: 90%">
              <template #title>
                <h3 style="text-align: center">绑定账户信息</h3>
                <br />
              </template>
              <Form :label-width="150">
                <div class="main">
                  <FormItem label="账户类型">

                    <Select v-model="formAllData.settleAcctType"
                            style="width:200px">
                      <Option v-for="item in settleAcctTypeList"
                              :value="item.value"
                              :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="开户银行编码">
                    <Input type="text"
                           v-model="formAllData.settleAcctBankCode" />
                  </FormItem>
                  <FormItem label="开户名称">
                    <Input type="text"
                           v-model="formAllData.settleAcctName" />
                  </FormItem>
                  <FormItem label="开户银行省市编码">
                    <Input type="text"
                           v-model="formAllData.settleAcctBankAddressCode"
                           placeholder="精确到市" />
                  </FormItem>
                  <FormItem label="开户银行联行号">
                    <Input type="text"
                           v-model="formAllData.settleAcctBankBranchCode" />
                  </FormItem>
                  <FormItem label="银行账户">
                    <Input type="text"
                           v-model="formAllData.settleAcctBankAcctNo" />
                  </FormItem>
                </div>
                <FormItem>
                  <Button type="primary"
                          @click="handleSubmit()">保存</Button>
                  <Button @click="handleReset(5)"
                          style="margin-left: 8px">清空</Button>
                </FormItem>
              </Form>
            </Card>
          </div>
        </TabPane>
        <TabPane label="法人证件信息">
          <div :style="{ padding: '50px 300px' }">
            <!-- 法人证件信息 -->
            <Card style="width: 90%">
              <template #title>
                <h3 style="text-align: center">法人证件信息</h3>
                <br />
              </template>
              <Form :label-width="150">
                <div class="main">
                  <FormItem label="法人姓名">
                    <Input type="text"
                           v-model="formAllData.legalPersonIdCardName" />
                  </FormItem>
                  <FormItem label="法人证件类型">
                    <Select v-model="formAllData.legalPersonIdCardType"
                            style="width: 200px">
                      <Option v-for="item in legalPersonIdCardTypeList"
                              :value="item.value"
                              :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="法人证件人像面照片">
                    <Upload action="//jsonplaceholder.typicode.com/posts/"
                            :form="['jpg', 'jpeg', 'png', 'gif']"
                            :before-upload="handleUpload">
                      <Button icon="ios-cloud-upload-outline"
                              @click="filesign(4)">上传图片</Button>
                    </Upload>
                    <div v-if="file !== null && fileSign==4">
                      待上传文件名: {{ file.name }}
                      <a type="text"
                         @click="upload('legalPersonIdCardCopy')"
                         :loading="loadingStatus">{{
                          loadingStatus ? "上传中" : "上传"
                      }}</a>
                    </div>
                    <div class="demo-upload-list"
                         v-if="formAllData.legalPersonIdCardCopy!=null? true:false">
                      <img :src="legalPersonIdCardCopyImg" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline"
                              @click="modalview3 = true"></Icon>
                        <!-- <Icon type="ios-trash-outline"
                              @click="modal = true"></Icon> -->
                      </div>
                      <Modal v-model="modalview3"
                             title="图片细节"
                             width="1000">
                        <div><img :src="legalPersonIdCardCopyImg" /></div>
                      </Modal>
                    </div>
                  </FormItem>
                  <FormItem label="法人证件国徽面照片">
                    <Upload action="//jsonplaceholder.typicode.com/posts/"
                            :form="['jpg', 'jpeg', 'png', 'gif']"
                            :before-upload="handleUpload">
                      <Button icon="ios-cloud-upload-outline"
                              @click="filesign(5)">上传图片</Button>
                    </Upload>
                    <div v-if="file !== null && fileSign==5">
                      待上传文件名: {{ file.name }}
                      <a type="text"
                         @click="upload('legalPersonIdCardNational')"
                         :loading="loadingStatus">{{
                          loadingStatus ? "上传中" : "上传"
                      }}</a>
                    </div>
                    <div class="demo-upload-list"
                         v-if="formAllData.legalPersonIdCardNational!=null? true:false">
                      <img :src="legalPersonIdCardNationalImg" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline"
                              @click="modalview4 = true"></Icon>
                        <!-- <Icon type="ios-trash-outline"
                              @click="modal = true"></Icon> -->
                      </div>
                      <Modal v-model="modalview4"
                             title="图片细节"
                             width="1000">
                        <div><img :src="legalPersonIdCardNationalImg" /></div>
                      </Modal>
                    </div>
                  </FormItem>
                  <FormItem label="法人证件号码">
                    <Input type="text"
                           v-model="formAllData.legalPersonIdCardNumber" />
                  </FormItem>
                  <FormItem label="法人证件有效期">
                    <DatePicker type="date"
                                format="yyyy-MM-dd"
                                placeholder="开始时间"
                                v-model="legalPersonIdCardStartTime">
                    </DatePicker>

                    <DatePicker type="date"
                                placeholder="结束时间"
                                v-model="legalPersonIdCardEndTime"
                                :disabled='legalPersonIdCardTimeSwitch'
                                :readonly='legalPersonIdCardTimeSwitch'>
                    </DatePicker>
                    <RadioGroup v-model="legalPersonIdCardRadioGroup">
                      <Radio label="短期"
                             @click.native="legalPersonIdCardRadioGroupChange(1)"></Radio>
                      <Radio label="长期"
                             v-model="legalPersonIdCardTimeSwitch"
                             @click.native="legalPersonIdCardRadioGroupChange(2)"></Radio>

                    </RadioGroup>

                  </FormItem>
                  <FormItem label="当前填写有效期">
                    <Input v-model="formAllData.legalPersonIdCardValidTime"
                           value="当前日期"
                           disabled />

                  </FormItem>
                </div>
                <FormItem>
                  <Button type="primary"
                          @click="handleSubmit()">保存</Button>
                  <Button @click="handleReset(6)"
                          style="margin-left: 8px">清空</Button>
                </FormItem>
              </Form>
            </Card>
          </div>
        </TabPane>
        <TabPane label="联系人证件信息">
          <div :style="{ padding: '50px 300px' }">
            <!-- 联系人证件信息 -->
            <Card style="width: 90%">
              <template #title>
                <h3 style="text-align: center">联系人证件信息</h3>
                <br />
              </template>
              <Form :label-width="150">
                <div class="main">
                  <FormItem label="联系人姓名">
                    <Input type="text"
                           v-model="formAllData.contactIdCardName" />
                  </FormItem>
                  <FormItem label="联系人证件类型">
                    <Select v-model="formAllData.contactIdCardType"
                            style="width: 200px">
                      <Option v-for="item in contactIdCardTypeList"
                              :value="item.value"
                              :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="联系人证件人像面照片">
                    <Upload action="//jsonplaceholder.typicode.com/posts/"
                            :form="['jpg', 'jpeg', 'png', 'gif']"
                            :before-upload="handleUpload">
                      <Button icon="ios-cloud-upload-outline"
                              @click="filesign(6)">上传图片</Button>
                    </Upload>
                    <div v-if="file !== null && fileSign==6">
                      待上传文件名: {{ file.name }}
                      <a type="text"
                         @click="upload('contactIdCardCopy')"
                         :loading="loadingStatus">{{
                          loadingStatus ? "上传中" : "上传"
                      }}</a>
                    </div>
                    <div class="demo-upload-list"
                         v-if="formAllData.contactIdCardCopy!=null? true:false">
                      <img :src="contactIdCardCopyImg" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline"
                              @click="modalview5 = true"></Icon>
                        <!-- <Icon type="ios-trash-outline"
                              @click="modal = true"></Icon> -->
                      </div>
                      <Modal v-model="modalview5"
                             title="图片细节"
                             width="1000">
                        <div><img :src="contactIdCardCopyImg" /></div>
                      </Modal>
                    </div>
                  </FormItem>
                  <FormItem label="联系人证件国徽面照片">
                    <Upload action="//jsonplaceholder.typicode.com/posts/"
                            :form="['jpg', 'jpeg', 'png', 'gif']"
                            :before-upload="handleUpload">
                      <Button icon="ios-cloud-upload-outline"
                              @click="filesign(7)">上传图片</Button>
                    </Upload>
                    <div v-if="file !== null && fileSign==7">
                      待上传文件名: {{ file.name }}
                      <a type="text"
                         @click="upload('contactIdCardNational')"
                         :loading="loadingStatus">{{
                          loadingStatus ? "上传中" : "上传"
                      }}</a>
                    </div>
                    <div class="demo-upload-list"
                         v-if="formAllData.contactIdCardNational!=null? true:false">
                      <img :src="contactIdCardNationalImg" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline"
                              @click="modalview6 = true"></Icon>
                        <!-- <Icon type="ios-trash-outline"
                              @click="modal = true"></Icon> -->
                      </div>
                      <Modal v-model="modalview6"
                             title="图片细节"
                             width="1000">
                        <div><img :src="contactIdCardNationalImg" /></div>
                      </Modal>
                    </div>
                  </FormItem>
                  <FormItem label="联系人证件号码">
                    <Input type="text"
                           v-model="formAllData.contactIdCardNumber" />
                  </FormItem>
                  <FormItem label="联系人证件有效期">
                    <DatePicker type="date"
                                format="yyyy-MM-dd"
                                placeholder="开始时间"
                                v-model="contactIdCardStartTime">
                    </DatePicker>
                    <DatePicker type="date"
                                placeholder="结束时间"
                                v-model="contactIdCardEndTime"
                                :disabled='contactIdCardTimeSwitch'
                                :readonly='contactIdCardTimeSwitch'>
                    </DatePicker>
                    <RadioGroup v-model="contactIdCardRadioGroup">
                      <Radio label="短期"
                             @click.native="contactIdCardRadioGroupChange(1)"></Radio>
                      <Radio label="长期"
                             @click.native="contactIdCardRadioGroupChange(2)"></Radio>

                    </RadioGroup>

                  </FormItem>
                  <FormItem label="当前填写有效期">
                    <Input v-model="formAllData.contactIdCardValidTime"
                           value="当前日期"
                           disabled />

                  </FormItem>
                  <FormItem label="联系人手机号">
                    <Input type="text"
                           v-model="formAllData.contactMobileNumber" />
                  </FormItem>
                  <FormItem label="联系人邮箱">
                    <Input type="text"
                           v-model="formAllData.contactEmail" />
                  </FormItem>
                </div>
                <FormItem>
                  <Button type="primary"
                          @click="handleSubmit()">保存</Button>
                  <Button @click="handleReset(7)"
                          style="margin-left: 8px">清空</Button>
                </FormItem>
              </Form>
            </Card>
          </div>
        </TabPane>
        <TabPane label="企业信息">
          <div :style="{ padding: '50px 300px' }">
            <!-- 企业信息 -->
            <Card style="width: 90%">
              <template #title>
                <h3 style="text-align: center">企业信息</h3>
                <br />
              </template>
              <Form ref="formCustom"
                    :label-width="150">
                <div class="main">
                  <FormItem label="企业分类大类">
                    <Input type="text"
                           v-model="formAllData.businessInfoType" />
                  </FormItem>
                  <FormItem label="企业分类细分">
                    <Input type="text"
                           v-model="formAllData.businessInfoSubType" />
                  </FormItem>
                  <FormItem label="企业经济成分">
                    <Input type="text"
                           v-model="formAllData.businessInfoEconomy" />
                  </FormItem>
                  <FormItem label="企业规模">
                    <div style=" display: flex;justify-content: space-between;">

                      <div>
                        <Input type="text"
                               v-model="formAllData.businessInfoScale"
                               style="width: 400px" />
                      </div>

                      <div>

                        <Poptip trigger="hover"
                                placement="top-start">
                          <div slot="content"
                               class="poptipExplain">
                            这是我的自定义内容，我想要换行啊换行鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋
                            这是我的自定义内容，我想要换行啊换行鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋鸡蛋

                          </div>

                          <Icon type="ios-help"
                                size="20" />
                        </Poptip>
                      </div>

                    </div>
                  </FormItem>
                  <FormItem label="企业经营范围">
                    <Input type="text"
                           v-model="formAllData.businessInfoRange" />
                  </FormItem>

                  <FormItem label="企业经营地址">
                    <Input type="text"
                           v-model="formAllData.businessInfoAddress" />
                  </FormItem>

                  <FormItem label="企业注册资本">
                    <Input type="text"
                           v-model="formAllData.businessInfoRegisteredCapital" />
                  </FormItem>
                  <FormItem label="企业注册地电话号码">
                    <Input type="text"
                           v-model="formAllData.businessInfoRegisteredTel" />
                  </FormItem>
                </div>
                <FormItem>
                  <Button type="primary"
                          @click="handleSubmit()">保存</Button>
                  <Button @click="handleReset(8)"
                          style="margin-left: 8px">清空</Button>
                </FormItem>
              </Form>
            </Card>
          </div>
        </TabPane>
        <TabPane label="实际控制企业信息">
          <div :style="{ padding: '50px 300px' }">
            <Card style="width: 90%">
              <template #title>
                <h3 style="text-align: center">实际控制企业信息</h3>
                <br />
              </template>
              <Form ref="formCustom"
                    :label-width="150">
                <div class="main">
                  <FormItem label="股东类型">

                    <Select v-model="formAllData.holdingCompanyType"
                            style="width: 200px">
                      <Option v-for="item in holdingCompanyTypeList"
                              :value="item.value"
                              :key="item.value">{{ item.label }}</Option>
                    </Select>

                  </FormItem>
                  <FormItem label="实际控制企业名称">
                    <Input type="text"
                           v-model="formAllData.holdingCompanyName" />
                  </FormItem>

                  <FormItem label="实际控制企业营业执照号">
                    <Input type="text"
                           v-model="formAllData.holdingCompanyLicenseNumber" />
                  </FormItem>

                  <FormItem label="实际控制企业营业期限">
                    <!-- <DatePicker type="date"
                                format="yyyy-MM-dd"
                                placeholder="开始时间"
                                v-model="holdingCompanyLicenseStartTime">
                    </DatePicker> -->

                    <DatePicker type="date"
                                placeholder="结束时间"
                                v-model="formAllData.holdingCompanyLicenseValidTime"
                                :disabled='holdingCompanyLicenseTimeSwitch'
                                :readonly='holdingCompanyLicenseTimeSwitch'>
                    </DatePicker>
                    <!-- <RadioGroup v-model="holdingCompanyLicenseRadioGroup">
                      <Radio label="短期"
                             @click.native="holdingCompanyLicenseRadioGroupChange(1)"></Radio>
                      <Radio label="长期"
                             @click.native="holdingCompanyLicenseRadioGroupChange(2)"></Radio>

                    </RadioGroup> -->

                  </FormItem>

                  <FormItem label="实际控股人/企业证件类型">
                    <Select v-model="formAllData.holdingCompanyLicenseType"
                            style="width: 200px">
                      <Option v-for="item in holdingCompanyLicenseTypeList"
                              :value="item.value"
                              :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>

                </div>
                <FormItem>
                  <Button type="primary"
                          @click="handleSubmit()">保存</Button>
                  <Button @click="handleReset(9)"
                          style="margin-left: 8px">清空</Button>
                </FormItem>
              </Form>
            </Card>
          </div>
        </TabPane>
        <TabPane label="受益人所有信息">
          <div :style="{ padding: '50px 300px' }">
            <Card style="width: 90%">
              <template #title>
                <h3 style="text-align: center">受益人所有信息</h3>
                <br />
              </template>
              <Form ref="formCustom"
                    :label-width="150">
                <div class="main">

                  <FormItem label="受益所有人姓名">
                    <Input type="text"
                           v-model="formAllData.beneficiaryIdCardName" />
                  </FormItem>

                  <FormItem label="受益所有人证件类型">
                    <Select v-model="formAllData.beneficiaryIdCardType"
                            style="width: 200px">
                      <Option v-for="item in beneficiaryIdCardTypeList"
                              :value="item.value"
                              :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="受益所有人证件号码">
                    <Input type="text"
                           v-model="formAllData.beneficiaryIdCardNumber" />
                  </FormItem>
                  <FormItem label="受益所有人证件有效期">
                    <DatePicker type="date"
                                format="yyyy-MM-dd"
                                placeholder="开始时间"
                                v-model="beneficiaryIdCardStartTime">
                    </DatePicker>

                    <DatePicker type="date"
                                placeholder="结束时间"
                                v-model="beneficiaryIdCardEndTime"
                                :disabled='beneficiaryIdCardTimeSwitch'
                                :readonly='beneficiaryIdCardTimeSwitch'>
                    </DatePicker>
                    <RadioGroup v-model="beneficiaryIdCardRadioGroup">
                      <Radio label="短期"
                             @click.native="beneficiaryIdCardRadioGroupChange(1)"></Radio>
                      <Radio label="长期"
                             @click.native="beneficiaryIdCardRadioGroupChange(2)"></Radio>

                    </RadioGroup>
                  </FormItem>
                  <FormItem label="当前填写有效期">
                    <Input v-model="formAllData.beneficiaryIdCardValidTime"
                           value="当前日期"
                           disabled />

                  </FormItem>
                  <FormItem label="受益所有人证件像面照片">
                    <Upload action="//jsonplaceholder.typicode.com/posts/"
                            :form="['jpg', 'jpeg', 'png', 'gif']"
                            :before-upload="handleUpload">
                      <Button icon="ios-cloud-upload-outline"
                              @click="filesign(8)">上传图片</Button>
                    </Upload>
                    <div v-if="file !== null && fileSign == 8">
                      待上传文件名: {{ file.name }}
                      <a type="text"
                         @click="upload('beneficiaryIdCardCopy')"
                         :loading="loadingStatus">{{
                          loadingStatus ? "上传中" : "上传"
                      }}</a>
                    </div>
                    <div class="demo-upload-list"
                         v-if="formAllData.beneficiaryIdCardCopy!=null? true:false">
                      <img :src="beneficiaryIdCardCopyImg" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline"
                              @click="modalview7 = true"></Icon>
                        <!-- <Icon type="ios-trash-outline"
                              @click="modal = true"></Icon> -->
                      </div>
                      <Modal v-model="modalview7"
                             title="图片细节"
                             width="1000">
                        <div><img :src="beneficiaryIdCardCopyImg" /></div>
                      </Modal>
                    </div>
                  </FormItem>
                  <FormItem label="受益所有人证件国徽面照片">
                    <Upload action="//jsonplaceholder.typicode.com/posts/"
                            :form="['jpg', 'jpeg', 'png', 'gif']"
                            :before-upload="handleUpload">
                      <Button icon="ios-cloud-upload-outline"
                              @click="filesign(9)">上传图片</Button>
                    </Upload>
                    <div v-if="file !== null && fileSign== 9">
                      待上传文件名: {{ file.name }}
                      <a type="text"
                         @click="upload('beneficiaryIdCardNational')"
                         :loading="loadingStatus">{{
                          loadingStatus ? "上传中" : "上传"
                      }}</a>
                    </div>
                    <div class="demo-upload-list"
                         v-if="formAllData.beneficiaryIdCardNational!=null? true:false">
                      <img :src="beneficiaryIdCardNationalImg" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline"
                              @click="modalview7 = true"></Icon>
                        <!-- <Icon type="ios-trash-outline"
                              @click="modal = true"></Icon> -->
                      </div>
                      <Modal v-model="modalview7"
                             title="图片细节"
                             width="1000">
                        <div><img :src="beneficiaryIdCardNationalImg" /></div>
                      </Modal>
                    </div>
                  </FormItem>
                  <FormItem label="受益所有人地址">
                    <Input type="text"
                           v-model="formAllData.beneficiaryAddress" />
                  </FormItem>

                </div>
                <FormItem>
                  <Button type="primary"
                          @click="handleSubmit()">保存</Button>

                  <Button @click="handleReset(10)"
                          style="margin-left: 8px">清空</Button>
                </FormItem>
              </Form>
            </Card>
          </div>
        </TabPane>
      </Tabs>
    </div>

    <div :style="{ padding: '50px 300px' }"></div>
  </div>
</template>
<script>
import baseApi from '../application-api'
export default {
  data () {
    return {
      // 营业执照信息日期开关
      businessLicenseTimeSwitch: false,
      businessLicenseStartTime: null,
      businessLicenseEndTime: null,
      businessLicenseRadioGroup: '短期',
      // 组织结构信息日期开关
      organizationCertTimeSwitch: false,
      organizationCertStartTime: null,
      organizationCertEndTime: null,
      organizationCertRadioGroup: '短期',
      // 法人证件信息日期开关
      legalPersonIdCardTimeSwitch: false,
      legalPersonIdCardStartTime: null,
      legalPersonIdCardEndTime: null,
      legalPersonIdCardRadioGroup: '短期',
      // 联系人证件信息日期开关
      contactIdCardTimeSwitch: false,
      contactIdCardStartTime: null,
      contactIdCardEndTime: null,
      contactIdCardRadioGroup: '短期',
      // 实际控制企业营业期限日期开关
      holdingCompanyLicenseTimeSwitch: false,
      holdingCompanyLicenseStartTime: null,
      holdingCompanyLicenseEndTime: null,
      holdingCompanyLicenseRadioGroup: '短期',
      // 受益所有人证件有效期限日期开关
      beneficiaryIdCardTimeSwitch: false,
      beneficiaryIdCardStartTime: null,
      beneficiaryIdCardEndTime: null,
      beneficiaryIdCardRadioGroup: '短期',

      // 图片详情
      modalview: false,
      modalview1: false,
      modalview2: false,
      modalview3: false,
      modalview4: false,
      modalview5: false,
      modalview6: false,
      modalview7: false,
      modalview8: false,

      // 前端图片地址
      businessLicenseCopyImg: '',
      organizationCertCopyImg: '',
      taxRegistrationCertCopyImg: '',
      legalPersonIdCardCopyImg: '',
      legalPersonIdCardNationalImg: '',
      contactIdCardCopyImg: '',
      contactIdCardNationalImg: '',
      beneficiaryIdCardCopyImg: '',
      beneficiaryIdCardNationalImg: '',

      // 图片获取url
      getImgUrl: process.env.API_BASE_URL + '/admin/union/image',
      // 图片上传地址变量
      url: process.env.API_BASE_URL + '/admin/uploadImage',
      // 法人id
      legalCode: null,
      // 图片流
      file: null,
      // 每个tab上传操作显示开关
      fileSign: null,
      // 上传按钮状态
      loadingStatus: false,

      // 双日期输入框数组
      legalPersonDate: [],
      // 表单所有信息
      formAllData: {
        // 法人id
        legalCode: '',
        // 基本信息
        organizationType: null,
        shortName: '',
        englishName: '',
        // 营业执照信息
        businessLicenseCopy: '',
        businessLicenseNumber: '',
        businessLicenseCompanyName: '',
        businessLicenseCompanyAddress: '',
        businessLicenseValidTime: '',
        // 组织结构信息
        organizationCertCopy: '',
        organizationCertNumber: '',
        organizationCertValidTime: '',
        // 税务登记信息
        taxRegistrationCertCopy: '',
        taxRegistrationCertNumber: '',
        // 绑定账户信息
        settleAcctType: null,
        settleAcctBankCode: '',
        settleAcctName: '',
        settleAcctBankAddressCode: '',
        settleAcctBankBranchCode: '',
        settleAcctBankAcctNo: '',
        // 法人证件信息
        legalPersonIdCardName: '',
        legalPersonIdCardType: null,
        legalPersonIdCardCopy: '',
        legalPersonIdCardNational: '',
        legalPersonIdCardNumber: '',
        legalPersonIdCardValidTime: '',
        // 联系人证件信息
        contactIdCardName: '',
        contactIdCardType: null,
        contactIdCardCopy: '',
        contactIdCardNational: '',
        contactIdCardNumber: '',
        contactIdCardValidTime: '',
        contactMobileNumber: '',
        contactEmail: '',
        // 企业信息
        businessInfoType: null,
        businessInfoSubType: null,
        businessInfoEconomy: '',
        businessInfoScale: '',
        businessInfoRange: '',
        businessInfoAddress: '',
        businessInfoRegisteredCapital: '',
        businessInfoRegisteredTel: '',
        // 实际控股企业信息
        holdingCompanyType: null,
        holdingCompanyName: '',
        holdingCompanyLicenseNumber: '',
        holdingCompanyLicenseValidTime: '',
        holdingCompanyLicenseType: null,
        // 受益人所有信息
        beneficiaryIdCardName: '',
        beneficiaryIdCardType: null,
        beneficiaryIdCardNumber: '',
        beneficiaryIdCardValidTime: '',
        beneficiaryIdCardCopy: '',
        beneficiaryIdCardNational: '',
        beneficiaryAddress: ''
      },

      // 选择器列表holdingCompanyLicenseType
      settleAcctTypeList: [
        {
          value: 1,
          label: '对私账户'
        },
        {
          value: 2,
          label: '对公账户'
        }
      ],
      legalPersonIdCardTypeList: [
        {
          value: 1,
          label: '中国大陆居民-身份证'
        },
        {
          value: 2,
          label: '其他国家或地区居民-护照'
        },
        {
          value: 3,
          label: '中国香港居民–来往内地通行证'

        },
        {
          value: 4,
          label: '中国澳门居民–来往内地通行证'
        },
        {
          value: 5,
          label: '中国台湾居民–来往大陆通行证'
        }
      ],
      contactIdCardTypeList: [
        {
          value: 1,
          label: '中国大陆居民-身份证'
        },
        {
          value: 2,
          label: '其他国家或地区居民-护照'
        },
        {
          value: 3,
          label: '中国香港居民–来往内地通行证'

        },
        {
          value: 4,
          label: '中国澳门居民–来往内地通行证'
        },
        {
          value: 5,
          label: '中国台湾居民–来往大陆通行证'
        }
      ],
      holdingCompanyTypeList: [
        {
          value: 1,
          label: '企业'
        },
        {
          value: 2,
          label: '个人'
        }
      ],
      holdingCompanyLicenseTypeList: [
        {
          value: 1,
          label: '营业执照'
        },
        {
          value: 2,
          label: '其他'
        }
      ],
      beneficiaryIdCardTypeList: [
        {
          value: '1',
          label: '中国大陆居民-身份证'
        },
        {
          value: '2',
          label: '其他国家或地区居民-护照'
        },
        {
          value: '3',
          label: '中国香港居民–来往内地通行证'

        },
        {
          value: '4',
          label: '中国澳门居民–来往内地通行证'
        },
        {
          value: '5',
          label: '中国台湾居民–来往大陆通行证'
        }
      ]

    }
  },
  computed: {},
  created () {
    console.log('跳转页面传值测试 ')
    this.legalCode = this.$route.params.data
    console.log('传来的数据' + this.legalCode)
    this.queryMerchantDetail()
  },

  methods: {
    // 日期转换格式工具类
    newdate (date1) {
      if (date1 == null) {
        return date1
      } else {
        // 必须new一个出来，不然后面重复的不行
        var date = new Date(date1)
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        // eslint-disable-next-line no-unused-vars
        var hour = date.getHours()
        // eslint-disable-next-line no-unused-vars
        var minute = date.getMinutes()
        // eslint-disable-next-line no-unused-vars
        var second = date.getSeconds()
        month = month > 9 ? month : '0' + month
        strDate = strDate > 9 ? strDate : '0' + strDate
        hour = hour > 9 ? hour : '0' + hour
        minute = minute > 9 ? minute : '0' + minute
        second = second > 9 ? second : '0' + second
        var newdata = year + '-' + month + '-' + strDate
        return newdata
      }
    },
    // 营业执照信息结束日期开关
    businessLicenseRadioGroupChange (sign) {
      if (sign === 1) {
        this.businessLicenseTimeSwitch = false
        console.log('短期')
      } if (sign === 2) {
        this.businessLicenseTimeSwitch = true
        this.businessLicenseEndTime = null
        console.log('长期')
      }
    },
    // 组织结构信息结束日期开关
    organizationCertRadioGroupChange (sign) {
      if (sign === 1) {
        this.organizationCertTimeSwitch = false
        console.log('短期')
      } if (sign === 2) {
        this.organizationCertTimeSwitch = true
        this.organizationCertEndTime = null
        console.log('长期')
      }
    },
    // 法人证件信息结束日期开关
    legalPersonIdCardRadioGroupChange (sign) {
      if (sign === 1) {
        this.legalPersonIdCardTimeSwitch = false
        console.log('短期')
      } if (sign === 2) {
        this.legalPersonIdCardTimeSwitch = true
        this.legalPersonIdCardEndTime = null
        console.log('长期')
      }
    },
    // 联系人证件信息结束日期开关
    contactIdCardRadioGroupChange (sign) {
      if (sign === 1) {
        this.contactIdCardTimeSwitch = false
        console.log('短期')
      } if (sign === 2) {
        this.contactIdCardTimeSwitch = true
        this.contactIdCardEndTime = null
        console.log('长期')
      }
    },
    // 实际控制企业营业期限结束日期开关beneficiaryIdCard
    holdingCompanyLicenseRadioGroupChange (sign) {
      if (sign === 1) {
        this.holdingCompanyLicenseTimeSwitch = false
        console.log('短期')
      } if (sign === 2) {
        this.holdingCompanyLicenseTimeSwitch = true
        this.holdingCompanyLicenseEndTime = null
        console.log('长期')
      }
    },
    // 受益所有人证件有效期限结束日期开关
    beneficiaryIdCardRadioGroupChange (sign) {
      if (sign === 1) {
        this.beneficiaryIdCardTimeSwitch = false
        console.log('短期')
      } if (sign === 2) {
        this.beneficiaryIdCardTimeSwitch = true
        this.beneficiaryIdCardEndTime = null
        console.log('长期')
      }
    },

    // 上传图片钩子函数
    handleUpload (file) {
      this.file = file
      return false
    },
    // 上传图片操作显示开关
    filesign (sign) {
      this.file = null
      this.fileSign = sign
      console.log('filesign', this.fileSign)
    },
    // 上传图片
    upload (sign) {
      let fileFormData = new FormData()
      this.loadingStatus = true
      fileFormData.append('file', this.file)
      fileFormData.append('legalCode', this.legalCode)
      console.log(fileFormData)
      let requestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.$http.post(this.url, fileFormData, requestConfig).then((res) => {
        this.file = null
        this.loadingStatus = false
        if (res.data['code'] === '200') {
          // 分开标记多个上传的图片id赋值
          if (sign === 'businessLicenseCopy') {
            // 营业执照信息图片上传
            console.log('当前id', this.formAllData['businessLicenseCopy'])
            // 获取存储成功的图片id
            this.formAllData['businessLicenseCopy'] = res.data.data['mediaId']
            console.log('返回id', this.formAllData.businessLicenseCopy)
          }
          if (sign === 'organizationCertCopy') {
            console.log(this.formAllData['organizationCertCopy'])
            this.formAllData['organizationCertCopy'] = res.data.data['mediaId']
            console.log(this.formAllData.organizationCertCopy)
          }
          if (sign === 'taxRegistrationCertCopy') {
            console.log(this.formAllData['taxRegistrationCertCopy'])
            this.formAllData['taxRegistrationCertCopy'] = res.data.data['mediaId']
            console.log(this.formAllData.taxRegistrationCertCopy)
          }
          if (sign === 'legalPersonIdCardCopy') {
            console.log(this.formAllData['legalPersonIdCardCopy'])
            this.formAllData['legalPersonIdCardCopy'] = res.data.data['mediaId']
            console.log(this.formAllData.legalPersonIdCardCopy)
          }
          if (sign === 'legalPersonIdCardNational') {
            console.log(this.formAllData['legalPersonIdCardNational'])
            this.formAllData['legalPersonIdCardNational'] = res.data.data['mediaId']
            console.log(this.formAllData.legalPersonIdCardNational)
          }
          if (sign === 'contactIdCardCopy') {
            console.log(this.formAllData['contactIdCardCopy'])
            this.formAllData['contactIdCardCopy'] = res.data.data['mediaId']
            console.log(this.formAllData.contactIdCardCopy)
          }
          if (sign === 'contactIdCardNational') {
            console.log(this.formAllData['contactIdCardNational'])
            this.formAllData['contactIdCardNational'] = res.data.data['mediaId']
            console.log(this.formAllData.contactIdCardNational)
          }

          if (sign === 'beneficiaryIdCardCopy') {
            console.log(this.formAllData['beneficiaryIdCardCopy'])
            this.formAllData['beneficiaryIdCardCopy'] = res.data.data['mediaId']
            console.log(this.formAllData.beneficiaryIdCardCopy)
          }

          if (sign === 'beneficiaryIdCardNational') {
            console.log(this.formAllData['beneficiaryIdCardNational'])
            this.formAllData['beneficiaryIdCardNational'] = res.data.data['mediaId']
            console.log(this.formAllData.beneficiaryIdCardNational)
          }

          this.$Message.success(res.data['msg'])
        } else {
          this.$Message.error(res.data['msg'])
        }
        // 上传完立马刷新图片——图片回显
        this.download()
      })
    },
    // 显示图片
    download () {
      // 营业执照图片
      this.$http.post(this.getImgUrl, { 'mediaId': this.formAllData['businessLicenseCopy'] }, { responseType: 'blob' }, { headers: { 'Content-Type': 'multipart/from-data' } }) // RESPONSE-TYPE 要定义成arraybuffer或blob , { responseType: "arraybuffer" }
        .then(res => {
          this.businessLicenseCopyImg = window.URL.createObjectURL(res.data)
          console.log('营业执照图片id', this.formAllData['businessLicenseCopy'])
          console.log('图片回传信息', res.data)
        })
        .catch(function (error) {
          console.log(error)
        })
      // 组织结构图片
      this.$http.post(this.getImgUrl, { 'mediaId': this.formAllData['organizationCertCopy'] }, { responseType: 'blob' }, { headers: { 'Content-Type': 'multipart/from-data' } })
        .then(res => {
          this.organizationCertCopyImg = window.URL.createObjectURL(res.data)
          console.log('图片id', this.formAllData['organizationCertCopy'])
          console.log('图片回传信息', res.data)
        })
        .catch()
      // 税务登记信息
      this.$http.post(this.getImgUrl, { 'mediaId': this.formAllData['taxRegistrationCertCopy'] }, { responseType: 'blob' }, { headers: { 'Content-Type': 'multipart/from-data' } })
        .then(res => {
          this.taxRegistrationCertCopyImg = window.URL.createObjectURL(res.data)
          console.log('图片id', this.formAllData['taxRegistrationCertCopy'])
          console.log('图片回传信息', res.data)
        })
        .catch()
      // 法人证件人像面照片
      this.$http.post(this.getImgUrl, { 'mediaId': this.formAllData['legalPersonIdCardCopy'] }, { responseType: 'blob' }, { headers: { 'Content-Type': 'multipart/from-data' } })
        .then(res => {
          this.legalPersonIdCardCopyImg = window.URL.createObjectURL(res.data)
          console.log('法人正面图片id', this.formAllData['legalPersonIdCardCopy'])
          console.log('图片回传信息', res.data)
        })
        .catch()
      // 法人证件国徽面照片
      this.$http.post(this.getImgUrl, { 'mediaId': this.formAllData['legalPersonIdCardNational'] }, { responseType: 'blob' }, { headers: { 'Content-Type': 'multipart/from-data' } })
        .then(res => {
          this.legalPersonIdCardNationalImg = window.URL.createObjectURL(res.data)
          console.log('法人反面图片id', this.formAllData['legalPersonIdCardNational'])
          console.log('图片回传信息', res.data)
        })
        .catch()
      // 联系人证件人像面照片
      this.$http.post(this.getImgUrl, { 'mediaId': this.formAllData['contactIdCardCopy'] }, { responseType: 'blob' }, { headers: { 'Content-Type': 'multipart/from-data' } })
        .then(res => {
          this.contactIdCardCopyImg = window.URL.createObjectURL(res.data)
          console.log('联系人反面图片id', this.formAllData['contactIdCardCopy'])
          console.log('图片回传信息', res.data)
        })
        .catch()
      // 联系人证件国徽面照片
      this.$http.post(this.getImgUrl, { 'mediaId': this.formAllData['contactIdCardNational'] }, { responseType: 'blob' }, { headers: { 'Content-Type': 'multipart/from-data' } })
        .then(res => {
          this.contactIdCardNationalImg = window.URL.createObjectURL(res.data)
          console.log('联系人反面图片id', this.formAllData['contactIdCardNational'])
          console.log('图片回传信息', res.data)
        })
        .catch()
      // 受益人人证件人像面照片
      this.$http.post(this.getImgUrl, { 'mediaId': this.formAllData['beneficiaryIdCardCopy'] }, { responseType: 'blob' }, { headers: { 'Content-Type': 'multipart/from-data' } })
        .then(res => {
          this.beneficiaryIdCardCopyImg = window.URL.createObjectURL(res.data)
          console.log('受益人反面图片id', this.formAllData['beneficiaryIdCardCopy'])
          console.log('图片回传信息', res.data)
        })
        .catch()
      // 受益人证件国徽面照片
      this.$http.post(this.getImgUrl, { 'mediaId': this.formAllData['beneficiaryIdCardNational'] }, { responseType: 'blob' }, { headers: { 'Content-Type': 'multipart/from-data' } })
        .then(res => {
          this.beneficiaryIdCardNationalImg = window.URL.createObjectURL(res.data)
          console.log('收益人反面图片id', this.formAllData['beneficiaryIdCardNational'])
          console.log('图片回传信息', res.data)
        })
        .catch()
    },

    // 保存表单
    handleSubmit () {
      console.log('组件传过来的值', this.formAllData['businessLicenseValidTime'])
      this.formAllData['businessLicenseValidTime'] = this.newdate(this.formAllData['businessLicenseValidTime'])
      // + ',' + (this.businessLicenseEndTime == null ? "长期" : (this.newdate(this.businessLicenseEndTime)));
      this.formAllData['organizationCertValidTime'] = this.newdate(this.formAllData['organizationCertValidTime'])
      // + ',' + (this.organizationCertEndTime == null ? "长期" : (this.newdate(this.organizationCertEndTime)));

      // if (this.formAllData['legalPersonIdCardValidTime'] === '' || this.formAllData['legalPersonIdCardValidTime'] === 'NaN-0NaN-0NaN,NaN-0NaN-0NaN') {
      //   this.formAllData['legalPersonIdCardValidTime'] = this.newdate(this.legalPersonIdCardStartTime) + ',' + (this.legalPersonIdCardEndTime == null ? '长期' : (this.newdate(this.legalPersonIdCardEndTime)))
      // }

      this.formAllData['legalPersonIdCardValidTime'] = this.newdate(this.legalPersonIdCardStartTime) + ',' + (this.legalPersonIdCardEndTime === '' ? '长期' : (this.newdate(this.legalPersonIdCardEndTime)))

      if (this.formAllData['contactIdCardValidTime'] == null || this.formAllData['contactIdCardValidTime'] === 'NaN-0NaN-0NaN,NaN-0NaN-0NaN') {
        this.formAllData['contactIdCardValidTime'] = this.newdate(this.contactIdCardStartTime) + ',' + (this.contactIdCardEndTime == null ? '长期' : (this.newdate(this.contactIdCardEndTime)))
      }
      this.formAllData['holdingCompanyLicenseValidTime'] = this.newdate(this.formAllData['holdingCompanyLicenseValidTime'])
      // + ',' + (this.holdingCompanyLicenseEndTime == null ? "长期" : (this.newdate(this.holdingCompanyLicenseEndTime)));
      if (this.formAllData['beneficiaryIdCardValidTime'] == null || this.formAllData['beneficiaryIdCardValidTime'] === 'NaN-0NaN-0NaN,NaN-0NaN-0NaN') {
        this.formAllData['beneficiaryIdCardValidTime'] = this.newdate(this.beneficiaryIdCardStartTime) + ',' + (this.beneficiaryIdCardEndTime == null ? '长期' : (this.newdate(this.beneficiaryIdCardEndTime)))
      }
      this.formAllData['beneficiaryIdCardValidTime'] = this.newdate(this.beneficiaryIdCardStartTime) + ',' + (this.beneficiaryIdCardEndTime == null ? '长期' : (this.newdate(this.beneficiaryIdCardEndTime)))
      console.log('提交测试表单中')
      // console.log('双向绑定的值：' + this.formAllData['businessLicenseNumber'])
      this.formAllData['legalCode'] = this.legalCode
      console.log('保存数据', this.formAllData)
      baseApi
        .addformtest(
          this.formAllData)
        .then(({ data }) => {
          if (data['code'] === '200') {
            this.$Message.success('保存信息成功')
            console.log('表单返回值', data)
          } else {
            this.$Message.error('保存信息失败')
            console.log('表单返回值' + typeof (this.formAllData['settleAcctType']))
          }
        })
        .catch((err) => {
          this.$Message.error('保存信息异常' + err)
        })
    },
    // 提交所有表单
    handleAllSubmit () {
      console.log('aaaaaa' + this.legalCode)
      baseApi
        .addAllformtest({
          'legalCode': this.legalCode
        }
        )
        .then(({ data }) => {
          if (data['code'] === '200') {
            this.$Message.success('提交信息成功')
            console.log('表单返回值' + data)
          } else {
            this.$Message.error('提交信息失败', data.msg)
            console.log('失败返回值', data.msg)
          }
        })
        .catch((err) => {
          this.$Message.error('提交信息异常' + err.msg)
        })
    },
    // 清楚表单数据
    handleReset (a) {
      if (a === 1) {
        this.formAllData.shortName = null
        this.formAllData.englishName = null
      } if (a === 2) {
        this.formAllData.businessLicenseCopy = null
        this.formAllData.businessLicenseNumber = null
        this.formAllData.businessLicenseCompanyName = null
        this.formAllData.businessLicenseCompanyAddress = null
        this.formAllData.businessLicenseValidTime = null
        this.businessLicenseCopyImg = null
      } if (a === 3) {
        this.formAllData.organizationCertCopy = null
        this.formAllData.organizationCertNumber = null
        this.formAllData.organizationCertValidTime = null
        this.organizationCertCopyImg = null
      } if (a === 4) {
        this.formAllData.taxRegistrationCertCopy = null
        this.formAllData.taxRegistrationCertNumber = null
        this.taxRegistrationCertCopyImg = null
      } if (a === 5) {
        this.formAllData.settleAcctType = null
        this.formAllData.settleAcctBankCode = null
        this.formAllData.settleAcctName = null
        this.formAllData.settleAcctBankAddressCode = null
        this.formAllData.settleAcctBankBranchCode = null
        this.formAllData.settleAcctBankAcctNo = null
      } if (a === 6) {
        this.formAllData.legalPersonIdCardName = null
        this.formAllData.legalPersonIdCardType = null
        this.formAllData.legalPersonIdCardCopy = null
        this.formAllData.legalPersonIdCardNational = null
        this.formAllData.legalPersonIdCardNumber = null
        this.formAllData.legalPersonIdCardValidTime = null
        this.legalPersonIdCardCopyImg = null
        this.legalPersonIdCardNationalImg = null
      } if (a === 7) {
        this.formAllData.contactIdCardName = null
        this.formAllData.contactIdCardType = null
        this.formAllData.contactIdCardCopy = null
        this.formAllData.contactIdCardNational = null
        this.formAllData.contactIdCardNumber = null
        this.formAllData.contactIdCardValidTime = null
        this.formAllData.contactMobileNumber = null
        this.formAllData.contactEmail = null
        this.contactIdCardCopyImg = null
        this.contactIdCardNationalImg = null
      } if (a === 8) {
        this.formAllData.businessInfoType = null
        this.formAllData.businessInfoSubType = null
        this.formAllData.businessInfoEconomy = null
        this.formAllData.businessInfoScale = null
        this.formAllData.businessInfoRange = null
        this.formAllData.businessInfoAddress = null
        this.formAllData.businessInfoRegisteredCapital = null
        this.formAllData.businessInfoRegisteredTel = null
      } if (a === 9) {
        this.formAllData.holdingCompanyType = null
        this.formAllData.holdingCompanyName = null
        this.formAllData.holdingCompanyLicenseNumber = null
        this.formAllData.holdingCompanyLicenseValidTime = null
        this.formAllData.holdingCompanyLicenseType = null
      } if (a === 10) {
        this.formAllData.beneficiaryIdCardName = null
        this.formAllData.beneficiaryIdCardType = null
        this.formAllData.beneficiaryIdCardNumber = null
        this.formAllData.beneficiaryIdCardValidTime = null
        this.formAllData.beneficiaryIdCardCopy = null
        this.formAllData.beneficiaryIdCardNational = null
        this.formAllData.beneficiaryAddress = null
        this.beneficiaryIdCardCopyImg = null
        this.beneficiaryIdCardNationalImg = null
      }
    },
    // 获取页面详细信息
    queryMerchantDetail () {
      baseApi
        .queryMerchantDetail({
          'legalCode': this.legalCode
        }
        )
        .then(({ data }) => {
          if (data['code'] === '200') {
            this.formAllData = data.data
            // 给双日期输入框赋值
            this.dateDeal('legalPersonIdCardValidTime', this.formAllData['legalPersonIdCardValidTime'])

            console.log('表单返回值', data.data)
            this.download()
          } else {

          }
        })
        .catch((err) => {
          this.$Message.error('获取异常' + err)
        })
    },
    // 双日期框字符处理
    dateDeal (sign, date) {
      if (sign === 'legalPersonIdCardValidTime') {
        this.legalPersonDate = date.split(',')
        console.log(this.legalPersonDate)
        if (this.legalPersonDate[1] === '长期') {
          // 长期按钮被点击
          this.legalPersonIdCardRadioGroupChange(2)
          // 短期按钮取消被点击
          this.legalPersonIdCardRadioGroup = ''

          this.legalPersonIdCardStartTime = this.legalPersonDate[0]
          this.legalPersonIdCardEndTime = this.legalPersonDate[1]
        } else {
          this.legalPersonIdCardStartTime = this.legalPersonDate[0]
          this.legalPersonIdCardEndTime = this.legalPersonDate[1]
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
// .rate-demo {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;

// }

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

.no-search {
  display: flex;
  align-items: center;
  justify-content: center;
  // background-image:  url('../images/nosearch.png');
  // background-size: cover;
  // background-position: center;
}

.search {
  width: 98px;
  height: 64px;
  margin-top: 100px;
}

.demo-spin-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.demo-upload-list {
  display: inline-block;
  width: 55px;
  height: 55px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  // box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.poptipExplain {
  width: 200px;
  white-space: normal;
  word-break: break-all;
  line-height: 25px;
  font-size: 14px;
}
</style>
