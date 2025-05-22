import { FC, use, useContext, useEffect, useState } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { StepWizardChildProps } from "react-step-wizard"
import { useForm } from "react-hook-form"
import { TimePickerValue } from "react-time-picker/dist/entry.nostyle"

import { IconContext } from "react-icons"
import { GrRotateLeft, GrRotateRight } from "react-icons/gr"
import {
  IoPauseCircleOutline,
  IoPlayCircleOutline,
  IoStopCircleOutline,
} from "react-icons/io5"

import IconStack from "../../Styled/IconStack"
import { utilService } from "../../../services"
import { ClipDetails } from "../../../types/ClipDetails"
import { useAuth } from "@/context/auth"

const ReportStartTimeProblemInClip: FC<any> = (props) => {
  const tabTitle = "Fix Start Time or Duration"
  const wizardProps = props as StepWizardChildProps
  const clipDetails = props.clipDetails as ClipDetails
  const user = useAuth().user
  const [updatedStartTime, setUpdatedStartTime] = useState(
    clipDetails?.start_time
  )
  const [updatedDuration, setUpdatedDuration] = useState(clipDetails?.duration)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
  })
  const playClipFromBeginning = () => {
    // Auto play the clip on selecting Report a problem in Start Time (or) Duration
    props.stopPlayingClipAfterDuration()
    props.handleSeekTo(clipDetails?.start_time)
    props.clipPlayHandler()
  }

  useEffect(() => {
    if (wizardProps.isActive) {
      props.handleTabChange(tabTitle)
      setUpdatedStartTime(clipDetails?.start_time)
      setUpdatedDuration(clipDetails?.duration)
      playClipFromBeginning()
    }
  }, [wizardProps.isActive, props.clipDetails])

  // const navigateToTheStep = (stepNumber: number) => {
  //   wizardProps?.goToStep(stepNumber);
  // };

  const onStartTimeChange = (value: TimePickerValue) => {
    setUpdatedStartTime(getSecondsFromHMS(value.toString()))
  }

  const onDurationChange = (value: TimePickerValue) => {
    setUpdatedDuration(getSecondsFromHMS(value.toString()))
  }

  const getSecondsFromHMS = (value: string) => {
    const hms = value.split(":") // split it at the colons
    const seconds = +hms[0] * 60 * 60 + +hms[1] * 60 + +hms[2]
    return seconds
  }

  const adjustStep = 5

  const startTimeBackwardClickHandler = () => {
    // Updating the start time to 5s -
    const adjustedStartTime = updatedStartTime - adjustStep
    const startTimeToUpdate = adjustedStartTime > 0 ? adjustedStartTime : 0
    setUpdatedStartTime(startTimeToUpdate)

    props.handleSeekTo(startTimeToUpdate)
    ;(document.getElementById("problemsubmit") as HTMLInputElement).disabled =
      false
  }

  const startTimeForwardClickHandler = () => {
    // Updating the start time to 5s +
    const adjustedStartTime = updatedStartTime + adjustStep
    const startTimeToUpdate =
      adjustedStartTime > props.videoDuration
        ? props.videoDuration
        : adjustedStartTime
    setUpdatedStartTime(startTimeToUpdate)

    props.handleSeekTo(startTimeToUpdate)
    ;(document.getElementById("problemsubmit") as HTMLInputElement).disabled =
      false
  }

  const playPauseClickHandler = () => {
    if (props.isClipPlaying) {
      props.clipPauseHandler()
      // 1. Get current seek position (in seconds) => Get played seconds
      // 2. Update the duration time of clip by calculating the difference between Start time & Stopped seconds
      const playedSecondsRounded = Math.floor(props.playedSeconds || 0)
      if (playedSecondsRounded != 0)
        setUpdatedDuration(playedSecondsRounded - updatedStartTime)
    } else {
      props.continuePlayingClipAfterDuration()
      props.clipPlayHandler()
    }

    ;(document.getElementById("problemsubmit") as HTMLInputElement).disabled =
      false
  }

  const submitClickHandler = (formData: any) => {
    const dataToBeReported = {
      problemType: "TimeOrDuration",
      userEmail: user?.accountEmail ?? "not provided",
      videoID: clipDetails?.id,
      sourceType: clipDetails?.source == 0 ? "BLive" : "Drund",
      gameKey: clipDetails?.gameKey,
      correctedStartTime: utilService.getFormattedTimeDuration(
        updatedStartTime,
        false
      ),
      correctedDuration: utilService.getFormattedTimeDuration(
        updatedDuration,
        false
      ),
      correctPlayerKey: null,
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

  const resetHandler = () => {
    // Reset start time state
    setUpdatedStartTime(clipDetails?.start_time)
    // Reset duration time state
    setUpdatedDuration(clipDetails?.duration)
    // Reset clip playing state
    playClipFromBeginning()
    ;(document.getElementById("problemsubmit") as HTMLInputElement).disabled =
      true
  }

  const disable = (thisID: string) => {
    ;(document.getElementById(thisID) as HTMLInputElement).classList.toggle(
      "disableOverlay"
    )
    ;(document.getElementById(thisID) as HTMLInputElement).disabled = true
  }

  return (
    <>
      <Form onSubmit={handleSubmit(submitClickHandler)}>
        <div className="flex-middle-center flex-column p-1">
          <Row>
            <Col>
              <a
                target={"_blank"}
                style={{ whiteSpace: "nowrap" }}
                className="prevent-select yellow-link"
                href="https://youtu.be/jRrdG1u4EOc"
              >
                Editing Help Tip
              </a>
            </Col>
          </Row>
        </div>
        <div className="flex-middle-center flex-column p-1">
          <Row>
            <Col>
              <h3>Edit Clip Start Time</h3>
            </Col>
          </Row>
        </div>
        <div className="flex-middle-center">
          <Row>
            <Col>
              <div className="rp-clip-forward-backward-controls d-flex flex-row p-1">
                <IconContext.Provider
                  value={{
                    className: "dark-bg-font-color",
                    // color: "black"
                    size: "5.6em",
                  }}
                >
                  <div className="px-3">
                    <IconStack
                      onClick={() => startTimeBackwardClickHandler()}
                      className="activeBtn"
                    >
                      <GrRotateLeft />
                      <span className="rp-clip-forward-backward-control-digit prevent-select">
                        {adjustStep}
                      </span>
                    </IconStack>
                  </div>

                  {!props.isClipPlaying ? (
                    <span
                      onClick={() => playPauseClickHandler()}
                      className="activeBtn"
                    >
                      <IoPlayCircleOutline />
                    </span>
                  ) : (
                    <span
                      onClick={() => playPauseClickHandler()}
                      className="activeBtn"
                    >
                      <IoPauseCircleOutline />
                    </span>
                  )}

                  <div className="px-3">
                    <IconStack
                      onClick={() => startTimeForwardClickHandler()}
                      className="activeBtn"
                    >
                      <GrRotateRight />
                      <span className="rp-clip-forward-backward-control-digit prevent-select">
                        {adjustStep}
                      </span>
                    </IconStack>
                  </div>
                </IconContext.Provider>
              </div>
            </Col>
          </Row>
        </div>
        <div className="flex-middle-center flex-column">
          <Row>
            <Col>
              <h5 style={{ whiteSpace: "nowrap" }} className="prevent-select">
                Start Time:
              </h5>
            </Col>
            <Col>
              <h5
                className={
                  updatedStartTime != clipDetails?.start_time
                    ? "font-yellow"
                    : ""
                }
              >
                {utilService.getFormattedTimeDuration(updatedStartTime, false)}
              </h5>
            </Col>
          </Row>
        </div>
        <div className="flex-middle-center flex-column adjust-clip-duration">
          <Row>
            <Col>
              <h5 className="prevent-select">Duration:</h5>
            </Col>
            <Col>
              <h5
                className={
                  updatedDuration != clipDetails?.duration ? "font-yellow" : ""
                }
              >
                {utilService.getFormattedTimeDuration(updatedDuration, false)}
              </h5>
            </Col>
          </Row>

          <IconContext.Provider
            value={{
              className: "dark-bg-font-color",
              size: "5.6em",
            }}
          >
            {props.isClipPlaying ? (
              <span
                onClick={() => playPauseClickHandler()}
                className="activeBtn"
                style={{ textAlign: "center" }}
              >
                <span
                  style={{
                    display: "block",
                    color: "Black",
                    fontWeight: "bold",
                    zIndex: 2,
                  }}
                ></span>
                <span style={{ display: "block", margin: 0 }}>
                  <IoStopCircleOutline />
                </span>
                {/* <IoStopCircleOutline />   */}
              </span>
            ) : (
              <div className="disableOverlay">
                <div className="">
                  <IoStopCircleOutline />
                </div>
              </div>
            )}
          </IconContext.Provider>
        </div>
        <div className="button-container">
          <div className="button-list">
            <div className="flex-middle-center item p-3">
              <Button
                variant="outline-light"
                className="report-problem-btn"
                onClick={() => resetHandler()}
              >
                Reset
              </Button>
            </div>
            <div className="flex-middle-center item p-3">
              <Button
                id="problemsubmit"
                type="submit"
                variant="light"
                className="report-problem-btn"
                disabled
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </>
  )
}

export default ReportStartTimeProblemInClip
