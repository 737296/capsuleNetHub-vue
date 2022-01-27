<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div
      class="sidebar-menu-con"
      :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}"
    >
      <shrinkable-menu
        :shrink="shrink"
        @on-change="handleSubmenuChange"
        :theme="menuTheme"
        :before-push="beforePush"
        :open-names="openedSubmenuArr"
        :menu-list="menuList"
      >
        <div slot="top" class="logo-con">
          <!-- <img v-show="!shrink" src="../images/logo.png" key="max-logo" /> -->
            <div v-show="!shrink" class="marge-img">
              <img src="../images/logo-min.png" key="min-logo" />
              <div class="system-title"><div class="eng">PAYHUB</div><div class="cha">支付中心Portal</div></div>
            </div>
            <img v-show="shrink" src="../images/logo-min.png" key="min-logo" />
        </div>
      </shrinkable-menu>
    </div>
    <div class="main-header-con" :style="{marginLeft: shrink ? '60px' : '200px'}">
      <div class="main-header">
        <!-- 左侧展开收起按钮 -->
        <!-- <div class="navicon-con">
          <Button
            :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}"
            type="text"
            @click="toggleClick"
          >
            <Icon type="navicon" size="32" color="white"></Icon>
          </Button>
        </div> -->
        <div class="header-avator-con">
          <div class="button-wrap">
          <template v-for="(es, idx) in externalServices">
            <Button type="info" :key="idx" v-html="es.name" @click="toExternalService(es)"></Button>
          </template>
          </div>
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ fullName || '游客' }}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Row>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>
      </div>
    </div>
    <div class="page-box" :style="{marginLeft: shrink ? '60px' : '200px'}">
      <div class="single-page-con">
        <div class="single-page">
          <keep-alive :include="cachePage">
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue'
import breadcrumbNav from './main-components/breadcrumb-nav.vue'
import util from '@/libs/util'
import { loginApi } from '@/api/login'
import { mapState } from 'vuex'
import md5 from 'md5'

