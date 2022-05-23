// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Stack from '@mui/material/Stack'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import BorderClearIcon from '@mui/icons-material/BorderClear'
import { useStateManager } from 'state/useStateManager'
import { TDToolType } from 'types'
import StylesSelector from './StylesSelector'
import SettingsDialog from './SettingsDialog/SettingsDialog'
import toolsList, { ToolRecord } from './toolbarButtons'

interface ToolbarBtnProps extends ToolRecord {
  isVisible: boolean,
}

const toolbarButton = ({ title, type, Icon, isVisible }: ToolbarBtnProps) => {
  if (!isVisible) return null
  return (
    <ToggleButton key={type} title={title} value={type}>
      <Icon />
    </ToggleButton>
  )
}

const Toolbar = () => {
  const stateManager = useStateManager()
  const { toolbar } = stateManager
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
            {toolsList.map(tool => toolbarButton({
              isVisible: toolbar.isVisible(tool.type),
              ...tool,
            }))}
          </ToggleButtonGroup>

          <ToggleButton onChange={handleShowGridChange} selected={!hideGrid} title="Toggle Grid" value="check">
            <BorderClearIcon />
          </ToggleButton>

          <SettingsDialog />

          <StylesSelector />
        </Stack>
      </AppBar>
    </Box>
  )
}
export default Toolbar
