import * as React from 'react';
import styles from './Recognition.module.scss';
import { IRecognitionProps } from './IRecognitionProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as $ from 'jquery';
import * as moment from 'moment';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import Slider from "react-slick";
import { SPComponentLoader } from '@microsoft/sp-loader';
import ReactTooltip from "react-tooltip";

SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css");
SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css");

SPComponentLoader.loadScript("https://code.jquery.com/jquery-2.2.0.min.js");
SPComponentLoader.loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js");
SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js");
export interface IRecognitionsState {
  Items: any[];
  TodayEvents: any[];
  TotalRecognition: number;
}

export default class Recognition extends React.Component<IRecognitionProps, IRecognitionsState, {}> {
  constructor(props: IRecognitionProps, state: IRecognitionsState) {
    super(props);
    this.state = {
      Items: [],
      TodayEvents: [],
      TotalRecognition: 0
    };
  }
  public componentDidMount() {
    $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    $('#spCommandBar').attr('style', 'display: none !important');
    this.checkRecognitionAvailability();

    this.get_Recognition_Data();

  }

  public get_Recognition_Data() {
    var reactHandler = this;
    const tdaydate = moment().format('MM-DD-YYYY');

    $.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Recognition')/items?$select=Title,EmployeeName,EmployeePicture,StartDate,EndDate,ID&$filter=EndDate ge '${tdaydate}'&$top=5`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        
        if (resultData.d.results.length != 0) {
          $("#today-award").show();
          // $("#if-no-highlights-present").hide();
          reactHandler.setState({
            TodayEvents: resultData.d.results,
            TotalRecognition: reactHandler.state.TotalRecognition + resultData.d.results.length,
          });
        } else {
          $("#today-award").hide();
        }
        reactHandler.checkRecognitionAvailability();
      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });
  }


  public checkRecognitionAvailability() {
    if (this.state.TotalRecognition == 0) {
      $("#if-recognition-present").hide();
      $("#if-no-recognition-present").show();
    } else {
      $("#if-recognition-present").show();
      $("#if-no-recognition-present").hide();
    }
  }
  public render(): React.ReactElement<IRecognitionProps> {
    var reactHandler = this;
    const settings = {
      dots: false,
      arrows: false,
      infinite: true,
      speed: 1500,
      autoplaySpeed: 3000,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: false
    };
    var handler = this;
    const TodayAward: JSX.Element[] = this.state.TodayEvents.map(function (item, key) {
      var Name = "";
      let Tday = moment().format("MM/DD");
      let RawImageTxt = item.EmployeePicture;
      let AchievementDate = moment(item.StartDate).format("MM/DD");

      if (item.EmployeeName != "") {
        // if (Tday == AchievementDate) {

        Name = item.EmployeeName
        // alert("birth"+Bdaydate+"---"+Name);
        if (RawImageTxt != "" && RawImageTxt != null) {
          var ImgObj = JSON.parse(RawImageTxt);
          return (
            <div className="sec">
              <a href={`${handler.props.siteurl}/SitePages/Recognition-Read.aspx?ItemID=${item.ID}&env=WebView`} data-interception='off'>
                {/* <a href="#" data-interception='off'> */}
                {/* https://rakgasae.sharepoint.com/sites/Intranet/SitePages/Recognition-Read.aspx */}

                <div className="heading" id="spotlight-title" title="Birthday">
                  <a href="#" style={{ cursor: "default" }} data-interception="off">
                    <span id="highlights-type"> Recognition</span>
                  </a>
                </div>
                <div className="section-part clearfix">
                  <div className="birthday-image relative">
                    <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
                    {/* <div className="birday-icons">
                      <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/birthday.svg`} alt="image" />
                    </div> */}
                  </div>
                  <div className="birthday-details">
                    <h4 data-tip data-for={"React-tooltip-title-today-" + key + ""} data-custom-class="tooltip-custom"> {Name} </h4>
                    <p data-tip data-for={"React-tooltip-Desig-today-" + key + ""} data-custom-class="tooltip-custom"> {item.Title}  </p>
                  </div>
                </div>
              </a>
            </div>
          );
        }
        else {
          return (
            <div className="sec">
              <a href={`${handler.props.siteurl}/SitePages/Recognition-Read.aspx?ItemID=${item.ID}&env=WebView`} data-interception='off'>

                <div className="heading" id="spotlight-title" title="Birthday">
                  <a href="#" style={{ cursor: "default" }} data-interception="off">
                    <span id="highlights-type"> Recognition</span>
                  </a>
                </div>
                <div className="section-part clearfix">
                  <div className="birthday-image relative">
                    <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/userphoto.jpg`} alt="image" />
                    {/* <div className="birday-icons">
                      <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/birthday.svg`} alt="image" />
                    </div> */}
                  </div>
                  <div className="birthday-details">
                    <h4 data-tip data-for={"React-tooltip-title-today-" + key + ""} data-custom-class="tooltip-custom"> {Name} </h4>
                    <p data-tip data-for={"React-tooltip-Desig-today-" + key + ""} data-custom-class="tooltip-custom"> {item.Title}  </p>
                  </div>
                </div>
              </a>
            </div>
          );
        }
      }

      //  }
    }
    );
    // const TodayAward: JSX.Element[] = this.state.TodayEvents.map(function (item, key) {
    //   var AwardTitle = item.Title;
    //   var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
    //   var Dte = "" + moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY") + "";

    //   return (
    //     <div>
    //       <div className="award-wrap">
    //         <div className="award-image">
    //           <img src='https://dasholding.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/award_img.png'></img>
    //         </div>
    //         <div className="award-desc">
    //           <p>{Dte}</p>
    //           <p>{AwardTitle}</p>
    //           <a href={`${AttachmentFile}`} className="readmore transition" target="_blank" data-interception="off">View Award<img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/right_arrow.svg`} className="transition" alt="image" />  </a>

    //         </div>
    //       </div>
    //     </div>
    //   );
    // }
    // );
    return (
      <div className={styles.recognition} id="recognition-web">
        <div className="birthday-wrap m-b-20" id="if-recognition-present">
          <div id="today-award"  >
            <Slider {...settings} id="SliderItemsBday">
              {TodayAward}
            </Slider>
          </div>
        </div>
        <div className="birthday-wrap m-b-20" id="if-no-recognition-present" >
          <div className="sec" style={{ height: "142px" }}>
            <div className="heading" id="spotlight-title">
              <a href="#" style={{ cursor: "default" }} data-interception="off">
                <span id="highlights-type" className="clearfix"> Recognition  </span>
              </a>
            </div>
            <div className="section-part clearfix">
              <div className="birthday-image relative">

              </div>
              <div className="birthday-details">
                <h4></h4>
                <p className="text-center"> No achievement at this moment.  </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
