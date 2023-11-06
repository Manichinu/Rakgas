import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IDocumentLibraryProps {
  description: string;
  siteurl:string;
  context:WebPartContext;
}
