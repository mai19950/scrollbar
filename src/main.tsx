import { CreateElement } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Bar from './bar'
import scrollbarWidth from './scrollbar-width'
import { toObject } from './utils'

interface StyleObj {
  [key: string]: any
}

type StyleType = string | StyleObj | StyleObj[]

@Component({
  name: 'Scrollbar',
  components: { Bar },
})
export default class Scrollbar extends Vue {
  @Prop({}) private native!: boolean
  @Prop({ default: 'div' }) private tag!: string
  @Prop({}) private noresize!: boolean
  @Prop({ default: {} }) private wrapStyle!: StyleType
  @Prop({ default: {} }) private viewStyle!: StyleType
  @Prop({ default: {} }) private wrapClass!: any
  @Prop({ default: {} }) private viewClass!: any

  private sizeWidth: number | string = '0'
  private sizeHeight: number | string = '0'
  private moveX = 0
  private moveY = 0

  get wrap(): Element {
    return this.$refs.wrap as Element
  }

  private handleScroll(): void {
    const wrap = this.wrap

    this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth
    this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight
  }

  private update(): void {
    let heightPercentage: number, widthPercentage: number
    const wrap = this.wrap
    if (!wrap) return
    const { clientHeight, clientWidth, scrollHeight, scrollWidth } = wrap

    heightPercentage = (clientHeight * 100) / scrollHeight
    widthPercentage = (clientWidth * 100) / scrollWidth

    this.sizeHeight = heightPercentage < 100 ? `${heightPercentage}%` : ''
    this.sizeWidth = widthPercentage < 100 ? `${widthPercentage}%` : ''
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
        {[view]}
      </div>
    )

    const { moveX, moveY } = this

    let nodes = !this.native
      ? [
          wrap,
          <bar move={moveX} size={this.sizeWidth} />,
          <bar move={moveY} size={this.sizeHeight} vertical />,
        ]
      : [
          <div ref='wrap' class={[this.wrapClass, 'el-scrollbar__wrap']} style={style}>
            {[view]}
          </div>,
        ]
    return h('div', { class: 'el-scrollbar' }, nodes)
  }

  private mounted(): void {
    if (this.native) return
    this.$nextTick(this.update)
    // !this.noresize &&
  }
  private beforeDestroy(): void {
    if (this.native) return
  }
}
