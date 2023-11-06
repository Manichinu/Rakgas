import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IRecognitionProps {
  description: string;
  siteurl:string;
  context:WebPartContext
}
