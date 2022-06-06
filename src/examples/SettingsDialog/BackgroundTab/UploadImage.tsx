import React, { useState } from 'react'
import styled from '@emotion/styled'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import { fileToBase64, getImageSizeFromSrc } from 'state/shapes/Image/utils'
import type { BgTabState } from './BackgroundTab'

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

const PreviewImg = ({ src, size }: {src: string, size: number[] }) => {
  const Component = size[0] / size[1] >= 1.5 ? PreviewImgWidth : PreviewImgHeight
  return (
    <Component alt="" src={src} />
  )
}

interface BackgroundImageUploadProps {
  src: string,
  size: number[],
  onClear: () => void,
  updateState: (props: Partial<BgTabState>) => void
}

const BackgroundImage = ({ updateState, src, size, onClear }: BackgroundImageUploadProps) => {
  const [url, setUrl] = useState('')

  const onChangeUrl = (e: React.BaseSyntheticEvent) => setUrl(e.currentTarget.value)
  const onDragOver = (e: React.BaseSyntheticEvent) => e.preventDefault()

  const onAddImageByUrl = async (urlToAdd: string) => {
    if (!urlToAdd) return
    const nSize = await getImageSizeFromSrc(urlToAdd)
    setUrl('')
    updateState({
      src,
      size: nSize,
      originalSize: nSize,
      keepRatio: true,
    })
  }

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    if (!e.dataTransfer.files?.length) return

    const nSrc = await fileToBase64(e.dataTransfer.files[0])
    await onAddImageByUrl(nSrc || '')
  }

  return (
    <Stack alignItems="flex-start" direction="row" spacing={3}>
      <PreviewBox onDragOver={onDragOver} onDrop={onDrop}>
        {src && (
          <PreviewImgWrapper>
            <PreviewImg size={size} src={src} />
            <CloseBtn color="info" onClick={onClear} size="small" variant="contained">
              <CloseIcon />
            </CloseBtn>
          </PreviewImgWrapper>
        )}
        {!src && (
          <PreviewTextWrapper>
            <p>D'n'D a background picture here...</p>
            <CloudDownloadIcon />
          </PreviewTextWrapper>
        )}
      </PreviewBox>
      <Stack direction="column" spacing={1}>
        <TextField label="URL" onChange={onChangeUrl} placeholder="paste URL here" size="small" value={url} variant="outlined" />
        <Button onClick={() => onAddImageByUrl(url)} size="small" variant="outlined">
          Or Add by URL
        </Button>
      </Stack>
    </Stack>
  )
}
export default BackgroundImage
