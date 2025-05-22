import { FC, FormEvent, useEffect, useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { StepWizardChildProps } from "react-step-wizard"
import { useForm } from "react-hook-form"

import { ClipDetails } from "../../../types/ClipDetails"
import { GameTeams } from "../../../types/ReportAProblemTeamDetails"
import ReportProblemInMatchPlayers from "../../shared/ReportProblemInMatchPlayers"
import { useAuth } from "@/context/auth"
import { FaExclamationTriangle } from "react-icons/fa"

const ReportBatterProblemInClip: FC<any> = (props) => {
  const tabTitle = "Fix the Batter"
  const wizardProps = props as StepWizardChildProps
  const clipDetails = props.clipDetails as ClipDetails
  const [gameTeams, setGameTeams] = useState<GameTeams>({} as GameTeams)
  const { user } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "all",
  })

  useEffect(() => {
    if (wizardProps.isActive) {
      props.handleTabChange(tabTitle)
      props
        .loadTeamsPlayersByType("all")
        .then((teams: GameTeams) => setGameTeams(teams))
    }
  }, [wizardProps.isActive])

  const [validationMessage, setValidationMessage] = useState("")

  const handleValueChange = () => {
    if (validationMessage !== "") {
      setValidationMessage("")
    }
  }

  const submitClickHandler = (formData: any) => {
    if (formData.playerDetail === null) {
      setValidationMessage(
        'Please select a batter from the list or select "Unknown" or "Other"'
      )
      return
    }
    const dataToBeReported = {
      problemType: "Batter",
      userEmail: user?.accountEmail ?? "not provided",
      videoID: clipDetails?.id,
      sourceType: clipDetails?.source == 0 ? "BLive" : "Drund",
      gameKey: clipDetails?.gameKey,
      correctedStartTime: null,
      correctedDuration: null,
      CorrectPlayerkey: formData.playerDetail as number, //formData.selectedPlayer?.key,
      incorrectPlayerKey: null,
      issueDescription: null,
      streamid: clipDetails?.streamID,
      markerid: clipDetails?.markerID,
    }
    // Calling send email API with Data
    props.sendReportProblemEmail(dataToBeReported).then(() => {
      // If successful, navigate to final step
      wizardProps?.lastStep()
    })
  }

  const resetFormData = () => {
    reset()
  }

  return (
    <>
      <div>
        <h4>Choose the correct batter.</h4>
        <Form onSubmit={handleSubmit(submitClickHandler)}>
          <ReportProblemInMatchPlayers
            register={register}
            gameTeams={gameTeams}
            resetFormData={resetFormData}
            onValueChange={handleValueChange}
          />
          <div>
            {validationMessage && (
              <Row className="py-3">
                <Col className="flex-middle-center">
                  <div className="error-message">
                    <FaExclamationTriangle className="error-icon" />
                    <p className="error-text">{validationMessage}</p>
                  </div>
                </Col>
              </Row>
            )}
            <Row className="py-3">
              <Col className="flex-middle-center">
                <Button
                  type="submit"
                  variant="light"
                  className="report-problem-btn"
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    </>
  )
}

export default ReportBatterProblemInClip
