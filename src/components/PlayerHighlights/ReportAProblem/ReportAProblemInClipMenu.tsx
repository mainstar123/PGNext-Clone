import { FC, useEffect } from "react"
import { Button, Col, Row } from "react-bootstrap"
import { StepWizardChildProps } from "react-step-wizard"

const ReportAProblemInClipMenu: FC<any> = (props) => {
  const wizardProps = props as StepWizardChildProps
  // const navigateToTheStep = (stepNumber: number) => {
  //   wizardProps?.goToStep(stepNumber);
  // };
  const tabTitle = "Report a Problem"
  useEffect(() => {
    if (wizardProps.isActive) {
      props.handleTabChange(tabTitle)
    }
  }, [wizardProps.isActive])

  const problemTypeSelectionHandler = (problemType: string) => {
    // updating parent state with selected "Problem Type"
    props.updateSelectingProblemType(problemType)
    switch (problemType) {
      case "startTimeAndDuration":
        wizardProps?.goToStep(2)
        break
      case "batter":
        wizardProps?.goToStep(3)
        break
      case "pitcher":
        wizardProps?.goToStep(4)
        break
      case "other":
        wizardProps?.goToStep(5)
        break
    }
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <div>
            <div className="row mt-4 d-md-flex justify-content-md-center align-items-md-center">
              <h5 className="col-md-7 ">
                Thank You. Let&apos;s fix this! What is inaccurate?
              </h5>
            </div>
            <div className="mt-2">
              {props.clipDetails?.source === 1 && (
                <>
                  <Row className="py-2">
                    <Col className="flex-middle-center">
                      <Button
                        variant="light"
                        className="report-problem-btn"
                        onClick={() =>
                          problemTypeSelectionHandler("startTimeAndDuration")
                        }
                      >
                        Start Time or Duration
                      </Button>
                    </Col>
                  </Row>
                  <Row className="py-3">
                    <Col className="flex-middle-center">
                      <Button
                        variant="light"
                        className="report-problem-btn"
                        onClick={() => problemTypeSelectionHandler("batter")}
                      >
                        Batter
                      </Button>
                    </Col>
                  </Row>
                  <Row className="py-3">
                    <Col className="flex-middle-center">
                      <Button
                        variant="light"
                        className="report-problem-btn"
                        onClick={() => problemTypeSelectionHandler("pitcher")}
                      >
                        Pitcher
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
              <Row className="py-3">
                <Col className="flex-middle-center">
                  <Button
                    variant="light"
                    className="report-problem-btn"
                    onClick={() => problemTypeSelectionHandler("other")}
                  >
                    Other
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default ReportAProblemInClipMenu
