import { Term } from '../models/Course'
import { utils } from '../utils'
import './css/TermHeader.css'

interface TermHeaderProps {
  term: Term;
}

export const TermHeader: React.FC<TermHeaderProps> = ({term}) => {
  return (
    <div className="term-header">
      <span className="term-info">{term.term}</span>
      <span className="term-units">Total Units: {utils.getTotalUnits(term)}</span>
    </div>
  )
}