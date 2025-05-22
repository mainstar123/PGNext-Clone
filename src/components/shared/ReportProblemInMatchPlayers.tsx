import { ChangeEvent, FC, useEffect, useState } from "react"
import { Form, Tab, Tabs } from "react-bootstrap"
import { Controller, FieldValues, UseFormRegister } from "react-hook-form"
import { utilService } from "../../services"
import { PlayerDetail, GameTeams } from "../../types/ReportAProblemTeamDetails"

interface ReportProblemInMatchPlayersProps {
  gameTeams: GameTeams
  register: UseFormRegister<FieldValues>
  resetFormData: () => void
  onValueChange: (value: string) => void
}

const ReportProblemInMatchPlayers: FC<ReportProblemInMatchPlayersProps> = ({
  gameTeams,
  register,
  resetFormData,
  onValueChange,
}) => {
  const [selectedValue, setSelectedValue] = useState("")

  const handleValueChange = (value: string) => {
    setSelectedValue(value)
    onValueChange(selectedValue)
  }
  return (
    <div className="report-problem-players-list-by-team">
      {gameTeams && (
        <Tabs
          defaultActiveKey="homeTeam"
          id="justify-tab-example"
          justify
          onSelect={(k) => resetFormData()}
        >
          {gameTeams.HomeTeam?.Name && (
            <Tab eventKey="homeTeam" title={gameTeams.HomeTeam?.Name}>
              <PlayersDetail
                players={gameTeams.HomeTeam?.Players}
                register={register}
                onValueChange={handleValueChange}
              />
            </Tab>
          )}
          {gameTeams.VisitorTeam?.Name && (
            <Tab eventKey="visitorTeam" title={gameTeams.VisitorTeam?.Name}>
              <PlayersDetail
                players={gameTeams.VisitorTeam?.Players}
                register={register}
                onValueChange={handleValueChange}
              />
            </Tab>
          )}
        </Tabs>
      )}
    </div>
  )
}

interface PlayerNameProps {
  players?: PlayerDetail[]
  register: UseFormRegister<FieldValues>
  onValueChange: (value: string) => void
}

export const PlayersDetail: FC<PlayerNameProps> = ({
  players,
  register,
  onValueChange,
}) => {
  const unknownPlayerKey = 0
  const otherPlayerKey = 1
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDetail>(
    {} as PlayerDetail
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.persist()
    let playerSelected: PlayerDetail = {} as PlayerDetail
    if (e.target.type == "radio") {
      if (e.target.id == "checkbox-" + otherPlayerKey && e.target.checked) {
        playerSelected = {
          PlayerKey: otherPlayerKey,
          PlayerName: "",
          PrimaryPosition: "N/A",
          JerseyNumber: "",
        }
      } else if (
        e.target.id == "checkbox-" + unknownPlayerKey &&
        e.target.checked
      ) {
        playerSelected = {
          PlayerKey: unknownPlayerKey,
          PlayerName: "",
          PrimaryPosition: "N/A",
          JerseyNumber: "",
        }
      } else {
        const playerKey = e.target.value as unknown as number
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        playerSelected = players?.find((x) => x.PlayerKey == playerKey)!
      }
    }
    setSelectedPlayer(playerSelected)
    onValueChange(e.target.value)
  }

  return (
    <>
      <ul>
        <Form.Group>
          {players?.map((player, index) => (
            <Form.Check
              {...register("playerDetail")}
              key={player.PlayerKey}
              name="playerDetail"
              id={"checkbox-" + player.PlayerKey}
              value={`${player.PlayerKey}`}
              type="radio"
              label={`${utilService.filterDummyJerseyNumbers(
                player.JerseyNumber
              )} - ${player.PlayerName} ${
                player.PrimaryPosition ? `(${player.PrimaryPosition})` : ""
              }`}
              onChange={handleChange}
            />
          ))}
          <Form.Check
            {...register("playerDetail")}
            key={unknownPlayerKey}
            // name="playerDetail"
            id={"checkbox-" + unknownPlayerKey}
            value={unknownPlayerKey}
            type="radio"
            label={"Unknown or I'm not sure"}
            onChange={handleChange}
          />
          <Form.Check
            {...register("playerDetail")}
            key={otherPlayerKey}
            // name="playerDetail"
            id={"checkbox-" + otherPlayerKey}
            value={otherPlayerKey}
            type="radio"
            label={"Other"}
            onChange={handleChange}
          />
          {selectedPlayer.PlayerKey == otherPlayerKey && (
            <Form.Control
              {...register("otherPlayerName")}
              type="text"
              name="otherPlayerName"
              placeholder="Enter non-listed player name"
              size="sm"
            />
          )}
        </Form.Group>
      </ul>
    </>
  )
}

export default ReportProblemInMatchPlayers
