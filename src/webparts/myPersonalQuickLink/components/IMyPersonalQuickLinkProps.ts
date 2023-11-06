import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IMyPersonalQuickLinkProps {
  description: string;
  siteurl:string;
  context: WebPartContext;
  userid:any;
}
