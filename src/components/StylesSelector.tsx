import React, { useSyncExternalStore } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Stack from '@mui/material/Stack'
import Popover from '@mui/material/Popover'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Crop54Icon from '@mui/icons-material/Crop54TwoTone'
import { useStateManager } from 'state/useStateManager'

const variants = [
  { name: 'black', color: '#000000', fill: 'transparent' },
  { name: 'blue', color: '#1c7ed6', fill: '#d2e4f4' },
  { name: 'red', color: '#ff2133', fill: '#fbd3d6' },
  { name: 'green', color: '#36b24d', fill: '#d7eddb' },
]

const sizes = [
  { name: 'small', size: 'S' },
  { name: 'medium', size: 'M' },
  { name: 'large', size: 'L' },
]

const StylesSelector = () => {
  const stateManager = useStateManager()
  const { toolbar } = stateManager
  const { styles: { color, fill, size } } = useSyncExternalStore(toolbar.subscribe, () => toolbar.state)

  const getCurrentVariant = () => variants.find(item => item.color === color) || null
  const isFill = !(fill === 'transparent')
  const variant = getCurrentVariant()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = (event: React.BaseSyntheticEvent) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const open = Boolean(anchorEl)

  const onChangeVariant = (e: React.BaseSyntheticEvent) => {
    const newVariant = variants.find(item => item.name === e.currentTarget.value)
    if (!newVariant) return
    stateManager.handleStylesChange({
      color: newVariant.color,
      fill: isFill ? newVariant.fill : 'transparent',
    })
  }

  const onChangeFill = (e: React.BaseSyntheticEvent) => {
    const currentVariant = getCurrentVariant()
    if (!currentVariant) return

    stateManager.handleStylesChange({
      fill: e.currentTarget.checked ? currentVariant.fill : 'transparent',
    })
  }

  const onChangeSize = (e: React.BaseSyntheticEvent) => {
    stateManager.handleStylesChange({
      size: e.currentTarget.value,
    })
  }

  return (
    <>
      <Button
        color="primary"
        onClick={handleClick}
        variant="outlined"
      >
        Styles
      </Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleClose}
        open={open}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Stack direction="column" spacing={1}>
            <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={4}>
              Color
              <ToggleButtonGroup exclusive onChange={onChangeVariant} value={variant?.name}>
                {Object.values(variants).map(item => (
                  <ToggleButton key={item.name} value={item.name}>
                    <Crop54Icon style={{ color: item.color }} />
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
            <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={4}>
              Fill
              <Switch checked={isFill} onChange={onChangeFill} size="small" />
            </Stack>
            <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={4}>
              Size
              <ToggleButtonGroup exclusive onChange={onChangeSize} value={size}>
                {Object.values(sizes).map(item => (
                  <ToggleButton key={item.name} size="small" value={item.size}>{item.size}</ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          </Stack>
        </Box>
      </Popover>
    </>
  )
}
export default StylesSelector
