// TODO: regularize text/font/size utils
let melm: HTMLPreElement
const getMeasurementDiv = () => {
  // A div used for measurement
  document.getElementById('__textMeasure')?.remove()

  const pre = document.createElement('pre')
  pre.id = '__textMeasure'

  Object.assign(pre.style, {
    whiteSpace: 'pre',
    width: 'auto',
    border: '1px solid transparent',
    padding: '4px',
    margin: '0px',
    opacity: '0',
    position: 'absolute',
    top: '-500px',
    left: '0px',
    zIndex: '9999',
    pointerEvents: 'none',
    userSelect: 'none',
    alignmentBaseline: 'mathematical',
    dominantBaseline: 'mathematical',
  })

  pre.tabIndex = -1

  document.body.appendChild(pre)
  return pre
}

if (typeof window !== 'undefined') {
  melm = getMeasurementDiv()
}

const getTextSize = (text: string, font: string) => {
  if (!melm) return { width: 10, height: 10 }

  melm.textContent = text || '&#8203;'
  melm.style.font = font

  // In tests, offsetWidth and offsetHeight will be 0
  return {
    width: melm.offsetWidth || 1,
    height: melm.offsetHeight || 1,
  }
}

const fontSize = 28
const fontFace = '"Source Sans Pro", sans-serif'

const getFontStyle = (scale = 1) => `${fontSize * scale}px/1 ${fontFace}`

export { getFontStyle, getTextSize }
