import * as React from 'react';
import styles from './AboutDepartment.module.scss';
import { IAboutDepartmentProps } from './IAboutDepartmentProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Web } from "@pnp/sp/webs";
import { Markup } from 'interweave';
import GlobalSideNav from "../../../extensions/globalCustomFeatures/GlobalSideNav";
 
export interface IAboutDepartmentState{
  Items:any[];
}

export default class AboutDepartment extends React.Component<IAboutDepartmentProps, IAboutDepartmentState,{}> {
  public constructor(props: IAboutDepartmentProps, state: IAboutDepartmentState){
    super(props);
    this.state = {
      Items: []
    };
  }

    public componentDidMount(){
      // $('#spCommandBar').attr('style', 'display: none !important');
      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $('#spLeftNav').attr('style', 'display: none !important');
  
    this.GetDepartmentAbout();
      setTimeout(function(){
        $('div[data-automation-id="CanvasControl"]').attr('style', 'padding: 0px !important; margin: 0px !important');
      },500);
    }

    private GetDepartmentAbout() {
      var reactHandler = this;
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('AboutDepartment')/items?$select=ID,Title,Description,DepartmentBannerImage&$filter=IsActive eq 1&$orderby=Created desc&$top=1`,  
        type: "GET",
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) {
          if(resultData.d.results.length == 0){
            $("#if-about-present").hide();
            $("#if-no-about-present").show();            
          }else{
            $("#if-about-present").show();
            $("#if-no-about-present").hide();
            reactHandler.setState({
              Items: resultData.d.results
            });
          }         
        },
        error : function(jqXHR, textStatus, errorThrown) {
        }
      });    
    }

    // private async GetDepartmentAbout() {
    //   var reactHandler = this;
  
    //   await sp.web.lists.getByTitle("AboutDepartment").items.select("ID","Title","Description","DepartmentBannerImage").filter(`IsActive eq '1'`).orderBy("Created", false).top(1)  
    //   .get().then((items) => { // //orderby is false -> decending 
    //       console.log("items",items);
                   
    //       // this.setState({
    //       //   Items: items,
    //       // });
          
    //       if (items.length == 0) {
    //         $("#if-about-present").hide();
    //         $("#if-no-about-present").show();
    //       } else {
    //         $("#if-about-present").show();
    //         $("#if-no-about-present").hide();
    //         reactHandler.setState({
    //           Items: items
    //         });
    //       }
    //     }).catch((err) => {
    //       console.log(err);
    //     });
    // }
    

  public render(): React.ReactElement<IAboutDepartmentProps> {
    var reactHandler = this;
    const AboutDept: JSX.Element[] = this.state.Items.map(function(item,key) {
      let RawImageTxt = item.DepartmentBannerImage;
      if(RawImageTxt != "" && RawImageTxt != null){      
        var ImgObj = JSON.parse(RawImageTxt);
        return (          
          <div className="col-md-12 m-b-0 clearfix">                       
            <div className="department-detailsi-img">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <div className="department-detailsi-conts">
              <h2>  {item.Title} </h2> 
              <p> <Markup content={item.Description} /> </p>
            </div>
          </div>
        );
      }
    });
    return (
      <div className={ styles.aboutDepartment }>
        
 {/* <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={''} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div> */}
        <div className="relative">    
          <div className="section-rigth">
            <div className="inner-banner-header relative m-b-20">
              <div className="inner-banner-overlay"></div>
              <div className="inner-banner-contents">
                <h1> Department </h1>
                <ul className="breadcums"> 
                    <li>  <a href="https://rakgasae.sharepoint.com/sites/Intranet/SitePages/Home.aspx?env=WebView" data-interception="off" > Home </a> </li>
                    <li>  <a href="#" style={{pointerEvents:"none"}} data-interception="off"> {this.props.PageName} </a> </li>
                </ul>
              </div>
            </div>
            <div className="inner-page-contents">
              <div className="sec m-b-20"> 
                <div className="row" style={{display:"none"}} id="if-about-present">
                  {AboutDept}
                </div>

                <div className="row" style={{display:"none"}} id="if-no-about-present">
                  <div className="col-md-12 m-b-0 clearfix">
                    <img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ContentEmpty.png" alt="no-content"></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
