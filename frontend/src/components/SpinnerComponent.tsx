import { useEffect, useState } from 'react';
import './css/SpinnerComponent.css'

interface SpinnerProps {
  messages: string[]
}

export const SpinnerComponent: React.FC<SpinnerProps> = ({messages}) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);
  
  return (
    <div className="planner-page">
      <section className="spinner-container">
        <div className="spinner"></div>
        <div className="spinner-label">{messages[messageIndex]}</div>
      </section>
    </div>
  )
}