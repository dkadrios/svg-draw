import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Popover from '@mui/material/Popover'
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined'
import { useStateManager } from 'state/useStateManager'
import { ImageShape } from '../state/shapes/Image'

const ImageUploadButton = () => {
  const [url, setUrl] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const stateManager = useStateManager()
  const open = Boolean(anchorEl)

  const handleOpen = (event: React.BaseSyntheticEvent) => {
    setAnchorEl(event.currentTarget)
    setUrl('')
  }
  const handleClose = () => setAnchorEl(null)
  const handleChangeUrl = (e: React.BaseSyntheticEvent) => setUrl(e.currentTarget.value)

  // TODO: move this to some kind of service
  const handleAddImageByUrl = async () => {
    try {
      const shape = await ImageShape.createImageShapeFromUrl(url, stateManager.getCenterPoint())
      stateManager.addShape(shape)
    } catch (e) {
      console.warn((e as Error).message)
    }
    handleClose()
  }

  return (
    <>
      <Button onClick={handleOpen} variant="outlined">
        <InsertPhotoOutlinedIcon />
      </Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={() => handleClose()}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ width: 400, p: 2, textAlign: 'center' }}>
          <Stack direction="column" spacing={1}>
            <Stack direction="row" spacing={4}>
              <TextField label="Paste URL" onChange={handleChangeUrl} placeholder="Image URL" size="small" value={url} variant="outlined" />
              <Button onClick={handleAddImageByUrl} size="small">Add Image by URL</Button>
            </Stack>
          </Stack>
        </Box>
      </Popover>
    </>
  )
}
export default ImageUploadButton
