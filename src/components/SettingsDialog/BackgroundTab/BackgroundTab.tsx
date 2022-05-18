import React, { useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useStateManager } from 'state/useStateManager'
import { ImageShape } from 'state/shapes/Image'
import { BgImageScale } from 'state/shapes/Image/ImageShape'
import { isEmpty } from '../../../utils'
import UploadImage from './UploadImage'
import ScaleForm from './ScaleForm'

const defaultScale: BgImageScale = {
  direction: 'horizontal',
  distance: 0,
  unit: 'px',
}

export interface ValidationMessages {
  distance?: string[]
}

const BackgroundTab = () => {
  const [image, setImage] = useState(undefined as undefined | ImageShape)
  const [scale, setScale] = useState(defaultScale as BgImageScale)

  const stateManager = useStateManager()
  const createImage = () => {
    if (!image) return
    stateManager.createBackgroundImage(image, scale)
  }

  const getValidationMessages = () => {
    const newMessages: ValidationMessages = {}
    if (image && scale.distance <= 0) {
      newMessages.distance = ['Distance should be positive']
    }
    return newMessages
  }

  const onImageChange = (shape?: ImageShape) => {
    setImage(shape)
    if (shape) {
      setScale({ ...defaultScale, distance: shape.size[0] })
    }
  }
  const onScaleChange = (val: BgImageScale) => {
    setScale(val)
  }

  const messages = getValidationMessages()
  const isValid = isEmpty(messages)

  return (
    <Stack direction="column" spacing={3}>
      <UploadImage image={image} onChange={onImageChange} />
      <Divider />
      <Typography component="h2" variant="h6">
        Background Image Scale
      </Typography>
      <ScaleForm image={image} messages={messages} onChange={onScaleChange} scale={scale} />
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <Button color="primary" disabled={!image || !isValid} onClick={createImage} variant="contained">Set Background Image</Button>
      </Box>
    </Stack>
  )
}
export default BackgroundTab
