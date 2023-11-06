import * as React from 'react';
import styles from './DepartmentServices.module.scss';
import { IDepartmentServicesProps } from './IDepartmentServicesProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Web } from "@pnp/sp/webs";
import { Markup } from 'interweave';
import { sp } from '@pnp/sp';
export interface IDepartmentServicesState {
  Items: any[];
  ServiceDescription: string;
}
export default class DepartmentServices extends React.Component<IDepartmentServicesProps, IDepartmentServicesState, {}> {
  public constructor(props: IDepartmentServicesProps, state: IDepartmentServicesState) {
    super(props);
    this.state = {
      Items: [],
      ServiceDescription: ""
    };
  }

  public componentDidMount() {
    // $('#spCommandBar').attr('style', 'display: none !important');
    // $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');


    $('#spLeftNav').attr('style', 'display: none !important');    //var handler = this;
    this.GetDepartmentServices();
  }

  private GetDepartmentServices() {
    var reactHandler = this;
    $.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Services')/items?$select=ID,Title,Description&$filter=IsActive eq 1&$orderby=Order0 asc`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        if (resultData.d.results.length == 0) {
          $("#if-service-present").hide();
          $("#if-no-service-present").show();
        } else {
          $("#if-service-present").show();
          $("#if-no-service-present").hide();
          reactHandler.setState({
            Items: resultData.d.results,
            ServiceDescription: resultData.d.results[0].Description
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });
  }

  // private async GetDepartmentServices() {
  //   var reactHandler = this;
  //   //  sp.web.lists.getByTitle("Quick Links").items
  //   await  sp.web.lists.getByTitle("Services").items.select("ID", "Title", "Description")
  //     .filter(`IsActive eq '1' `).orderBy("Order0", true).get().then((items) => { // //orderby is false -> decending          

  //       console.log("item1", items);

  //       if (items.length == 0) {
  //         $("#if-service-present").hide();
  //         $("#if-no-service-present").show();
  //       } else {
  //         $("#if-service-present").show();
  //         $("#if-no-service-present").hide();
  //         reactHandler.setState({
  //           Items: items,
  //           ServiceDescription: items[0].Description
  //         });
  //       }
  //     }).catch((err) => {
  //       console.log(err);
  //     });
  // }

  public LoadServiceDescription(ItemID) {
    var reactHandler = this;
    $.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('Services')/items?$select=ID,Title,Description&$filter=ID eq ${ItemID}`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        reactHandler.setState({
          ServiceDescription: resultData.d.results[0].Description
        });

      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });
  }

  // public async LoadServiceDescription(ItemID) {
  //   var reactHandler = this;

  //   await sp.web.lists.getByTitle("Services").items.select("ID", "Title", "Description")
  //     .filter(`ID eq '${ItemID}'`).get().then((items) => { // //orderby is false -> decending   
  //       console.log("items", items);

  //       this.setState({
  //         ServiceDescription: items[0].Description,
  //       });

  //     }).catch((err) => {
  //       console.log(err);
  //     });
  // }

  public render(): React.ReactElement<IDepartmentServicesProps> {
    $("#service-main li").on("click", function () {

      $(this).siblings().removeClass("active");
      $(this).addClass("active");


    });

    var reactHandler = this;
    const DeptServices: JSX.Element[] = this.state.Items.map(function (item, key) {
      if (key == 0) {
        return (
          <li className="active" onClick={() => reactHandler.LoadServiceDescription(item.ID)}> <a href="#" data-interception="off"> {item.Title} </a>  </li>
        );
      } else {
        return (
          <li onClick={() => reactHandler.LoadServiceDescription(item.ID)}> <a href="#" data-interception="off"> {item.Title} </a>  </li>
        );
      }
    });
    return (
      <div className={styles.departmentServices}>
        <div className="relative">
          <div className="section-rigth">
            <div className="depat-key-people dept-sub m-b-20">
              <div className="sec">
                <div className="heading">
                  Our Services
                </div>
                <div className="section-part clearfix" id="if-service-present">

                  <div className="ourservices-left">
                    <ul id="service-main">
                      {DeptServices}
                    </ul>
                  </div>
                  <div className="ourservices-right">
                    <p> <Markup content={this.state.ServiceDescription} /> </p>
                  </div>

                </div>
                <div className="row" style={{ display: "none" }} id="if-no-service-present">
                  <div className="col-md-12 m-b-0 clearfix">
                    <img src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ContentEmpty.png" alt="no-content"></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
