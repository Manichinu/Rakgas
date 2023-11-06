import { SPHttpClient } from '@microsoft/sp-http'; 

export interface INewQuickLinkManagerProps {
  description: string;
  siteurl:string;
  userid:any;
  spHttpClient: SPHttpClient;  
}
