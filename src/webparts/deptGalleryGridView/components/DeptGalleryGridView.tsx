import * as React from 'react';
import styles from './DeptGalleryGridView.module.scss';
import { IDeptGalleryGridViewProps } from './IDeptGalleryGridViewProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import Slider from "react-slick";
import GlobalSideNav from "../../../extensions/globalCustomFeatures/GlobalSideNav";

export interface IGalleryGridViewState {
  Images: any[];
  Videos: any[];
  items: any[];
  type: string;
  FolderItems: any[];
  nav1;
  nav2;
  FolderURL: string;
  // FolderURLGrid:string;
  Mode: string;
  slideIndex: number;
  updateCount: number;
  Type: string;
}
SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css");
SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css");
SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js");

export default class DeptGalleryGridView extends React.Component<IDeptGalleryGridViewProps, IGalleryGridViewState, {}> {
  slider2: any;
  slider1: any;
  public constructor(props: IDeptGalleryGridViewProps, state: IGalleryGridViewState) {
    super(props);
    this.state = {
      Images: [],
      Videos: [],
      items: [],
      type: "",
      FolderItems: [],
      nav1: null,
      nav2: null,
      FolderURL: "",
      //  FolderURLGrid:"",
      Mode: "",
      slideIndex: 0,
      updateCount: 0,
      Type: ""
    };
  }


