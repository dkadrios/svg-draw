import React, { useState } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CreateIcon from '@mui/icons-material/Create'
import Crop54Icon from '@mui/icons-material/Crop54'
import ArrowRightAltSharpIcon from '@mui/icons-material/ArrowRightAltSharp'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import StraightenIcon from '@mui/icons-material/Straighten'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import ToggleButton from '@mui/material/ToggleButton'
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { TDShapeType, TDToolType } from 'types'

const toolsList = [
  { id: TDShapeType.Rectangle, title: 'Rectangle', icon: Crop54Icon },
  { id: TDShapeType.Line, title: 'Line', icon: ArrowRightAltSharpIcon },
  { id: TDShapeType.FreeDraw, title: 'Free Drawing', icon: CreateIcon },
  { id: TDShapeType.Text, title: 'Text', icon: TextFieldsIcon },
  { id: TDShapeType.MeasureLine, title: 'Measure Distance', icon: StraightenIcon },
]

interface ToolSettings {
  create: boolean // whether to show a shape toolbar button
}

type StudentSettings = {
  [key in TDShapeType]?: ToolSettings
}

const initialSettings: StudentSettings = (
  toolsList.reduce((acc, item) => ({ ...acc, [item.id]: { create: true } }), {}))

const StudentsViewTab = () => {
  const [settings, setSettings] = useState(initialSettings)

  const onToggle = (id: TDShapeType) => () =>
    setSettings({ ...settings, ...settings, [id]: { create: !settings[id]?.create } })

  const toolsToShow = toolsList.filter(item => settings[item.id]?.create)

  return (
    <Stack direction="row" spacing={5}>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {toolsList.map((item) => {
          const labelId = `checkbox-list-label-${item.id}`

          return (
            <ListItem disablePadding key={item.id}>
              <ListItemButton dense onClick={onToggle(item.id)} role={undefined}>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText id={labelId} primary={item.title} />
                <Switch
                  checked={settings[item.id]?.create}
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
          <ToggleButton title="Select Tool" value={TDToolType.Select}>
            <TouchAppOutlinedIcon />
          </ToggleButton>
          {toolsToShow.map(item => (
            <ToggleButton title={item.title} value={item.id}>
              <item.icon />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  )
}
export default StudentsViewTab
