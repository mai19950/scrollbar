interface ObjType {
  [key: string]: any
}

type ExtendFn = (to: ObjType, _form: ObjType) => ObjType

const extend: ExtendFn = (to, _form) => {
  for (let key in _form) {
    to[key] = _form[key]
  }
  return to
}

export const toObject = (arr: any[]) => {
  const res: ObjType = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

export const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  },
}

export interface IBarStyleProp {
  move: number
  size: string
  bar: any
}

export interface IBarStyle {
  [key: string]: any
}

export const renderThumbStyle = ({ move, size, bar }: IBarStyleProp) => {
  const style: IBarStyle = {}
  const translate = `translate${bar.axis}(${move}%)`

  style[bar.size] = size
  style.transform = translate
  style.msTransform = translate
  style.webkitTransform = translate

  return style
}
