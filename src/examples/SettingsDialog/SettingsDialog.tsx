import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import BackgroundTab from './BackgroundTab'
import StudentsView from './StudentsViewTab/StudentsViewTab'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, index, value, ...other } = props

  return (
    <div
      aria-labelledby={`simple-tab-${index}`}
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      role="tabpanel"
      {...other}
    >
      {value === index && children}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const SettingsDialog = () => {
  const [open, setOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)
  const onChange = (event: React.SyntheticEvent, val: number) => setCurrentTab(val)

  return (
    <>
      <Button onClick={onOpen} variant="outlined">
        <SettingsIcon />
      </Button>
      <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
        <DialogTitle>
          Settings
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs aria-label="basic tabs example" onChange={onChange} value={currentTab}>
              <Tab label="Background Image" {...a11yProps(0)} />
              <Tab label="Student View" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <Box sx={{ my: 3 }}>
            <TabPanel index={0} value={currentTab}>
              <BackgroundTab onClose={onClose} />
            </TabPanel>
            <TabPanel index={1} value={currentTab}>
              <StudentsView />
            </TabPanel>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default SettingsDialog
