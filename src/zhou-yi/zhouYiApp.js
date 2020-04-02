import el from '../utils/el'
import zhouYi from './zhou-yi.json'
import Gua from './Gua'

const { guas } = zhouYi
const { baGuas } = zhouYi
const YAO_POSITIONS = ['初', '二', '三', '四', '五', '上', '用']
const YAO_NUMBERS = ['六', '九']

const getYaoName = (ycode, i) => {
  return i === 0 || i >= 5 ? YAO_POSITIONS[i] + YAO_NUMBERS[ycode] :
                             YAO_NUMBERS[ycode] + YAO_POSITIONS[i]
} 

const guaXiangEl = (gua, index, visible) => {
  if (!gua.$yaoCodes || !visible) return el('div')

  return el('svg', { width: 200, height: 220, style: 'padding-left: 30px' }, [
    el('g', [
      el('text', { x: 10 + 60 - 9, y: 30 }, gua.$topGuaXiang),
      el('text', { x: 10 + 60 - 9, y: 210 }, gua.$bottomGuaXiang)
    ]),
    el('g', gua.$yaoCodes.map((code, i) => {
      const y = 180 - 25 * i
      const width = 120
      const gap = 18
      const swidth = (width - gap) / 2
      const style = 'stroke: black; stroke-width: 15'
      const yaoName = getYaoName(code, i)
      const yaoNameEl = el('text', { 
        x: 140, y, style: 'alignment-baseline: middle' 
      }, yaoName)
      return code ? 
        el('g', [
          el('line', { x1: 10, y1: y, x2: width + 10, y2: y, style }),
          yaoNameEl
        ]) :
        el('g', [
          el('line', { x1: 10, y1: y, x2: swidth + 10, y2: y, style }),
          el('line', { x1: width - swidth + 10 , 
                       y1: y, x2: width + 10, y2: y, style }),
          yaoNameEl
        ])
    }))
  ])
}

export default function zhouYiApp() {
  const gua = el.setData({
    index: 3,
    data: { get() { return guas[this.index] } },
    json: { get() { return JSON.stringify(this.data, null, 2) } },
    bottomGua: { get() { return new Gua(this.data).bottomGua } },
    topGua: { get() { return new Gua(this.data).topGua } },
    bottomGuaName: { get() { return this.bottomGua.name } },
    topGuaName: { get() { return this.topGua.name } },
    bottomGuaXiang: { get() { return this.bottomGua.xiang } },
    topGuaXiang: { get() { return this.topGua.xiang } },
    name: { get() { return this.data.name } },
    sentence: { get() { return this.data.sentence } },
    tuan: { get() { return this.data.tuan } },
    xiang: { get() { return this.data.xiang } },
    yaoCodes: { get() { return this.data.code.split('').map(y => +y) } },
    yaoNames: { 
      get() { 
        const ycodes = this.yaoCodes.slice()
        const { code } = this.data
        if (code === '111111') {
          ycodes.push(1)
        } else if (code === '000000') {
          ycodes.push(0)
        }
        return ycodes.map(getYaoName) 
      } 
    },
    guaXiangEl: { el() { return guaXiangEl(this, this.index, true) } },
    yaoTsEl: {
      el() {
        const { serial, yaos } = this.data
        const numbers = [1, 2, 3, 4, 5, 6]
        if (serial <= 2) numbers.push(7)
        return el.create('div', numbers.map(n => {
          const yao = yaos[n]
          return el('p', [
            el('span', { style: 'color: gray' }, this.yaoNames[n - 1]),
            ' ', yao.sentence, el('br'),
            el('span', { style: 'color: gray' }, '象曰 '), yao.xiang
          ])
        }))
      }
    },
    wenyanEl: {
      el() { 
        const { wenyan } = this.data
        if (!wenyan) return el.create('div')
        return el.create('div', [
          el('h3', '文言曰'),
          el.html('div', wenyan.replace(/\n/g, '<br>'))
        ])
      }
    }
  })

  const gua2 = el.setData({
    index: 0,
    visible: false,
    data: { get() { return guas[this.index] } },
    name: { get() { return this.data.name } },
    bottomGua: { get() { return new Gua(this.data).bottomGua } },
    topGua: { get() { return new Gua(this.data).topGua } },
    bottomGuaXiang: { get() { return this.bottomGua.xiang } },
    topGuaXiang: { get() { return this.topGua.xiang } },
    yaoCodes: { get() { return this.data.code.split('').map(y => +y) } },
    guaXiangEl: { el() { return guaXiangEl(this, this.index, this.visible) } },
    transformName: '',
    title: { 
      get() { 
        return this.visible ? 
          gua.name + this.transformName + this.name + '卦' : ''
      },
      dep: 'index'
    }
  })
  el.linkData(gua, 'index', () => { gua2.visible = false })

  const makeZhi = n => {
    return () => {
      const zhiGua = new Gua(gua.data).zhiGua(n)
      gua2.index = zhiGua.serial - 1
      gua2.transformName = '之'
      gua2.visible = true
    }
  }

  return el.create('div', [
    el('h1', { style: 'font-size: 25px' }, '周易'),
    el('div', [
      el('span', '序卦'),
      el('span', guas.map((guadt, i) => el('button', {
        click() { gua.index = i }
      }, [guadt.serial, ' ', guadt.name])))
    ]),

    el('div', [
      el('h2', [
        el('span', gua.$name), ' ',
        el('span', { style: 'font-size: 12px' }, [
          el('span', gua.$topGuaName), '上', 
          el('span', gua.$bottomGuaName), '下'
        ])
      ]),
      el('p', gua.$sentence),
      el('p', [
        el('span', { style: 'color: gray' }, '彖曰 '), 
        el('span', gua.$tuan)
      ]),
      el('p', [
        el('span', { style: 'color: gray' }, '象曰 '), 
        el('span', gua.$xiang)
      ]),
      el('div', { class: 'clearfix' }, [
        el('div', { style: 'width: 30%; float: left' }, [
          el('div', gua.$guaXiangEl),
          el('div', [
            el('button', { 
              click: () => {
                const cuoGua = new Gua(gua.data).cuoGua
                gua2.index = cuoGua.serial - 1
                gua2.transformName = '錯'
                gua2.visible = true
              },
            }, '錯'),
            el('button', { 
              click: () => {
                const zongGua = new Gua(gua.data).zongGua
                gua2.index = zongGua.serial - 1
                gua2.transformName = '綜'
                gua2.visible = true
              }
            }, '綜'),
            el('button', { 
              click: () => {
                const alterGua = new Gua(gua.data).alterGua
                gua2.index = alterGua.serial - 1
                gua2.transformName = '交互'
                gua2.visible = true
              }
            }, '交互'),
            el('button', { click: makeZhi(1) }, '之'),
            el('button', { click: makeZhi(2) }, '二'),
            el('button', { click: makeZhi(3) }, '三'),
            el('button', { click: makeZhi(4) }, '四'),
            el('button', { click: makeZhi(5) }, '五'),
            el('button', { click: makeZhi(6) }, '六')
          ]),
          el('h3', gua2.$title),
          el('div', gua2.$guaXiangEl),
        ]),
        el('div', { 
          style: 'width: 60%; float: left; padding-left: 30px'
        }, gua.$yaoTsEl)
      ]),
    ]),
    el('div', gua.$wenyanEl),
    // el('div', [
      // el('pre', gua.$json)
    // ]),
    
    el('style', `
      .clearfix::after {
        content: "";
        clear: both;
        display: table;
      }
    `)
  ])
}