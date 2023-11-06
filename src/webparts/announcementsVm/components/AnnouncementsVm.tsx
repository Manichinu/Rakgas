import * as React from 'react';
import styles from './AnnouncementsVm.module.scss';
import { IAnnouncementsVmProps } from './IAnnouncementsVmProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as $ from 'jquery';
import * as moment from 'moment';
import { SPComponentLoader } from '@microsoft/sp-loader';
import GlobalSideNav from "../../../extensions/globalCustomFeatures/GlobalSideNav";
import { Web } from '@pnp/sp/webs';

const NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet/");

export interface IAnnouncementsVmState {
  Items: any[];
}

export default class AnnouncementsVm extends React.Component<IAnnouncementsVmProps, IAnnouncementsVmState, {}> {
  constructor(props: IAnnouncementsVmProps, state: IAnnouncementsVmState) {
    super(props);
    this.state = {
      Items: []
    };
  }

  public componentDidMount() {

    var reactHandler = this;
    setTimeout(function () {
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $('#spCommandBar').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');

    }, 2000);
    reactHandler.GetAllAnnouncements();
  }

  // private GetAllAnnouncements() {
  //   // $('#spCommandBar').attr('style', 'display: none !important');
  //   // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
  //   // $('#CommentsWrapper').attr('style', 'display: none !important');

  //   var reactHandler = this;          
  //   var APIUrl = `${this.props.siteurl}/_api/web/lists/getbytitle('Announcement')/items?$select=Title,Image,ID,Created&$filter=IsActive eq 1`;
  //   $.ajax({
  //     url: APIUrl,
  //     type: "GET",
  //     headers:{'Accept': 'application/json; odata=verbose;'},
  //     success: function(resultData) {              
  //       reactHandler.setState({
  //         Items: resultData.d.results
  //       });             
  //     },
  //     error : function(jqXHR, textStatus, errorThrown) {
  //     }
  //   });
  // }

  private async GetAllAnnouncements() {
    var reactHandler = this;

    await NewWeb.lists.getByTitle("Announcement").items.select("ID", "Title", "Created", "Image", "PublishingDate", "Attachments", "AttachmentFiles").expand("AttachmentFiles")
      .filter(`IsActive eq '1' `).orderBy("Created", false).getAll().then((items) => { // //orderby is false -> decending          
        let sortedDetails = items.sort(
          (p1, p2) => (p1.PublishingDate < p2.PublishingDate) ? 1 : (p1.PublishingDate > p2.PublishingDate) ? -1 : 0);
        console.log(sortedDetails)
        this.setState({
          Items: sortedDetails,
        });

      }).catch((err) => {
        console.log(err);
      });
  }

  public render(): React.ReactElement<IAnnouncementsVmProps> {
    var handler = this;
    var Dt = "";
    const AnncAllDetails: JSX.Element[] = this.state.Items.map(function (item, key) {
      let RawImageTxt = item.Image;
      var RawPublishedDt = moment(item.PublishingDate, "YYYY-MM-DD").format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");
      if (RawPublishedDt == tdaydt) {
        Dt = "Today";
      } else {
        Dt = "" + moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY") + "";
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
          <li>
            <div className="top-img-wrap">
              <img src={`${URLs}`} alt="image" />
            </div>
            <div className="ns-tag-duration ">
              <a href="#" className="tags" style={{ pointerEvents: "none" }} data-interception="off"> {Dt} </a>
            </div>
            <a href={`${handler.props.siteurl}/SitePages/Announcement-Read-More.aspx?env=WebView&ItemID=${item.ID}`} data-interception='off' className="nw-list-main top-news-a"> {item.Title} </a>

          </li>
        );
      }
      else if (RawImageTxt == "" || RawImageTxt == null) {
        return (
          <li>
            <div className="top-img-wrap">
              <img src={`${handler.props.siteurl}/SiteAssets/Portal%20Assets/Img/Error%20Handling%20Images/home_banner_noimage.png`} alt="image" />
            </div>
            <div className="ns-tag-duration ">
              <a href="#" className="tags" style={{ pointerEvents: "none" }} data-interception="off"> {Dt} </a>
            </div>
            <a href={`${handler.props.siteurl}/SitePages/Announcement-Read-More.aspx?env=WebView&ItemID=${item.ID}`} data-interception='off' className="nw-list-main top-news-a"> {item.Title} </a>

          </li>
        );
      }
    });
    return (
      <div className={styles.announcementsVm} id="annc-view-mb-t-50">
        {/* <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={''} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div> */}
        <section>
          <div className="relative">

            <div className="section-rigth">

              <div className="inner-banner-header relative m-b-20">

                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Announcements </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/Homepage.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                    <li>  <a href="#" data-interception="off" style={{ pointerEvents: "none" }} >  All Announcements </a> </li>
                  </ul>
                </div>

              </div>
              <div className="inner-page-contents banner-viewall">

                <div className="top-news-sections category-news-sec m-b-20">
                  <div className="sec">

                    <div className="row">
                      <div className="col-md-12">

                        <div className="section-part clearfix">
                          <ul>
                            {AnncAllDetails}
                          </ul>
                        </div>
                      </div>
                    </div>
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
