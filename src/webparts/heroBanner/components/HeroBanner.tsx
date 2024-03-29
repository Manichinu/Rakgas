import * as React from 'react';
import styles from './HeroBanner.module.scss';
import { IHeroBannerProps } from './IHeroBannerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {sp} from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as $ from 'jquery';
import Slider from "react-slick";
import * as moment from 'moment';
import { Web } from "@pnp/sp/webs";

import GlobalSideNav from "../../../extensions/globalCustomFeatures/GlobalSideNav";

SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css");
SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css");
SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js");

export interface IHeroBannerState{
  Items:any[];
  AnncCount:number;
  TotalItem:number;
}
const NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet/"); 
export default class HeroBanner extends React.Component<IHeroBannerProps,IHeroBannerState, {}> {
  constructor(props: IHeroBannerProps, state: IHeroBannerState) {
    super(props);
    this.state = {
    Items: [],
    AnncCount:0,
    TotalItem:0
    };
    }

    public componentDidMount(){
      
      setTimeout(function () {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $("#CommentsWrapper").attr("style", "display: none !important");
      $(".inner-pages-nav").remove();
    }, 2000); 
  
    var reactHandler = this;    
    reactHandler.GetBanner(); 
    }

    private async GetBanner() {
      const d = new Date().toISOString();
      await NewWeb.lists.getByTitle("Hero Banner").items.select("Title","Description", "ExpiresOn", "Image", "ID").filter(`IsActive eq '1' and ExpiresOn ge datetime'${d}'`).orderBy("Created", false).getAll().then((items) => { // //orderby is false -> decending                
        this.setState({
          Items: items,
          AnncCount: items.length
        });
        this.Validate();
      }).catch((err) => {        
        console.log(err);
      });    
    }

      public Validate(){
        var reactHandler = this;
        let Total = reactHandler.state.AnncCount;
        reactHandler.setState({TotalItem:Total});        
              if(reactHandler.state.TotalItem == 0){
                $("#if-Banner-Exist").hide();
                $("#if-Banner-not-Exist").show();
              }else{
                $("#if-Banner-Exist").show();
                $("#if-Banner-not-Exist").hide();
              }
      }
  public render(): React.ReactElement<IHeroBannerProps> {
    const settings = {
      dots: true,
      arrows: true,
      infinite: true,
      speed: 2500,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1
      };
      var handler = this;
      const MAslider: JSX.Element[] = this.state.Items.map(function(item,key) {
        let RawImageTxt = item.Image;
        let dummyElement = document.createElement("DIV");
        dummyElement .innerHTML = item.Description;
        var outputText = dummyElement.innerText;

        if(RawImageTxt != "" && RawImageTxt != null){
          var ImgObj = JSON.parse(RawImageTxt);
          return (
            <div className="item">
              <a href={`${handler.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?env=WebView&ItemID=${item.ID}`} data-interception='off'>
                <div className="banner-parts">
                  <img src={ImgObj.serverRelativeUrl} alt="image" />
                  <div className="overlay"></div>
                  <div className="banner-impot-contents">
                    <h4> {item.Title} </h4>
                    <p> {outputText} </p>
                  </div>
                </div>
              </a>
            </div>
          );
        }
        else if(RawImageTxt == "" || RawImageTxt == null){
          return (            
            <div className="item">
              <a href={`${handler.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?env=WebView&ItemID=${item.ID}`} data-interception='off'>
                <div className="banner-parts">
                  <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/Img/Error%20Handling%20Images/home_banner_noimage.png`} alt="image" />
                  <div className="overlay"></div>
                  <div className="banner-impot-contents">
                    <h4> {item.Title} </h4>
                    <p> {outputText} </p>
                  </div>
                </div>
              </a>
            </div>
          );
        }
      });
    return (
      <div className={ styles.heroBanner }>
        {/* <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={''} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div> */}

       <div className="row">
          <div className="col-md-12">
            <div id="myCarousel" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner">
                <div id="if-Banner-Exist">
                  <Slider {...settings} >              
                    {MAslider}   
                  </Slider>
                </div> 
                <div id="if-Banner-not-Exist" className="background" style={{display:"none"}}>
                  <img className="err-img" src={`${this.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/If_no_Content_to_show.png`} alt="no-image-uploaded" />
                </div>                                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
