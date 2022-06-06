import React, { ChangeEvent, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { BgTabMessages, BgTabState } from './BackgroundTab'

type ScaleFormProps = {
  state: BgTabState,
  updateState: (props: Partial<BgTabState>) => void,
  messages: BgTabMessages,
}

const CanvasSizeForm = ({ updateState, state: { keepRatio, src, size, originalSize }, messages }: ScaleFormProps) => {
  const onRatioChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (keepRatio) {
      updateState({ keepRatio: false })
      return
    }
    updateState({ keepRatio: true, originalSize: size })
  }

  const onWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Math.round(Number(e.target.value))
    if (!keepRatio) {
      updateState({ size: [val, size[1]] })
    }
    const newHeight = Math.round(originalSize[1] * (val / originalSize[0]))
    updateState({ size: [val, newHeight] })
  }

  const onHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Math.round(Number(e.target.value))
    if (!keepRatio) {
      updateState({ size: [size[0], val] })
    }
    const newWidth = Math.round(originalSize[0] * (val / originalSize[1]))
    updateState({ size: [newWidth, val] })
  }

  return (
    <Stack direction="column" spacing={3} sx={{ w: 600 }}>
      <Typography component="h2" variant="h6">
        Canvas Size
      </Typography>
      <FormControlLabel
        control={
          <Checkbox checked={keepRatio} disabled={!src} onChange={onRatioChange} />
        }
        label="Keep Aspect Ratio"
      />
      <TextField
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        label="Width"
        onChange={onWidthChange}
        size="small"
        type="number"
        value={size[0]}
        variant="standard"
      />
      <TextField
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        label="Height"
        onChange={onHeightChange}
        size="small"
        type="number"
        value={size[1]}
        variant="standard"
      />
    </Stack>
  )
}

export default CanvasSizeForm
