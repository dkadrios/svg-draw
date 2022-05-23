import React, { useState } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { TDToolType } from 'types'
import { useStateManager } from 'state/useStateManager'
import toolsList from '../../toolbarButtons'

const StudentsViewTab = () => {
  const stateManager = useStateManager()
  const { toolbar } = stateManager
  const { tools } = toolbar.getSettings()

  const onToggle = (id: TDToolType) => () =>
    toolbar.setSettings(id, !tools[id])

  const toolsToShow = toolsList.filter(item => tools[item.type])

  return (
    <Stack direction="row" spacing={5}>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {toolsList.map((item) => {
          const labelId = `checkbox-list-label-${item.type}`

          return (
            <ListItem disablePadding key={item.type}>
              <ListItemButton dense onClick={onToggle(item.type)} role={undefined}>
                <ListItemIcon>
                  <item.Icon />
                </ListItemIcon>
                <ListItemText id={labelId} primary={item.title} />
                <Switch
                  checked={tools[item.type]}
                  edge="end"
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      <Stack direction="column" spacing={3}>
        <Typography component="h3" variant="h6">
          Student's toolbar preview
        </Typography>
        <ToggleButtonGroup exclusive>
          {toolsToShow.map(item => (
            <ToggleButton key={item.type} title={item.title} value={item.type}>
              <item.Icon />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  )
}
export default StudentsViewTab
