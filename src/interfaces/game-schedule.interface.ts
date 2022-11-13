export interface description {
  culture: string;
  value: string;
}

export interface GameSchedule {
  errors: {
    errors: string[];
  };
  result: {
    id: string;
    createdOn: string;
    modifiedOn: string;
    companyId: string;
    seasonId: string;
    startTime: string;
    endTime: string;
    game: {
      gameNames: description[];
      gameDescriptions: description[];
      gameUrl: string;
      gameId: string;
    };
  };
  isSuccess: boolean;
}
