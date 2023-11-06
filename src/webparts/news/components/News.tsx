import * as React from 'react';
import styles from './News.module.scss';
import { INewsProps } from './INewsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import Slider from "react-slick";
import { Web } from '@pnp/sp/presets/all';
import { sp } from '@pnp/sp';
const NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet/");


SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css");
SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css");

SPComponentLoader.loadScript("https://code.jquery.com/jquery-2.2.0.min.js");
SPComponentLoader.loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js");
SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js");

export interface INewsState {
  Items: any[];
  ItemCount: number;
}

export default class News extends React.Component<INewsProps, INewsState, {}> {

  constructor(props: INewsProps, state: INewsState) {
    super(props);
    this.state = {
      Items: [],
      ItemCount: 2
    };

  }

  public componentDidMount() {
    setTimeout(function () {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $("#CommentsWrapper").attr("style", "display: none !important");
      $('#RecommendedItems').attr('style', 'display: none !important');
    }, 2000);


    var reactHandler = this;
    reactHandler.GetNews();

  }

  public async GetNews() {
    var reactHandler = this;
    // $.ajax({
    //   url: `${this.props.siteurl}/_api/web/lists/getbytitle('News')/items?$select=ID,Title,Description,Created,Dept/Title,Image,Tag,DetailsPageUrl,SitePageID/Id&$filter=IsActive eq 1&$orderby=Created desc&$expand=SitePageID,Dept`,
    //   type: "GET",
    //   headers: { 'Accept': 'application/json; odata=verbose;' },
    //   success: function (resultData) {
    await NewWeb.lists.getByTitle("News").items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id").filter("IsActive eq 1").orderBy("Created", false).expand("Dept", "SitePageID").get().then((items) => {
      if (items.length == 0) {
        $("#if-news-present").hide();
        $("#if-no-news-present").show();
      } else {
        $("#if-news-present").show();
        $("#if-no-news-present").hide();
      }
      if (items.length <= 1) {
        reactHandler.setState({ ItemCount: 1 });
      } else {
        reactHandler.setState({ ItemCount: 2 });
      }
      reactHandler.setState({
        Items: items
      });

      // },
      // error: function (jqXHR, textStatus, errorThrown) {
      // }
    });
  }

  // private async GetNews() {
  //   var reactHandler = this;

  //   await NewWeb.lists.getByTitle("News").items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id").expand("SitePageID", "Dept")
  //     .filter(`IsActive eq '1'`).orderBy("Created", false)

  //     .get().then((items) => { // //orderby is false -> decending  
  //       console.log("items", items);

  //       if (items.length == 0) {
  //         $("#if-news-present").hide();
  //         $("#if-no-news-present").show();
  //       } else {
  //         $("#if-news-present").show();
  //         $("#if-no-news-present").hide();
  //       }
  //       if (items.length <= 1) {
  //         this.setState({ ItemCount: 1 });
  //       } else {
  //         this.setState({ ItemCount: 2 });
  //       }
  //       this.setState({
  //         Items: items
  //       });

  //     }).catch((err) => {
  //       console.log(err);
  //     });
  // }

  public SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <a href="#" onClick={onClick} style={{ ...style, display: "block" }} className="pull-right"> <img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/icon_next.svg" data-interception="off" />  <span id="nxt-node-ttle">  </span>  </a>
    );
  }

  public SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <a href="#" onClick={onClick} style={{ ...style, display: "block" }} className="pull-left" data-interception="off"> <img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/icon_back.svg" />  <span id="prev-node-ttle">  </span>  </a>
    );
  }


  public render(): React.ReactElement<INewsProps> {
    const settings = {
      dots: false,
      //arrows: true,
      infinite: true,
      speed: 500,
      autoplay: false,
      slidesToShow: this.state.ItemCount, //Value Comes From State
      slidesToScroll: 2,
      nextArrow: <this.SampleNextArrow />,
      prevArrow: <this.SamplePrevArrow />,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
            arrows: false,
            autoplay: false,
            centerMode: false
          }
        }
      ]
    };
    var viewall = `${this.props.siteurl}/SitePages/NewsViewMore.aspx?env=WebView`;
    var reactHandler = this;
    var Dt = "";
    const Newsslider: JSX.Element[] = this.state.Items.map(function (item, key) {
      let RawImageTxt = item.Image;
      var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");
      if (RawPublishedDt == tdaydt) {
        Dt = "Today";
      } else {
        Dt = "" + RawPublishedDt + "";
      }
      if (item.Dept != undefined) {
        var depttitle = item.Dept.Title
      }
      if (item.SitePageID != undefined) {
        var sitepageid = item.SitePageID.Id
      }

      if (RawImageTxt != "" && RawImageTxt != null) {
        //var ImgObj = `https://remodigital.sharepoint.com/sites/ClientPOC/${RawImageTxt.serverRelativeUrl}`;
        var ImgObj = JSON.parse(RawImageTxt);
        return (
          <div className="news-section-block clearfix">
            <div className="news-whole-block-img">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <div className="news-whole-block-details">
              {/* <a href={`${item.DetailsPageUrl}?env=WebViewList&ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}`} data-interception="off">{item.Title}</a> </h4> */}

              <h4>  <a href={`${item.DetailsPageUrl}?env=WebViewList&ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}`} data-interception="off">{item.Title}</a> </h4>
              <h5> <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> {Dt} </h5>
            </div>
          </div>
        );
      } else {
        return (
          <div className="news-section-block clearfix">
            <div className="news-whole-block-img">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="no-image-uploaded" />
            </div>
            <div className="news-whole-block-details">
              <h4>  <a href={`${item.DetailsPageUrl}?env=WebViewList&ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}`} data-interception="off">{item.Title}</a> </h4>

              {/* <h4>  <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${item.Dept.Title}&SitePageID=${item.SitePageID.Id}&env-WebView`} data-interception="off">{item.Title}</a> </h4> */}
              <h5> <img src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clock.svg`} alt="Time"></img> {Dt} </h5>
            </div>
          </div>
        );
      }
    });

    return (
      <div className={[styles.news, "m-b-15 m-b-20-news"].join(' ')} id="m-b-20-news">
        <div className="news-wrap m-b-20">
          <div className="sec event-cal" id="if-news-present">
            <div className="heading">
              <a href={viewall} data-interception="off">News</a>
            </div>
            <div className="section-part clearfix">
              <div className="news-section-wrap clearfix">
                <Slider {...settings}>
                  {Newsslider}
                </Slider>
              </div>
            </div>
          </div>

          <div className="sec event-cal" id="if-no-news-present" style={{ display: "none" }}>
            <div className="heading">
              <a href="#" data-interception="off"> News</a>
            </div>
            <div className='hse-events-err'>
              <img className="err-img" src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="no-image-uploaded" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
