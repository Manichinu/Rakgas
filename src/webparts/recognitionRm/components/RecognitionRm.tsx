import * as React from 'react';
import styles from './RecognitionRm.module.scss';
import { IRecognitionRmProps } from './IRecognitionRmProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import GlobalSideNav from '../../../extensions/globalCustomFeatures/GlobalSideNav';
import { sp } from '@pnp/sp';
import swal from 'sweetalert';
import { Web } from '@pnp/sp/webs';
import { Markup } from 'interweave';



export interface IRecognitionRmState {
  Items: any[];
  ItemID:number;

}
const NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet/");

export default class RecognitionRm extends React.Component<IRecognitionRmProps, IRecognitionRmState, {}> {
  public constructor(props: IRecognitionRmProps, state: IRecognitionRmState) {
    super(props);
    this.state = {
      Items: [],
      ItemID:null

    };
  }

  public componentDidMount() {
    setTimeout(function () {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    }, 2000);
    var reactHandler = this;
    // reactHandler.GetCurrentUser();
    const url: any = new URL(window.location.href);
    const ItemID = url.searchParams.get("ItemID");
    reactHandler.GetRcognitionDetails(ItemID);
  }


  public async GetRcognitionDetails(ItemID) {
    
    await NewWeb.lists.getByTitle("Recognition").items.select("Title", "EmployeeName", "EmployeePicture", "StartDate", "EndDate","Description","ID").filter(`IsActive eq '1' and ID eq '${ItemID}'`).getAll().then((items) => { // //orderby is false -> decending   
          
      this.setState({
        Items: items,ItemID: items[0].Id,
      });
     
      
      
    }).catch((err) => {
      console.log(err);
    });
  }
 
  public render(): React.ReactElement<IRecognitionRmProps> {
    var handler = this;
    var Dte = "";
    const RecognitionDetails: JSX.Element[] = this.state.Items.map(function (item, key) {
      
      let RawImageTxt = item.EmployeePicture;
      var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");
      if (RawPublishedDt == tdaydt) {
        Dte = "Today";
      } else {
        Dte = "" + moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY") + "";
      }
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        return (
          <div className="col-md-12 view-all-news-l-col home-detail-banner">
            <div className="view-all-news-recent-left">
              <div className="view-all-news-recent-img-cont">
                <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
              </div>
              <h2 className="nw-list-main"> {item.Title} </h2>
              <div className="ns-tag-duration clearfix">
                <div className="pull-left">
                  <a href="#" className="tags" data-interception="off"> {Dte} </a>
                </div>
              </div>
              <div className="mews-details-para">
                <p> <Markup content={item.Description} /> </p>
              </div>

            </div>
          </div>
        );
      } else {
        return (
          <div className="col-md-12 view-all-news-l-col home-detail-banner">
            <div className="view-all-news-recent-left">
              <div className="view-all-news-recent-img-cont">
                <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/Img/Error%20Handling%20Images/home_banner_noimage.png`} alt="image" />
              </div>
              <h2 className="nw-list-main"> {item.Title} </h2>
              <div className="ns-tag-duration clearfix">
                <div className="pull-left">
                  <a href="#" className="tags" data-interception="off"> {Dte} </a>
                </div>
              </div>
              <div className="mews-details-para">
                <p> <Markup content={item.Description} /> </p>
              </div>
            </div>
          </div>
        );
      }
    });
    // const pagecomments: JSX.Element[] = this.state.commentitems.map(function (item, key) {
    //   var EmpName = item.EmployeeName.Title;
    //   var dated = moment(item.CommentedOn).format("DD/MM/YYYY");
    //   var comment = item.UserComments;
    //   return (
    //     <li>
    //       <div className="commentor-desc clearfix">
    //         <div className="commentor-image">
    //           <img src={`${handler.props.siteurl}/SiteAssets/test/img/userphoto.jpg`} alt="image" />
    //         </div>
    //         <div className="commentor-details-desc">
    //           <h3>  {EmpName} </h3> <span>  {dated}  </span>
    //           <p>  {comment} </p>
    //         </div>
    //       </div>
    //     </li>
    //   );
    // });
    return (
      <div className={styles.recognitionRm}>
        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Regonition </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/Homepage.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                    {/* <li>  <a href={`${this.props.siteurl}/SitePages/Hero-Banner-VMore.aspx`} data-interception="off"> Hero Banner ViewMore </a> </li> */}
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> Recognition</a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec m-b-20">
                  <div className="row">
                    {RecognitionDetails}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
