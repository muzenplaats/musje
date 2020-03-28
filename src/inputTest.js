import el from './utils/el'

export default function () {
  const data = el.setData({
    text: 'abc',
    number: 12345,
    password: '111',
    textarea: '123\n456',
    color: '#ffaaff',
    date: '2020-03-27',
    month: '2020-03',
    week: '2020-W05',
    time: '15:20',
    datetimeLocal: '2018-06-12T19:30',
    email: 'a@b.c',
    file: '',
    url: 'www',
    image: 'test',
    range: 90,
    search: 'hello',
    tel: '012',
    checkbox: true,
    radio: 'radBV',
    selectedIndex: 2,
    selectedValue: 'cat',
    selectOptions: []
  })

  return el.create('div', [
    el('h1', { style: 'font-size: 20' }, 'Input Test'),
    el('div', [
      'text: ', el('input', { type: 'text', value: data.$text }),
      ' ', el('span', data.$text)
    ]),
    el('div', [
      'number: ', el('input', { type: 'number', value: data.$number }),
      ' ', el('span', data.$number)
    ]),
    el('div', [
      'password: ', el('input', { type: 'password', value: data.$password }),
      ' ', el('span', data.$password)
    ]),
    el('div', [
      'textarea: ', el('textarea', { value: data.$textarea }),
      ' ', el('span', data.$textarea)
    ]),
    el('div', [
      'color: ', el('input', { type: 'color', value: data.$color }),
      ' ', el('span', data.$color)
    ]),
    el('div', [
      'date: ',
      el('input', { type: 'date', value: data.$date }),
      ' ', el('span', data.$date)
    ]),
    el('div', [
      'month: ',
      el('input', { type: 'month', value: data.$month }),
      ' ', el('span', data.$month)
    ]),
    el('div', [
      'week: ',
      el('input', { type: 'week', value: data.$week }),
      ' ', el('span', data.$week)
    ]),
    el('div', [
      'time: ', el('input', { type: 'time', value: data.$time }),
      ' ', el('span', data.$time)
    ]),
    el('div', [
      'datetime-local: ',
      el('input', { type: 'datetime-local', value: data.$datetimeLocal }),
      ' ', el('span', data.$datetimeLocal)
    ]),
    el('div', [
      'email: ', el('input', { type: 'email', value: data.$email }),
      ' ', el('span', data.$email)
    ]),
    el('div', [
      'file: ', el('input', { type: 'file', value: data.$file }),
      ' ', el('span', data.$file)
    ]),
    el('div', [
      'url: ', el('input', { type: 'url', value: data.$url }),
      ' ', el('span', data.$url)
    ]),
    el('div', [
      'image: ', el('input', { type: 'image', src: data.$image }),
      ' ', el('span', data.$image)
    ]),
    el('div', [
      'range: ',
      el('input', { type: 'range', min: 10, max: 200, value: data.$range }),
      ' ', el('span', data.$range)
    ]),
    el('div', [
      'search: ',
      el('input', { type: 'search', min: 10, max: 200, value: data.$search }),
      ' ', el('span', data.$search)
    ]),
    el('div', [
      'tel: ',
      el('input', { type: 'tel', min: 10, max: 200, value: data.$tel }),
      ' ', el('span', data.$tel)
    ]),
    el('div', [
      'checkbox: ',
      el('input', { type: 'checkbox', checked: data.$checkbox }),
      ' ', el('span', data.$checkbox)
    ]),

    el('div', [
      'radio: ',
      el('span', [
        el('input', { type: 'radio', id: 'aa', name: 'rad1',
                      value: 'radAV', checkedValue: data.$radio }),
        el('label', { for: 'aa'}, 'a')
      ]),
      el('span', [
        el('input', { type: 'radio', id: 'bb', name: 'rad1',
                      value: 'radBV', checkedValue: data.$radio }),
        el('label', { for: 'bb'}, 'b')
      ]),
      el('span', [
        el('input', { type: 'radio', id: 'cc', name: 'rad1',
                      value: 'radCV', checkedValue: data.$radio }),
        el('label', { for: 'cc'}, 'c')
      ]),
      ',', el.nbsp(5), el('span', data.$radio)
    ]),

    // Ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
    // type: select-one
    el('div', [
      el('div', 'select-one: '),
      el('div', [
        el('label', { for: 'pet-select' }, 'Choose a pet: '),
      ]),
      el('select', {
        name: 'pets', id: 'pet-select',
        selectedIndex: data.$selectedIndex, value: data.$selectedValue
      }, [
        el('option', { value: '' }, '--Please choose an option--'),
        el('option', { value: 'dog' }, 'Dog'),
        el('option', { value: 'cat' }, 'Cat'),
        el('option', { value: 'hamster' }, 'Hamster'),
        el('option', { value: 'parrot' }, 'Parrot'),
        el('option', { value: 'spider' }, 'Spider'),
        el('option', { value: 'goldfish' }, 'Goldfish')
      ]),
      el('div', [
        'selectedIndex: ', el('span', data.$selectedIndex),
        ', selectedValue: ', el('span', data.$selectedValue)
      ])
    ]),

    // type: select-multiple
    el('div', { style: 'padding: 10px 5px 30px 5px' }, [
      el('div', 'select-multiple: '),
      el('div', [
        el('label', { for: 'pet-select1' }, 'Choose a pet: ')
      ]),
      el('select', {
        name: 'pets1', id: 'pet-select1',
        multiple: '', selectedOptions: data.$selectOptions
      }, [
        el('option', { value: '' }, '--Please choose an option--'),
        el('option', { value: 'dog' }, 'Dog'),
        el('option', { value: 'cat' }, 'Cat'),
        el('option', { value: 'hamster' }, 'Hamster'),
        el('option', { value: 'parrot' }, 'Parrot'),
        el('option', { value: 'spider' }, 'Spider'),
        el('option', { value: 'goldfish' }, 'Goldfish')
      ]),
      el('div', data.$selectOptions.map())
    ]),

    el('style', `
      div {
        padding: 3px 5px 3px 5px;
      }
    `)
  ])
}
