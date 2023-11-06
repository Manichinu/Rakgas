import * as React from 'react';
import styles from './AnnouncementsRm.module.scss';
import { IAnnouncementsRmProps } from './IAnnouncementsRmProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { Web } from "@pnp/sp/webs";
import { Markup } from 'interweave';
import { SPComponentLoader } from '@microsoft/sp-loader';
import GlobalSideNav from "../../../extensions/globalCustomFeatures/GlobalSideNav";

export interface IAnnouncementsRmState {
  Items: any[];
  ItemID: number;
}
const NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet/");


export default class AnnouncementsRm extends React.Component<IAnnouncementsRmProps, IAnnouncementsRmState, {}> {
  constructor(props: IAnnouncementsRmProps, state: IAnnouncementsRmState) {
    super(props);
    this.state = {
      Items: [],
      ItemID: null
    };
  }

  public componentDidMount() {
    setTimeout(function () {

      $('#spCommandBar').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');

    }, 2000);

    var reactHandler = this;
    const url: any = new URL(window.location.href);
    const ItemID = url.searchParams.get("ItemID");
    reactHandler.GetAnnouncementsDetails(ItemID);
  }

  public async GetAnnouncementsDetails(ItemID) {
    await NewWeb.lists.getByTitle("Announcement").items.select("Title", "Description", "Created", "Image", "ID", "PublishingDate", "Attachments", "AttachmentFiles").expand("AttachmentFiles").filter(`IsActive eq '1' and ID eq '${ItemID}'`).getAll().then((items) => { // //orderby is false -> decending          
      this.setState({
        Items: items, ItemID: items[0].Id
      });
      console.log(items)
    }).catch((err) => {
      console.log(err);
    });
  }


  public render(): React.ReactElement<IAnnouncementsRmProps> {
    var handler = this;
    var Dte = "";
    const AnncDetails: JSX.Element[] = this.state.Items.map(function (item, key) {
      let RawImageTxt = item.Image;
      var RawPublishedDt = moment(item.PublishingDate, "YYYY-MM-DD").format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");
      if (RawPublishedDt == tdaydt) {
        Dte = "Today";
      } else {
        Dte = "" + moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY") + "";
      }
      if (RawImageTxt != "" && RawImageTxt != null) {
        var URLs;
        var ImgObj = JSON.parse(RawImageTxt);
        if (ImgObj.serverRelativeUrl == undefined) {
          if (item.AttachmentFiles.length != 0) {
            URLs = item.AttachmentFiles[0].ServerRelativeUrl
          }
        } else {
          URLs = ImgObj.serverRelativeUrl
        }
        return (
          <div className="col-md-12 view-all-news-l-col home-detail-banner">
            <div className="view-all-news-recent-left">
              <div className="view-all-news-recent-img-cont">
                <img src={`${URLs}`} alt="image" />
              </div>
              <h2 className="nw-list-main"> {item.Title} </h2>
              <div className="ns-tag-duration clearfix">
                <div className="pull-left">
                  <a href="#" className="tags" style={{ pointerEvents: "none" }} data-interception="off"> {Dte} </a>
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
                <img src={`${handler.props.siteurl}/SiteAssets/Portal%20Assets/Img/Error%20Handling%20Images/home_banner_noimage.png`} alt="image" />
              </div>
              <h2 className="nw-list-main"> {item.Title} </h2>
              <div className="ns-tag-duration clearfix">
                <div className="pull-left">
                  <a href="#" className="tags" style={{ pointerEvents: "none" }} data-interception="off"> {Dte} </a>
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
    return (
      <div className={styles.announcementsRm} id="annc-read-mb-t-50">
        {/* <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={''} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div> */}
        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Announcements </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/Homepage.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                    <li>  <a href={`${this.props.siteurl}/SitePages/Announcement-View-More.aspx?env=WebView`} data-interception="off"> All Announcements </a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> Announcements ReadMore </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec m-b-20">
                  <div className="row">
                    {AnncDetails}
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
