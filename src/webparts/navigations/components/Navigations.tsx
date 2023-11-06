import * as React from 'react';
import styles from './Navigations.module.scss';
import { INavigationsProps } from './INavigationsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as $ from 'jquery';
import { Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import ReactTooltip from "react-tooltip";
import { SPComponentLoader } from '@microsoft/sp-loader';


export interface INavigationsState {
  MainNavItems: any[];
  DeptandQuickLinksItems: any[];
  QuickLinkItems: any[];
  SelectedNav: any[];
  showdata: any[];
  showdataqlink: any[];
  IsAdminForContentEditor: boolean;
}

let SelectedDepartments = [];
let BreadCrumb = [];
const ActivePageUrl = (window.location.href.split('?') ? window.location.href.split('?')[0] : window.location.href).toLowerCase();
const NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet/");
export default class Navigations extends React.Component<INavigationsProps, INavigationsState, {}> {
  private displayData;
  private displayDataQlink;
  public constructor(props: INavigationsProps, state: INavigationsState) {
    super(props);
    this.displayData = [];
    this.displayDataQlink = [];
    this.appendData = this.appendData.bind(this);
    this.appendDataQLink = this.appendDataQLink.bind(this);

    this.state = {
      MainNavItems: [],
      DeptandQuickLinksItems: [],
      QuickLinkItems: [],
      SelectedNav: [],
      showdata: [],
      showdataqlink: [],
      IsAdminForContentEditor: false,
    }
  }

  public componentDidMount() {
    // $('.clears-subnav-quick').hide();   
    // $(".quick-hides").hide();
    $('.floating-content-editor-home').addClass('active')
    $('.clears-subnav').hide();
    $('#spCommandBar').attr('style', 'display: none !important');
    $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    BreadCrumb = [];
    this.GetMainNavItems();
    this.EnableContentEditorForSuperAdmins();
  }


  public async EnableContentEditorForSuperAdmins() {
    let groups = await NewWeb.currentUser.groups();
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].Title == "ContentPageEditors") {
        this.setState({ IsAdminForContentEditor: true }); //To Show Content Editor on Center Nav to Specific Group Users alone
        //alert("1");
      } else {

      }
    }
  }

  public async GetMainNavItems() {
    var reactHandler = this;
    try {
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Navigations')/items?$select=Title,URL,OpenInNewTab,LinkMasterID/Title,LinkMasterID/Id,URL,HoverOnIcon,HoverOffIcon&$filter=IsActive eq 1&$orderby=Order0 asc&$top=10&$expand=LinkMasterID`,
        type: "GET",
        headers: { 'Accept': 'application/json; odata=verbose;' },
        success: function (resultData) {
          reactHandler.setState({
            MainNavItems: resultData.d.results
          });
          console.log(resultData.d.results);
          
          $('#root-nav-links ul li').on('click', function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
          });
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
      });
    } catch (err) {
      console.log("Navigation Main Nav : " + err);
    }
  }

  public GetDepartments() {
    $('.clears-subnav').show();
   
    $('.floating-content-editor-home').addClass('active')
    $('.breadcrum-block').addClass('open');
    $(".breadcrum-block").show();
    var reactHandler = this;
    reactHandler.displayData = [];
    BreadCrumb = [];
    $(".main-mavigation").siblings().removeClass("submenu");
    $(".main-mavigation").addClass("submenu");
    try {
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,ID,URL,HasSubDept,OpenInNewTab,PlaceUnder/Title,PlaceUnder/Id&$filter=IsActive eq 1&$orderby=Order0 asc&$expand=PlaceUnder/Id,PlaceUnder`,
        type: "GET",
        headers: { 'Accept': 'application/json; odata=verbose;' },
        success: function (resultData) {
          reactHandler.setState({
            DeptandQuickLinksItems: resultData.d.results
          });
          for (var i = 0; i < resultData.d.results.length; i++) {
            if (resultData.d.results[i].PlaceUnder.Title == undefined) {
              let ID = resultData.d.results[i].Id;
              var Title = resultData.d.results[i].Title;
              var Url = resultData.d.results[i].URL.Url;
              let OpenInNewTab = resultData.d.results[i].OpenInNewTab;
              let HasSubDept = resultData.d.results[i].HasSubDept;
              reactHandler.appendData(ID, Title, OpenInNewTab, HasSubDept, Url);
            }
          }
          $(".submenu-wrap-lists ul li").on("click", function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
           
          });
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
      });
    } catch (err) {
      console.log("Navigation Department Link : " + err);
    }
  }

  public GetQuickLinks() {
    $('.floating-content-editor-home').addClass('active')
    $('.clears-subnav-quick').show();
    $('.clears-subnav').hide();
    var reactHandler = this;
    reactHandler.displayDataQlink = [];
    BreadCrumb = [];
    $(".main-mavigation").siblings().removeClass("submenu");
    $(".main-mavigation").addClass("submenu");
    try {
      $.ajax({
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=Title,OpenInNewPage,URL,Image,ImageHover,centernavigationicon&$filter=IsActive eq 1&$orderby=Order0 asc`,
        type: "GET",
        headers: { 'Accept': 'application/json; odata=verbose;' },
        success: function (resultData) {
          reactHandler.setState({
            QuickLinkItems: resultData.d.results
          });
          for (var i = 0; i < resultData.d.results.length; i++) {
            var Title = resultData.d.results[i].Title;
            var Url = resultData.d.results[i].URL.Url;
            let OpenInNewTab = resultData.d.results[i].OpenInNewPage;
            var HoverOff = resultData.d.results[i].Image;
            var HoverOffImage = JSON.parse(HoverOff);
            let HoverOn = resultData.d.results[i].ImageHover;
            var HoverOnImage = JSON.parse(HoverOn);
            let Centernav = resultData.d.results[i].centernavigationicon;
            // var centernavigationicon = JSON.parse(Centernav);           
            reactHandler.appendDataQLink(Title, OpenInNewTab, Url, HoverOffImage, HoverOnImage, Centernav);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
      });
    } catch (err) {
      console.log("Navigation Quick Link : " + err);
    }
  }

  public GetSubNodes(ID, Title, ClickFrom, key) {
  
    $('.floating-content-editor-home').addClass('active')
    $(".breadcrum-block").show();
    $('.clears-subnav').show();
    if (ClickFrom == "Breadcrumb") {
      var IndexValue = key;
      for (var i = 0; i < BreadCrumb.length; i++) {
        if (i > IndexValue) {
          BreadCrumb.splice(i);
        }
      }
    } else {
      BreadCrumb.push({ "Title": Title, "ID": ID });
    }

    var reactHandler = this;
    reactHandler.displayData = [];
    SelectedDepartments.unshift(ID);
    $.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,ID,URL,HasSubDept,OpenInNewTab,PlaceUnder/Title,PlaceUnder/Id&$filter=IsActive eq 1 and PlaceUnder/Id eq '${ID}'&$orderby=Order0 asc&$expand=PlaceUnder`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactHandler.setState({
          DeptandQuickLinksItems: resultData.d.results
        });
        for (var i = 0; i < resultData.d.results.length; i++) {
          let ItemID = resultData.d.results[i].Id;
          var Title = resultData.d.results[i].Title;
          var Url = resultData.d.results[i].URL.Url;
          let OpenInNewTab = resultData.d.results[i].OpenInNewTab;
          let HasSubDept = resultData.d.results[i].HasSubDept;
          reactHandler.appendData(ItemID, Title, OpenInNewTab, HasSubDept, Url);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });
  }

  public appendData(ID, Title, OpenInNewTab, HasSubDept, Url) {
    var reactHandler = this;
    if (OpenInNewTab == true) {
      if (HasSubDept == true) {
        reactHandler.displayData.push(<li id='head-dept'>
          {/* <a href={Url} target="_blank" data-interception="off" role="button"> <span>{Title}</span></a> */}
         
          <p id="head-dept" className={"deptdropdown-" + ID + ""}  onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off"> <span className="point-er-dept imgdept">{Title}</span><img className="point-er-dept" src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/white_arrow.png`} alt="nav"></img> </p>
        </li>);
      } else if(HasSubDept != true) {
        reactHandler.displayData.push(<li>
          <a href={Url} target="_blank" data-interception="off" role="button" > <span>{Title}</span></a>
        </li>);
      }
    } else {
      if (HasSubDept == true) {
        reactHandler.displayData.push(<li id='head-dept'>
          {/* <a href={Url} data-interception="off" role="button"> <span>{Title}</span></a> */}
          
          <p id="head-dept" className={"deptdropdown-" + ID + ""}  onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off"> <span className="point-er-dept">{Title}</span><img className="point-er-dept imgdept" src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/white_arrow.png`} alt="nav"></img> </p>
        </li>);
      } else if(HasSubDept != true) {
        reactHandler.displayData.push(<li>
          <a href={Url} data-interception="off" role="button" > <span>{Title}</span></a>
        </li>);
      }
    }
    reactHandler.setState({
      showdata: reactHandler.displayData
    });
  }

  public appendDataQLink(Title, OpenInNewTab, Url, HoverOffImage, HoverOnImage, Centernav) {
    var reactHandler = this;
    console.log(Centernav);

    if (Centernav != "" && Centernav != null) {
      console.log("center nav image present");

      var centernavigationicon = JSON.parse(Centernav);
      if (OpenInNewTab == true) {
        reactHandler.displayDataQlink.push(<li>
          <a href={Url} target="_blank" data-interception="off" role="button">
            <img className="DarkImage" src={centernavigationicon.serverRelativeUrl} alt="image" />
            <img className="LightImage" src={HoverOnImage.serverRelativeUrl} alt="image" />
            <p>{Title}</p></a>
        </li>);
      } else {
        reactHandler.displayDataQlink.push(<li>
          <a href={Url} data-interception="off" role="button" >
            <img className="DarkImage" src={centernavigationicon.serverRelativeUrl} alt="image" />
            <img className="LightImage" src={HoverOnImage.serverRelativeUrl} alt="image" />
            <p>{Title}</p></a>
        </li>);
      }
    }
    else {
      if (OpenInNewTab == true) {
        reactHandler.displayDataQlink.push(<li>
          <a href={Url} target="_blank" data-interception="off" role="button">
            <img className="DarkImage" src={HoverOffImage.serverRelativeUrl} alt="image" />
            <img className="LightImage" src={HoverOnImage.serverRelativeUrl} alt="image" />
            <p>{Title}</p></a>
        </li>);
      } else {
        reactHandler.displayDataQlink.push(<li>
          <a href={Url} data-interception="off" role="button" >
            <img className="DarkImage" src={HoverOffImage.serverRelativeUrl} alt="image" />
            <img className="LightImage" src={HoverOnImage.serverRelativeUrl} alt="image" />
            <p>{Title}</p></a>
        </li>);
      }
    }
    reactHandler.setState({
      showdataqlink: reactHandler.displayDataQlink
    });
  }

  public ClearNavigation() {
    BreadCrumb = [];
    $('.breadcrum-block').removeClass('open');
    $('.clears-subnav-quick').hide();
    $('.clears-subnav').hide();
    $(".breadcrum-block").hide();
    $(".main-mavigation").removeClass("submenu");
    $('#root-nav-links ul li').siblings().removeClass('active');
    $(".submenu-wrap-lists ul li").siblings().removeClass('active');
    $('#root-nav-links ul li:first-child').addClass('active');

    this.displayData = [];
    this.displayDataQlink = [];
  }

  public render(): React.ReactElement<INavigationsProps> {
    var handler = this;

    const MainNavigations: JSX.Element[] = handler.state.MainNavItems.map(function (item, key) {
      let RawImageTxtOn = item.HoverOnIcon;
      let RawImageTxtOff = item.HoverOffIcon;
      if (RawImageTxtOn != null || RawImageTxtOn != undefined && RawImageTxtOff != null || RawImageTxtOff != undefined) {
        var ImgObjforON = JSON.parse(RawImageTxtOn);
        var ImgObjforOFF = JSON.parse(RawImageTxtOff);
        if (item.OpenInNewTab == true) {
          if (item.LinkMasterID.Title == "DEPT_00001") {
            return (
              <li> <a href="#" className='dept-main-head' onClick={() => handler.GetDepartments()} data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" data-interception="off" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a>
               
                <div className="submenu-wrap-lists department-wrap">
               
                  {/* <div className="submenu-clear-wrap ">
                    <a href="#" className="submenu-clear" data-tip data-for={"React-tooltip-clear"} data-custom-class="tooltip-custom" data-interception="off" onClick={() => handler.ClearNavigation()} >   <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clear.svg`} alt="image" />  </a>
                    <ReactTooltip id={"React-tooltip-clear"} place="right" type="dark" effect="solid">
                      <span>Clear</span>
                    </ReactTooltip>
                  </div> */}
                  <ul className="clearfix">
                    {handler.state.showdata}
                  </ul>
                </div>
              </li>
            );
          }
          if (item.LinkMasterID.Title == "QLINK_00002") {
            return (
              <li> <a href="#" onClick={() => handler.GetQuickLinks()}> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" data-interception="off" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a>
                
                <div className="submenu-wrap-lists q-links-dpt">
                <a href='#' id='quick-hides'  className="clears-subnav-quick" onClick={() => handler.ClearNavigation()}>All Menu<img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Right arrow12.png`} alt="nav" data-interception="off"></img></a>
                  {/* <div className="submenu-clear-wrap">
                    <a href="#" className="submenu-clear" data-tip data-for={"React-tooltip-clear"} data-custom-class="tooltip-custom" onClick={() => handler.ClearNavigation()}>   <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clear.svg`} alt="image" />  </a>
                    <ReactTooltip id={"React-tooltip-clear"} place="right" type="dark" effect="solid">
                      <span>Clear</span>
                    </ReactTooltip>
                  </div> */}
                  <ul className="clearfix">
                    {handler.state.showdataqlink}
                  </ul>
                </div>
              </li>
            );
          }
          if (item.LinkMasterID.Title == undefined) {
            var str2 = item.Title;
            var ContentEditorURL = item.URL;
            var conturl = ContentEditorURL.toLowerCase();
            conturl = conturl.split("?");
            var DomID2 = str2.replace(/[_\W]+/g, "_");

            if (item.Title == "Home") {
              return (
                <li className="active" id={DomID2}> <a href={`${item.URL}`} target="_blank" data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
              );
            } else if (conturl[0] == "https://rakgasae.sharepoint.com/sites/intranet/sitepages/content-editor.aspx") {
              if (handler.state.IsAdminForContentEditor == true) {
                return (
                  <li className='floating-content-editor floating-content-editor-home' data-tip data-for={"React-tooltip-contenteditor"} data-custom-class="tooltip-custom"> <a href={`${item.URL}`} target="_blank" data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" />  </a>
                    <ReactTooltip id={"React-tooltip-contenteditor"} place="top" type="dark" effect="solid">
                      <span>Content Editor</span>
                    </ReactTooltip>
                  </li>
                );
              }
            } else {
              return (
                <li id={DomID2}> <a href={`${item.URL}`} target="_blank" data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
              );
            }
          }
        } else {
          if (item.LinkMasterID.Title == "DEPT_00001") {
            return (
              <li> <a href="#" className='dept-main-head' onClick={() => handler.GetDepartments()}> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" data-interception="off" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a>
              
                <div className="submenu-wrap-lists department-wrap">
              
                  {/* <div className="submenu-clear-wrap">
                    <a href="#" className="submenu-clear" data-tip data-for={"React-tooltip-clear"} data-custom-class="tooltip-custom" onClick={() => handler.ClearNavigation()} data-interception="off">   <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clear.svg`} alt="image" />  </a>
                    <ReactTooltip id={"React-tooltip-clear"} place="right" type="dark" effect="solid">
                      <span>Clear</span>
                    </ReactTooltip>
                  </div> */}
                  <ul className="clearfix">
                    {handler.state.showdata}
                  </ul>
                </div>
              </li>
            );
          }
          if (item.LinkMasterID.Title == "QLINK_00002") {
            return (
              <li> <a href="#" onClick={() => handler.GetQuickLinks()}> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" data-interception="off" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a>
                 
                <div className="submenu-wrap-lists q-links-dpt">
                <a href='#' id='quick-hides'  className="clears-subnav-quick" onClick={() => handler.ClearNavigation()}>All Menu<img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Right arrow12.png`} alt="nav" data-interception="off"></img></a>
                  {/* <div className="submenu-clear-wrap">
                    <a href="#" className="submenu-clear" data-tip data-for={"React-tooltip-clear"} data-custom-class="tooltip-custom" onClick={() => handler.ClearNavigation()} data-interception="off">   <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/clear.svg`} alt="image" />  </a>
                    <ReactTooltip id={"React-tooltip-clear"} place="right" type="dark" effect="solid">
                      <span>Clear</span>
                    </ReactTooltip>
                  </div> */}
                  <ul className="clearfix">
                    {handler.state.showdataqlink}
                  </ul>
                </div>
              </li>
            );
          }
          if (item.LinkMasterID.Title == undefined) {

            var str = item.Title;
            var ContentEditorURL = item.URL;
            var conturl = ContentEditorURL.toLowerCase();
            conturl = conturl.split("?");
            var DomID = str.replace(/[_\W]+/g, "_");

            if (item.Title == "Home") {
              return (
                <li className="active" id={DomID}> <a href={`${item.URL}`} data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
              );
            }
            else if (conturl[0] == "https://rakgasae.sharepoint.com/sites/intranet/sitepages/content-editor.aspx") {
              if (handler.state.IsAdminForContentEditor == true) {
                return (
                  <li className='floating-content-editor floating-content-editor-home ' data-tip data-for={"React-tooltip-contenteditor"} data-custom-class="tooltip-custom"> <a href={`${item.URL}`} data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" />   </a>
                    <ReactTooltip id={"React-tooltip-contenteditor"} place="top" type="dark" effect="solid">
                      <span>Content Editor</span>
                    </ReactTooltip>
                  </li>
                );
              }
            }
            else {
              return (
                <li id={DomID}> <a href={`${item.URL}`} data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
              );
            }
          }
        }
      }
    });

    return (
      <div className={styles.navigations}>
        <div className="main-mavigation m-b-20">
          <nav className="sec" id="root-nav-links">
         
            <div className="breadcrum-block">
            <a href='#'   className="clears-subnav" onClick={() => handler.ClearNavigation()}>All Menu<img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Right arrow12.png`} alt="nav" data-interception="off"></img></a>
              {BreadCrumb.map((item, key) => (
                <a href="#" id="b-d-crumb" data-index={key} onClick={() => handler.GetSubNodes(item.ID, item.Title, "Breadcrumb", key)}>{item.Title}<img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Right arrow12.png`} alt="nav" data-interception="off"></img></a>
              ))}
            </div>
            <ul className="clearfix">
              {MainNavigations}
            </ul>
          </nav>

        </div>
      </div>
    );
  }
}
