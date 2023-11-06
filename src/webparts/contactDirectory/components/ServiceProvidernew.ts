import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClient } from "@microsoft/sp-http";
import * as moment from 'moment';
export class ServiceProvider {
  public _graphClient: MSGraphClient;
  private spcontext: WebPartContext;
  public constructor(spcontext: WebPartContext) {
    this.spcontext = spcontext;
  }
  //To Get recents
  public getADdetails = async (): Promise<[]> => {
    this._graphClient = await this.spcontext.msGraphClientFactory.getClient(); //TODO    
    let myADdetails: [] = [];
    try{
      //const teamsResponse2 = await this._graphClient.api('https://graph.microsoft.com/beta/users?$select=employeeId,country,businessPhones,city,department,jobTitle,mobilePhone,officeLocation,surname,givenName,mail').top(999).version('v1.0').get();
      const teamsResponse2 = await this._graphClient.api('https://graph.microsoft.com/beta/groups/d30288f2-8724-4600-a695-34811f4082d5/members?$count=true').top(999).version('v1.0').get();
      myADdetails = teamsResponse2.value as [];
      
    }catch(error){
      console.log('unable to get ADUserGroups', error);
    }
    return myADdetails;
  }   
}