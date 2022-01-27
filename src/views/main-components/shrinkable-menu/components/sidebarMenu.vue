<style lang="less">
@import "../styles/menu.less";
</style>

<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <Menu
    ref="sideMenu"
    :active-name="currentPath.length > 1 ? currentPath[1].name : $route.path"
    :open-names="openNames"
    :theme="menuTheme"
    width="auto"
    @on-select="changeMenu"
  >
    <div v-for="item in menuList" :key="item.path">
      <!-- <MenuItem v-if="item.children.length<=1" :name="item.children[0].name" >
                <Icon :type="item.icon" :size="iconSize" :key="item.path"></Icon>
                <span class="layout-text" :key="item.path">{{ itemTitle(item) }}</span>
      </MenuItem>-->
      <Submenu v-if="item.children.length >= 1" :name="item.name" :key="item.path+'keys'">
        <template slot="title">
          <Icon :type="item.icon" :size="iconSize"></Icon>
          <span class="layout-text">{{ itemTitle(item) }}</span>
        </template>
        <template v-for="child in item.children">
          <MenuItem :name="child.name" :key="child.name+'keym'">
            <Icon :type="child.icon" :size="iconSize" :key="child.name+'keyi'"></Icon>
            <span class="layout-text" :key="child.name+'keys'">{{ child.title }}</span>
          </MenuItem>
        </template>
      </Submenu>
    </div>
  </Menu>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'sidebarMenu',
  props: {
    menuList: Array,
    iconSize: Number,
    menuTheme: {
      type: String,
      default: 'dark'
    },
    openNames: {
      type: Array
    }
  },
  computed: mapState({
    // 当前面包屑数组
    currentPath: state => state.app.currentPath
  }),
  methods: {
    changeMenu (active) {
      this.$emit('on-change', active)
    },
    itemTitle (item) {
      if (typeof item.title === 'object') {
        return this.$t(item.title.i18n)
      } else {
        return item.title
      }
    }
  },
  updated () {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened()
      }
    })
  }
}
</script>
