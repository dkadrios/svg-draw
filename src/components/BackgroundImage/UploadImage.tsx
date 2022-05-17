import React, { useState } from 'react'
import styled from '@emotion/styled'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import { useStateManager } from 'state/useStateManager'
import { ImageShape } from '../../state/shapes/Image'

interface BackgroundImageUploadProps {
  image: null | ImageShape,
  onChange: (shape: null | ImageShape) => void
}

const PreviewBox = styled(Box)`
  border: 1px solid;
  width: max-content;
  max-width: 200px;
  max-height: 200px;
  text-align: center;
  height: auto;
`

const PreviewImgWrapper = styled.div`
  position: relative;
  line-height: 0;
`

const PreviewTextWrapper = styled.div`
  padding: 6px;
`

const PreviewImg = styled.img`
  width: 100%;
`

const CloseBtn = styled(Button)`
  position: absolute;
  right: 0;
  padding: 0;
  min-width: auto;
`

const BackgroundImage = ({ onChange, image }: BackgroundImageUploadProps) => {
  const [url, setUrl] = useState('')
  const stateManager = useStateManager()

  const onChangeUrl = (e: React.BaseSyntheticEvent) => setUrl(e.currentTarget.value)
  const onDragOver = (e: React.BaseSyntheticEvent) => e.preventDefault()
  const onImageClear = () => onChange(null)

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
    <Stack alignItems="flex-start" direction="row" spacing={1}>
      <PreviewBox onDragOver={onDragOver} onDrop={onDrop}>
        {image && (
          <PreviewImgWrapper>
            <PreviewImg alt="" src={image.src} />
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
          Add by URL
        </Button>
      </Stack>
    </Stack>
  )
}
export default BackgroundImage
