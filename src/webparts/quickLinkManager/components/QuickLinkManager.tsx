import * as React from "react";
import { useState } from "react";
import styles from "./QuickLinkManager.module.scss";
import { IQuickLinkManagerProps } from "./IQuickLinkManagerProps";
import { escape } from "@microsoft/sp-lodash-subset";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItemAddResult } from "@pnp/sp/items";
import * as $ from "jquery";
import { SPComponentLoader } from "@microsoft/sp-loader";
import swal from "sweetalert";
import { Web } from "@pnp/sp/presets/all";
import { IListItem } from "./IListItem";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

import Sortable from "sortablejs/modular/sortable.complete.esm.js";
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
export interface IQuickLinkManagerState {
  items: any[];
  ExistingQuickLinksCount: any;
  BgBanner: any[];
  MyQuickLinksPrefference: any[];
  ExistingQL: any[];
  MyQLinksArray: any[];
  IsEditModeisON: boolean;
  IsFavEmpty: boolean;
  AvailableSpaceCount: number;
  ID: any;
  IsTabEmpty: boolean;

  quickitem: any[];
}
var allindex:any=[];
let ExistingQlinks = [];
let MyQlinkArr = [];
let NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet/");
SPComponentLoader.loadCss(
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"'
);
SPComponentLoader.loadCss(
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
);
SPComponentLoader.loadCss(
  "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css"
);
SPComponentLoader.loadCss(
  "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
);
SPComponentLoader.loadCss(
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
);
let tempFavHolderArr = [];

export default class QuickLinkManager extends React.Component<
  IQuickLinkManagerProps,
  IQuickLinkManagerState,
  {}
