import { useAcademicDataContext } from '../context/useContext'
import { Semester } from '../models/Semester'
import { utils } from '../utils'

import './css/TermHeader.css'

interface TermHeaderProps {
  semester: Semester
}

export const TermHeader: React.FC<TermHeaderProps> = ({ semester }) => {
  const { courses } = useAcademicDataContext()

  return (
    <div className="term-header">
      <span className="term-info">{semester.name}</span>
      <span className="term-units">
        Total Units: {utils.getTotalUnits(semester, courses)}
      </span>
    </div>
  )
}
