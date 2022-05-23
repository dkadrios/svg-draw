import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined'
import Crop54Icon from '@mui/icons-material/Crop54'
import ArrowRightAltSharpIcon from '@mui/icons-material/ArrowRightAltSharp'
import CreateIcon from '@mui/icons-material/Create'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import StraightenIcon from '@mui/icons-material/Straighten'
import SvgIcon from '@mui/material/SvgIcon'
import { TDToolType } from 'types'

const toolsList = [
  { type: TDToolType.Select, title: 'Select', Icon: TouchAppOutlinedIcon },
  { type: TDToolType.Rectangle, title: 'Rectangle', Icon: Crop54Icon },
  { type: TDToolType.Line, title: 'Line', Icon: ArrowRightAltSharpIcon },
  { type: TDToolType.FreeDraw, title: 'Free Drawing', Icon: CreateIcon },
  { type: TDToolType.Text, title: 'Text', Icon: TextFieldsIcon },
  { type: TDToolType.MeasureLine, title: 'Measure Distance', Icon: StraightenIcon },
]

export interface ToolRecord {
  type: TDToolType,
  title: string,
  Icon: typeof SvgIcon
}
export default toolsList
