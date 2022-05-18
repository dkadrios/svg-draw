import React, { ChangeEvent } from 'react'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { ImageShape } from 'state/shapes/Image'
import { BgImageScale } from 'state/shapes/Image/ImageShape'
import { Unit } from 'types'
import type { ValidationMessages } from './BackgroundTab'

type Direction = 'horizontal' | 'vertical'

type ScaleFormProps = {
  image?: ImageShape,
  scale: BgImageScale,
  messages: ValidationMessages
  onChange: (scale: BgImageScale) => void
}

const ScaleForm = ({ image, scale, onChange, messages }: ScaleFormProps) => {
  const onDirectionChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...scale, direction: e.target.value as Direction })
  const onUnitsChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...scale, unit: e.target.value as Unit })
  const onDistanceChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...scale, distance: Number(e.target.value) })

  return (
    <Box sx={{ w: 300 }}>
      <FormControl disabled={!image} sx={{ mb: 3 }}>
        <FormLabel>Direction</FormLabel>
        <RadioGroup onChange={onDirectionChange} row value={scale.direction}>
          <FormControlLabel control={<Radio />} label="Horizontal" value="horizontal" />
          <FormControlLabel control={<Radio />} label="Vertical" value="vertical" />
        </RadioGroup>
      </FormControl>

      <Stack alignItems="start" direction="row" spacing={3}>
        <TextField
          disabled={!image}
          error={!!messages.distance}
          helperText={messages.distance}
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
    </Box>
  )
}

export default ScaleForm
