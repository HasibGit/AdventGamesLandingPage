export interface description {
  culture: string;
  value: string;
}

export interface PrizeAndWinningCriteria {
  errors: {
    errors: string[];
  };
  result: {
    gameId: string;
    companyId: string;
    seasonId: string;
    name: string;
    day: number;
    prizeDescriptions: description[];
    winningCriteria: {
      criteriaType: number;
      scoreThreshold: number;
      criteriaDescriptions: description[];
      winningDescriptions: description[];
    };
    id: string;
    createdOn: string;
    modifiedOn: string;
  };
  isSuccess: boolean;
}
