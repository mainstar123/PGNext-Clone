import { FC, useEffect } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { StepWizardChildProps } from "react-step-wizard"
import { useForm } from "react-hook-form"
import { ClipDetails } from "../../../types/ClipDetails"
import router from "next/router"
import { useAuth } from "@/context/auth"

const ReportOtherProblemInClip: FC<any> = (props) => {
  const tabTitle = "Fix my issue"
  const wizardProps = props as StepWizardChildProps
  const clipDetails = props.clipDetails as ClipDetails
  const user = useAuth().user
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
  })

  useEffect(() => {
    if (wizardProps.isActive) {
      props.handleTabChange(tabTitle)
    }
  }, [wizardProps.isActive])

  // const navigateToTheStep = (stepNumber: number) => {
  //   wizardProps?.goToStep(stepNumber);
  // };

  let playerIdNumeric = 0
  const { playerId, sk } = router.query
  if (playerId) playerIdNumeric = parseInt(playerId as string)

  const submitClickHandler = (formData: any) => {
    // console.log("FormData: ", formData);
    const dataToBeReported = {
      problemType: "Other",
      userEmail: user?.accountEmail ?? "not provided",
      videoID: clipDetails?.id,
      sourceType: clipDetails?.source == 0 ? "BLive" : "Drund",
      gameKey: clipDetails?.gameKey,
      correctedStartTime: null,
      correctedDuration: null,
      correctPlayerKey: playerIdNumeric, //SOMETHING
      incorrectPlayerKey: null,
      issueDescription: formData.problemDescription,
      streamid: clipDetails?.streamID,
      markerid: clipDetails?.markerID,
    }

    // Calling send email API with Data
    props.sendReportProblemEmail(dataToBeReported).then(() => {
      // If successful, navigate to final step
      wizardProps?.lastStep()
    })
  }

  return (
    <>
      <h5>Please explain the issue.</h5>
      <Form onSubmit={handleSubmit(submitClickHandler)}>
        {/* <FloatingLabel controlId="floatingTextarea2" label="Comments"> */}
        <Form.Control
          as="textarea"
          {...register("problemDescription", {
            required: {
              value: true,
              message: "Problem description is required",
            },
            maxLength: {
              value: 1000,
              message: "Maximum 1000 characters allowed",
            },
          })}
          placeholder="Please explain the issue here..."
          style={{ minHeight: "15em", color: "black", padding: "0.5em" }}
        />
        {errors.problemDescription?.message && (
          <div className="text-danger-on-grey pl-4 mt-1">
            <p>{errors.problemDescription?.message?.toString()}</p>
          </div>
        )}
        {/* {(errors?.problemDescription?.type === "required" ||
          errors?.problemDescription?.type === "validate") && (
          <div className="text-danger-on-grey pl-4 mb-2">
            <small>Description is required</small>
          </div>
        )} */}
        {/* </FloatingLabel> */}
        <div>
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
    </>
  )
}

export default ReportOtherProblemInClip
