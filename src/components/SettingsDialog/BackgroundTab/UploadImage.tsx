import React, { useState } from 'react'
import styled from '@emotion/styled'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import { useStateManager } from 'state/useStateManager'
import { ImageShape } from '../../../state/shapes/Image'

const PreviewBox = styled(Box)`
  text-align: center;
  width: 300px;
`

const PreviewImgWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: auto;
  margin: auto;
`

const PreviewImgWidth = styled.img`
  display: block;
  max-width: 300px;
  height: auto;
`

const PreviewImgHeight = styled.img`
  display: block;
  max-height: 200px;
  width: auto;
`

const PreviewTextWrapper = styled.div`
  width: 300px;
  height: 200px;
  border: 1px solid;
  padding: 6px;
`

const CloseBtn = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0;
  min-width: auto;
`

const PreviewImg = ({ image }: {image: null | ImageShape }) => {
  if (!image) return null

  const Component = image.size[0] / image.size[1] >= 1.5 ? PreviewImgWidth : PreviewImgHeight
  return (
    <Component alt="" src={image.src} />
  )
}

interface BackgroundImageUploadProps {
  image?: ImageShape,
  onChange: (shape?: ImageShape) => void
}

const BackgroundImage = ({ onChange, image }: BackgroundImageUploadProps) => {
  const [url, setUrl] = useState('')
  const stateManager = useStateManager()

  const onChangeUrl = (e: React.BaseSyntheticEvent) => setUrl(e.currentTarget.value)
  const onDragOver = (e: React.BaseSyntheticEvent) => e.preventDefault()
  const onImageClear = () => onChange()

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    if (!e.dataTransfer.files?.length) return

    const shape = await ImageShape.createImageShapeFromFile(
      e.dataTransfer.files[0],
      stateManager.getCenterPoint(),
      { isBackground: true },
    )
    onChange(shape)
  }

  const handleAddImageByUrl = async () => {
    const shape = await ImageShape.createImageShapeFromUrl(url, stateManager.getCenterPoint())
    setUrl('')
    onChange(shape)
  }

  return (
    <Stack alignItems="flex-start" direction="row" spacing={3}>
      <PreviewBox onDragOver={onDragOver} onDrop={onDrop}>
        {image && (
          <PreviewImgWrapper>
            <PreviewImg image={image} />
            <CloseBtn color="info" onClick={onImageClear} size="small" variant="contained">
              <CloseIcon />
            </CloseBtn>
          </PreviewImgWrapper>
        )}
        {!image && (
          <PreviewTextWrapper>
            <p>D'n'D a background picture here...</p>
            <CloudDownloadIcon />
          </PreviewTextWrapper>
        )}
      </PreviewBox>
      <Stack direction="column" spacing={1}>
        <TextField label="URL" onChange={onChangeUrl} placeholder="paste URL here" size="small" value={url} variant="outlined" />
        <Button onClick={handleAddImageByUrl} size="small" variant="outlined">
          Or Add by URL
        </Button>
      </Stack>
    </Stack>
  )
}
export default BackgroundImage
