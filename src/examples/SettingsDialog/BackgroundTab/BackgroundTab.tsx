import React, { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useStateManager } from 'state/useStateManager'
import type { BgImageScale } from 'types'
import { isEmpty } from 'utils'
import { CANVAS } from 'types'
import UploadImage from './UploadImage'
import ScaleForm from './ScaleForm'
import CanvasSizeForm from './CanvasSizeForm'

export interface BgTabMessages {
  distance?: string[]
  canvasWidth?: string[],
  canvasHeight?: string[],
}

export type OnImageChangeProps = { src?: string, size: number[], scale?: BgImageScale }

const defaultState = {
  src: '',
  originalSize: [CANVAS.widthDefault, CANVAS.heightDefault],
  size: [CANVAS.widthDefault, CANVAS.heightDefault],
  keepRatio: false,
  scale: {
    direction: 'horizontal',
    distance: 0,
    unit: 'px',
  } as BgImageScale,
}
export type BgTabState = typeof defaultState

const BackgroundTab = ({ onClose }: { onClose: () => void }) => {
  const [state, setState] = useState(defaultState)
  const stateManager = useStateManager()

  const getValidationMessages = () => {
    const newMessages: BgTabMessages = {}
    if (state.src && state.scale.distance <= 0) {
      newMessages.distance = ['Distance should be positive']
    }
    if (state.size[0] < CANVAS.widthMin) {
      newMessages.canvasWidth = [`Min canvas width is ${CANVAS.widthMin}`]
    }
    if (state.size[1] < CANVAS.heightMin) {
      newMessages.canvasHeight = [`Min canvas height is ${CANVAS.heightMin}`]
    }
    return newMessages
  }

  const updateState = (props: Partial<BgTabState>) => {
    setState({ ...state, ...props })
  }

  const clearState = () => setState(defaultState)

  const onImageChange = ({ src = '', size, scale }: OnImageChangeProps) =>
    setState({
      src,
      size,
      originalSize: size,
      keepRatio: true,
      scale: scale || { ...defaultState.scale, distance: size[0] },
    })

  const onScaleChange = (scale: BgImageScale) => setState({ ...state, scale })

  const setCanvasProps = () => {
    stateManager.setCanvasProps(state.size, state.src, state.scale)
    onClose()
  }

  useEffect(() => {
    onImageChange(stateManager.getCanvasProps())
  }, [stateManager])

  const messages = getValidationMessages()
  const isValid = isEmpty(messages)

  return (
    <Stack direction="column" spacing={3}>
      <UploadImage onClear={clearState} size={state.size} src={state.src} updateState={updateState} />
      <Divider />
      <Stack direction="row" spacing={5}>
        <CanvasSizeForm messages={messages} state={state} updateState={updateState} />
        <ScaleForm messages={messages} scale={state.scale} src={state.src} updateState={updateState} />
      </Stack>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <Button color="primary" disabled={!isValid} onClick={setCanvasProps} sx={{ mx: 2 }} variant="contained">Set BG Image</Button>
        <Button color="secondary" onClick={onClose} variant="contained">Cancel</Button>
      </Box>
    </Stack>
  )
}
export default BackgroundTab
