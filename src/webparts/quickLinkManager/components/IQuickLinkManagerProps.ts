import { SPHttpClient } from '@microsoft/sp-http'; 
import { WebPartContext } from '@microsoft/sp-webpart-base';
export interface IQuickLinkManagerProps {
  description: string;
  siteurl:string;
  userid:any;
  spHttpClient: SPHttpClient;  
  context: WebPartContext;
}

  