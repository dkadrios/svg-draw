/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react'
import styled from '@emotion/styled'
import { ShapeStyleKeys, TDShapeType, TextShape, TransformedBounds } from 'types'
import { getFromCache, translateBounds, vec } from 'utils'
import { HTMLContainer } from 'core'
import ShapeUtil from './ShapeUtil'

type T = TextShape
type E = HTMLDivElement

const fontSize = 28
const fontFace = '"Source Sans Pro", sans-serif'

const getFontStyle = ({ scale = 1 }) => `${fontSize * scale}px/1 ${fontFace}`

class TextUtil extends ShapeUtil<T, E> {
  type = TDShapeType.Text as const

  canEdit = true

  isAspectRatioLocked = true

  shapeStyleKeys: ShapeStyleKeys = ['color']

  Component = ShapeUtil.Component<T, E>(({
    shape,
    isGhost,
    isEditing,
    events,
    onShapeBlur,
    onShapeChange,
  }, ref) => {
    const { styles, text } = shape
    const rInput = React.useRef<HTMLTextAreaElement>(null)

    const handlePointerDown = React.useCallback(
      (e) => { if (isEditing) e.stopPropagation() },
      [isEditing],
    )

    React.useEffect(() => {
      if (!isEditing) onShapeBlur?.()
      requestAnimationFrame(() => {
        const elm = rInput.current
        if (elm) {
          elm.focus()
          elm.select()
        }
      })
    }, [isEditing, onShapeBlur])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Escape') {
        onShapeChange?.(shape, { reset: true })
      }
      if (e.key === 'Tab' || (e.key === 'Enter' && e.metaKey)) {
        onShapeBlur?.({ text: e.currentTarget.value })
        e.stopPropagation()
        e.preventDefault()
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onShapeChange?.(shape, { text: e.currentTarget.value })
    }

    return (
      <HTMLContainer ref={ref} {...events}>
        <Wrapper isEditing={isEditing} isGhost={isGhost} onPointerDown={handlePointerDown}>
          <InnerWrapper
            isEditing={isEditing}
            style={{
              font: getFontStyle(styles),
              color: shape.styles.color,
            }}
          >
            {isEditing ? (
              <TextArea
                autoCapitalize="false"
                autoComplete="false"
                autoCorrect="false"
                autoFocus
                autoSave="false"
                datatype="wysiwyg"
                defaultValue={text}
                dir="auto"
                name="text"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onPointerDown={handlePointerDown}
                placeholder=""
                ref={rInput}
                spellCheck="true"
                tabIndex={-1}
                wrap="off"
              />
            ) : (
              text
            )}
            &#8203;
          </InnerWrapper>
        </Wrapper>
      </HTMLContainer>
    )
  })

  Indicator = ShapeUtil.Indicator<T>(({ shape }) => {
    const { height, width } = this.getBounds(shape)
    return <rect height={height} width={width} x={0} y={0} />
  })

  getBounds = (shape: T) => {
    const bounds = getFromCache(this.boundsCache, shape, () => {
      if (!melm) {
        return { minX: 0, minY: 0, maxX: 10, maxY: 10, width: 10, height: 10 }
      }

      melm.textContent = shape.text || '&#8203;'
      melm.style.font = getFontStyle(shape.styles)

      // In tests, offsetWidth and offsetHeight will be 0
      const width = melm.offsetWidth || 1
      const height = melm.offsetHeight || 1

      return {
        minX: 0,
        maxX: width,
        minY: 0,
        maxY: height,
        width,
        height,
      }
    })

    return translateBounds(bounds, shape.point)
  }

  transform(shape: TextShape, newBounds: TransformedBounds) {
    const { styles: { scale = 1 } } = shape
    const bounds = this.getBounds(shape)

    return {
      point: vec.toFixed([bounds.minX, bounds.minY]),
      styles: {
        ...shape.styles,
        scale: scale * Math.max(Math.abs(newBounds.scaleY), Math.abs(newBounds.scaleX)),
      },
    }
  }
}

let melm: HTMLPreElement
function getMeasurementDiv() {
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

type WrapperProps = {
  isGhost?: boolean,
  isEditing?: boolean
}

const Wrapper = styled.div<WrapperProps>({
  width: '100%',
  height: '100%',
}, ({ isGhost, isEditing }) => ({
  opacity: isGhost ? 0.5 : 1,
  pointerEvents: isEditing ? 'none' : 'all',
  userSelect: isEditing ? 'none' : 'all',
}))

type InnerWrapperProps = {
  isEditing: boolean
}

const InnerWrapper = styled.div<InnerWrapperProps>({
  position: 'absolute',
  width: '100%',
  height: '100%',
  padding: '4px',
  zIndex: 1,
  minHeight: 1,
  minWidth: 1,
  lineHeight: 1,
  outline: 0,
  fontWeight: '500',
  backfaceVisibility: 'hidden',
  WebkitTouchCallout: 'none',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
}, props => ({
  userSelect: props.isEditing ? 'text' : 'none',
  pointerEvents: props.isEditing ? 'all' : 'none',
  background: props.isEditing ? 'rgba(65, 132, 244, 0.05)' : 'none',
  WebkitUserSelect: props.isEditing ? 'text' : 'none',
}))

const TextArea = styled.textarea`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  font: inherit;
  color: inherit;
  width: 100%;
  height: 100%;
  border: none;
  padding: 4px;
  resize: none;
  text-align: inherit;
  min-height: inherit;
  min-width: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  outline: 0;
  overflow: hidden;
  backface-visibility: hidden;
  display: inline-block;
  pointer-events: all;
  background-color: rgba(65, 132, 244, 0.05);
  user-select: text;
  webkit-user-select: text;
  white-space: pre-wrap;
  overflow-wrap: break-word
`

export default TextUtil
