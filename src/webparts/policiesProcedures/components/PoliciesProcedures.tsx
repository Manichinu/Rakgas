import * as React from 'react';
import styles from './PoliciesProcedures.module.scss';
import { IPoliciesProceduresProps } from './IPoliciesProceduresProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery'
import { SPComponentLoader } from "@microsoft/sp-loader";
import GlobalSideNav from "../../../extensions/globalCustomFeatures/GlobalSideNav";
import { Web } from '@pnp/sp/webs';

let NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet/");

export interface IPoliciesProcedureState{  
  items:any[];         
}
export default class PoliciesProcedures extends React.Component<IPoliciesProceduresProps,IPoliciesProcedureState, {}> {
  public constructor(props: IPoliciesProceduresProps, state: IPoliciesProcedureState){  
    super(props);          
    this.state = {               
      items: [],          
    };         
  }

  public componentDidMount(){
    setTimeout(function () {
    $('#spCommandBar').attr('style', 'display: none !important');
    $('#CommentsWrapper').attr('style', 'display: none !important');
    $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');

  }, 2000);  
  this.GetDocumentCenterLinks();   
  }

  // public GetDocumentCenterLinks(){  
  //   let UserID=this.props.UserId;
  //   var reactHandler = this;
  //   $.ajax({  
  //       // url: `${this.props.siteurl}/_api/web/lists/getbytitle('Policy and Procedure Master')/items?$select=Title,HoverOnImage,AccessibleTo/Title,HoverOffImage,URL&$expand=AccessibleTo&$orderby=Order0 asc&$filter=IsActive eq 1 and AccessibleTo/Id eq ${UserID}`, 
  //         url: `${this.props.siteurl}/_api/web/lists/getbytitle('Policy and Procedure Master')/items?$select=Title,HoverOnImage,HoverOffImage,URL&$orderby=Order0 asc&$filter=IsActive eq 1`,  
 
  //       type: "GET",  
  //       headers:{'Accept': 'application/json; odata=verbose;'},  
  //       success: function(resultData) {              
  //         reactHandler.setState({  
  //           items: resultData.d.results  
  //         }); 
  //         console.log("item",resultData.d.results);
                                      
  //       },  
  //       error : function(jqXHR, textStatus, errorThrown) {  
  //       }  
  //   });
  // }
  private async GetDocumentCenterLinks() {
    var reactHandler = this;

    await NewWeb.lists.getByTitle("Policy and Procedure Master").items.select("Title","HoverOnImage","HoverOffImage","URL").orderBy("Order0", true)
      .filter("IsActive eq '1'").get().then((items) => { // //orderby is false -> decending          
        reactHandler.setState({  
          items:items
        }); 
      }).catch((err) => {
        console.log(err);
      });
  }


  public render(): React.ReactElement<IPoliciesProceduresProps> {
    var reactHandler = this;
    const policiesandProcedures: JSX.Element[] = this.state.items.map(function(item,key) { 
                        
      let Title = item.Title;
      let RawImageTxt = item.HoverOnImage;
      let RawHoverOffImage = item.HoverOffImage;
      if(RawImageTxt != "" && RawHoverOffImage != ""){
      var ImgObj = JSON.parse(RawImageTxt);
      var ImgObjHoverImage = JSON.parse(RawHoverOffImage);       
        return (   
            <li> 
              <a href={`${item.URL.Url}`} data-interception="off" target="_blank"> 
                <img className="DarkImage" src={ImgObjHoverImage.serverRelativeUrl} alt="image"/>
                <img className="LightImage" src={ImgObj.serverRelativeUrl} alt="image"/> 
                <p>{Title}</p>    
              </a> 
            </li>                                   
        );         
    }                   
  });
    return (
      <div className={ styles.policiesProcedures }>
         {/* <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={''} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div> */}

         <section>
          <div className="relative">
            <div className="section-rigth"></div>
            <div className="inner-banner-header relative m-b-20">
              <div className="inner-banner-overlay"></div>
              <div className="inner-banner-contents">
                <h1> Policies and Procedures </h1>
                <ul className="breadcums">
                  <li>  <a href={`${this.props.siteurl}/SitePages/Homepage.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                  <li>  <a href="#" style={{pointerEvents:"none"}} data-interception="off"> Policies and Procedures </a> </li>
                </ul>
              </div>
            </div>
            <div className="direct-conttent-sreas">
              <div className="sec">
                <ul className="clearfix">
                  {policiesandProcedures}                        
                </ul>
              </div>
            </div>
          </div>        
        </section>
      </div>
    );
  }
}
