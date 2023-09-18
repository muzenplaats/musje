import Tie from './Tie'

export default function linkTies(cells) {

  cells.forEach((cell, c) => {
    cell.data.forEach((dt, d) => {

      if (dt.name === 'multipart') {
        dt.layers.forEach((layer, l) => {
          layer.data.forEach((ldt, ld) => {
            if (!ldt.tie) {
              return
            }

            const { type } = ldt.tie

            if (type !== 'begin' && type !== 'continue') {
              return
            }

            let { ndt, ncell } = getNextNote(cells, c, d, l, ld)

            if (!ndt || !hasMatchedPitch(dt, ndt)) {
              return
            }

            link(dt, ndt, cell, ncell)
          })
        })
      }

      if (!dt.tie) {
        return
      }

      const { type } = dt.tie

      if (type !== 'begin' && type !== 'continue') {
        return
      }

      let { ndt, ncell } = getNextNote(cells, c, d)

      if (!ndt || !hasMatchedPitch(dt, ndt)) {
        return
      }

      link(dt, ndt, cell, ncell)
    })
  })
}


const getNextNote = (cells, c, d, l, ld) => {
  let ndt

  // The dt is multipart.
  if (typeof l === 'number') {
    const { layers } = cells[c].data[d]

    do {
      ld++
      ndt = layers[l].data[ld]

      if (!ndt) {
        return getNextNote(cells, c, d)
      }

      if (ndt) {
        if (ndt.name === 'note' || ndt.name === 'chord') {
          return { ndt, ncell }
        }

        if (ndt.name === 'rest') {
          return {}
        }
      }
    } while (ndt)
  }

  do {
    let ncell = cells[c]
    d++
    ndt = ncell.data[d]

    if (!ndt) {
      c++
      d = 0
      ncell = cells[c]
      
      if (!ncell) {
        break
      }

      ndt = ncell.data[d]
    }

    if (ndt) {
      if (ndt.name === 'note' || ndt.name === 'chord') {
        return { ndt, ncell }
      }

      if (ndt.name === 'rest') {
        break
      }

      if (ndt.name === 'multipart') {
        return getNextNote(cells, c, d, 0, 0)
      }
    }
  } while (ndt)

  return {}
}


const hasMatchedPitch = (dt, ndt) => {
  switch (dt.name) {
    case 'note':
      switch (ndt.name) {
        case 'note':
          return ndt.pitch.midiNumber === dt.pitch.midiNumber
        case 'chord':
          return ndt.pitches.some(pitch => pitch.midiNumber === dt.pitch.midiNumber)
      }
    case 'chord':
      switch (ndt.name) {
        case 'note':
          return dt.pitches.some(pitch => pitch.midiNumber === ndt.pitch.midiNumber)
        case 'chord':
          return dt.pitches.some((pitch, p) => {
            return ndt.pitches.some(npitch => pitch.midiNumber === npitch.midiNumber)
          })
      }
  }
}

const getMatchedPitch = (pitches, pitch) => {
  for (let i = 0; i < pitches.length; i++) {
    if (pitches[i].midiNumber === pitch.midiNumber) {
      return pitches[i]
    }
  }
}

const getMatchedPitches = (pitches, npitches) => {
  const result = []

  pitches.forEach(pitch => {
    npitches.forEach(npitch => {
      if (pitch.midiNumber === npitch.midiNumber) {
        result.push({ 
          curr: pitch, 
          next: npitch 
        })
      }
    })
  })

  return result
}



const link = (dt, ndt, cell, ncell) => {
  switch (dt.name) {
    case 'note':
      switch (ndt.name) {
        case 'note':    // note~note
          linkTiePair(dt, ndt, dt, ndt, cell, ncell)
          break
        case 'chord':   // note~chord
          const npitch = getMatchedPitch(ndt.pitches, dt.pitch)
          linkTiePair(dt, npitch, dt, ndt, cell, ncell)
          break
        default:
          throw new TypeError(ndt.name)
      }
      break
    case 'chord':
      switch (ndt.name) {
        case 'note':    // chord~note
          const pitch = getMatchedPitch(dt.pitches, ndt.pitch)
          linkTiePair(pitch, ndt, dt, ndt, cell, ncell)
          break
        case 'chord':   // chord-chord
          const paires = getMatchedPitches(dt.pitches, ndt.pitches)

          paires.forEach(({ curr, next }) => {
            linkTiePair(curr, next, dt, ndt, cell, ncell)
          })

          linkTiePair(dt, ndt, dt, ndt, cell, ncell)
          break
        default:
          throw new TypeError(ndt.name)
      }
      break
    default:
      throw new TypeError(dt.name)
  }
}

const linkTiePair = (curr, next, dt, ndt, cell, ncell) => {
  if (!curr || !next) {
    return
  }

  if (curr.tie) {
    if (curr.tie.type === 'end') {
      curr.tie.type = 'continue'
    }
  } else {
    curr.tie = new Tie({ type: 'begin' })
  }

  next.tie = new Tie({
    type: next.tie ? 'continue' : 'end', 
    cell: ncell
  })

  curr.tie.cell = cell
  curr.tie.note = dt
  curr.tie.nextNote = ndt

  if (next.name === 'pitch') {
    curr.tie.nextPitch = next
  }

  curr.tie.next = next.tie
  next.tie.note = ndt
  next.tie.prevNote = dt
  
  if (curr.name === 'pitch') {
    next.tie.prevPitch = curr
  }

  next.tie.prev = curr.tie


  // chord~note
  if (curr.name === 'pitch' && next.name === 'note') {
    // console.log('chord~note', dt.tie)
    dt.tie.cell = cell
    dt.tie.note = dt
    dt.tie.nextNote = ndt
    dt.tie.next = ndt.tie

  // note~chord
  } else if (curr.name === 'note' && next.name === 'pitch') {
    // console.log('note~chord', ndt.tie)

    // Todo
    // dt.nextCT = ndt.tie
    // ndt.tie = new Tie({
    //   type: ndt.tie ? 'continue' : 'end', cell: ncell
    // })
    // ndt.tie.prevNote = dt
    // ndt.tie.prev = dt.tie
  }
}
