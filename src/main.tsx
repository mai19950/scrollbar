import { CreateElement } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import scrollbarWidth from './scrollbar-width'
import { toObject } from './utils'

// interface StyleObj {
// [key: string]: any
// }

@Component({
  name: 'Scrollbar',
})
export default class Scrollbar extends Vue {
  @Prop({}) private native!: boolean
  @Prop({ default: 'div' }) private tag!: string
  @Prop({}) private noresize!: boolean
  @Prop({ default: {} }) private wrapStyle!: any
  @Prop({ default: {} }) private wrapClass!: any
  @Prop({ default: {} }) private viewClass!: any
  @Prop({ default: {} }) private viewStyle!: any

  private sizeWidth: number | string = '0'
  private sizeHeight: number | string = '0'
  private moveX = 0
  private moveY = 0

  get wrap() {
    return this.$refs.wrap
  }

  private handleScroll() {
    const wrap = this.wrap as Element

    this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth
    this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight
  }

  private render(h: CreateElement) {
    let gutter = scrollbarWidth()
    let style = this.wrapStyle

    if (gutter) {
      const gutterWith = `-${gutter}px`
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle)
        style.marginRight = style.marginBottom = gutterWith
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle
      } else {
        style = gutterStyle
      }
    }

    const view = h(
      this.tag,
      {
        class: ['el-scrollbar__view', this.viewClass],
        style: this.viewStyle,
        ref: 'resize',
      },
      this.$slots.default
    )

    const wrap = (
      <div
        ref='wrap'
        style={style}
        onScroll={this.handleScroll}
        class={[
          this.wrapClass,
          'el-scrollbar__wrap',
          gutter ? '' : 'el-scrollbar__wrap--hidden-default',
        ]}
      >
        {view}
      </div>
    )
  }
}
