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
    name: string;
    day: number;
    descriptions: description[];
    prizeWinningCriteria: {
      criteriaType: number;
      scoreThreshold: number;
      winningCriteriaDescriptions: description[];
      congratulationDescriptions: description[];
    };
    id: string;
    createdOn: string;
    modifiedOn: string;
  };
  isSuccess: true;
}
