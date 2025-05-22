import { FunctionComponent, useContext, useState } from "react"
import GlobalContext from "../../../context/GlobalContext"
import { useAuth } from "@/context/auth"
// import { IconContext } from "react-icons";
// import { BsFillPlayCircleFill, BsPauseCircleFill } from "react-icons/bs";

interface PlayerOverlayProps {
  // eslint-disable-next-line @typescript-eslint/ban-types
  handleReportAProblemWizard: Function
  sentfrom: string
}

const PlayerOverlay: FunctionComponent<PlayerOverlayProps> = ({
  handleReportAProblemWizard,
  sentfrom = "ReportAProblem",
}) => {
  const { isAuthenticated } = useAuth()
  return (
    (sentfrom = "ReportAProblem"),
    (
      <div className="player-overlay-wrapper">
        {isAuthenticated && (
          <div className="player-overlay-report-problem cursor-pointer">
            <a onClick={() => handleReportAProblemWizard()}>Report a Problem</a>
          </div>
        )}
      </div>
    )
  )
}

export default PlayerOverlay
