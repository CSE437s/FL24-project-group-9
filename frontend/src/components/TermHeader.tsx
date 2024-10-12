import { Semester } from '../models/Semester'
import { utils } from '../utils'

import './css/TermHeader.css'

interface TermHeaderProps {
  semester: Semester
}

export const TermHeader: React.FC<TermHeaderProps> = ({ semester }) => {
  return (
    <div className="term-header">
      <span className="term-info">{semester.name}</span>
      <span className="term-units">
        Total Units: {utils.getTotalUnits(semester)}
      </span>
    </div>
  )
}
