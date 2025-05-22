import { FC, useEffect, useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { StepWizardChildProps } from "react-step-wizard"
import { ClipDetails } from "../../../types/ClipDetails"
import { GameTeams } from "../../../types/ReportAProblemTeamDetails"
import ReportProblemInMatchPlayers from "../../shared/ReportProblemInMatchPlayers"
import { useAuth } from "@/context/auth"
import { FaExclamationTriangle } from "react-icons/fa"

const ReportPitcherProblemInClip: FC<any> = (props) => {
  const tabTitle = "Fix the Pitcher"
  const wizardProps = props as StepWizardChildProps
  const user = useAuth().user
  const clipDetails = props.clipDetails as ClipDetails
  const [gameTeams, setGameTeams] = useState<GameTeams>({} as GameTeams)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "all",
  })

  // const navigateToTheStep = (stepNumber: number) => {
  //   wizardProps?.goToStep(stepNumber);
  // };

  useEffect(() => {
    if (wizardProps.isActive) {
      props.handleTabChange(tabTitle)
      props
        .loadTeamsPlayersByType("all")
        .then((teams: GameTeams) => setGameTeams(teams))
    }
  }, [wizardProps.isActive])

  const submitClickHandler = (formData: any) => {
    if (formData.playerDetail === null) {
      setValidationMessage(
        'Please select a pitcher from the list or select "Unknown" or "Other"'
      )
      return
    }
    const dataToBeReported = {
      problemType: "Pitcher",
      userEmail: user?.accountEmail ?? "not provided",
      videoID: clipDetails?.id,
      sourceType: clipDetails?.source == 0 ? "BLive" : "Drund",
      gameKey: clipDetails?.gameKey,
      correctedStartTime: null,
      correctedDuration: null,
      correctPlayerKey: formData.playerDetail as number, // formData.selectedPlayer?.key,
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
  const [validationMessage, setValidationMessage] = useState("")

  const handleValueChange = () => {
    if (validationMessage !== "") {
      setValidationMessage("")
    }
  }

  const resetFormData = () => {
    reset()
  }

  return (
    <>
      <div>
        <h4>Choose the correct pitcher.</h4>
        <Form onSubmit={handleSubmit(submitClickHandler)}>
          <ReportProblemInMatchPlayers
            gameTeams={gameTeams}
            register={register}
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

export default ReportPitcherProblemInClip
