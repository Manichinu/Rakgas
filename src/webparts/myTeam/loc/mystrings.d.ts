declare interface IMyTeamWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'MyTeamWebPartStrings' {
  const strings: IMyTeamWebPartStrings;
  export = strings;
}
