import { CreateElement } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import Scrollbar from './main'
import { IDirection, BAR_MAP, renderThumbStyle } from '../share/utils'

@Component({
  name: 'bar',
})
export default class Bar extends Vue {
  @Prop({}) private vertical!: boolean
  @Prop({}) private size!: string
  @Prop({}) private move!: number

  private cursorDown: boolean = false

  readonly $refs!: {
    thumb: Element
    [key: string]: Vue | Element | undefined
  }

  readonly $parent!: Scrollbar

  get bar(): IDirection {
    return BAR_MAP[this.vertical ? 'vertical' : 'horizontal']
  }

  get wrap(): Element {
    return this.$parent.wrap
  }

  private mouseMoveDocumentHandler(e: MouseEvent): void {
    if (this.cursorDown === false) return
    const {
      axis: barAxis,
      direction: barDirection,
      client: barClient,
      offset: barOffset,
      scroll: barScroll,
      scrollSize: barScrollSize,
    } = this.bar
    const prevPage = this[barAxis]

    if (!prevPage) return

    const offset = (this.$el.getBoundingClientRect()[barDirection] - e[barClient]) * -1
    const thumb = this.$refs.thumb as Element
    const thumbClickPosition = thumb[barOffset] - prevPage
    const thumbPositionPercentage = ((offset - thumbClickPosition) * 100) / this.$el[barOffset]
    this.wrap[barScroll] = (thumbPositionPercentage * this.wrap[barScrollSize]) / 100
  }

  private mouseUpDocumentHandler(e: MouseEvent): void {
    this.cursorDown = false
    this[this.bar.axis] = 0
    document.removeEventListener('mousemove', this.mouseMoveDocumentHandler)
    document.onselectstart = null
  }

  private clickThumbHandler(e: MouseEvent): void {
    // 检测是否按住ctrl 或者 鼠标右键
    if (e.ctrlKey || e.button === 2) {
      return
    }
    this.startDrag(e)
    const {
      axis: barAxis,
      direction: barDirection,
      client: barClient,
      offset: barOffset,
    } = this.bar
    const current = e.currentTarget! as Element
    this[barAxis] =
      current[barOffset] - (e[barClient] - current.getBoundingClientRect()[barDirection])
  }

  private clickTrackHandler(e: MouseEvent): void {
    const {
      // axis: barAxis,
      direction: barDirection,
      client: barClient,
      offset: barOffset,
      scroll: barScroll,
      scrollSize: barScrollSize,
    } = this.bar

    const current = e.target as Element
    const offset = Math.abs(current.getBoundingClientRect()[barDirection] - e[barClient])
    const thumb = this.$refs.thumb as Element
    const thumbHalf = thumb[barOffset] / 2
    const thumbPositionPercentage = ((offset - thumbHalf) * 100) / this.$el[barOffset]
    this.wrap[barScroll] = (thumbPositionPercentage * this.wrap[barScrollSize]) / 100
  }

  private startDrag(e: MouseEvent) {
    // 阻止事件冒泡并且阻止该元素上同事件类型的监听器被触发
    e.stopImmediatePropagation()
    this.cursorDown = true

    document.addEventListener('mousemove', this.mouseMoveDocumentHandler)
    document.addEventListener('mouseup', this.mouseUpDocumentHandler)
    document.onselectstart = () => false
  }

  private render(h: CreateElement) {
    const { size, move, bar } = this

    return (
      <div class={['el-scrollbar__bar', `is-${bar.key}`]} onMousedown={this.clickTrackHandler}>
        <div
          className='el-scrollbar__thumb'
          ref='thumb'
          onMousedown={this.clickThumbHandler}
          style={renderThumbStyle({ size, move, bar })}
        ></div>
      </div>
    )
  }

  private destroyed(): void {
    document.removeEventListener('mouseup', this.mouseUpDocumentHandler)
  }
}
