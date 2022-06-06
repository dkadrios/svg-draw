import * as React from 'react'
import styled from '@emotion/styled'
import { HTMLContainer, TLComponentProps, TLIndicatorProps, TLPointerEvent, TLShapeUtil } from 'core'
import TextShape from './TextShape'

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

type T = TextShape

class TextUtil extends TLShapeUtil<T> {
  Component = ({
    shape,
    isGhost,
    isEditing,
    events,
    onShapeBlur,
    onShapeChange,
  }: TLComponentProps<T>) => {
    const { text } = shape
    const rInput = React.useRef<HTMLTextAreaElement>(null)

    const handlePointerDown = React.useCallback(
      (e: TLPointerEvent) => { if (isEditing) e.stopPropagation() },
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onShapeChange?.({ reset: true })
      }
      if (e.key === 'Tab' || (e.key === 'Enter' && e.metaKey)) {
        onShapeBlur?.()
        e.stopPropagation()
        e.preventDefault()
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onShapeChange?.({ text: e.currentTarget.value })
    }

    return (
      <HTMLContainer {...events}>
        <Wrapper isEditing={isEditing} isGhost={isGhost} onPointerDown={handlePointerDown}>
          <InnerWrapper
            isEditing={isEditing}
            style={{
              font: shape.getFontStyle(),
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
  }

  Indicator = ({ shape }: TLIndicatorProps<T>) => {
    const { height, width } = shape.getBounds()
    return <rect height={height} width={width} x={0} y={0} />
  }
}

export default new TextUtil()
