import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Popover from '@mui/material/Popover'
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined'
import { useStateManager } from 'state/useStateManager'

const ImageUploadButton = () => {
  const [url, setUrl] = React.useState('')
  const [anchorEl, setAnchorEl] = React.useState(null)
  const stateManager = useStateManager()
  const open = Boolean(anchorEl)

  const handleOpen = (event: React.BaseSyntheticEvent) => {
    setAnchorEl(event.currentTarget)
    setUrl('')
  }
  const handleClose = () => setAnchorEl(null)
  const handleChangeUrl = (e: React.BaseSyntheticEvent) => setUrl(e.currentTarget.value)

  const handleAddImageByUrl = (e: React.BaseSyntheticEvent) => {
    stateManager.addImageByUrl(url)
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