export default {
  components: {
    shrinkableMenu,
    // tagsPageOpened,
    breadcrumbNav
    // messageTip
  },
  data () {
    return {
      shrink: false,
      logUrl: '',
      brandName: '',
      urlArr: [],
      path: ''
    }
  },
  computed: mapState({
    menuList: state => state.app.routers,
    // 打开的页面的页面对象
    pageTagsList: state => state.app.pageOpenedList,
    // 当前面包屑数组
    currentPath: state => state.app.currentPath,
    cachePage: state => state.app.cachePage,
    menuTheme: state => state.app.menuTheme,
    // 用户名称
    fullName: state => state.user.userInfo.account,
    openedSubmenuArr: state => state.app.openedSubmenuArr,
    // 外部服务
    externalServices: state => state.app.externalServices || []
  }),
  methods: {
    init () {
      let pathArr = util.setCurrentPath(this, this.$route.name)
      this.$store.commit('updateMenulist')
      if (pathArr.length >= 1) {
        this.$store.commit('addOpenSubmenu', pathArr[0].name)
        this.shrink = false
      }
      // this.fullName = this.Base64decode("fullName");
      // let messageCount = 3
      // this.messageCount = messageCount.toString();
      this.checkTag(this.$route.name)
      this.$store.commit('setMessageCount', 3)
    },
    toggleClick () {
      this.shrink = !this.shrink
    },
    handleClickUserDropdown (name) {
      if (name === 'ownSpace') {
        util.openNewPage(this, 'ownspace_index')
        this.$router.push({
          name: 'ownspace_index'
        })
      } else if (name === 'loginout') {
        // 退出登录
        this.$Modal.confirm({
          title: '确认',
          content: '<p>是否要退出登录？</p>',
          onOk: () => {
            loginApi.logout()
          },
          onCancel: () => { }
        })
      }
    },
    checkTag (name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true
        }
      })
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        )
      }
    },
    // urlName () {
    //   this.urlArr = this.$store.state.app.currentPath
    //   localStorage.setItem('pathStr', JSON.stringify(this.urlArr))
    // },
    handleSubmenuChange (val) { },
    beforePush (name) {
      return true
    },
    toExternalService ({ path }) {
      const timestamp = Date.now()
      window.open(`${path}${path.includes('?') > 0 ? '&' : '?'}sign=${md5(md5('这是私钥' + timestamp))}&timestamp=${timestamp}&name=${encodeURIComponent(this.fullName)}`, '_blank')
    }
  },
  watch: {
    $route (to) {
      util.setCurrentPath(this, to.name)
      this.checkTag(to.name)
    }
  },
  mounted () {
    const _self = this
    if (document.documentElement.clientWidth <= 1280) {
      _self.toggleClick()
    }
  },
  created () {
    // 显示打开的页面的列表
    // this.$store.commit('setOpenedList')
    this.$nextTick(() => {
      this.init()
    })
  }
}
</script>
<style lang="less" scoped>
.main {
    position: absolute;
    width: 100%;
    height: 100%;
    .sidebar-menu-con {
      float: left;
      height: 100%;
      // position: fixed;
      // top: 0;
      // left: 0;
      z-index: 21;
      transition: width .3s;
    };
    &-header-con{
      margin-left: 200px;
      box-sizing: border-box;
      // position: fixed;
      display: block;
      // width: 100%;
      height: 85px;
      z-index: 20;
      box-shadow: 0 2px 1px 1px rgba(100,100,100,.1);
      transition: padding .3s;
      .main-header {
        height: 55px;
        background: #495060;
        box-shadow: 0 2px 1px 1px rgba(100,100,100,.1);
        position: relative;
        z-index: 11;
        a {
          color:rgba(255, 255, 255, .7);
          &:hover, &:visited, &:active {
            color:#fff;
          }
        };
        .navicon-con {
          margin: 6px;
          display: inline-block;
        };
        .header-middle-con {
          position: absolute;
          left: 60px;
          top: 0;
          right: 340px;
          bottom: 0;
          padding: 6px;
          overflow: hidden;
          p {
            height:100%;
            line-height: 3em;
            font-weight: bold;
            font-size: 16px;
            color: white;
            display: inline-block;
          }
        };
        .header-avator-con {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 300px;
          .button-wrap{
            display: inline-flex;
            align-items: center;
            height: 100%;
          }
          .switch-theme-con {
            display: inline-block;
            width: 40px;
            height: 100%;
          };
          .message-con {
            display: inline-block;
            width: 30px;
            padding: 18px 0;
            text-align: center;
            cursor: pointer;
            i {
              vertical-align: middle;
            }
          };
          .change-skin {
            font-size: 14px;
            font-weight: 500;
            padding-right: 5px;
          };
          .switch-theme {
            height: 100%;
          };
          .user-dropdown {
            &-menu-con {
              position: absolute;
              right: 0;
              top: 0;
              width: 150px;
              height: 100%;
              .main-user-name {
                display: inline-block;
                width: 80px;
                word-break: keep-all;
                white-space: nowrap;
                vertical-align: middle;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: right;
              }
            };
            &-innercon {
              height: 100%;
              padding-right: 14px;
            }
          };
          .full-screen-btn-con {
            display: inline-block;
            width: 30px;
            padding: 18px 0;
            text-align: center;
            cursor: pointer;
            i {
              vertical-align: middle;
            }
          };
          .lock-screen-btn-con {
            display: inline-block;
            width: 30px;
            padding: 18px 0;
            text-align: center;
            cursor: pointer;
            i {
              vertical-align: middle;
            }
          }
        }
      };
      .tags-con {
        height: 30px;
        z-index: -1;
        overflow: hidden;
        background: #ffffff;
      };
    };
    .header-con {
      height: calc(~"100% - 85px");
      overflow: hidden;
      background: #ffffff;
      .single-page-con {
        height: 100%;
        .single-page {
          height: 100%;
        }
      };
      .tags-outer-scroll-con{
        position: relative;
        box-sizing: border-box;
        padding-right: 120px;
        width: 100%;
        height: 100%;
        .tags-inner-scroll-body{
          position: absolute;
          padding: 2px 10px;
          overflow: visible;
          white-space: nowrap;
          transition: left .3s ease;
        };
        .close-all-tag-con{
          position: absolute;
          right: 0;
          top: 0;
          box-sizing: border-box;
          padding-top: 8px;
          text-align: center;
          width: 110px;
          height: 100%;
          background: white;
          box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
          z-index: 10;
        }
      }
    };
    &-breadcrumb{
        padding: 8px 30px 0;
    }
    .page-box {
      height: calc(~"100% - 85px");
      overflow: hidden;
      background: #ffffff;
      .single-page-con {
        height: 100%;
        overflow: auto;
        // .single-page {
        //   // height: 100%;
        // }
      };
      .tags-outer-scroll-con{
        position: relative;
        box-sizing: border-box;
        padding-right: 120px;
        width: 100%;
        height: 100%;
        .tags-inner-scroll-body{
          position: absolute;
          padding: 2px 10px;
          overflow: visible;
          white-space: nowrap;
          transition: left .3s ease;
        };
        .close-all-tag-con{
          position: absolute;
          right: 0;
          top: 0;
          box-sizing: border-box;
          padding-top: 8px;
          text-align: center;
          width: 110px;
          height: 100%;
          background: white;
          box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
          z-index: 10;
        }
      }
    };
}

.logo-con{
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  text-align: center;
  img{
    height: 44px;
    width: auto;
  }
  .marge-img {
    display: flex;
    padding-top: 3px;
    width: 154px;
    height: 44px;
    box-sizing: border-box;
    img {
      height: 100%;
      width: auto;
    };
    .system-title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 5px;
      width: 104px;
      color: #fff;
      font-size: 14px;
      opacity: 0.88;
      .eng {
        line-height: 16px;
      }
      .cha {
        // line-height: 16px;
      }
    }
  }
}
</style>
