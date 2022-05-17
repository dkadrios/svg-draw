import React, { ChangeEvent, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Popover from '@mui/material/Popover'
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import type { Unit } from 'types'
import { useStateManager } from 'state/useStateManager'
import { TDShapeType } from 'types'
import { ImageShape } from '../../state/shapes/Image'
import { BgImageScale } from '../../state/shapes/Image/ImageShape'
import UploadImage from './UploadImage'

type Direction = 'horizontal' | 'vertical'

const BackgroundImage = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [image, setImage] = useState(null as null | ImageShape)
  const [scale, setScale] = useState({
    direction: 'horizontal',
    distance: 0,
    unit: 'px',
  } as BgImageScale)
  const stateManager = useStateManager()
  const page = stateManager.getPage()
  const open = Boolean(anchorEl)

  const onOpen = (event: React.BaseSyntheticEvent) => setAnchorEl(event.currentTarget)
  const onClose = () => setAnchorEl(null)
  const onImageChange = (shape: null | ImageShape) => setImage(shape)

  const onDirectionChange = (e: ChangeEvent<HTMLInputElement>) =>
    setScale({ ...scale, direction: e.target.value as Direction })
  const onUnitsChange = (e: ChangeEvent<HTMLInputElement>) =>
    setScale({ ...scale, unit: e.target.value as Unit })
  const onDistanceChange = (e: ChangeEvent<HTMLInputElement>) =>
    setScale({ ...scale, distance: Number(e.target.value) })

  const createImage = () => {
    if (!image) return

    const imageToAdd = image.produce({
      childIndex: page.getMinChildIndex() - 1,
      isBackground: true,
      scale,
    })

    const prevImage = page.find({ type: TDShapeType.Image, isBackground: true })
    if (prevImage) page.removeShape(prevImage.id)

    page.addShape(imageToAdd)
    stateManager.setSelected(imageToAdd.id)
    onClose()
  }

  // TODO: validation
  return (
    <>
      <Button onClick={onOpen} variant="outlined">
        <InsertPhotoOutlinedIcon />
      </Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={() => onClose()}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ width: 400, p: 3 }}>
          <Stack direction="column" spacing={1}>
            <UploadImage image={image} onChange={onImageChange} />

            <Typography component="h2" variant="subtitle1">
              Background Image Scale
            </Typography>

            <FormControl disabled={!image}>
              <FormLabel>Direction</FormLabel>
              <RadioGroup onChange={onDirectionChange} row value={scale.direction}>
                <FormControlLabel control={<Radio />} label="Horizontal" value="horizontal" />
                <FormControlLabel control={<Radio />} label="Vertical" value="vertical" />
              </RadioGroup>
            </FormControl>

            <Stack alignItems="end" direction="row" spacing={2}>
              <TextField
                disabled={!image}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                label="Distance"
                onChange={onDistanceChange}
                size="small"
                type="number"
                value={scale.distance.toString()}
                variant="standard"
              />
              <TextField
                disabled={!image}
                label="Units"
                onChange={onUnitsChange}
                select
                SelectProps={{ native: true }}
                size="small"
                sx={{ w: '50%' }}
                value={scale.unit}
                variant="standard"
              >
                <option key="px" value="px">Pixels</option>
                <option key="mi" value="mi">Miles</option>
                <option key="ft" value="ft">Feet</option>
                <option key="km" value="km">Kilometers</option>
                <option key="m" value="m">Meters</option>
              </TextField>
            </Stack>
            <Button color="primary" disabled={!image} onClick={createImage}>Add Background Image</Button>
          </Stack>
        </Box>
      </Popover>
    </>
  )
}
export default BackgroundImage
