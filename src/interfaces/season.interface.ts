export interface Description {
  culture: string;
  value: string;
}

export interface Theme {
  backgroundColor: string;
  bubbleType1BackgroundColor: string;
  bubbleType2BackgroundColor: string;
  bubbleType3BackgroundColor: string;
  cardBackgroundColor: string;
  cardBorder: string;
  seasonDeadlineColor: string;
  offerDetailsColor: string;
  winningCriteriaColor: string;
  requiredPointsColor: string;
  offerColor: string;
  playButtonBackgroundColor: string;
  playButtonBorderColor: string;
  playButtonTextColor: string;
}

export interface Season {
  errors: {
    errors: string[];
  };
  result: {
    id: string;
    createdOn: string;
    modifiedOn: string;
    name: string;
    companyId: string;
    startTime: string;
    endTime: string;
    seasonDescriptions: Description[];
    prizeDescriptions: Description[];
    termsAndConditionsUrls: Description[];
    theme: Theme;
  };
  isSuccess: boolean;
}