> {
  public constructor(
    props: IQuickLinkManagerProps,
    state: IQuickLinkManagerState
  ) {
    super(props);
    this.state = {
      items: [],
      ExistingQuickLinksCount: 0,
      BgBanner: [],
      MyQuickLinksPrefference: [],
      ExistingQL: [],
      MyQLinksArray: [],
      IsEditModeisON: false,
      IsFavEmpty: false,
      ID: 0,
      IsTabEmpty: false,
      AvailableSpaceCount: 5,
   
      quickitem: [],
    };
  }

  public componentDidMount() {
    $('.hidelink').hide();
    $(".add-quicklinks").removeClass('open');
    setTimeout(function () {
      $("#spCommandBar").attr("style", "display: none !important");
      $('div[data-automation-id="pageHeader"]').attr(
        "style",
        "display: none !important"
      );
      $("#CommentsWrapper").attr("style", "display: none !important");
    }, 2000);
    this.getcurrentusersQuickLinksForEdit();
    this.getquicklink();
    this.ShowFavs();
   
    var el = document.getElementById('fav-tab-area');
    var sortable = Sortable.create(el, {
      dataIdAttr: 'data-id',
      onEnd: function (/**Event*/evt) {
        $(evt.item).parent().find('.list-group-items').each(function () {
          $(this).find('span').text($(this).index() + 1);
        });
        UpdateQuickLinkOrder();
      },
    });
   
  }
 


  public async getcurrentusersQuickLinksForEdit() {
    tempFavHolderArr = [];
    let web = Web(this.props.siteurl);
    await web.lists
      .getByTitle("UsersQuickLinks")
      .items.select(
        "Id",
        "SelectedQuickLinks/ID",
        "SelectedQuickLinks/Title",
        "SelectedQuickLinks/Id",
        "URL",
        "Order0",
        "ImageSrc"
      )
      .filter(`Author/Id eq ${this.props.userid}`)
      .orderBy("Order0", true)
      .expand("SelectedQuickLinks")
      .get()
      .then((items) => {
        // //orderby is false -> decending
        this.setState({
          MyQuickLinksPrefference: items,
        });
        if (this.state.IsEditModeisON == true) {
          setTimeout(() => {
            $(".delete-quicklinks").addClass("open");
          }, 1500);
        }

        if (items.length != 0) {
          this.setState({
            IsFavEmpty: false,
          });
        } else {
          this.setState({
            IsFavEmpty: true,
          });
          // setTimeout(() => {
          //   $(".mode-edit-on,.mode-edit-off").hide();
          // }, 200);
        }

        this.setState({ MyQLinksArray: items });
        for (var i = 0; i < items.length; i++) {
          tempFavHolderArr.push(items[i].SelectedQuickLinks.ID);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public async getquicklink() {
    // $("#main-block-tab").css("visibility", "hidden");
    setTimeout(() => {
      $(".mode-edit-on,.mode-edit-off").show();
    }, 200);
    
    this.HideFavs();
    let web = Web(this.props.siteurl);
    // NewWeb.lists.getByTitle('Quick Links').items.select("*", "Id", "Title", "URL", "ImageHover","Order0").orderBy("Order0", true).get().then((response) => {
      NewWeb.lists.getByTitle('Quick Links').items.select("Id", "Title", "URL", "ImageHover","Order0").filter(`IsActive eq '1'`).orderBy("Order0", true).get().then((response) => {
    
      this.setState({
        quickitem: response
      });
      if (response.length != 0) {
        this.setState({
          IsTabEmpty: false,
        });
        
        if (this.state.IsEditModeisON == true) {
          setTimeout(() => {
            this.ShowAddBtn();
            this.RemoveActionMenu();
          }, 500);
          setTimeout(() => {
            this.ShowAddBtn();
          }, 1500);
        }
      } else {
        // this.setState({
        //   IsTabEmpty: true,
        // });
      
      } 
    });
    
    
  }
  public async AddToMyQuickLinkPreference(ItemID, ImgSrc, URL, index) {
 
    
    $("#bt-qlink-adder").prop("disabled", true);
    NewWeb.lists.getByTitle("UsersQuickLinks").items.filter(`Author/Id eq ${this.props.userid}`).get().then(async (resp) => {
      if (resp.length < 5) {
          if (tempFavHolderArr.indexOf(ItemID) === -1) {
            const iar: IItemAddResult = await NewWeb.lists.getByTitle("UsersQuickLinks").items.add({
            
                SelectedQuickLinksId:ItemID,
                ImageSrc:ImgSrc,
                URL:URL,
                Order0: 500,
              });
            this.RemoveActionMenu();
          } else {
            $("#bt-qlink-adder").prop("disabled", false);
            swal({
              title: "Aleady exist",
              icon: "warning",
              showConfirmButton: false,
              timer: 1500,
            } as any);
          }
          this.getcurrentusersQuickLinksForEdit();
         
        }else {
          $("#bt-qlink-adder").prop("disabled", false);
          swal({
            title: "No space, only 5 links can be added!",
            icon: "warning",
            showConfirmButton: false,
            timer: 1500,
          } as any);
        }
      });
     
  }

  public EnableEditMode() {
    this.setState({
      IsEditModeisON: true,
    });
    $(".add-quicklinks").addClass("open");
    this.ShowDeletedBtn();
    this.ShowAddBtn();
    this.RemoveActionMenu();
    $(".add-quicklinks").show();
   
  }

  public ExitEditMode() {
    this.setState({
      IsEditModeisON: false,
    });
    $(".add-quicklinks").removeClass("open");
    this.HideDeletedBtn();
    this.HideAddBtn();
    $(".add-quicklinks").hide();
  }

  public HideFavs() {
    $("#main-block-tab").show();
    $("#fav-tab-area").hide();
  }

  public DeleteMyQuickLink(ID: any) {
    swal({
      title: "Are you sure?",
      text: "Do you want to delete this!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    } as any).then((willDelete) => {
      if (willDelete) {
        let list = NewWeb.lists.getByTitle("UsersQuickLinks");
        list.items
          .getById(ID)
          .delete()
          .then(() => {
            swal({
              title: "Deleted Successfully",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            } as any).then(() => {
              this.getcurrentusersQuickLinksForEdit();
            });
            
          });
          
      }
    });
    // setTimeout(() => {
    //   $(".add-quicklinks").addClass("open");
    // }, 500);      
 
  }

  public ShowFavs() {
   
    // $("#main-block-tab").hide();
    $("#fav-tab-area").show();
    this.getcurrentusersQuickLinksForEdit();
  }

  public ShowDeletedBtn() {
    $(".delete-quicklinks").addClass("open");
    
  }

  public HideDeletedBtn() {
    $(".delete-quicklinks").removeClass("open");
    
  }

  public ShowAddBtn() {
    $(".add-quicklinks").addClass("open");
   
  }

  public HideAddBtn() {
    $(".add-quicklinks").removeClass("open");
   
  }

  public RemoveActionMenu() {
    NewWeb.lists
      .getByTitle("UsersQuickLinks")
      .items.select("Id", "SelectedQuickLinks/Id")
      .expand("SelectedQuickLinks")
      .filter(`Author/Id eq ${this.props.userid}`)
      .get()
      .then(async (resp) => {
        if (resp.length != 0) {
          console.log(resp.length);
          for (var i = 0; i < resp.length; i++) {
            $("." + resp[i].SelectedQuickLinks.Id + "-link").hide();
          }
        }
      });
    $("#bt-qlink-adder").prop("disabled", false);
  }
  
   
  
  public render(): React.ReactElement<IQuickLinkManagerProps> {
    var reactHandler = this;
    const AllQuickLinks: JSX.Element[] = reactHandler.state.quickitem.map(
      function (item, key) {
        console.log(item)
        let RawImageTxt = item.ImageHover;
        if (RawImageTxt != "") {
          var ImgObj = JSON.parse(RawImageTxt);
          return (
            <li>
              
              <a href={`${item.URL.Url}`} data-interception="off" target="_blank">
                <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />{" "}
                <p> {item.Title} </p>
              </a>
              <div id={`${item.Id}-link`}className={`${item.Id}-link hidelink add-quicklinks`}>
                
                  <img onClick={() =>reactHandler.AddToMyQuickLinkPreference(item.ID,ImgObj.serverRelativeUrl,item.URL.Url,key + 1)} src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/add_quick.png"alt="image"/>
               
              </div>
            </li>
            //   <li>
            //   <a href="#" data-interception="off">   <img src={`${ImgObj.serverRelativeUrl}`} alt="image"/>
            //     <h5> {item.Title} </h5>
            //     <div className="add-quicklinks">
            //     <div id={`${item.Id}-link`} className={`add-quicklinks ${item.Id}-link`}><a id="bt-qlink-adder" title='Add to Favourites' href="#" onClick={() => reactHandler.AddToMyQuickLinkPreference(item.ID, ImgObj.serverRelativeUrl, item.URL.Url, key + 1)}>
            //        <img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/add_quick.png" alt="image"/>
            //       </a></div>
            //     </div>
            //   </a>
            // </li>
          );
        }
      }
    );

    const AllQuickLinkssmanage: JSX.Element[] =
      reactHandler.state.MyQLinksArray.map(function (item, key) {
        // console.log(item);
        allindex=key+1
        return (
          <li className="list-group-items" tabIndex={key + 1}>

            <span className="indexers"  style={{ display: "none" }} data-value={`${key + 1}|${item.Id}`}>{key + 1}</span>
           
            <a href={`${item.URL}`} data-interception="off" target="_blank">
              <img src={`${item.ImageSrc}`} alt="image" />
              <p> {item.SelectedQuickLinks.Title} </p>
            </a>
            <div  className="delete-quicklinks" title="Remove from Added Quicklink" onClick={() => reactHandler.DeleteMyQuickLink(item.Id)}>
              <img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/remove_q.svg" alt="image"/>
            </div>
          </li>
        );
      });
    return (
      <div className={styles.quickLinkManager}>
        <section>
          <div className="relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Manage Quick Links </h1>
                  <ul className="breadcums">
                    <li> {" "}
                <a href={`${this.props.siteurl}/SitePages/Homepage.aspx?env=WebView`} data-interception="off">{" "}Home{" "}</a>{" "}
                    </li>
                    <li> {" "} <a href="#"style={{ pointerEvents: "none" }}data-interception="off">{" "} Manage Quick Links{" "}
                      </a>{" "}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec">
                  <div className="added-quickis-part">
                    <div className="heading clearfix">
                      <div className="header-left">Added Quicklinks</div>
                      <div className="dragnddrop_text" >

                      <img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/drap_drop.png" alt="image" />

                        You can drag and drop to change position
                        {/* <img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/drap_drop.png" alt="image" /><span id="drag-item-d">You can drag and drop to change position and </span> */}
                        
                      </div>
                      <div className="header-right drap-drop-p">
                        
                        {this.state.IsEditModeisON == false ?
              <a href="#" className='editor-mode-enabler mode-edit-on' onClick={() => this.EnableEditMode()}>Add Quick Links</a>
              :
              <a href="#" className='editor-mode-enabler mode-edit-off' onClick={() => this.ExitEditMode()}>Exit edit mode</a>
            }

                      </div>
                    </div>
                    <div className="section-part">
                   
                    <ul className="qq-links-part clearfix " id="fav-tab-area" style={{ display: "none" }}>

                   {this.state.IsFavEmpty == false ?
                  AllQuickLinkssmanage
                     :
                  <div className='no-fav-records if-favtab-empty if-tab-empty'>
              <h3> No favorites added </h3>    
              </div>
                  }                
                  </ul>
                    </div>
                  </div>
                  
                  <div className="whole-quickis-part">
                    <div className="heading clearfix">
                      <div className="header-left">Quicklinks</div>
                    </div>
                    <div className="section-part">
                    {/* <div id="home" className="tab-pane fade in active"> */}
                    
                      <ul className='qq-links-part clearfix' >
                        {this.state.IsTabEmpty == false ? (
                      
                          AllQuickLinks
                        ) : (
                          <div className="no-fav-records if-tab-empty">
                            {/* <img
                              src="https://taqeef.sharepoint.com/sites/Intranet/SiteAssets/Style%20Library/img/Landing%20Page%20Imgs/no_records.svg"
                              alt="no-fav"
                            /> */}
                            <h3> No records found </h3>
                          </div>
                        )}
                      </ul>
                      </div>
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  public componentDidUpdate(
    prevProps: Readonly<IQuickLinkManagerProps>,
    prevState: Readonly<IQuickLinkManagerState>,
    snapshot?: {}
  ): void {
    setTimeout(() => {
      $("#main-block-tab").css("visibility", "visible");
    }, 1000);
  }

  
}

function UpdateQuickLinkOrder() {
  let list = NewWeb.lists.getByTitle("UsersQuickLinks");
  $("ul li.list-group-items .indexers").each(function () {
    var newIndexValue: any = $(this).data("value");
    newIndexValue = newIndexValue.split("|");
    var ItemID = newIndexValue[1];
    const i = list.items.getById(ItemID).update({
      Order0: $(this).text()
    });
  });

}