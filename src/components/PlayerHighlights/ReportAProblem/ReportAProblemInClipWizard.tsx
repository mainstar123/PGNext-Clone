import { FunctionComponent, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import StepWizard from "react-step-wizard";
import { AxiosResponse } from "axios";

import ReportAProblemInClipMenu from "./ReportAProblemInClipMenu";
import ReportStartTimeProblemInClip from "./ReportStartTimeProblemInClip";
import ReportBatterProblemInClip from "./ReportBatterProblemInClip";
import ReportPitcherProblemInClip from "./ReportPitcherProblemInClip";
import ReportOtherProblemInClip from "./ReportOtherProblemInClip";
import ThanksForReportingProblemInClip from "./ThanksForReportingProblemInClip";

import { GameTeams } from "../../../types/ReportAProblemTeamDetails";
import { ClipDetails } from "../../../types/ClipDetails";
import { API_URLS } from "../../../constants";
import { apiService } from "../../../services";
import { IoArrowBackCircleSharp } from "react-icons/io5";

interface ReportAProblemInClipWizardProps {
  clipDetails: ClipDetails;
  videoDuration?: number;
  playedSeconds?: number;
  isClipPlaying?: boolean;
  sentfrom: string;
  clipPauseHandler: () => void;
  clipPlayHandler: () => void;
  backToVideoDetails: () => void;
  handleTabChange: (tabName: string) => void;
  onReportProblemWizardCloseHandler: () => void;
  handleSeekTo: (seekToSeconds: number) => void;
  stopPlayingClipAfterDuration: () => void;
  continuePlayingClipAfterDuration: () => void;
}

const ReportAProblemInClipWizard: FunctionComponent<
  ReportAProblemInClipWizardProps
> = ({
  clipDetails,
  videoDuration,
  playedSeconds,
  isClipPlaying,
  sentfrom,
  clipPauseHandler,
  clipPlayHandler,
  handleTabChange,
  onReportProblemWizardCloseHandler,
  backToVideoDetails,
  handleSeekTo,
  stopPlayingClipAfterDuration,
  continuePlayingClipAfterDuration,
}) => {
  const [selectedProblemType, setSelectedProblemType] = useState("");

  // Do something on step change
  const onStepChange = (stats: any) => {
    //   handleTabChange(stats.stepName);
  };
  useEffect(() => {
    clipPauseHandler();
  }, [clipDetails]);

  const handleProblemTypeSelection = (problemType: string) => {
    setSelectedProblemType(problemType);
  };

  const loadTeamsPlayersByType = (playersType: "all" | "pitchers") => {
    return new Promise((resolve, reject) => {
      let apiUrl = API_URLS.GetTeamDetailsByGameId;
      if (playersType === "all") {
        apiUrl = API_URLS.GetTeamDetailsByGameId;
      } else if (playersType === "pitchers") {
        apiUrl = API_URLS.GetPitchersTeamDetailsByGameId;
      }

      apiService.common
        .getByParams<GameTeams>(apiUrl, {
          gameId: clipDetails.gameKey,
        })
        .then((gameTeams: GameTeams) => {
          resolve(gameTeams);
        });
    });
  };

  const sendReportProblemEmail = (problemDetails: any) => {
    // console.log("dataToBeReported: ", problemDetails);
    return apiService.common
      .post(API_URLS.SendReportAProblemEmail, {
        ...problemDetails,
      })
      .then((response: AxiosResponse) => {
        console.log(response.data);
      });
  };

  return (
    <>
      {/* Show back button only for Drund clips */}
      {clipDetails.source == 1 &&
      (sentfrom != "ReportAProblem" ||
      selectedProblemType != "") &&
      1 != 1 && //HIDE BACK UNTIL WE CAN DEAL WITH IT
      (
        <div className="flex-column">
          <div className="flex-middle-left">
            <div
              className="cursor-pointer"
              onClick={() => backToVideoDetails()}
            >
              <IoArrowBackCircleSharp size={"1.75em"} />
              <strong> Back</strong>
            </div>
          </div>
        </div>
      )}

      <div className="report-problem-wrapper">
        <Container className="px-0">
          <StepWizard
            onStepChange={onStepChange}
            initialStep={clipDetails?.source == 0 ? 5 : 1}
          >
            <ReportAProblemInClipMenu
              handleTabChange={handleTabChange}
              clipDetails={clipDetails}
              updateSelectingProblemType={handleProblemTypeSelection}
            />
            <ReportStartTimeProblemInClip
              clipDetails={clipDetails}
              videoDuration={videoDuration}
              playedSeconds={playedSeconds}
              handleTabChange={handleTabChange}
              handleSeekTo={handleSeekTo}
              isClipPlaying={isClipPlaying}
              clipPauseHandler={clipPauseHandler}
              clipPlayHandler={clipPlayHandler}
              sendReportProblemEmail={sendReportProblemEmail}
              stopPlayingClipAfterDuration={stopPlayingClipAfterDuration}
              continuePlayingClipAfterDuration={
                continuePlayingClipAfterDuration
              }
            />
            <ReportBatterProblemInClip
              clipDetails={clipDetails}
              handleTabChange={handleTabChange}
              loadTeamsPlayersByType={loadTeamsPlayersByType}
              sendReportProblemEmail={sendReportProblemEmail}
            />
            <ReportPitcherProblemInClip
              clipDetails={clipDetails}
              handleTabChange={handleTabChange}
              loadTeamsPlayersByType={loadTeamsPlayersByType}
              sendReportProblemEmail={sendReportProblemEmail}
            />
            <ReportOtherProblemInClip
              clipDetails={clipDetails}
              handleTabChange={handleTabChange}
              sendReportProblemEmail={sendReportProblemEmail}
            />
            <ThanksForReportingProblemInClip
              onCloseHandler={onReportProblemWizardCloseHandler}
              handleTabChange={handleTabChange}
              reportedProblemType={selectedProblemType ? selectedProblemType : "other"}
            />
          </StepWizard>
        </Container>
      </div>
    </>
  );
};

export default ReportAProblemInClipWizard;
