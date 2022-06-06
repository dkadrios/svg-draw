import React, { ChangeEvent } from 'react'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { BgImageScale, Unit } from 'types'
import type { BgTabMessages, BgTabState } from './BackgroundTab'

type Direction = 'horizontal' | 'vertical'

type ScaleFormProps = {
  src: string,
  scale: BgImageScale,
  messages: BgTabMessages
  updateState: (props: Partial<BgTabState>) => void
}

const ScaleForm = ({ src, scale, updateState, messages }: ScaleFormProps) => {
  const onDirectionChange = (e: ChangeEvent<HTMLInputElement>) =>
    updateState({ scale: { ...scale, direction: e.target.value as Direction } })
  const onUnitsChange = (e: ChangeEvent<HTMLInputElement>) =>
    updateState({ scale: { ...scale, unit: e.target.value as Unit } })
  const onDistanceChange = (e: ChangeEvent<HTMLInputElement>) =>
    updateState({ scale: { ...scale, distance: Number(e.target.value) } })

  return (
    <Stack direction="column" spacing={3}>
      <Typography component="h2" variant="h6">
        Background Image Scale
      </Typography>
      <FormControl disabled={!src} sx={{ mb: 3 }}>
        <FormLabel>Direction</FormLabel>
        <RadioGroup onChange={onDirectionChange} row value={scale.direction}>
          <FormControlLabel control={<Radio />} label="Horizontal" value="horizontal" />
          <FormControlLabel control={<Radio />} label="Vertical" value="vertical" />
        </RadioGroup>
      </FormControl>

      <Stack alignItems="start" direction="row" spacing={3}>
        <TextField
          disabled={!src}
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
          disabled={!src}
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
    </Stack>
  )
}

export default ScaleForm