  public componentDidMount() {
    setTimeout(() => {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');

      // $('#webPartContainer').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');

      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $('#spLeftNav').attr('style', 'display: none !important');

      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    }, 2000);

    const url: any = new URL(window.location.href);
    const Type = url.searchParams.get("Type");
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2,
      Type: Type,
      type: Type
    });
    this.GetGalleryFilesFolder("Main");

    if (Type == "Img") {
      $(".vdo-block-cntnt").removeClass("active");
      $(".img-block-cntnt").addClass("active");
    } else {
      $(".img-block-cntnt").removeClass("active");
      $(".vdo-block-cntnt").addClass("active");
    }

    $(".img-galler-section-cls ul li").on("click", function () {
      $(this).siblings().removeClass("active");
      $(this).addClass("active");
    });
  }

  public GetGalleryFilesFolder(triggeredFrom) {
    var reactHandler = this;
    var APIUrl;
    const url: any = new URL(window.location.href);


    const FolderUrl = url.searchParams.get("FolderName");
    const Type = url.searchParams.get("Type");
    this.setState({ FolderURL: FolderUrl, Type: Type });
   

    if (triggeredFrom == "Main") {
      if (Type == "Img") {
        APIUrl = `${reactHandler.props.siteurl}/_api/Web/GetFolderByServerRelativeUrl(${FolderUrl})?$expand=Folders,Files`;
      } else {
        APIUrl = `${reactHandler.props.siteurl}/_api/Web/GetFolderByServerRelativeUrl(${FolderUrl}/Videos)?$expand=Folders,Files`;
      }
    } else {
      if (reactHandler.state.type == "Img") {
        APIUrl = `${reactHandler.props.siteurl}/_api/Web/GetFolderByServerRelativeUrl(${FolderUrl})?$expand=Folders,Files`;
      } else {
        var string = FolderUrl.split('/');
        var str2 = "Videos";
        if (string.indexOf(str2) != -1) {
          APIUrl = `${reactHandler.props.siteurl}/_api/Web/GetFolderByServerRelativeUrl(${FolderUrl})?$expand=Folders,Files`;

        }
        else {
          var FolderPath = url.searchParams.get("FolderName").replace(/[']/g, '');
          var FolderServerRelativeUrl = "" + FolderPath + "/Videos";
          APIUrl = `${reactHandler.props.siteurl}/_api/Web/GetFolderByServerRelativeUrl('${FolderServerRelativeUrl}')?$expand=Folders,Files`;
        }
      }
    }
    $.ajax({
      async: true,
      url: APIUrl,// URL to fetch data from sharepoint list                
      method: "GET",
      headers: {
        "accept": "application/json;odata=verbose",
        "content-type": "application/json;odata=verbose"
      },
      success: function (resultData) {

        if (reactHandler.state.type == "Img") {
          $(".image-gallery-allimg-block").show();
          if (resultData.d.Files.results.length != 0) {
            $("#no-video").hide();
            reactHandler.setState({
              Images: resultData.d.Files.results
            });
          }
          var string = FolderUrl.split('/');
          var str2 = "Videos";
          if (string.indexOf(str2) != -1) {
            $("#no-video").show();
          }


        }
        else {


          $(".video-gallery-allimg-block").show();
          ;

          reactHandler.setState({
            Videos: resultData.d.Files.results
          });

          if (resultData.d.Files.results.length == 0) {
            $("#no-video").show();
          }
          else {
            $("#no-video").hide();
          }


        }
      },
      error: function (error) {
        console.log(JSON.stringify(error));
        if (reactHandler.state.type == "Img") { }
        else {

          $("#no-video").show();
          $("#trigger-video").hide();
        }
      }
    });

  }

  public async ShowImages() {
    this.setState({
      Images:[],
      Videos:[]
    })
    await this.setState({ type: "Img" });
    $(".image-gallery-allimg-block").show();
    $(".video-gallery-allimg-block").hide();
    // setTimeout(() => {
      this.GetGalleryFilesFolder("ImgBlock");
    // }, 500);
  }

  public async ShowVideos() {
    this.setState({
      Images:[],
      Videos:[]
    })
    await this.setState({ type: "Vdo" });
    $(".image-gallery-allimg-block").hide();
    $(".video-gallery-allimg-block").show();
    // setTimeout(() => {
      this.GetGalleryFilesFolder("VdoBlock");
    // }, 500);
  }

  public GetImagesInsideFolder(FolderURL, Mode, key) {
    var siteurl: string;
    this.setState({ FolderURL: FolderURL });
    $(".lightbox").addClass("open");
    var reactHandler = this;
    reactHandler.setState({ Mode: Mode });
    if (Mode == "Image") {
      $("#trigger-image").hide();
      $("#trigger-video").show();
      siteurl = "" + reactHandler.props.siteurl + "/_api/Web/GetFolderByServerRelativeUrl(" + FolderURL + ")?$select=ID,Title,FileRef,FileSystemObjectType,FileLeafRef,File/ServerRelativeUrl,File/Name&$expand=Folders,Files";
    } else if (Mode == "Video") {
      $("#trigger-video").hide();
      $("#trigger-image").show();
      var FolderPath = FolderURL.replace(/[']/g, '');
      var FolderServerRelativeUrl = "" + FolderPath + "/Videos";
      var string = FolderURL.split('/');
      var str2 = "Videos";
      if (string.indexOf(str2) != -1) {
        $("#trigger-image").hide();
        siteurl = "" + reactHandler.props.siteurl + "/_api/Web/GetFolderByServerRelativeUrl(" + FolderURL + ")?$select=ID,Title,FileRef,FileSystemObjectType,FileLeafRef,File/ServerRelativeUrl,File/Name&$expand=Folders,Files";

      }
      else {

        siteurl = "" + reactHandler.props.siteurl + "/_api/Web/GetFolderByServerRelativeUrl('" + FolderServerRelativeUrl + "')?$select=ID,Title,FileRef,FileSystemObjectType,FileLeafRef,File/ServerRelativeUrl,File/Name&$expand=Folders,Files";
      }
    }
    this.ShowHideVideos(FolderURL, Mode);
    $.ajax({
      async: false,
      url: siteurl,// URL to fetch data from sharepoint Picture Library                
      method: "GET",
      headers: {
        "accept": "application/json;odata=verbose",
        "content-type": "application/json;odata=verbose"
      },
      success: async function (resultData) {
        reactHandler.setState({
          FolderItems: resultData.d.Files.results
        });

      },
      error: function (error) {
        console.log(JSON.stringify(error));
        if (Mode == "Video") {

          $("#trigger-video").hide();
        }
      }
    });
  }
  public ShowHideVideos(FolderURL, Mode) {


    var reactHandler = this;
    var siteurl: string;
    // reactHandler.setState({Mode:Mode}); 
    var FolderPath = FolderURL.replace(/[']/g, '');
    var FolderServerRelativeUrl = "" + FolderPath + "/Videos";
    var string = FolderURL.split('/');
    var str2 = "Videos";

    if (string.indexOf(str2) != -1) {
      // siteurl = "https://rakgasae.sharepoint.com/sites/Intranet/_api/Web/GetFolderByServerRelativeUrl("+FolderURL+")?$select=ID,Title,FileRef,FileSystemObjectType,FileLeafRef,File/ServerRelativeUrl,File/Name&$expand=Folders,Files";          
      siteurl = "" + reactHandler.props.siteurl + "/_api/Web/GetFolderByServerRelativeUrl(" + FolderURL + ")?$select=ID,Title,FileRef,FileSystemObjectType,FileLeafRef,File/ServerRelativeUrl,File/Name&$expand=Folders,Files";

    }
    else {
      siteurl = `${reactHandler.props.siteurl}/_api/Web/GetFolderByServerRelativeUrl('${FolderServerRelativeUrl}')?$expand=Folders,Files`;// URL to fetch data from sharepoint Picture Library                

    }

    $.ajax({
      async: false,
      url: siteurl,
      method: "GET",
      headers: {
        "accept": "application/json;odata=verbose",
        "content-type": "application/json;odata=verbose"
      },
      success: async function (resultData) {

        if (resultData.d.Files.results.length == 0) {
          $("#trigger-video").hide();
        }

      },
      error: function (error) {
        console.log(JSON.stringify(error));

        $("#trigger-video").hide();
      }
    });
  }
  public CloseLightBox() {
    $(".lightbox").removeClass("open");
  }
  public render(): React.ReactElement<IDeptGalleryGridViewProps> {
    var reactHandler = this;
    const settings = {
      dots: false,
      arrows: true,
      infinite: false,
      speed: 500,
      autoplay: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: () =>
        this.setState(state => ({ updateCount: state.updateCount + 1 })),
      beforeChange: (current, next) => this.setState({ slideIndex: next })
    };

    const Images: JSX.Element[] = this.state.Images.map(function (item, key) {
      var filename = item.Name;
      var completeurl = item.ServerRelativeUrl;
      var Len = filename.length;
      var Dot = filename.lastIndexOf(".");
      var type = Len - Dot;
      var res = filename.substring(Dot + 1, Len);
      var ext = res.toLowerCase();


      var string = completeurl.split('/');
      var str2 = "Videos";

      if (ext != "mp4" && ext != "mov" && ext != "wmv" && ext != "flv" && ext != "mov" && ext != "avi" && ext != "avchd" && ext != "webm" && ext != "mkv") {

        return (
          <li className="li-img-area" data-value={key} onClick={function (event) { reactHandler.GetImagesInsideFolder(reactHandler.state.FolderURL, "Image", key); reactHandler.slider1.slickGoTo(key) }}>
            <img src={`${item.ServerRelativeUrl}`} alt="Image" />
          </li>
        );
      }
    });

    const Videos: JSX.Element[] = this.state.Videos.map(function (item, key) {
      return (
        <li className="li-video-area" onClick={function (event) { reactHandler.GetImagesInsideFolder(reactHandler.state.FolderURL, "Video", key); reactHandler.slider1.slickGoTo(key) }}>
          <video className="lg-video-object lg-html5" >
            <source src={`${item.ServerRelativeUrl}`} type="video/mp4" />
          </video>
        </li>
      );
    });

    const MAslider2: JSX.Element[] = this.state.FolderItems.map(function (item, key) {

      if (reactHandler.state.Mode == "Image") {
        var filename = item.Name;
        var completeurl = item.ServerRelativeUrl;
        var Len = filename.length;
        var Dot = filename.lastIndexOf(".");
        var type = Len - Dot;
        var res = filename.substring(Dot + 1, Len);
        var ext = res.toLowerCase();


        var string = completeurl.split('/');
        var str2 = "Videos";
        if (ext != "mp4" && ext != "mov" && ext != "wmv" && ext != "flv" && ext != "mov" && ext != "avi" && ext != "avchd" && ext != "webm" && ext != "mkv") {

          return (
            <li> <a href="#" data-interception="off"> <img src={`${item.ServerRelativeUrl}`} alt="image" /> </a> </li>
          );
        }
      } else if (reactHandler.state.Mode == "Video") {
        return (
          <li><a href="#" data-interception="off">
            <video className="lg-video-object lg-html5">
              <source src={`${item.ServerRelativeUrl}`} type="video/mp4" />
            </video>
          </a></li>
        );
      }
    });
    return (
      <div className={styles.deptGalleryGridView}>
         {/* <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={''} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div> */}

        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Gallery Grid View </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/Home.aspx?env=WebView`} data-interception="off"> Home</a> </li>
                    <li>  <a href={`${this.props.siteurl}/SitePages/Gallery-ViewMore.aspx?env=WebView`} data-interception="off"> Gallery Folders </a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> Grid View </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents gallery-viewall-imgs">
                <div className="top-news-sections category-news-sec m-b-20">
                  <div className="sec">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="img-galler-section-cls">
                          <ul>
                            <li className="img-block-cntnt">
                              <a href="#" onClick={() => this.ShowImages()} data-interception="off"> Images </a>
                            </li>
                            <li className="vdo-block-cntnt">  <a href="#" onClick={() => this.ShowVideos()} data-interception="off"> Videos </a>  </li>
                            <div className="section-part clearfix latest-events-bck" id="no-video" style={{ display: "none" }}>
                              <div className="clearfix img-block-area">
                                <img className="err-img" src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ContentEmpty.png" alt="no-image-uploaded" />
                              </div>
                            </div>
                          </ul>
                        </div>
                        <div className="section-part clearfix">
                          <ul className="clearfix image-gallery-allimg-block" id="lightgallery" style={{ display: "none" }}>
                            {Images}
                          </ul>
                          <ul className="clearfix video-gallery-allimg-block" style={{ display: "none" }}>
                            {Videos}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lightbox">
            <div className="gallery-lightbox-contents">
              <div className="lightbox-contents-img">
                <div className="lightbox-contents-header clearfix">
                  <ul>
                    <li id="trigger-image" className={this.state.Mode == "Image" ? "imageblock" : ""} > <a href="#" onClick={() => this.GetImagesInsideFolder(this.state.FolderURL, "Image", 0)} data-interception="off"> Pictures  </a> </li>
                    <li id="trigger-video" className={this.state.Mode == "Video" ? "videoblock" : ""} > <a href="#" onClick={() => this.GetImagesInsideFolder(this.state.FolderURL, "Video", 0)} data-interception="off"> Videos  </a> </li>
                    {/*<li> <a href={`${this.props.siteurl}/SitePages/Gallery-Grid-View.aspx?FolderName=${this.state.FolderURL}&Type=Img&env=WebViewList`} data-interception="off"> Grid View  </a> </li>*/}
                  </ul>
                </div>
                <div className="lightbox-contents-body">
                  <Slider {...settings}
                    asNavFor={this.state.nav2}
                    ref={slider => (this.slider1 = slider)}
                  >
                    {this.state.FolderItems && this.state.FolderItems.map(function (item, key) {
                      if (reactHandler.state.Mode == "Image") {
                        var filename = item.Name;
                        var completeurl = item.ServerRelativeUrl;
                        var Len = filename.length;
                        var Dot = filename.lastIndexOf(".");
                        var type = Len - Dot;
                        var res = filename.substring(Dot + 1, Len);
                        var ext = res.toLowerCase();
                        if (ext != "mp4" && ext != "mov" && ext != "wmv" && ext != "flv" && ext != "mov" && ext != "avi" && ext != "avchd" && ext != "webm" && ext != "mkv") {


                          return (
                            <>
                              <img src={`${item.ServerRelativeUrl}`} alt="image" />
                              <h4 style={{ color: '#ffffff' }}>{item.Name}</h4>
                            </>
                          );
                        }
                      } else if (reactHandler.state.Mode == "Video") {
                        return (
                          <>
                            <video className="lg-video-object lg-html5" controls>
                              <source src={`${item.ServerRelativeUrl}`} type="video/mp4" />
                            </video>
                            <h4 style={{ color: '#ffffff' }}>{item.Name}</h4>
                          </>
                        );
                      }
                    })}
                  </Slider>
                </div>
                <div className="lightbox-conent-thumbnails">
                  <ul className="clearfix">
                    <Slider
                      asNavFor={this.state.nav1}
                      ref={slider => (this.slider2 = slider)}
                      slidesToShow={4}
                      swipeToSlide={true}
                      focusOnSelect={true}
                      infinite={false}
                      autoplay={false}
                      arrows={false}
                      centerMode={false}
                      responsive={[
                        {
                          breakpoint: 1000,
                          settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1,
                            infinite: false,
                            dots: false,
                            arrows: false,
                            autoplay: false,
                            centerMode: false
                          }
                        }
                      ]
                      }
                    >
                      {MAslider2}
                    </Slider>
                  </ul>
                </div>
                <div className="lightbox-close">
                  <img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/close.svg" alt="close" onClick={() => this.CloseLightBox()} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
