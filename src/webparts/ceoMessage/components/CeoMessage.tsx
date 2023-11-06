import * as React from 'react';
import styles from './CeoMessage.module.scss';
import { ICeoMessageProps } from './ICeoMessageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Web } from "@pnp/sp/presets/all";

export interface ICeoMessageState{
  Items:any[];
}


const NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet"); 
export default class CeoMessage extends React.Component<ICeoMessageProps,ICeoMessageState, {}> {
  public constructor(props: ICeoMessageProps, state: ICeoMessageState){
    super(props);
    this.state = {
      Items: []
    };
    }

    public componentDidMount(){
  
      setTimeout(function () {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
   $(".inner-pages-nav").remove();
    }, 2000); 
    this.GetCEOMessage();
    }

    // private  GetCEOMessage() {
    //   var reactHandler = this;       
    //   $.ajax({
    //     url: `${this.props.siteurl}/_api/web/lists/getbytitle('CEO Message')/items?$select=ID,Title,Description,Created,Name,Image,Designation,Name&$filter=IsActive eq 1&$orderby=Created desc&$top=1`,  
    //   type: "GET",
    //   headers:{'Accept': 'application/json; odata=verbose;'},
    //   success: function(resultData) {
    //     if(resultData.d.results.length == 0){          
    //       $("#if-no-ceo-msg-present").show();
    //       $("#if-ceo-msg-present").hide();
    //     }else{
    //       reactHandler.setState({
    //         Items: resultData.d.results
    //       });
    //       $("#if-no-ceo-msg-present").hide();
    //       $("#if-ceo-msg-present").show();
    //     }      
    //   },
    //   error : function(jqXHR, textStatus, errorThrown) {
    //   }
    //   });
    // }

    private async GetCEOMessage() {
      var reactHandler = this;
  
      await NewWeb.lists.getByTitle("CEO Message").items.select("ID","Title","Description","Created","Name","Image","Designation","Name").filter(`IsActive eq '1'`).orderBy("Created", false).top(1)
      .get().then((items) => { // //orderby is false -> decending          
  
  
        if (items.length == 0) {
          $("#if-no-ceo-msg-present").show();
          $("#if-ceo-msg-present").hide();
        } else {
          reactHandler.setState({
            Items: items
          });
          $("#if-no-ceo-msg-present").hide();
          $("#if-ceo-msg-present").show();
        }
        }).catch((err) => {
          console.log(err);
        });
    }
  public render(): React.ReactElement<ICeoMessageProps> {
    var handler = this;
    const CEOMessage: JSX.Element[] = this.state.Items.map(function(item,key) {
      let dummyElement = document.createElement("DIV");
      var Date=moment(item.Created).format("DD/MM/YYYY");
      dummyElement .innerHTML = item.Description;
      var outputText = dummyElement.innerText;

      $("#ceo-title-dynamic").html(`${item.Title}`);
      let RawImageTxt = item.Image;
      if(RawImageTxt != "" && RawImageTxt != null){
        var ImgObj = JSON.parse(RawImageTxt);
          return (
            <>
              <div className="section-part clearfix">
                <div className="ceo-message-left">                  
                  <h6>{Date}</h6>
                  <p> {outputText} </p>
                  <a href={handler.props.siteurl+`/SitePages/CEO-Read-More.aspx?env=WebView&ItemID=${item.ID}`} data-interception="off" className="readmore transition" > Read more 
                  <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/right_arrow.svg`} className="transition" alt="image" />  </a>
                </div>            
              </div>
              <div className="ceo-message-right">
                  <img src={ImgObj.serverRelativeUrl} alt="no-image-uploaded" />
                  <h4> {item.Name} </h4>
              </div>
            </>
          );                   
      }else{
        return(
          <>
            <div className="section-part relative clearfix">
              <div className="ceo-message-left">                
                <p> {outputText} </p>
                <a href={handler.props.siteurl+`/SitePages/CEO-Read-More.aspx?env=WebView&ItemID=${item.ID}`} data-interception="off" className="readmore transition"> Read more <img src="https://taqeef.sharepoint.com/sites/intranet/SiteAssets/Style%20Library/img/Landing%20Page%20Imgs/right_arrow.svg" className="transition" alt="image" />  </a>
              </div>            
            </div>
            <div className="ceo-message-right">
              <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ceo_no_found.png`} alt="img" />
              <h4> {item.Name} </h4>
            </div>
          </>
        );
      }
    });
    return (
      <div className={ styles.ceoMessage }>
        <div className="row">
          <div className="col-md-12">
            <div className="sec relative" id="if-ceo-msg-present">
              <div className="heading" id="ceo-title-dynamic">
                
              </div>
                {CEOMessage}
            </div>
            <div className="sec shadoww relative" id="if-no-ceo-msg-present" style={{display:"none"}}>
              <div className="heading">            
                  CEO's Message
              </div>
              <img className="err-img" src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="ceoimg"></img>                                    
            </div>
          </div>
        </div>
      </div>
    );
  }
}
