// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Stack from '@mui/material/Stack'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import CreateIcon from '@mui/icons-material/Create'
import Crop54Icon from '@mui/icons-material/Crop54'
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined'
import ArrowRightAltSharpIcon from '@mui/icons-material/ArrowRightAltSharp'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import StraightenIcon from '@mui/icons-material/Straighten'
import BorderClearIcon from '@mui/icons-material/BorderClear'
import { useStateManager } from 'state/useStateManager'
import { TDToolType } from '../types'
import StylesSelector from './StylesSelector'
import BackgroundImage from './BackgroundImage/BackgroundImage'

const Toolbar = () => {
  const stateManager = useStateManager()
  const [toolbarState, setToolbarState] = useState(stateManager.toolbar.state)

  useEffect(() => {
    stateManager.toolbar.subscribe(setToolbarState)
    return () => stateManager.toolbar.unsubscribe(setToolbarState)
  }, [stateManager.toolbar])

  const { hideGrid } = stateManager.getSettings()

  const onToolChange = (e: React.BaseSyntheticEvent, value: TDToolType) => {
    stateManager.setTool(value)
  }

  const handleShowGridChange = () => {
    stateManager.setSettings({ hideGrid: !hideGrid })
  }

  return (
    <Box m="auto" p={1} width="fit-content">
      <AppBar color="transparent" position="static">
        <Stack direction="row" spacing={4}>
          <ToggleButtonGroup exclusive onChange={onToolChange} value={toolbarState.tool}>
            <ToggleButton title="Select Tool" value={TDToolType.Select}>
              <TouchAppOutlinedIcon />
            </ToggleButton>
            <ToggleButton title="Rectangle Tool" value={TDToolType.Rectangle}>
              <Crop54Icon />
            </ToggleButton>
            <ToggleButton title="Line Tool" value={TDToolType.Line}>
              <ArrowRightAltSharpIcon />
            </ToggleButton>
            <ToggleButton title="Pencil Tool" value={TDToolType.FreeDraw}>
              <CreateIcon />
            </ToggleButton>
            <ToggleButton title="Text Tool" value={TDToolType.Text}>
              <TextFieldsIcon />
            </ToggleButton>
            <ToggleButton title="Measure Tool" value={TDToolType.MeasureLine}>
              <StraightenIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButton onChange={handleShowGridChange} selected={!hideGrid} title="Toggle Grid" value="check">
            <BorderClearIcon />
          </ToggleButton>

          <BackgroundImage />

          <StylesSelector />
        </Stack>
      </AppBar>
    </Box>
  )
}
export default Toolbar
