import { el } from './utils/html'
import { precision } from './utils/helpers'

export default function converterAppElement() {
  const data = el.setData({
    wavenumber: 1,
    wn: {
      get() { return precision(this.wavenumber, 6) },
      set(val) { this.wavenumber = val },
      dep: 'wavenumber'
    },
    erg: {
      get() { return precision(this.wavenumber * 5.0358e15, 6) },
      set(val) { this.wavenumber = val / 5.0358e15 },
      dep: 'wavenumber'
    },
    cal: {
      get() { return precision(this.wavenumber * 0.34996, 6) },
      set(val) { this.wavenumber = val / 0.34996 },
      dep: 'wavenumber'
    },
    ev: {
      get() { return precision(this.wavenumber * 8067.5, 6) },
      set(val) { this.wavenumber = val / 8067.5 },
      dep: 'wavenumber'
    },
  })

  const table = [
    ['Wavenumber:', data.$wn, ' cm<sup>-1</sup>'],
    ['Erg:', data.$erg, ' erg/molecule'],
    ['Cal:', data.$cal, ' cal/molecule'],
    ['Electron-volt:', data.$ev, ' eV']
  ]

  return el.create('div', [
    el('h1', { style: 'font-size: 22px' }, 'Energy Converter'),
    el('form', table.map(row => {
      return el('div', { style: 'padding: 3px' }, [
        el('label', { for: row[0] }, [
          el('div', { style: 'width: 100px; display: inline-block; padding-right: 10px; text-align: right' }, row[0])
        ]),
        el('input', {
          type: 'number', id: row[0], name: row[0], value: row[1],
          style: 'width: 120px'
        }),
        el.html('label', { for: row[0] }, row[2])
      ])
    })),
  ])
}

