import * as React from 'react';
import styles from './DocumentLibrary.module.scss';
import { IDocumentLibraryProps } from './IDocumentLibraryProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery'
import { SPComponentLoader } from "@microsoft/sp-loader";
import GlobalSideNav from "../../../extensions/globalCustomFeatures/GlobalSideNav";
import { Web } from '@pnp/sp/presets/all';



const NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet/");

export interface IDocumentLibraryState {
  items: any[];
  ToggleDepartments: any[];
}

export default class DocumentLibrary extends React.Component<IDocumentLibraryProps, IDocumentLibraryState, {}> {
  public constructor(props: IDocumentLibraryProps, state: IDocumentLibraryState) {
    super(props);
    this.state = {
      items: [],
      ToggleDepartments: [],

    };
  }

  public componentDidMount() {
    setTimeout(function () {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    }, 2000);

    this.GetDepartmetsTabs();

  }
  public GetDepartmetsTabs() {

    NewWeb.lists.getByTitle("DepartmentsMaster").items.select("Title", "ID", "URL", "HasSubDept", "OpenInNewTab", "PlaceUnder/Title", "PlaceUnder/Id", "IsActive").
      expand("PlaceUnder/Id", "PlaceUnder").orderBy("Order0", true).filter(`IsActive eq 1 and PlaceUnder eq null`)
      .get().then((items) => {
        this.setState({ ToggleDepartments: items });
        $(".nav-pills li:first").addClass("active");
        this.GetDocumentBasedOnDept(items[0].ID)
      });
  }

  public async GetDocumentBasedOnDept(ID) {

    var reactHandler = this;
    reactHandler.setState({ items: [] });
    setTimeout(async () => {
      await NewWeb.lists.getByTitle("Document").items.
        select("ID", "Title", "Name/Title", "HoverOnImage", "HoverOffImage", "URL", "DepartmentBelongsTo/Id", "DepartmentBelongsTo/Title").
        expand("Name", "DepartmentBelongsTo").orderBy("Order0", true).filter(`IsActive eq '1' and DepartmentBelongsTo/Id eq ${ID}`).get().then((items) => { // //orderby is false -> decending          

          reactHandler.setState({
            items: items
          });

        }).catch((err) => {
          console.log(err);
        });
    }, 500);
  }

  public render(): React.ReactElement<IDocumentLibraryProps> {


    var reactHandler = this;
    const Departments: JSX.Element[] = reactHandler.state.ToggleDepartments.map(function (item, key) {
      return (
        <li className=""><a data-toggle="pill" href="#home" onClick={() => reactHandler.GetDocumentBasedOnDept(item.Id)}>{item.Title}</a>
        </li>
      );
    });
    const DocumentLibrary: JSX.Element[] = this.state.items.map(function (item, key) {

      let Title = item.Name.Title;
      let RawImageTxt = item.HoverOnImage;
      let RawHoverOffImage = item.HoverOffImage;
      if (RawImageTxt != "" && RawHoverOffImage != "") {
        var ImgObj = JSON.parse(RawImageTxt);
        var ImgObjHoverImage = JSON.parse(RawHoverOffImage);
        return (
          <li>
            <a href={`${item.URL.Url}`} data-interception="off" target="_blank">
              <img className="DarkImage" src={ImgObjHoverImage.serverRelativeUrl} alt="image" />
              <img className="LightImage" src={ImgObj.serverRelativeUrl} alt="image" />
              <p>{Title}</p>
            </a>
          </li>
        );
      }
    });
    return (
      <div className={styles.documentLibrary}>
        <section>
          <div className="relative">
            <div className="section-rigth"></div>
            <div className="inner-banner-header relative m-b-20">
              <div className="inner-banner-overlay"></div>
              <div className="inner-banner-contents">
                <h1> Document Library </h1>
                <ul className="breadcums">
                  <li>  <a href={`${this.props.siteurl}/SitePages/Homepage.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                  <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> Document Library </a> </li>
                </ul>
              </div>
            </div>
            <div className="direct-conttent-sreas">

              <div className="sec">

                <div className="container">
                  <ul className="nav nav-pills">
                    {Departments}
                  </ul>
                  <div className="tab-content">
                    <div className="tab-pane fade in active">
                      <div className='tab-departments'>
                        <ul className="clearfix">
                          {DocumentLibrary}
                        </ul>
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
