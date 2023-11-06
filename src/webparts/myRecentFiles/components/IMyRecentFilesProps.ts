import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMyRecentFilesProps {
  description: string;
  context: WebPartContext;
  siteurl:string;
}
