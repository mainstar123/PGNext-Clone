import { FC, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { StepWizardChildProps } from "react-step-wizard";

const ThanksForReportingProblemInClip: FC<any> = (props) => {
  const wizardProps = props as StepWizardChildProps;
  // const navigateToTheStep = (stepNumber: number) => {
  //   wizardProps?.goToStep(stepNumber);
  // };
  const [selectedIssueThanksNote, setSelectedIssueThanksNote] = useState(
    {} as any
  );
  const thanksNotes: any = {
    startTimeAndDuration: {
      issueDetail:
        "Your submitted new start time/duration will be reviewed by our team.",
      resolutionDescription:
        "We hope to approve and edit within the next 48 hours.",
    },
    batter: {
      issueDetail: "Your submitted new batter will be reviewed by our team.",
      resolutionDescription:
        "We hope to approve and edit within the next 48 hours.",
    },
    pitcher: {
      issueDetail: "Your submitted new pitcher will be reviewed by our team.",
      resolutionDescription:
        "We hope to approve and edit within the next 48 hours.",
    },
    other: {
      issueDetail: "Your submitted issue will be reviewed by our team.",
      resolutionDescription:
        "We hope to approve and edit within the next 72 hours.",
    },
  };

  const tabTitle = "Thank you";
  useEffect(() => {
    if (wizardProps.isActive) {
      props.handleTabChange(tabTitle);
      setSelectedIssueThanksNote(thanksNotes[props.reportedProblemType]);
    }
  }, [wizardProps.isActive]);

  return (
    <>
      <Row>
        <Col xs={12} style={{ textAlign: "center" }}>
          <h5>{selectedIssueThanksNote.issueDetail}</h5>
          <h6>
            We hope to approve and edit within the next
            {props.reportedProblemType == "other" ? " 72 " : " 48 "}hours.
          </h6>
        </Col>
      </Row>
      <div>
        <Row className="py-3">
          <Col className="flex-middle-center">
            <Button
              variant="light"
              className="report-problem-btn"
              onClick={() => props.onCloseHandler()}
            >
              Close
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ThanksForReportingProblemInClip;
