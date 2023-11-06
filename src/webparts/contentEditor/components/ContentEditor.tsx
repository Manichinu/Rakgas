import * as React from "react";
import styles from "./ContentEditor.module.scss";
import { IContentEditorProps } from "./IContentEditorProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import * as $ from "jquery";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { Title } from "GlobalCustomFeaturesApplicationCustomizerStrings";
import GlobalSideNav from "../../../extensions/globalCustomFeatures/GlobalSideNav";

export interface IContentEditorState {
  Items: any[];
  GetDept: any[];
  LandingPage: any[];
  DivisionDept: any[];
  ContentEditorAdmin: boolean;
  Tabs: any[];
}

const NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet");
const ActivePageUrl = (
  window.location.href.split("?")
    ? window.location.href.split("?")[0]
    : window.location.href
).toLowerCase();

export default class ContentEditor extends React.Component<
  IContentEditorProps,
  IContentEditorState,
  {}
> {
  public constructor(props: IContentEditorProps, state: IContentEditorState) {
    super(props);
    //SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css");
    // SPComponentLoader.loadScript("https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js");
    SPComponentLoader.loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.bundle.min.js"
    );
    // SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css");
    SPComponentLoader.loadCss(
      "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css"
    );
    SPComponentLoader.loadCss(
      "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css"
    );
    SPComponentLoader.loadCss(
      "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"
    );
    SPComponentLoader.loadCss(
      "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"
    );

    //  SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css");
    this.state = {
      Items: [],
      GetDept: [],
      LandingPage: [],
      DivisionDept: [],
      ContentEditorAdmin: false,
      Tabs: [],
    };
  }

  public componentDidMount() {
    setTimeout(function () {
      $("#spCommandBar").attr("style", "display: none !important");
      // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $('div[data-automation-id="CanvasZone"]>div').attr(
        "style",
        "width:100% !important"
      );
      $("#CommentsWrapper").attr("style", "display: none !important");
      $('div[data-automation-id="pageHeader"]').attr(
        "style",
        "display: none !important"
      );

    }, 2000);
    setTimeout(function () {
      $('div[data-automation-id="CanvasControl"]').attr(
        "style",
        "padding: 0px !important; margin: 0px !important"
      );
    }, 500);
    $('.floating-content-editor floating-content-editor-internal').hide();
    this.CheckPermission();

    this.Addclass();
    this.GetLandingPAge_permission();

    // if ($("#id-landingpage").hasClass("active")) {
    //   console.log('active');
    //   this.GetLandingPAge();
    // }

    //this.GetLandingPAge();
  }

  public Addclass() {
    setTimeout(() => {
      $("#accordion .card .card-header").on("click", function () {
        $(".card-header.active").removeClass("active");
        $(".SubDep.show").removeClass("show");
        // $(".SubDep.in").removeClass("in");
        $(this).addClass("active");
      });
    }, 2000);
  }

  public async CheckPermission() {
    let groups = await NewWeb.currentUser.groups();


    for (var i = 0; i < groups.length; i++) {

      if (groups[i].Title == "ContentPageEditors") {
        this.setState({ ContentEditorAdmin: true });


        $("#access-denied-block").hide();

        break;
      } else {

        $("#access-denied-block").show();
        // break;
      }
    }
    if (this.state.ContentEditorAdmin == true) {

      // this.GetContentEditorTabs();

      this.GetDepartment();
      this.GetDivisionDept(1);
      this.GetContentEditorNavigations(1);
      this.GetLandingPAge();
    }

  }

  // public GetDepartment() {
  //   let UserID = this.props.UserId;

  //   var reactHandler = this;
  //   $.ajax({
  //     url: `${this.props.siteurl}/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,Id,AccessibleTo/Title&$expand=AccessibleTo&$filter=((IsContentEditorGroupHead eq 'yes') and (AccessibleTo/Id eq ${UserID}))`,
  //     type: "GET",
  //     headers: { Accept: "application/json; odata=verbose;" },
  //     success: function (resultData) {
  //       console.log(resultData);

  //       reactHandler.setState({
  //         GetDept: resultData.d.results,
  //       });
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {},
  //   });
  // }

  private async GetDepartment() {
    let UserID = this.props.UserId;
    var reactHandler = this;

    await NewWeb.lists.getByTitle("DepartmentsMaster").items.select("Title", "Id", "URL", "AccessibleTo/Title").expand("AccessibleTo")
      .filter(`IsContentEditorGroupHead eq 'yes' and AccessibleTo/Id eq '${UserID}'`).get().then((items) => { // //orderby is false -> decending          

        reactHandler.setState({
          GetDept: items,
        });

      }).catch((err) => {
        console.log(err);
      });
  }
  // public GetDivisionDept(ID) {

  //   let UserID = this.props.UserId;
  //   var reactHandler = this;
  //   $.ajax({
  //     // url: `${this.props.siteurl}/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,id&$filter=PlaceUnder/Id eq ${ID}` ,
  //     url: `${this.props.siteurl}/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,ID,URL,AccessibleTo/Title,PlaceUnder/Title&$expand=PlaceUnder,AccessibleTo&$orderby=Title asc&$filter=((IsActive eq 1) and (PlaceUnder/Id eq ${ID}) and (AccessibleTo/Id eq ${UserID}))`,

  //     type: "GET",
  //     headers: { Accept: "application/json; odata=verbose;" },
  //     success: function (resultData) {
  //       reactHandler.setState({
  //         DivisionDept: resultData.d.results,
  //       });

  //       // reactHandler.PassActiveClass();
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {},
  //   });
  // }

  private async GetDivisionDept(ID) {
    let UserID = this.props.UserId;
    var reactHandler = this;

    await NewWeb.lists.getByTitle("DepartmentsMaster").items.select("Title", "ID", "URL", "AccessibleTo/Title", "PlaceUnder/Title").expand("AccessibleTo", "PlaceUnder").orderBy("Title", true)
      .filter(`IsActive eq '1' and PlaceUnder/Id eq '${ID}' and AccessibleTo/Id eq '${UserID}'`).get().then((items) => { // //orderby is false -> decending          

        reactHandler.setState({
          DivisionDept: items,
        });

      }).catch((err) => {
        console.log(err);
      });
  }
  public PassActiveClass() {
    setTimeout(() => {
      $("#sub_nav ul li a").on("click", function () {

        $(".sub_dep.active").removeClass("active");
        $(this).addClass("active");
      });
    }, 1000);
  }

  // public GetContentEditorNavigations(ID) {

  //   let UserID = this.props.UserId;
  //   var reactHandler = this;
  //   $.ajax({
  //     url: `${this.props.siteurl}/_api/web/lists/getbytitle('Content Editor Master')/items?$select=Title,id,URL,AccessibleTo/Title,Icon&$expand=AccessibleTo&$orderby=Title asc&$filter=SubDept eq ${ID} and AccessibleTo/Id eq ${UserID}`,
  //     type: "GET",
  //     headers: { Accept: "application/json; odata=verbose;" },
  //     success: function (resultData) {
  //       reactHandler.setState({
  //         Items: resultData.d.results,
  //       });

  //       reactHandler.PassActiveClass();
  //     },

  //     error: function (jqXHR, textStatus, errorThrown) {},
  //   });
  //   // console.log(this.state.Items);
  // }

  private async GetContentEditorNavigations(ID) {
    let UserID = this.props.UserId;
    var reactHandler = this;

    await NewWeb.lists.getByTitle("Content Editor Master").items.select("Title", "id", "URL", "AccessibleTo/Title", "Icon", "Attachments", "AttachmentFiles").expand("AccessibleTo", "AttachmentFiles").orderBy("Title", true)
      .filter(`SubDept eq '${ID}' and AccessibleTo/Id eq '${UserID}'`).get().then((items) => { // //orderby is false -> decending          

        reactHandler.setState({
          Items: items,
        });

        reactHandler.PassActiveClass();

      }).catch((err) => {
        console.log(err);
      });
  }
  // public GetLandingPAge() {
  //   let UserID = this.props.UserId;
  //   var reactHandler = this;
  //   $.ajax({
  //     url: `${this.props.siteurl}/_api/web/lists/getbytitle('Content Editor Master')/items?$select=Title,id,URL,AccessibleTo/Title,Icon&$expand=AccessibleTo&$orderby=Title asc&$filter=DeptName eq 'Landing Page' and AccessibleTo/Id eq ${UserID}`,
  //     type: "GET",
  //     headers: { Accept: "application/json; odata=verbose;" },
  //     success: function (resultData) {
  //       console.log(resultData);

  //       reactHandler.setState({
  //         Items: resultData.d.results,
  //       });
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {},
  //   });
  //   console.log(this.state.LandingPage);
  // }

  private async GetLandingPAge() {
    let UserID = this.props.UserId;
    var reactHandler = this;

    await NewWeb.lists.getByTitle("Content Editor Master").items.select("Title", "id", "URL", "AccessibleTo/Title", "Icon","Attachments", "AttachmentFiles").expand("AccessibleTo","AttachmentFiles").orderBy("Title", true)
      .filter(`DeptName eq 'Landing Page' and AccessibleTo/Id eq '${UserID}'`).get().then((items) => { // //orderby is false -> decending          

        reactHandler.setState({
          Items: items,
        });

      }).catch((err) => {
        console.log(err);
      });
    console.log(this.state.LandingPage);
  }
  // public GetLandingPAge_permission() {
  //   let UserID = this.props.UserId;
  //   var reactHandler = this;
  //   $.ajax({
  //     url: `${this.props.siteurl}/_api/web/lists/getbytitle('Content Editor Master')/items?$select=Title,id,URL,AccessibleTo/Title,Icon&$expand=AccessibleTo&$orderby=Title asc&$filter=DeptName eq 'Landing Page' and AccessibleTo/Id eq ${UserID}`,
  //     type: "GET",
  //     headers: { Accept: "application/json; odata=verbose;" },
  //     success: function (resultData) {
  //       console.log(resultData);
  //       if (resultData.d.results.length != 0) {
  //         setTimeout(() => {
  //         $("#Landinpage_permission").show();
  //       }, 1000);
  //       } else {
  //         // $("#accordion .card .card-header.active").removeClass("active");
  //         // $("#accordion .card .card-header.").removeClass("active");
  //         setTimeout(() => {
  //           $(" .MainDept").addClass("active");
  //           $(".per_subdept").addClass("show");
  //           $(".showsubdept").addClass("active");
  //         }, 2000);
  //         // $(".MainDept").addClass("active");  showsubdept
  //       }
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {},
  //   });
  // }

  private async GetLandingPAge_permission() {
    let UserID = this.props.UserId;
    var reactHandler = this;

    await NewWeb.lists.getByTitle("Content Editor Master").items.select("Title", "id", "URL", "AccessibleTo/Title", "Icon").expand("AccessibleTo").orderBy("Title", true)
      .filter(`DeptName eq 'Landing Page' and AccessibleTo/Id eq '${UserID}'`).get().then((items) => { // //orderby is false -> decending          

        if (items.length != 0) {
          setTimeout(() => {
            $("#Landinpage_permission").show();
          }, 1000);
        } else {
          // $("#accordion .card .card-header.active").removeClass("active");
          // $("#accordion .card .card-header.").removeClass("active");
          setTimeout(() => {
            $(" .MainDept").addClass("active");
            $(".per_subdept").addClass("show");
            $(".showsubdept").addClass("active");
          }, 2000);
          // $(".MainDept").addClass("active");  showsubdept
        }

      }).catch((err) => {
        console.log(err);
      });
    console.log(this.state.LandingPage);
  }

  public render(): React.ReactElement<IContentEditorProps> {
    var reactHandler = this;
    const DepartmentTab: JSX.Element[] = this.state.GetDept.map(function (
      item,
      key
    ) {
      if (key == 0) {
        return (
          <div className="card">
            <div className="card-header MainDept ">
              <a
                className="card-link collapsed"
                data-toggle="collapse"
                href={`#collapse${key}`}
                onClick={() => reactHandler.GetDivisionDept(item.Id)}
                aria-expanded="false"
                data-interception="off"
              >
                {item.Title}
                <span className="collapse_icon">
                  <img
                    src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/plus.svg`}
                    alt="img"
                    className="add-img"
                  />

                  <img
                    src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/plus-b.svg`}
                    alt="img"
                    className="add-img-b"
                  />

                  <img
                    src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/minus.svg`}
                    alt="img"
                    className="minus-img"
                  />
                </span>
              </a>
            </div>

            <div
              id={`collapse${key}`}
              className="collapse per_subdept SubDep "
              data-parent="#accordion"
            >
              <div className="card-body second-level-Divisions" id="sub_nav">
                <ul className="clearfix nav-list">
                  {reactHandler.state.DivisionDept &&
                    reactHandler.state.DivisionDept.map(function (item, key) {
                      return (
                        <li>
                          <a
                            href="#"
                            id="sub_dep"
                            className="sub_dep showsubdept"
                            data-interception="off"
                            onClick={() =>
                              reactHandler.GetContentEditorNavigations(item.ID)
                            }
                          >
                            <div className="inner-qiuicklinks-inner">
                              <p> {item.Title} </p>
                            </div>
                          </a>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="card">
            <div className="card-header">
              <a
                className="card-link collapsed"
                data-toggle="collapse"
                href={`#collapse${key}`}
                onClick={() => reactHandler.GetDivisionDept(item.Id)}
                aria-expanded="false"
                data-interception="off"
              >
                {" "}
                {item.Title}
                <span className="collapse_icon">
                  <img
                    src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/plus.svg`}
                    alt="img"
                    className="add-img"
                  />

                  <img
                    src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/plus-b.svg`}
                    alt="img"
                    className="add-img-b"
                  />

                  <img
                    src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/minus.svg`}
                    alt="img"
                    className="minus-img"
                  />
                </span>
              </a>
            </div>

            <div
              id={`collapse${key}`}
              className="collapse SubDep"
              data-parent="#accordion"
            >
              <div className="card-body second-level-Divisions" id="sub_nav">
                <ul className="clearfix nav-list">
                  {reactHandler.state.DivisionDept &&
                    reactHandler.state.DivisionDept.map(function (item, key) {
                      return (
                        <li>
                          <a
                            href="#"
                            id="sub_dep"
                            className="sub_dep"
                            onClick={() =>
                              reactHandler.GetContentEditorNavigations(item.ID)
                            }
                            data-interception="off"
                          >
                            <div className="inner-qiuicklinks-inner">
                              <p> {item.Title} </p>
                            </div>
                          </a>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        );
      }
    });

    const DivisionElements: JSX.Element[] = this.state.DivisionDept.map(
      function (item, key) {
        // let RawImageTxt = item.Icon;

        if (key == 0) {
          return (
            <div className="card">
              <div className="card-header ">
                <a
                  href="#"
                  onClick={() =>
                    reactHandler.GetContentEditorNavigations(item.ID)
                  }
                  className="card-link collapsed"
                  data-interception="off"
                >
                  {" "}
                  {item.Title}
                </a>
              </div>
            </div>
          );
        } else {
          return (
            <div className="card">
              <div className="card-header">
                <a
                  href="#"
                  onClick={() =>
                    reactHandler.GetContentEditorNavigations(item.ID)
                  }
                  className="card-link collapsed"
                  data-interception="off"
                >
                  {" "}
                  {item.Title}{" "}
                </a>
              </div>
            </div>
          );
        }
      }
    );

    const ContentEditorElements: JSX.Element[] = this.state.Items.map(function (
      item,
      key
    ) {
      console.log(item)
      let RawImageTxt = item.Icon;

      var ImgObj = JSON.parse(RawImageTxt);
      var URLs;
      if (ImgObj.serverRelativeUrl == undefined) {
        if (item.AttachmentFiles.length != 0) {
          URLs = item.AttachmentFiles[0].ServerRelativeUrl
        }
      } else {
        URLs = ImgObj.serverRelativeUrl
      }

      return (
        <li className="ifcontentpresent">
          <a href={`${item.URL.Url}`} target="_blank" data-interception="off">
            <div className="inner-qiuicklinks-inner">
              <img src={`${URLs}`} />
              <p> {item.Title} </p>
            </div>
          </a>
        </li>
      );
    });
    const LandingPageElement: JSX.Element[] = this.state.LandingPage.map(
      function (item, key) {
        let RawImageTxt = item.Icon;

        var ImgObj = JSON.parse(RawImageTxt);
        return (
          <li className="ifcontentpresent">
            <a href={`${item.URL.Url}`} target="_blank" data-interception="off">
              <div className="inner-qiuicklinks-inner">
                <img src={`${ImgObj.serverRelativeUrl}`} />
                <p> {item.Title} </p>
              </div>
            </a>
          </li>
        );
      }
    );

    return (
      <div className={styles.contentEditor}>
        {/* <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={''} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div> */}
        {this.state.ContentEditorAdmin &&
          this.state.ContentEditorAdmin == true ? (
          <section>
            <div className="relative">
              <div className="section-rigth">
                <div className="inner-banner-header relative m-b-20">
                  <div className="inner-banner-overlay"></div>
                  <div className="inner-banner-contents">
                    <h1> Content Editor </h1>
                    <ul className="breadcums">
                      <li>
                        <a
                          href={`${this.props.siteurl}/SitePages/Homepage.aspx?env=WebView`}
                          data-interception="off"
                        >
                          {" "}
                          Home
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          style={{ pointerEvents: "none" }}
                          data-interception="off"
                        >
                          {" "}
                          Content Editor{" "}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="inner-page-contents " id="permission_available">
                  <div className="top-news-sections content-editir-secs m-b-20">
                    <div className="row">
                      <div className="col-md-6">
                        <div id="accordion">
                          <div
                            className="card"
                            style={{ display: "none" }}
                            id="Landinpage_permission"
                          >
                            <div
                              className="card-header active "
                              id="id-landingpage"
                            >
                              <a
                                className="card-link"
                                data-toggle="collapse"
                                href="#LandingPage"
                                onClick={() => reactHandler.GetLandingPAge()}
                                data-interception="off"
                              >
                                Landing Pages
                              </a>
                            </div>
                          </div>
                          {DepartmentTab}
                        </div>
                      </div>
                      <div className="col-md-6 direct-conttent-sreas">
                        <div className="sec">
                          {/* <ul className="clearfix " id="LandingPage">{LandingPageElement}</ul> */}
                          <ul className="clearfix">{ContentEditorElements}</ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section id="access-denied-block" style={{ display: "none" }}>
            <div className="result-succ-mess">
              <h3>Access Denied</h3>
              <img
                src={`${reactHandler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/Not_Sync.png`}
                alt="image"
                data-themekey="#"
              />
              <h4> You don't have enough permission to access this!</h4>{" "}
              <p>Please contact your Administrator</p>
              <a
                href={`${reactHandler.props.siteurl}/SitePages/Homepage.aspx?env=WebView`}
                data-interception="off"
              >
                Go Back
              </a>
            </div>
          </section>
        )}
      </div>
    );
  }
}
