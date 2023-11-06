import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { ISpfxWeatherProps } from './loc/ISpfxWeatherProps';
import * as $ from 'jquery';
import { ServiceProvider } from '../globalCustomFeatures/services/ServiceProvider';
import { Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import ReactTooltip from "react-tooltip";
import * as moment from "moment";
import Slider from "react-slick";


setTimeout(function () {
  $('html').css("visibility", "visible");
  $('html').addClass('loading-in-progress');
}, 1200);

export interface ISideNavProps {
  siteurl: string;
  context: any;
  currentWebUrl: string;
  CurrentPageserverRequestPath: string;
}
export interface ISideNavState {
  myMailDatas: any[];
  myMeetingsDatas: any[];
  EmailCount: any;
  MeetingsCount: any;
  CurrentPageUrl: any;
  IsAdminForContentEditor: boolean;

  MainNavItems: any[];
  DeptandQuickLinksItems: any[];
  QuickLinkItems: any[];
  SelectedNav: any[];
  showdata: any[];
  showdataLevelTwo: any[];
  showdataqlink: any[];

  showdataResponsive: any[];
  showdataLevelTwoResponsive: any[];
  showdataqlinkResponsive: any[];
  CurrentUserID: number;
  CurrentUserName: string;
  CurrentUserDesignation: string;
  CurrentUserProfilePic: string;
  SiteLogo: string;
  IsSeen: string;
}

var UserVisitationItemId;
var AlertItems = [];
let BreadCrumb = [];
const NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet/");
export default class GlobalSideNav extends React.Component<ISideNavProps, ISideNavState, {}>
{
  private serviceProvider;
  private displayData;
  private displayDataLevel2;
  private displayDataQlink;


  private displayDataResponsive;
  private displayDataLevel2Responsive;
  private displayDataQlinkResponsive;
  public constructor(props: ISideNavProps, state: {}) {
    super(props);
    this.serviceProvider = new ServiceProvider(this.props.context);

    this.displayData = [];
    this.displayDataLevel2 = [];
    this.displayDataQlink = [];

    this.displayDataResponsive = [];
    this.displayDataLevel2Responsive = [];
    this.displayDataQlinkResponsive = [];
    this.appendData = this.appendData.bind(this);
    this.appendDataLevelTwo = this.appendDataLevelTwo.bind(this);
    this.appendDataQLink = this.appendDataQLink.bind(this);

    /*External Files*/
    //SPComponentLoader.loadCss(`https://fonts.googleapis.com/css?family=Roboto:300,400,500,700`);
    SPComponentLoader.loadCss(`https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css`);
    SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);

    SPComponentLoader.loadCss(`https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/css/SP-NativeStyle-Overriding.css?v=3.3`);
    SPComponentLoader.loadCss(`https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/css/style.css?v=7.0`);
    SPComponentLoader.loadCss(`https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/css/Responsive.css?v=4.6`);

    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css");
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css");
    SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js");

    SPComponentLoader.loadScript('https://code.jquery.com/jquery-3.6.0.min.js', {
      globalExportsName: 'jQuery'
    }).then(() => {
      SPComponentLoader.loadScript('https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js', {
        globalExportsName: 'jQuery'
      }).then(($: any) => {
        SPComponentLoader.loadScript('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js', {
          globalExportsName: 'jQuery'
        });
      });
    });


    this.state = {
      myMailDatas: [],
      myMeetingsDatas: [],
      EmailCount: "",
      MeetingsCount: "",
      CurrentPageUrl: "",
      IsAdminForContentEditor: false,

      MainNavItems: [],
      DeptandQuickLinksItems: [],
      QuickLinkItems: [],
      SelectedNav: [],
      showdata: [],
      showdataLevelTwo: [],
      showdataqlink: [],

      showdataResponsive: [],
      showdataLevelTwoResponsive: [],
      showdataqlinkResponsive: [],
      CurrentUserID: 0,
      CurrentUserName: "",
      CurrentUserDesignation: "",
      CurrentUserProfilePic: "",
      SiteLogo: "",
      IsSeen: ""
    };
  }


  public componentDidMount() {
    this.GetCurrentLoggedUser();
    $(document).on("click", function (e) {

      if ($(e.target).is("#user-img") != false) {
        $(".user-profile-details").addClass("open");

      } else {
        $(".user-profile-details").removeClass("open");

      }
    });

    $(document).on("click", function (e) {

      if ($(e.target).is("#hide-quick") != false) {
        $(".global-qlink-main").addClass("open");

      } else {
        $(".global-qlink-main").removeClass("open");

      }
    });


    $(document).on("click", function (e) {
      //  const target = e.target as unknown as Element;

      var container = $(".global-dept-main");
      // if (!container.is(target) && container.has(target).length === 0) {
      if ($(e.target).is("#deeept") != false) {

        $(".global-dept-main").addClass("open");

      } else {

        $(".global-dept-main").removeClass("open");

      }

    });





    $('#spLeftNav').attr('style', 'display: none !important');
    // $("#spCommandBar").attr("style", "display: none !important");

    const ActivePageUrl = (window.location.href.split('?') ? window.location.href.split('?')[0] : window.location.href).toLowerCase();

    this.getUnreadmailCount();
    this.getmymeetings();
    this.GetMainNavItems();
    this.BindPlaceholderLogo();
    this.GetCurrentUserDetails();
    this.setState({
      CurrentPageUrl: ActivePageUrl
    });

    $('.globalleftmenu-fixed-area ul li').on('click', function () {
      $(this).siblings().removeClass('active');
      $(this).siblings().removeClass('open');
      $(this).addClass('active');
      $(this).toggleClass('open');
    });

    $(".reponsive-quick-wrap .main-menu ul li.submenu a img").on("click", function () {
      //$(this).toggleClass('active');
      var self = $(this).parent();
      self.toggleClass("active");
    });


    if (ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/sitepages/homepage.aspx" || ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/sitepages/homepage.aspx#" ||
      ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet" || ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet#" || ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/" ||
      ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/#") {
      setTimeout(function () {
        $('div[data-automation-id="CanvasControl"]').attr('style', 'padding: 0px !important; margin: 0px !important');

      }, 500);
      $(".inner-pages-nav").hide();
      //   $("#master_footer_parent").hide();
      setTimeout(function () {
        $('#master_footer_parent').attr('style', 'display: none !important');

      }, 2000);
    }

    if (ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/eventsactivities/sitepages/homepage.aspx" || ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/eventsactivities/sitepages/homepage.aspx#" ||
      ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/eventsactivities" || ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/eventsactivities#" || ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/eventsactivities/" ||
      ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/eventsactivities/#") {
      $('#spLeftNav').attr('style', 'display: none !important');
      $('#sp-appBar,#spSiteHeader,#SuiteNavWrapper').attr('style', 'display: none !important');

    }
    if (ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/learningportal/sitepages/homepage.aspx" || ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/learningportal/sitepages/homepage.aspx#" ||
      ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/learningportal" || ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/learningportal#" || ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/learningportal/" ||
      ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/learningportal/#") {
      $('#spLeftNav').attr('style', 'display: none !important');
      $('#sp-appBar,#spSiteHeader,#SuiteNavWrapper').attr('style', 'display: none !important');

    }
    if (ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/offerspromotions/sitepages/homepage.aspx" || ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/offerspromotions/sitepages/homepage.aspx#" ||
      ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/offerspromotions" || ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/offerspromotions#" || ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/offerspromotions/" ||
      ActivePageUrl == "https://rakgasae.sharepoint.com/sites/intranet/offerspromotions/#") {
      $('#spLeftNav').attr('style', 'display: none !important');
      $('#sp-appBar,#spSiteHeader,#SuiteNavWrapper').attr('style', 'display: none !important');

    }

    setTimeout(function () {
      $('html').css("visibility", "visible");
      $('html').removeClass('loading-in-progress');
    }, 1800);

    setTimeout(function () {
      $('html').css("visibility", "visible");
      $('html').removeClass('loading-in-progress');
    }, 2500);

    setTimeout(function () {
      $('html').css("visibility", "visible");
      $('html').removeClass('loading-in-progress');
    }, 3000);
    setTimeout(function () {
      $('html').css("visibility", "visible");
      $('html').removeClass('loading-in-progress');
    }, 5000);

    var style = document.createElement('style');
    style.innerHTML =
      '#sp-appBar {' +
      'display: none !important;' +
      '}';
    var ref = document.querySelector('script');
    ref.parentNode.insertBefore(style, ref);

    //Click Outside to remove mobile view left menu
    document.addEventListener("mousedown", (event) => {
      const target = event.target as Element;
      var container = $(".reponsive-quick-wrap");
      if (!container.is(target) && container.has(target).length === 0) {
        $(".responsive-menu-wrap ").removeClass("open");
      }
    });

    //Click Outside to remove mobile view search
    document.addEventListener("mousedown", (event) => {
      const target = event.target as Element;
      var container = $(".search");
      if (!container.is(target) && container.has(target).length === 0) {
        $(".responsive-background").removeClass("open");
        $(".search").removeClass("open");
      }
    });
  }



  public GetCurrentUserDetails() {
    var reacthandler = this;
    $.ajax({
      url: `${reacthandler.props.siteurl}/_api/SP.UserProfiles.PeopleManager/GetMyProperties`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        console.log(resultData.d.Id);
        var email = resultData.d.Email;
        var Name = resultData.d.DisplayName;
        var Designation = resultData.d.Title;
        reacthandler.setState({
          CurrentUserName: Name,
          CurrentUserDesignation: Designation,
          CurrentUserProfilePic: `${reacthandler.props.siteurl}/_layouts/15/userphoto.aspx?size=l&username=${email}`
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });
  }
  public async GetCurrentLoggedUser() {
    await NewWeb.currentUser.get().then((user) => {
      console.log(user);
      this.setState({
        CurrentUserID: user.Id
      })
      this.CheckUserVisitation();

    }, (errorResponse) => {
    }
    );
  }
  // check the current user have seen the alert message or not
  public CheckUserVisitation() {
    NewWeb.lists.getByTitle("Alerts User Visit Transactions").items.filter(`UserId eq '${this.state.CurrentUserID}'`).getAll().then((items) => {
      console.log(items)
      if (items.length != 0) {
        for (var i = 0; i < items.length; i++) {
          var Today = moment().format("DD/MM/YYYY");
          var CreatedDate = moment(items[i].Created).format("DD/MM/YYYY");
          if (this.state.CurrentUserID == items[i].UserId && Today == CreatedDate && items[i].IsSeen == true) {
            console.log("Seen")
            $("#myCarousel").hide();
            this.setState({
              IsSeen: "Yes"
            })
          }
          else if (this.state.CurrentUserID == items[i].UserId && Today == CreatedDate && items[i].IsSeen == false) {
            $("#myCarousel").show();
            this.setState({
              IsSeen: "Update"
            })
            UserVisitationItemId = items[i].ID;
            console.log(UserVisitationItemId)
            console.log("Not seen")
          }
          else {
            $("#myCarousel").show();
            this.setState({
              IsSeen: "No"
            })
          }
        }
      } else {
        $("#myCarousel").show();
        this.setState({
          IsSeen: "No"
        })
      }
      this.GetTodayAlerts();

    }).catch((err) => {
      console.log(err);
    });
  }
  // get the currently active alert items
  public GetTodayAlerts() {
    NewWeb.lists.getByTitle("Alerts Master").items.select("*").expand("AttachmentFiles").getAll().then((items) => {
      // console.log(items)
      AlertItems = [];
      for (var i = 0; i < items.length; i++) {
        var CurrentDate = moment();
        var Today = moment().format("DD/MM/YYYY");
        var AlertStartDate = moment(items[i].Showthealertfrom).format("DD/MM/YYYY");
        var AlertEndDate = moment(items[i].Removethealerton);
        var PastDate = moment(items[i].Showthealertfrom);
        if (Today == AlertStartDate && AlertEndDate >= CurrentDate) {
          AlertItems.push(items[i])
        } else if (AlertEndDate >= CurrentDate && PastDate <= CurrentDate) {
          AlertItems.push(items[i])
        }

      }
      console.log(AlertItems);
      if (AlertItems.length == 0) {
        $("#myCarousel").hide();
        $("#if-Banner-Exist").hide();
        $("#if-Banner-not-Exist").show();
      } else {
        $("#if-Banner-Exist").show();
        $("#if-Banner-not-Exist").hide();
      }
    }).catch((err) => {
      console.log(err);
    });
  }
  // add or update the current user details in Alert user visits Transaction
  public addUserVisitation() {
    var userRecordAdded = 0;
    if (this.state.IsSeen == "No") {
      NewWeb.lists.getByTitle("Alerts User Visit Transactions").items.filter(`UserId eq '${this.state.CurrentUserID}'`).getAll().then((items) => {
        if (items.length != 0) {
          for (var i = 0; i < items.length; i++) {
            var Today = moment().format("DD/MM/YYYY");
            var CreatedDate = moment(items[i].Created).format("DD/MM/YYYY");
            if (Today == CreatedDate) {
              userRecordAdded = 1;
            }
          }
          if (userRecordAdded == 0) {
            NewWeb.lists.getByTitle("Alerts User Visit Transactions").items.add({
              Title: "User",
              UserId: this.state.CurrentUserID,
              IsSeen: true
            })
          }
        }
      })

    }
    else if (this.state.IsSeen == "Update") {
      NewWeb.lists.getByTitle("Alerts User Visit Transactions").items.getById(UserVisitationItemId).update({
        IsSeen: true
      })
    }

  }
  // Hide and show the alert messages
  public showAlertMessages() {
    $("#myCarousel").toggle();
    if (AlertItems.length != 0) {
      this.setState({
        IsSeen: "Yes"
      })
      this.addUserVisitation();
    } else {

    }
  }

  public BindPlaceholderLogo() {

    var reacthandler = this;
    $.ajax({
      url: `https://rakgasae.sharepoint.com/sites/intranet/_api/web/lists/getbytitle('Logo Master')/items?$select=Title,Logo&$filter=IsActive eq 1&$orderby=Created desc&$top=1`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        let RawImageTxt = resultData.d.results[0].Logo;
        if (RawImageTxt != "") {
          var ImgObj = JSON.parse(RawImageTxt);
          reacthandler.setState({
            SiteLogo: `${ImgObj.serverRelativeUrl}`
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });
  }

  public getUnreadmailCount() {
    this.serviceProvider.
      getmymailcount()
      .then(
        (result: any[]): void => {
          this.setState({ myMailDatas: result });
          var mailcount = this.state.myMailDatas.length;
          if (this.state.myMailDatas.length > 0) {
            this.setState({ EmailCount: mailcount });
            if (this.state.myMailDatas.length > 999) {
              $(".count-email").addClass("more");
            }
          } else {
            this.setState({ EmailCount: "0" });
            $("#Emails_count").hide();
          }
        }
      )
  }

  public getmymeetings() {
    this.serviceProvider.
      getmymeetingscount()
      .then(
        (result: any[]): void => {
          this.setState({ myMeetingsDatas: result });
          var myMeetingscount = this.state.myMeetingsDatas.length;
          if (this.state.myMeetingsDatas.length > 0) {
            this.setState({ MeetingsCount: myMeetingscount });
            if (this.state.myMeetingsDatas.length > 999) {
              $(".meet-count").addClass("more");
            }
          } else {
            this.setState({ MeetingsCount: "0" });
            $("#Meetings_count").hide();
          }
        }
      )
  }

  public async EnableContentEditorForSuperAdmins() {
    let groups = await NewWeb.currentUser.groups();
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].Title == "ContentPageEditors") {
        this.setState({ IsAdminForContentEditor: true }); //To Show Content Editor on Center Nav to Specific Group Users alone

      } else {
        // this.setState({IsAdminForContentEditor:true});
      }
    }
  }

  public async GetMainNavItems() {
    var reactHandler = this;
    try {
      $.ajax({
        url: `https://rakgasae.sharepoint.com/sites/Intranet/_api/web/lists/getbytitle('Navigations')/items?$select=Title,URL,OpenInNewTab,LinkMasterID/Title,LinkMasterID/Id,URL,HoverOnIcon,HoverOffIcon&$filter=IsActive eq 1&$orderby=Order0 asc&$top=10&$expand=LinkMasterID`,
        type: "GET",
        headers: { 'Accept': 'application/json; odata=verbose;' },
        success: function (resultData) {
          reactHandler.setState({
            MainNavItems: resultData.d.results
          });
          reactHandler.EnableContentEditorForSuperAdmins();
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
    //$(".global-qlink-main").hide();
    //$(".global-dept-main").show();
    $(".resp-dept-submenu-mob").toggleClass("active");
    $(".resp-qlink-submenu").removeClass("active");
    $(".global-qlink-main").removeClass("open");
    $(".global-dept-main").toggleClass("open");
    var reactHandler = this;
    reactHandler.displayData = [];
    reactHandler.displayDataResponsive = [];
    try {
      $.ajax({
        url: `https://rakgasae.sharepoint.com/sites/Intranet/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,ID,URL,HasSubDept,OpenInNewTab,PlaceUnder/Title,PlaceUnder/Id&$filter=IsActive eq 1&$orderby=Order0 asc&$expand=PlaceUnder/Id,PlaceUnder`,
        type: "GET",
        async: false,
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
    //$(".global-dept-main").hide();
    //$(".global-qlink-main").show();
    $(".resp-qlink-submenu").toggleClass("active");
    $(".resp-dept-submenu-mob").removeClass("active");
    $(".third-level-submenu").removeClass("open");
    $(".global-dept-main").removeClass("open");
    $(".global-qlink-main").toggleClass("open");
    var reactHandler = this;
    reactHandler.displayDataQlink = [];
    reactHandler.displayDataQlinkResponsive = [];
    try {
      $.ajax({
        url: `https://rakgasae.sharepoint.com/sites/Intranet/_api/web/lists/getbytitle('Quick Links')/items?$select=Title,OpenInNewPage,URL&$filter=IsActive eq 1&$orderby=Order0 asc`,
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
            reactHandler.appendDataQLink(Title, OpenInNewTab, Url);
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
    $("#" + ID + "-Dept-Child").empty();
    //$("#"+ID+"-Dept-Child").show();
    $("#" + ID + "-Dept-Child-parent").toggleClass("open");
    //$("#"+ID+"-Dept-Child").css("display" , "block !important");
    var reactHandler = this;
    this.displayDataLevel2 = [];
    this.displayDataLevel2Responsive = [];
    $.ajax({
      url: `https://rakgasae.sharepoint.com/sites/Intranet/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,ID,URL,HasSubDept,OpenInNewTab,PlaceUnder/Title,PlaceUnder/Id&$filter=IsActive eq 1 and PlaceUnder/Id eq '${ID}'&$orderby=Order0 asc&$expand=PlaceUnder`,
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
          reactHandler.appendDataLevelTwo(ID, Title, OpenInNewTab, HasSubDept, Url);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });
  }

  public GetSubNodesLevelTwo(ID, Title, ClickFrom, key) {
    var reactHandler = this;
    //reactHandler.displayData=[];
    $.ajax({
      url: `https://rakgasae.sharepoint.com/sites/Intranet/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,ID,URL,HasSubDept,OpenInNewTab,PlaceUnder/Title,PlaceUnder/Id&$filter=IsActive eq 1 and PlaceUnder/Id eq '${ID}'&$orderby=Order0 asc&$expand=PlaceUnder`,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        for (var i = 0; i < resultData.d.results.length; i++) {
          let ItemID = resultData.d.results[i].Id;
          var Title = resultData.d.results[i].Title;
          var Url = resultData.d.results[i].URL.Url;
          let OpenInNewTab = resultData.d.results[i].OpenInNewTab;
          let HasSubDept = resultData.d.results[i].HasSubDept;
          reactHandler.appendDataLevelTwo(ID, Title, OpenInNewTab, HasSubDept, Url);
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
        reactHandler.displayData.push(<li className="GetSubNodes">

          <a href="#" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off"><span id="deeept">{Title}</span><i id="deeept" className="fa fa-caret-down" aria-hidden="true" ></i></a>
          <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
            <ul id={`${ID}-Dept-Child`}>
              {reactHandler.state.showdataLevelTwo}
            </ul>
          </div>
        </li>);

        //For Responsive
        reactHandler.displayDataResponsive.push(<li className="GetSubNodes">
          <a href={Url} target="_blank" data-interception="off" role="button"><span>{Title}</span>  </a>
          <a href="#" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")}><i className="fa fa-caret-down" aria-hidden="true" ></i></a>
          <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
            <ul id={`${ID}-Dept-Child`}>
              {reactHandler.state.showdataLevelTwoResponsive}
            </ul>
          </div>
        </li>);


        reactHandler.setState({
          showdata: this.displayData,
          showdataResponsive: this.displayDataResponsive
        });
      } else {
        reactHandler.displayData.push(<li>
          <a href={Url} target="_blank" data-interception="off" role="button" >{Title}</a>
        </li>);

        //For Responsive
        reactHandler.displayDataResponsive.push(<li>
          <a href={Url} target="_blank" data-interception="off" role="button" ><span>{Title}</span></a>
        </li>);

        reactHandler.setState({
          showdata: this.displayData,
          showdataResponsive: this.displayDataResponsive
        });
      }

    } else {
      if (HasSubDept == true) {
        reactHandler.displayData.push(<li className="GetSubNodes">

          <a href="#" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off"> <span id="deeept">{Title}</span> <i id="deeept" className="fa fa-caret-down" aria-hidden="true" ></i></a>
          <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
            <ul id={`${ID}-Dept-Child`}>
              {reactHandler.state.showdataLevelTwo}
            </ul>
          </div>
        </li>);

        //For Responsive
        reactHandler.displayDataResponsive.push(<li className="GetSubNodes">

          <a href="#" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off"> {Title}<i className="fa fa-caret-down" aria-hidden="true" ></i></a>
          <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
            <ul id={`${ID}-Dept-Child`}>
              {reactHandler.state.showdataLevelTwoResponsive}
            </ul>
          </div>
        </li>);

        reactHandler.setState({
          showdata: this.displayData,
          showdataResponsive: this.displayDataResponsive
        });
      } else {
        reactHandler.displayData.push(<li>
          <a href={Url} data-interception="off" role="button"> {Title}</a>
        </li>);

        //For Responsive
        reactHandler.displayDataResponsive.push(<li>
          <a href={Url} data-interception="off" role="button"><span> {Title}</span></a>
        </li>);

        reactHandler.setState({
          showdata: this.displayData,
          showdataResponsive: this.displayDataResponsive
        });
      }

    }
  }

  public appendDataLevelTwo(ID, Title, OpenInNewTab, HasSubDept, Url) {
    var reactHandler = this;
    if (OpenInNewTab == true) {
      if (HasSubDept == true) {

        $("#" + ID + "-Dept-Child").append(`<li class="GetSubNodesLevelTwo"> 
      <a href=${Url} target="_blank" data-interception="off" role="button">${Title}</a> <i class="fa fa-caret-down" aria-hidden="true""></i>        
        <div class="third-level-submenu relative">
          <ul class="clearfix" id="${ID}-Dept-Child">                                                            
            
          </ul>    
        </div>
      </li>`);
      } else {

        $("#" + ID + "-Dept-Child").append(`<li> 
      <a href=${Url} target="_blank" data-interception="off" role="button" >${Title}</a>
      </li>`);
      }
      reactHandler.setState({
        showdataLevelTwo: this.displayDataLevel2,
        showdataLevelTwoResponsive: this.displayDataLevel2Responsive
      });
    } else {
      if (HasSubDept == true) {

        $("#" + ID + "-Dept-Child").append(`<li class="GetSubNodesLevelTwo"> 
      <a href=${Url} target="_blank" data-interception="off" role="button">${Title}</a> <i class="fa fa-caret-down" aria-hidden="true""></i>        
        <div class="third-level-submenu relative">
          <ul class="clearfix" id="${ID}-Dept-Child">                                                            
            
          </ul>    
        </div>
      </li>`);
      } else {

        $("#" + ID + "-Dept-Child").append(`<li> 
      <a href=${Url} data-interception="off" role="button"> ${Title}</a>
      </li>`);
      }
      reactHandler.setState({
        showdataLevelTwo: this.displayDataLevel2,
        showdataLevelTwoResponsive: this.displayDataLevel2Responsive
      });
    }

  }


  public appendDataQLink(Title, OpenInNewTab, Url) {
    var reactHandler = this;
    if (OpenInNewTab == true) {
      reactHandler.displayDataQlink.push(<li>
        <a href={`${Url}`} target="_blank" data-interception="off" role="button" >{Title}</a>
      </li>);

      //For Responsive
      reactHandler.displayDataQlinkResponsive.push(<li>
        <a href={`${Url}`} target="_blank" data-interception="off" role="button" ><span>{Title}</span></a>
      </li>);
    } else {
      reactHandler.displayDataQlink.push(<li>
        <a href={`${Url}`} data-interception="off" role="button" >{Title}</a>
      </li>);

      //For Responsive
      reactHandler.displayDataQlinkResponsive.push(<li>
        <a href={`${Url}`} data-interception="off" role="button" ><span>{Title}</span></a>
      </li>);
    }
    reactHandler.setState({
      showdataqlink: reactHandler.displayDataQlink,
      showdataqlinkResponsive: reactHandler.displayDataQlinkResponsive
    });
  }

  /*public appendData(ID,Title,OpenInNewTab,HasSubDept,Url) {               
    var reactHandler = this;          
    if(OpenInNewTab == true){
      if(HasSubDept == true){
        reactHandler.displayData.push(<li className="GetSubNodes"> 
        <a href={Url} target="_blank" data-interception="off" role="button">{Title}  </a>  
        <a href="#" onClick={() => reactHandler.GetSubNodes(ID,Title,"NavMain"," ")}><i className="fa fa-caret-down" aria-hidden="true" ></i></a>
            <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
              <ul id={`${ID}-Dept-Child`}>                                                            
                {reactHandler.state.showdataLevelTwo}
              </ul>   
            </div>           
        </li>);
        reactHandler.setState({
          showdata : this.displayData
        });
      }else{
        reactHandler.displayData.push(<li> 
        <a href={Url} target="_blank" data-interception="off" role="button" >{Title}</a>
        </li>);
        reactHandler.setState({
          showdata : this.displayData
        });
      }      
      
    }else{
      if(HasSubDept == true){
        reactHandler.displayData.push(<li className="GetSubNodes"> 
        <a href={Url} data-interception="off" role="button">{Title} </a>                 
        <a href="#" onClick={() => reactHandler.GetSubNodes(ID,Title,"NavMain"," ")}><i className="fa fa-caret-down" aria-hidden="true" ></i></a>
            <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
              <ul id={`${ID}-Dept-Child`}>                                                            
                {reactHandler.state.showdataLevelTwo}
              </ul>   
            </div>           
        </li>);
        reactHandler.setState({
          showdata : this.displayData
        });
      }else{
        reactHandler.displayData.push(<li> 
        <a href={Url} data-interception="off" role="button"> {Title}</a>
        </li>);
        reactHandler.setState({
          showdata : this.displayData
        });
      }
      
    }              
 }
 
public appendDataLevelTwo(ID,Title,OpenInNewTab,HasSubDept,Url){   
  var reactHandler = this;          
  if(OpenInNewTab == true){
    if(HasSubDept == true){
      
      $("#"+ID+"-Dept-Child").append(`<li class="GetSubNodesLevelTwo"> 
      <a href=${Url} target="_blank" data-interception="off" role="button">${Title}</a> <i class="fa fa-caret-down" aria-hidden="true""></i>        
        <div class="third-level-submenu relative">
          <ul class="clearfix" id="${ID}-Dept-Child">                                                            
            
          </ul>    
        </div>
      </li>`);
    }else{
      
      $("#"+ID+"-Dept-Child").append(`<li> 
      <a href=${Url} target="_blank" data-interception="off" role="button" >${Title}</a>
      </li>`);
    }
    reactHandler.setState({
      showdataLevelTwo : this.displayDataLevel2
   });  
  }else{
    if(HasSubDept == true){
      
      $("#"+ID+"-Dept-Child").append(`<li class="GetSubNodesLevelTwo"> 
      <a href=${Url} target="_blank" data-interception="off" role="button">${Title}</a> <i class="fa fa-caret-down" aria-hidden="true""></i>        
        <div class="third-level-submenu relative">
          <ul class="clearfix" id="${ID}-Dept-Child">                                                            
            
          </ul>    
        </div>
      </li>`);
    }else{
      
      $("#"+ID+"-Dept-Child").append(`<li> 
      <a href=${Url} data-interception="off" role="button"> ${Title}</a>
      </li>`);
    }
    reactHandler.setState({
      showdataLevelTwo : this.displayDataLevel2
   });  
  }  
  
}
 

 public appendDataQLink(Title,OpenInNewTab,Url) {             
  var reactHandler = this;      
  if(OpenInNewTab == true){    
    reactHandler.displayDataQlink.push(<li> 
      <a href={`${Url}`} target="_blank" data-interception="off" role="button">{Title}</a>
    </li>);
  }else{
    reactHandler.displayDataQlink.push(<li> 
      <a href={`${Url}`} data-interception="off" role="button">{Title}</a>
    </li>);
  }    
  reactHandler.setState({
    showdataqlink : reactHandler.displayDataQlink
 });      
}*/

  OpenSearchPage(e) {
    if (e.keyCode == 13) {
      window.open(
        `https://rakgasae.sharepoint.com/sites/Intranet/_layouts/15/search.aspx/?q=${e.target.value}`,
        "_self"
      );
    }
  }

  public OpenBurggerMenu() {
    $(".responsive-menu-wrap").addClass("open");
  }
  public CloseBurggerMenu() {
    $(".responsive-menu-wrap").removeClass("open");
  }
  public OpenSearch() {
    $(".responsive-background").addClass("open");
    $(".search").addClass("open");
  }

  public ShowUserDetailBlock() {
    $(".user-profile-details").toggleClass("open");
  }

  public CloseUserDetailsBlock() {
    $(".user-profile-details").removeClass("open");
  }

  public render(): React.ReactElement<ISideNavProps> {
    $('.globalleftmenu-fixed-area ul li').on('click', function () {
      $(this).siblings().removeClass('active');
      $(this).siblings().removeClass('open');
      $(this).addClass('active');
      $(this).toggleClass('open');
    });
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


    const MainNavigations: JSX.Element[] = handler.state.MainNavItems.map(function (item, key) {

      if (item.OpenInNewTab == true) {
        if (item.LinkMasterID.Title == "DEPT_00001") {
          return (
            <li className="submenu relative "> <a href="#" onClick={() => handler.GetDepartments()}><span id="deeept">{item.Title}</span><i id="deeept" className="fa fa-caret-down" aria-hidden="true" data-interception="off"></i></a>
              <ul className="hidedept main-submenu global-dept-main" id="deeept">
                {handler.state.showdata}
              </ul>
            </li>
          );
        }
        if (item.LinkMasterID.Title == "QLINK_00002") {
          return (
            <li id="hide-quick" className="submenu "> <a href="#" onClick={() => handler.GetQuickLinks()} data-interception="off"><span id="hide-quick">{item.Title}</span><i id="hide-quick" className="fa fa-caret-down" aria-hidden="true"></i></a>
              <ul className="main-submenu global-qlink-main" id="hide-quick">
                {handler.state.showdataqlink}
              </ul>
            </li>
          );
        }
        if (item.LinkMasterID.Title == undefined) {
          var str = item.Title;
          var DomID = str.replace(/[_\W]+/g, "_");
          if (item.Title == "Home") {
            return (
              <li className=" " id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"> {item.Title}</a> </li>
            );
          } else if (item.Title == "Content Editor") {
            if (handler.state.IsAdminForContentEditor == true) {
              let RawImageTxtOn = item.HoverOnIcon;
              let RawImageTxtOff = item.HoverOffIcon;
              if (RawImageTxtOn != null || RawImageTxtOn != undefined && RawImageTxtOff != null || RawImageTxtOff != undefined) {
                var ImgObjforON = JSON.parse(RawImageTxtOn);
                var ImgObjforOFF = JSON.parse(RawImageTxtOff);
                return (
                  <>
                    {/* <li id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"> {item.Title}</a> </li> */}

                    <li id={DomID} className='floating-content-editor floating-content-editor-internal' data-tip data-for={"React-tooltip-contenteditor"} data-custom-class="tooltip-custom"> <a href={`${item.URL}`} data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" />   </a>
                      <ReactTooltip id={"React-tooltip-contenteditor"} place="top" type="dark" effect="solid">
                        <span>Content Editor</span>
                      </ReactTooltip>
                    </li>

                  </>
                );
              }
            }
          } else {
            return (
              <li id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"> {item.Title}</a> </li>
            );
          }

        }
      } else {
        if (item.LinkMasterID.Title == "DEPT_00001") {
          return (
            <li id="hide-dept" className="submenu relative"> <a href="#" onClick={() => handler.GetDepartments()} data-interception="off"><span id="deeept">{item.Title}</span><i id="deeept" className="fa fa-caret-down" aria-hidden="true"></i> </a>
              <ul className="hidedept main-submenu global-dept-main" id="deeept">
                {handler.state.showdata}
              </ul>
            </li>
          );
        }
        if (item.LinkMasterID.Title == "QLINK_00002") {
          return (
            <li className="submenu relative"> <a href="#" onClick={() => handler.GetQuickLinks()} data-interception="off"><span id="hide-quick">{item.Title}</span><i id="hide-quick" className="fa fa-caret-down" aria-hidden="true"></i></a>
              <ul className="main-submenu global-qlink-main" id="hide-quick">
                {handler.state.showdataqlink}
              </ul>
            </li>
          );
        }
        if (item.LinkMasterID.Title == undefined) {
          var str2 = item.Title;
          var DomID2 = str2.replace(/[_\W]+/g, "_");
          if (item.Title == "Home") {
            return (
              <li className=" " id={DomID2}> <a href={`${item.URL}`} data-interception="off"> {item.Title}</a> </li>
            );
          } else if (item.Title == "Content Editor") {
            if (handler.state.IsAdminForContentEditor == true) {
              let RawImageTxtOn = item.HoverOnIcon;
              let RawImageTxtOff = item.HoverOffIcon;
              if (RawImageTxtOn != null || RawImageTxtOn != undefined && RawImageTxtOff != null || RawImageTxtOff != undefined) {
                var ImgObjforON = JSON.parse(RawImageTxtOn);
                var ImgObjforOFF = JSON.parse(RawImageTxtOff);
                return (
                  // <li id={DomID}> <a href={`${item.URL}`} data-interception="off"> {item.Title}</a> </li>
                  <li id={DomID} className='floating-content-editor floating-content-editor-internal' data-tip data-for={"React-tooltip-contenteditor"} data-custom-class="tooltip-custom"> <a href={`${item.URL}`} data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" />   </a>
                    <ReactTooltip id={"React-tooltip-contenteditor"} place="top" type="dark" effect="solid">
                      <span>Content Editor</span>
                    </ReactTooltip>
                  </li>
                );
              }
            }
          } else {
            return (
              <li id={DomID}> <a href={`${item.URL}`} data-interception="off"> {item.Title}</a> </li>
            );
          }
        }

      }
    });

    const ResponsiveMainNavigations: JSX.Element[] = handler.state.MainNavItems.map(function (item, key) {

      if (item.OpenInNewTab == true) {
        if (item.LinkMasterID.Title == "DEPT_00001") {
          return (
            <li className="submenu resp-dept-submenu-mob"> <a href="#" onClick={() => handler.GetDepartments()} data-interception="off"><span>{item.Title}</span><img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/next.svg" alt="image" /></a>
              <div className="responsi-inner-submenu " >
                <ul>
                  {handler.state.showdataResponsive}
                </ul>
              </div>
            </li>
          );
        }
        if (item.LinkMasterID.Title == "QLINK_00002") {
          return (
            <li className="submenu resp-qlink-submenu"> <a href="#" onClick={() => handler.GetQuickLinks()} data-interception="off"><span id="hide-quick">{item.Title}</span><img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/next.svg" alt="image" /></a>
              <div className="responsi-inner-submenu" id="hide-quick">
                <ul>
                  {handler.state.showdataqlinkResponsive}
                </ul>
              </div>
            </li>
          );
        }
        if (item.LinkMasterID.Title == undefined) {
          var str = item.Title;
          var DomID = str.replace(/[_\W]+/g, "_");
          if (item.Title == "Home") {
            return (
              <li className=" " id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"><span> {item.Title}</span></a> </li>
            );
          } else if (item.Title == "Content Editor") {
            if (handler.state.IsAdminForContentEditor == true) {
              return (
                <li id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"> <span>{item.Title}</span></a> </li>
              );
            }
          } else {
            return (
              <li id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"><span> {item.Title}</span></a> </li>
            );
          }

        }
      } else {
        if (item.LinkMasterID.Title == "DEPT_00001") {
          return (
            <li className="submenu resp-dept-submenu-mob"> <a href="#" onClick={() => handler.GetDepartments()} data-interception="off"><span>{item.Title}</span><img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/next.svg" alt="image" /></a>
              <div className="responsi-inner-submenu">
                <ul>
                  {handler.state.showdataResponsive}
                </ul>
              </div>
            </li>
          );
        }
        if (item.LinkMasterID.Title == "QLINK_00002") {
          return (
            <li className="submenu resp-qlink-submenu"> <a href="#" onClick={() => handler.GetQuickLinks()} data-interception="off"><span id="hide-quick">{item.Title}</span><img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/next.svg" alt="image" /></a>
              <div className="responsi-inner-submenu" id="hide-quick">
                <ul>
                  {handler.state.showdataqlinkResponsive}
                </ul>
              </div>
            </li>
          );
        }
        if (item.LinkMasterID.Title == undefined) {
          var str2 = item.Title;
          var DomID2 = str2.replace(/[_\W]+/g, "_");
          if (item.Title == "Home") {
            return (
              <li className=" " id={DomID2}> <a href={`${item.URL}`} data-interception="off"><span> {item.Title}</span></a> </li>
            );
          } else if (item.Title == "Content Editor") {
            if (handler.state.IsAdminForContentEditor == true) {
              return (
                <li id={DomID}> <a href={`${item.URL}`} data-interception="off"><span> {item.Title}</span></a> </li>
              );
            }
          } else {
            return (
              <li id={DomID}> <a href={`${item.URL}`} data-interception="off"><span> {item.Title}</span></a> </li>
            );
          }
        }

      }
    });

    const Alerts = AlertItems.map(function (item, key) {
      var URLs;
      var AlertUrl = item.Link;
      if (item.AttachmentFiles.length != 0) {
        URLs = item.AttachmentFiles[0].ServerRelativeUrl
      }

      if (AlertUrl != null || AlertUrl != undefined) {
        return (
          <div>
            <ul className="alert_icons clearfix">
              <li><a href="#">
                <img onClick={() => handler.showAlertMessages()} src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/alert_close.svg" className="close-img" data-themekey="#" />
              </a>
              </li>
            </ul>
            <div className="clearfix newsalert_part">
              <div className="newsalert_left">
                <img src={`${URLs}`} data-themekey="#" />
              </div>
              <div className="newsalert_right">
                <a href={item.Link.Url} target="_blank"><h5 title={item.Title}>{item.Title}</h5></a>
                <p>{item.Description}</p>
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div>
            <ul className="alert_icons clearfix">
              <li><a href="#">
                <img onClick={() => handler.showAlertMessages()} src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/alert_close.svg" className="close-img" data-themekey="#" />
              </a>
              </li>
            </ul>
            <div className="clearfix newsalert_part">
              <div className="newsalert_left">
                <img src={`${URLs}`} data-themekey="#" />
              </div>
              <div className="newsalert_right">
                <a href="#"><h5 title={item.Title}>{item.Title}</h5></a>
                <p>{item.Description}</p>
              </div>
            </div>
          </div>
        )
      }
    })
    console.log(Alerts)

    return (
      <div className="visiblei ms-slideRightIn40 GlobalLeftNavigation">

        <header>
          <div className="container ">
            <div className="header-left">
              <div className="logo">

                <a className="logo-anchor" href="https://rakgasae.sharepoint.com/sites/Intranet/SitePages/Homepage.aspx?env=WebView" data-interception="off">  <img src={this.state.SiteLogo} alt="image" /> </a>
              </div>
              <div className="search relative">
                <img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/search.png" alt="image" />
                <input type="text" className="form-control insearch" placeholder="Search Here" onKeyDown={this.OpenSearchPage} />
              </div>
            </div>
            <div className="header-right">
              <div className="header-right-lists">
                <ul>
                  <li className="meet-count" data-tip data-for={"React-tooltip-calendar"} data-custom-class="tooltip-custom">
                    <a href="https://outlook.office365.com/calendar/view/month" target="_blank" data-interception="off" className="notification relative" >
                      <img src={`https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/tq1.svg`} alt="images" />
                      <span id="Meetings_count"> {this.state.MeetingsCount} </span>
                    </a>
                    <ReactTooltip id={"React-tooltip-calendar"} place="bottom" type="dark" effect="solid">
                      <span>Calendar</span>
                    </ReactTooltip>
                  </li>
                  <li data-tip data-for={"React-tooltip-my-team"} data-custom-class="tooltip-custom">
                    <a href={`https://teams.microsoft.com`} data-interception="off" target="_blank" className="notification relative">
                      <img src={`https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/tq2.svg`} alt="images" />
                    </a>
                    <ReactTooltip id={"React-tooltip-my-team"} place="bottom" type="dark" effect="solid">
                      <span>Teams</span>
                    </ReactTooltip>
                  </li>
                  <li className="count-email" data-tip data-for={"React-tooltip-Email"} data-custom-class="tooltip-custom">
                    <a href="https://outlook.office365.com/mail/inbox" target="_blank" data-interception="off" className="notification relative">
                      <img src={`https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/tq3.svg`} alt="images" />
                      <span id="Emails_count"> {this.state.EmailCount} </span>
                    </a>
                    <ReactTooltip id={"React-tooltip-Email"} place="bottom" type="dark" effect="solid">
                      <span>EMail</span>
                    </ReactTooltip>
                  </li>


                  <li className="user-images"> <a href="#" className="notification relative" onClick={() => this.ShowUserDetailBlock()} data-interception="off" >
                    <img id='user-img' src={`${this.state.CurrentUserProfilePic}`} alt="images" />
                    <div className="user-profile-details">
                      <h3>  {this.state.CurrentUserName} </h3>
                      <p> {this.state.CurrentUserDesignation} </p>
                      <div className="logou-bck">
                        <a href="https://login.windows.net/common/oauth2/logout" data-interception="off" ><i className="fa fa-sign-out" aria-hidden="true" ></i> Logout</a>

                      </div>
                    </div>
                  </a>
                  </li>
                </ul>
              </div>
              <div className="responsive-inner-classes">
                <ul>
                  <li> <a href="#" onClick={() => this.OpenSearch()} data-interception="off"><img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/res_searc.svg" alt="image" /> </a></li>
                  <li> <a href="#" onClick={() => this.OpenBurggerMenu()} data-interception="off"><img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/burger_menu.svg" alt="image" /> </a></li>
                </ul>
              </div>
            </div>
          </div>
        </header>
        <div className="inner-pages-nav">
          <div className="container">
            <nav>
              <ul>
                {MainNavigations}
              </ul>
            </nav>
          </div>
        </div>

        {/*reponaive contents  menu */}

        <div className="responsive-menu-wrap">
          <div className="reponsive-quick-wrap">
            <div className="main-menu">
              <ul>
                {ResponsiveMainNavigations}
              </ul>
            </div>
          </div>
          <div className="responsive-qiuck-close">
            <a href="#" onClick={() => this.CloseBurggerMenu()} data-interception="off"><i className="fa fa-close"></i></a>
          </div>
          <div className="responsive-background">

          </div>
        </div>

        <div className="responsive-notifications">
          <ul>
            <li className="meet-count" data-tip data-for={"React-tooltip-calendar-resp"} data-custom-class="tooltip-custom">
              <a href="https://outlook.office365.com/calendar/view/month" target="_blank" data-interception="off" className="notification relative" >
                <img src={`https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/rn4.svg`} alt="images" />
                <span id="Meetings_count"> {this.state.MeetingsCount} </span>
              </a>
              <ReactTooltip id={"React-tooltip-calendar-resp"} place="top" type="dark" effect="solid">
                <span>Calendar</span>
              </ReactTooltip>
            </li>
            <li data-tip data-for={"React-tooltip-my-team-resp"} data-custom-class="tooltip-custom">
              <a href={`https://rakgasae.sharepoint.com/sites/Intranet/SitePages/My-Team.aspx?env=WebViewList`} data-interception="off" className="notification relative">
                <img src={`https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/rn1.svg`} alt="images" />
              </a>
              <ReactTooltip id={"React-tooltip-my-team-resp"} place="top" type="dark" effect="solid">
                <span>Teams</span>
              </ReactTooltip>
            </li>
            <li className="count-email" data-tip data-for={"React-tooltip-Email-resp"} data-custom-class="tooltip-custom">
              <a href="https://outlook.office365.com/mail/inbox" target="_blank" data-interception="off" className="notification relative">
                <img src={`https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/rn2.svg`} alt="images" />
                <span id="Emails_count"> {this.state.EmailCount} </span>
              </a>
              <ReactTooltip id={"React-tooltip-Email-resp"} place="top" type="dark" effect="solid">
                <span>EMail</span>
              </ReactTooltip>
            </li>

          </ul>
        </div>
        <div className="news_alert_banner">
          {/* <button type='button' onClick={() => this.showAlertMessages()}>Alert</button> */}
          <div className='news_alert open'>
            <div onClick={() => this.showAlertMessages()}>
              <a href='#'>
                <img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/news_alert.svg" />
              </a>
            </div>
            <div id="myCarousel" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner">
                <div id="if-Banner-Exist">
                  <Slider {...settings} >
                    {Alerts}
                  </Slider>
                </div>
                <div id="if-Banner-not-Exist" className="background" style={{ display: "none" }}>
                  <img className="err-img" src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/no_alerts.svg" alt="no-image-uploaded" />
                </div>
              </div>
            </div>
          </div>
        </div>



      </div>
    );
  }
}
