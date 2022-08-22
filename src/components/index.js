import Popup from './popup.vue'
import PopupCondition from './popup-condition.vue'
import PageTable from './page-table.vue'
import PageTableCopy from './page-table-copy.vue'
import TagSelect from './tag-select.vue'

export default {
  install (Vue) {
    Vue.component(Popup.name, Popup)
    Vue.component(PopupCondition.name, PopupCondition)
    Vue.component(PageTable.name, PageTable)
    Vue.component(PageTableCopy.name, PageTableCopy)
    Vue.component(TagSelect.name, TagSelect)
  }
}
