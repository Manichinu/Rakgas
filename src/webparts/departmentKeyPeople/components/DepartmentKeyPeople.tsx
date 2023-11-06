import * as React from 'react';
import styles from './DepartmentKeyPeople.module.scss';
import { IDepartmentKeyPeopleProps } from './IDepartmentKeyPeopleProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import Slider from "react-slick";
import { Markup } from 'interweave';
import { sp } from '@pnp/sp';
SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css");
SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css");
SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js");
 
export interface IDepartmentKeyPeopleState{
  Items:any[];  
  nav1;
  nav2;
  PrevNodeIndexval:number;
  NextNodeIndexval:number;
}
export default class DepartmentKeyPeople extends React.Component<IDepartmentKeyPeopleProps,IDepartmentKeyPeopleState, {}> {
  slider2: any; 
  slider1: any;
  public constructor(props:IDepartmentKeyPeopleProps, state: IDepartmentKeyPeopleState){
    super(props);
    this.state = {
      Items: [],
      nav1: null,
      nav2: null,
      PrevNodeIndexval:0,
      NextNodeIndexval:0
    };
    }

    public componentDidMount(){  
      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      // $('#spCommandBar').attr('style', 'display: none !important');  
      $('#spLeftNav').attr('style', 'display: none !important');  
      this.GetDepartmentKeyPeople();

      this.setState({
        nav1: this.slider1,
        nav2: this.slider2
      });     
      
      setTimeout(function(){
        $('div[data-automation-id="CanvasControl"]').attr('style', 'padding: 0px !important; margin: 0px !important');
      },500);
    }

    public GetDepartmentKeyPeople(){
      var reactHandler = this;           
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Department KeyPeople')/items?$select=ID,Title,About,Name/Title,Name/EMail,Name/Department,Name/JobTitle,Created,KeyPeoplePicture&$filter=IsActive eq 1&$orderby=Order0 asc&$expand=Name`,  
        type: "GET",
        headers:{'Accept': 'application/json; odata=verbose;'},
        success: function(resultData) 
      //   {
      //   reactHandler.setState({
      //     Items: resultData.d.results
      //   });                
      // },
      {
        if(resultData.d.results.length == 0){
          $("#if-key-people-present").hide();
          $("#if-no-key-people-present").show();            
        }else{
          $("#if-key-people-present").show();
          $("#if-no-key-people-present").hide();
          reactHandler.setState({
            Items: resultData.d.results
          });
        }         
      },
      error : function(jqXHR, textStatus, errorThrown) {
      }
      });
    }

    // public async GetDepartmentKeyPeople() {
    //   var reactHandler = this;
  
    //   await sp.web.lists.getByTitle("Department KeyPeople").items
    //     .select("ID", "Title", "About", "Name/Title", "Name/EMail", "Name/Department", "Name/JobTitle", "Created", "KeyPeoplePicture").filter(`IsActive eq 1'`)
    //     .orderBy("Order0", true).expand("Name")
    //     .get().then((items) => {
  
    //       reactHandler.setState({
    //         Items: items
    //       });
    //     }).catch((err) => {
    //       console.log(err);
    //     });
    // }

  public render(): React.ReactElement<IDepartmentKeyPeopleProps> {
    const settings = {
      dots: false,
      arrows: false,
      infinite: false,
      autoplaySpeed: 5000,
      speed: 2000,
      autoplay: true,      
      slidesToShow: 1,
      slidesToScroll: 1      
      };

      const MAslider: JSX.Element[] = this.state.Items.map(function(item,key) {
        let RawImageTxt = item.KeyPeoplePicture;
        if(RawImageTxt != "" && RawImageTxt != null){
          var ImgObj = JSON.parse(RawImageTxt);
          return (            
            <div className="key-contacts-top clearfix"> 
              <div className="key-contacts-people-det">
                <h2> {item.Name.Title} </h2>
                <h5>  {item.Name.EMail} </h5>
                <p>  <Markup content={item.About} />  </p>
              </div>
              <div className="key-contacts-people-img">
                <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
                <div className="dept-overlay">  </div>
                <h4> {item.Name.JobTitle} </h4>
              </div>
            </div>
          );
        }        
      });

      const MAslider2: JSX.Element[] = this.state.Items.map(function(item,key) {
        let RawImageTxt = item.KeyPeoplePicture;
        if(RawImageTxt != "" && RawImageTxt != null){
          var ImgObj = JSON.parse(RawImageTxt);
          return (            
            <li className="clearfix"> 
              <div className="ket-small-img">
                <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
              </div>    
              <div className="ket-small-desc">
                <h4>  {item.Name.Title} </h4>
                <p> {item.Name.Department} </p>
              </div>    
            </li>
          );
        }
      });
    return (
      <div className={ styles.departmentKeyPeople }>
        <section id="dept-master-keyppl-wrap">
          <div className="relative">    
            <div className="section-rigth">
              <div className="department-inner-wrap clearfix row">
                <div className="col-md-12">
                  <div className="depat-key-people dept-sub m-b-20">
                    <div className="sec">
                      <div className="heading">
                        Key People
                      </div>
                      <div className="section-part clearfix" id="if-key-people-present" >                                        
                      <Slider {...settings} 
                        asNavFor={this.state.nav2}
                        ref={slider => (this.slider1 = slider)}
                        >              
                          {MAslider}   
                      </Slider>
                        <div className="key-contacts-bottom relative"> 
                          <ul>
                          <Slider
                            asNavFor={this.state.nav1}
                            ref={slider => (this.slider2 = slider)}
                            slidesToShow={5}
                            swipeToSlide={true}
                            focusOnSelect={true}
                            infinite={false}
                            centerMode={false}
                            pauseOnHover={true}
                          
                          >{MAslider2}</Slider>
                          </ul>
                        </div>
                      </div> 
                      <div className="row" style={{display:"none"}} id="if-no-key-people-present">
                  <div className="col-md-12 m-b-0 clearfix">
                    <img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ContentEmpty.png" alt="no-content"></img>
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
