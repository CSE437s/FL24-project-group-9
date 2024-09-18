import HeaderBar from "../components/HeaderBar";
import { ScheduleBlock } from "../components/ScheduleBlock";
import './SchedulerPage.css'

export default function SchedulerPage() {
  return (
    <>
      <HeaderBar />
      <div className="scheduler-page">
        <ScheduleBlock />
      </div>
    </>
  );
}