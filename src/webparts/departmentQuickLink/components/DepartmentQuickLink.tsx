import * as React from 'react';
import styles from './DepartmentQuickLink.module.scss';
import { IDepartmentQuickLinkProps } from './IDepartmentQuickLinkProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import * as $ from 'jquery';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";

export interface IDepartmentQuickLinkState{  
  QuickLinkData:any[];
}
export default class DepartmentQuickLink extends React.Component<IDepartmentQuickLinkProps,IDepartmentQuickLinkState, {}> {
  public constructor(props: IDepartmentQuickLinkProps, state: IDepartmentQuickLinkState){
    super(props);
    this.state = {    
    QuickLinkData:[]
    };
    }

    public componentDidMount(){
      // $('#spCommandBar').attr('style', 'display: none !important');
      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
  
  
      $('#spLeftNav').attr('style', 'display: none !important');    var reacthandler = this;
      reacthandler.getcurrentusersQuickLinks();
      }
  
      public getcurrentusersQuickLinks(){
      var reactHandler = this;      
      $.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=ID,Title,URL,Image,ImageHover&$filter=IsActive eq 1&$top=5&$orderby=Order0 asc`,
      type: "GET",
      headers:{'Accept': 'application/json; odata=verbose;'},
      success: function(resultData) {
        reactHandler.setState({
        QuickLinkData: resultData.d.results
        });
        if(resultData.d.results.length == 0){
          $(".if-no-qlinks-present").show();
          $(".if-qlinks-present").hide();
        }else{
          $(".if-no-qlinks-present").hide();
          $(".if-qlinks-present").show();
        }      
      },
      error : function(jqXHR, textStatus, errorThrown) {
      }
      });
      }
  public render(): React.ReactElement<IDepartmentQuickLinkProps> {
    var reactHandler = this;
    const DeptQuickLinks: JSX.Element[] = this.state.QuickLinkData.map(function(item,key) {
      let RawImageTxt = item.Image;
      let RawImageTxt2 = item.ImageHover;
      if(RawImageTxt != "" && RawImageTxt != null && RawImageTxt2 != "" && RawImageTxt2 != null){      
        var ImgObj = JSON.parse(RawImageTxt);
        var ImgObj2 = JSON.parse(RawImageTxt2);
        return (          
          <li>
            <a href={`${item.URL.Url}`} target="_blank" data-interception="off" className="clearfix"> 
                <img src={`${ImgObj.serverRelativeUrl}`} alt="image" className="quick-def"/> 
                <img src={`${ImgObj2.serverRelativeUrl}`} alt="image" className="quick-hov"/> 
                <p> {item.Title} </p>
            </a>    
          </li>
        );
      }
    });
    return (
      <div className={ styles.departmentQuickLink }>
           <div className="relative">    
          <div className="section-rigth">
            <div className="quicklinks-wrap personal-qlinks-wrap m-b-20 dept-qlinks">
              <div className="sec">
                <div className="heading">
                  Quick Links
                </div>
                <div className="section-part clearfix if-qlinks-present">
                  <ul>
                    {DeptQuickLinks}
                  </ul>
                </div>    

                <div className="section-part clearfix if-no-qlinks-present" style={{display:"none"}}>
                  <img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ContentEmpty.png" alt="no-content"></img>
                </div>

              </div> 
            </div>
          </div>
        </div>
      </div>
    );
  }
}
