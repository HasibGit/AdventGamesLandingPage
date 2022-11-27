export interface Company {
  errors: {
    errors: string[];
  };
  result: {
    name: string;
    webSiteUrl: string;
    defaultLanguage: string;
    id: string;
    createdOn: string;
    modifiedOn: string;
  };
  isSuccess: boolean;
}
