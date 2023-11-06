import * as React from 'react';
import styles from './Footer.module.scss';
import { IFooterProps } from './IFooterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery'

export interface IFooterState{  
  items:any[];         
}
export default class Footer extends React.Component<IFooterProps,IFooterState, {}> {
  public constructor(props: IFooterProps, state: IFooterState){  
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
  this.GetFooterLinks();
}
public GetFooterLinks(){  
 
  var reactHandler = this;
  $.ajax({  
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('FooterMaster')/items?$select=Title,HoverOnImage,HoverOffImage,URL&$orderby=Order0 asc&$filter=IsActive eq 1`,  
      type: "GET",  
      headers:{'Accept': 'application/json; odata=verbose;'},  
      success: function(resultData) { 
        if(resultData.d.results.length == 0){          
          $("#if-no-footer-present").show();
          $("#if-footer-present").hide();
        }else{             
        reactHandler.setState({  
          items: resultData.d.results  
        });
        $("#if-no-footer-present").hide();
        $("#if-footer-present").show();
      }                            
      },  
      error : function(jqXHR, textStatus, errorThrown) {  
      }  
  });
}
  public render(): React.ReactElement<IFooterProps> {
    var reactHandler = this;
    const FooterLink: JSX.Element[] = this.state.items.map(function(item,key) {                        
      let Title = item.Title;
      let RawHoverOffImage = item.HoverOnImage;
      let RawImageTxt = item.HoverOffImage;
      
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
      <div className={ styles.footer } id="Homepage_Footerbar">
          <section>
          <div className="relative">
            <div className="section-rigth"></div>
        
            <div className="direct-conttent-sreas">
     
              <div className="sec"  id="if-footer-present">
              {/* <div className="heading clearfix"><h3> <a href="#" data-interception="off"> Footer </a> </h3></div> */}
                <ul className="clearfix">
                  {FooterLink}                        
                </ul>
              </div>
              <div className="sec shadoww relative" id="if-no-footer-present" style={{display:"none"}}>
              {/* <div className="heading">            
              Footer
              </div> */}
              <img className="err-img" src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="ceoimg"></img>                                    
            </div>
            </div>
          </div>        
        </section>
      </div>
    );
  }
}
