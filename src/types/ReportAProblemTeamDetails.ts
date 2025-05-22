export interface GameTeams {
  HomeTeam: Team;
  VisitorTeam: Team;
}

export interface Team {
  Name: string;
  Players: PlayerDetail[];
}

export interface PlayerDetail {
  PlayerName: string;
  PrimaryPosition: string;
  PlayerKey: number;
  JerseyNumber: string;
}
