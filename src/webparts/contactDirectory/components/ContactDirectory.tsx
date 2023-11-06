import * as React from "react";
import styles from "./ContactDirectory.module.scss";
import { IContactDirectoryProps } from "./IContactDirectoryProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/web";
import "@pnp/sp/profiles";
import { SPComponentLoader } from "@microsoft/sp-loader";
import * as $ from "jquery";
import { IItemAddResult } from "@pnp/sp/items";
import swal from 'sweetalert';
import "DataTables.net";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
import { Title } from "GlobalCustomFeaturesApplicationCustomizerStrings";
import { Web } from "@pnp/sp/webs";
import { withWidth } from "@material-ui/core";
import { ServiceProvider } from '../components/ServiceProvidernew';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import * as pnp from '@pnp/sp'

SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css");
SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js");
SPComponentLoader.loadCss("https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js");
SPComponentLoader.loadScript("https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js");
SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.bundle.min.js");
SPComponentLoader.loadCss("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css");

export interface IContactDirectoryState {
  Items: any[];
  Columns: any[];
  ColumnName: any[];
  CheckColumn: any[];
  CheckBoxValue: any[];
  AddColumn: any[];
  RemoveColumn: any[];
  myAdRecentData: any[],
  LISTDATA: any[],
}

const NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet/");

let UserDetailsHolder: any = [];
let MasterGlobArray: any = [];
export default class ContactDirectory extends React.Component<IContactDirectoryProps,IContactDirectoryState,{}> {
  private serviceProvider;
  constructor(props: IContactDirectoryProps, state: IContactDirectoryState) {
    super(props);
    this.serviceProvider = new ServiceProvider(this.props.context);
    this.state = {
      Items: [],
      Columns: [],
      ColumnName: [],
      CheckColumn: [],
      CheckBoxValue: [],
      AddColumn: [],
      RemoveColumn: [],
      myAdRecentData: [],
      LISTDATA: []
    };
  }

  public componentDidMount() {
    // setTimeout(function () {
    $("#spCommandBar").attr("style", "display: none !important");
    $("#CommentsWrapper").attr("style", "display: none !important");
    $('div[data-automation-id="pageHeader"]').attr("style", "display: none !important");
    $(".ilter-hide").hide();
    // 
    //}, 
    //2000);
    var reactHandler = this;
    reactHandler.GetColumnName();
    // reactHandler.DisplayColumn();
    reactHandler.GetMyAdDetails();
  }

  public LoadTableDatas() {
    $(".ilter-hide").show();
    $.fn.dataTable.ext.errMode = 'none';

    ($('#example') as any).DataTable({
      pageLength: 10,
      bSort: false,
      lengthMenu: [[5, 10, 20, 50, 100, -1], [5, 10, 20, 50, 100, "All"]],
      initComplete: function () {
        this.api().columns().every(function () {
          var column = this;
          var select = $('<select><option value="">All</option></select>')
            .appendTo($(column.header()).empty()).on('change', function () {
              var val = $.fn.dataTable.util.escapeRegex(
                ($(this) as any).val()
              );
              column.search(val ? '^' + val + '$' : '', true, false).draw();
            });
          column.data().unique().sort().each(function (d, j) {
            select.append('<option value="' + d + '">' + d + '</option>')
          });
        });
      }
    });
  }

  private async GetContact() {
    var reactHandler = this;
    $.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('ContactDirectoryMaster')/items?$select=employeeId,country,businessPhones,city,department,jobTitle,mobilePhone,surname,givenName,mail,ProfilePictureURL,ProfileImage&$orderby=Created desc&$top=5000`,

      type: "GET",
      headers: { Accept: "application/json; odata=verbose;" },
      success: function (resultData) {
        //console.log(resultData);

        // reactHandler.setState({
        //   LISTDATA: resultData.d.results,
        // });
        for (var i = 0; i < resultData.d.results.length; i++) {
          MasterGlobArray.push(resultData.d.results[i]);
        }

        reactHandler.setState({
          myAdRecentData: MasterGlobArray
        });
        //console.log(resultData.d.results)

        setTimeout(() => {
          reactHandler.LoadTableDatas();
        }, 1000);


        // $("#example").on('page.dt', function () { 
        //   console.log('Page change happened');
        //   reactHandler.CheckSelectedTitle();
        // }).DataTable();
        // // $("#example").on('show.dt', function () { 
        // //   console.log('Page change happened');
        // //   reactHandler.CheckSelectedTitle();
        // // }).DataTable();
        // $(document).on("change", ".dataTables_length", function(){
        //   reactHandler.CheckSelectedTitle();

        // })
        // $(document).on("change", ".sorting_disabled", function(){
        //   reactHandler.CheckSelectedTitle();

        // })

      },

      error: function (jqXHR, textStatus, errorThrown) {
        reactHandler.setState({
          myAdRecentData: MasterGlobArray
        });
        setTimeout(() => {
          reactHandler.LoadTableDatas();
        }, 1000);
      },
    });
  }

  public GetMyAdDetails() {
    sp.setup(this.props.context);
    this.serviceProvider.getADdetails().then(
        async (result: any): Promise<void> => {
          /* for(var i =0; i < result.length; i++){
             //console.log(result[i].userPrincipalName);
             let loginName="i:0#.f|membership|"+result[i].userPrincipalName;
             const profile = await sp.profiles.getPropertiesFor(loginName);            
             UserDetailsHolder.push(profile)//UserProfileProperties;
           }*/
          //console.log("UserDetailsHolder",result);
          // this.setState({ 
          //   myAdRecentData: result 
          // }); 
          for (var i = 0; i < result.length; i++) {
            MasterGlobArray.push(result[i]);
          }
          this.GetContact();
          //console.log(MasterGlobArray)
        }
      )
      .catch(error => {
        //console.log(error);
        this.GetContact();
      });
  }

  public AddOpenClass() {
    $("#myDIV").toggleClass("open");
  }

  public async GetColumnName() {
    var reactHandler = this;
    $.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('ContactDirectoryMaster')/fields?$filter=Hidden eq false and ReadOnlyField eq false `,

      type: "GET",
      headers: { Accept: "application/json; odata=verbose;" },
      success: function (resultData) {
        reactHandler.setState({
          ColumnName: resultData.d.results,
        });
        setTimeout(() => {
          //  reactHandler.HideColumn();
          reactHandler.CheckSelectedTitle();
        }, 2000);
      },

      error: function (jqXHR, textStatus, errorThrown) { },
    });
  }

  public HideColumn() {
    // var column=[".cust-img",".user_Job",""]
    $(".cust-img").hide();
    $(".user_Job").hide();
    $(".user_Fname").hide();
    $(".user_Lname").hide();
    $(".user_EmpID").hide();
    $(".user_Emailid").hide();
    $(".user_Dept").hide();
    $(".user_Phone").hide();
    $(".user_OfficePhone").hide();
    $(".user_City").hide();
    $(".user_Country").hide();
    $(".user_RepManager").hide();
  }

  public async DeleteItem(ID) {
    let list = NewWeb.lists.getByTitle("ContactConfigTransaction");
    await list.items.getById(ID).delete().then(() => {
        //console.log("Deleteted");
      });
  }

  public CheckSelectedTitle() {
    var reactHandler = this;
    $.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('ContactConfigTransaction')/items?$select=Title,id`,
      type: "GET",
      headers: { Accept: "application/json; odata=verbose;" },
      success: function (resultData) {
        console.log(resultData.d.results);
        for (var i = 0; i < resultData.d.results.length; i++) {
          if (resultData.d.results[i].Title == "ProfileImage") {
            $(".cust-img").show();
          } else if (resultData.d.results[i].Title == "JobTitle") {
            $(".user_Job").show();
          } else if (resultData.d.results[i].Title == "First Name") {
            $(".user_Fname").show();
          } else if (resultData.d.results[i].Title == "Last Name") {
            $(".user_Lname").show();
          } else if (resultData.d.results[i].Title == "EmployeeId") {
            $(".user_EmpID").show();
          } else if (resultData.d.results[i].Title == "Mail") {
            $(".user_Emailid").show();
          } else if (resultData.d.results[i].Title == "Department") {
            $(".user_Dept").show();
          } else if (resultData.d.results[i].Title == "MobilePhone") {
            $(".user_Phone").show();
          } else if (resultData.d.results[i].Title == "Office Phone") {
            $(".user_OfficePhone").show();
          } else if (resultData.d.results[i].Title == "City") {
            $(".user_City").show();
          } else if (resultData.d.results[i].Title == "Country") {
            $(".user_Country").show();
          }/* else if (resultData.d.results[i].Title == "Reporting Manager") {
            $(".user_RepManager").show();
          }*/

          (
            $("input[type=checkbox][value='" + resultData.d.results[i].Title + "']") as any).attr("checked", true);
        }
      },

      error: function (jqXHR, textStatus, errorThrown) { },
    });
  }

  public DisplayColumn() {
    this.uncheckedvalues();
    var GetColumn = [];
    var checkboxValues = [];
    var reactHandler = this;

    $.ajax({
      url: `${this.props.siteurl}/_api/web/lists/getbytitle('ContactConfigTransaction')/items?$select=Title`,

      type: "GET",
      headers: { Accept: "application/json; odata=verbose;" },
      success: function (resultData) {
        //console.log(resultData);
        for (var i = 0; i < resultData.d.results.length; i++) {
          GetColumn.push(resultData.d.results[i].Title)
        }
        //console.log(GetColumn);
        //console.log(resultData.d.results);

        $("input[type=checkbox]:checked").map(function () {
          checkboxValues.push({ label: '' + $(this).val() + '', value: '' + $(this).val() + '' });
        });
        //console.log(checkboxValues);

        for (var i = 0; i < checkboxValues.length; i++) {
          if (jQuery.inArray(checkboxValues[i].value, GetColumn) == -1) {
            NewWeb.lists.getByTitle("ContactConfigTransaction").items.add({
              Title: checkboxValues[i].value,
            });
          }

        }

        swal({
          title: "Applied Successfully",
          icon: "success"
        } as any).then(() => {
          location.reload();

        });
      },



      error: function (jqXHR, textStatus, errorThrown) { },
    });


  }

  public async uncheckedvalues() {
    var uncheckedvalues = [];
    $("input[type=checkbox]:not(:checked)").map(function () {
      uncheckedvalues.push($(this).val());
    });

    for (var i = 0; i < uncheckedvalues.length; i++) {
      var reactHandler = this;
      $.ajax({
        // url: `${this.props.siteurl}/_api/web/lists/getbytitle('ContactDirectoryMaster')/items?$select=Title,Name,Branch,Department,DOB,DOJ,Location,Phone_x0020_Number,EmailId,Employee_x0020_Image,ReportingManager`,
        url: `${this.props.siteurl}/_api/web/lists/getbytitle('ContactConfigTransaction')/items?$select=Title,id&$filter=Title eq '${uncheckedvalues[i]}'`,
        type: "GET",
        headers: { Accept: "application/json; odata=verbose;" },
        success: function (resultData) {
          reactHandler.DeleteItem(resultData.d.results[0].ID);
        },
        error: function (jqXHR, textStatus, errorThrown) { },
      });
    }
  }

  public CancelCheckbox() {
    $("#myDIV").removeClass("open");
    window.location.reload();
  }

  public render(): React.ReactElement<IContactDirectoryProps> {
    var handler = this;
    var JobTitle = "";
    var Dept = "";
    var RepManager = "";
    var OfficePhone = "";
    var City = "";
    var Country = "";
    var EmailId = "";
    var EmployeeId = "";
    var Phonenumber = "";
    const ColumnName: JSX.Element[] = handler.state.ColumnName.map(function (
      item,
      key

    ) {
      console.log("columnnME" + item);

      let Title = item.Title;

      if (Title != "Content Type" && Title != "Attachments") {
        return (
          <li>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="box"
                id={`check${key}`}
                value={item.Title}
              />
              {/* <input className="form-check-input" type="checkbox" name='box' id={`check${key}`}   onClick={()=>handler.AddtoListItem(key,item.Title)} value={item.Title}  /> */}

              <label className="form-check-label" id="Column">
                {" "}
                {item.Title}
              </label>
            </div>{" "}
          </li>
        );
      }
    });

    const ContactDirectory: JSX.Element[] = this.state.myAdRecentData.map(function (item,key) {
      console.log(item);
      //  let RawImageTxt ="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/userphoto.jpg"; //PictureURL
      //  if (RawImageTxt != "" && RawImageTxt != null && RawImageTxt!= undefined) {
      //    var ImgObj = RawImageTxt;
      //    //console.log("ImgObj",ImgObj);
      //   //  var ImgObj = JSON.parse(RawImageTxt);
      //  }
      debugger;
      var img = item.ProfilePictureURL;//ProfileImage;
      if (img != "" && img != null && img != undefined) {
        var ImgObj = item.ProfilePictureURL;//JSON.parse(img);
      } else {

      }
      let RawImageTxt = "https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/userphoto.jpg"; //PictureURL
      if (img != "" && img != null && img != undefined) {
        var ImgObj = item.ProfilePictureURL;//JSON.parse(img);

        if (item.jobTitle == null) {
          JobTitle = "NA";

          //console.log("SPS-JobTitle",item.jobTitle);
        } else {
          JobTitle = item.jobTitle;
          //console.log("JobTitle",item.jobTitle)
        }
        if (item.department == null) {
          Dept = "NA";
          debugger;
        } else {
          Dept = item.department;
        }
        if (item.city == null) {
          City = "NA";
        } else {
          City = item.city; //Location
        }
        if (item.country == null) {
          Country = "NA";
        } else {
          Country = item.country;
        }
        if (item.businessPhones == "") {
          OfficePhone = "NA";
        } else {
          OfficePhone = item.businessPhones; //Workphone
        }
        if (item.mail == null) {
          EmailId = "NA";
          //console.log("EmailId",EmailId);
        } else {
          EmailId = item.mail; //WorkEmail
        }
        if (item.employeeId == null) {
          EmployeeId = "NA";
        } else {
          EmployeeId = item.employeeId;
        }
        if (item.mobilePhone == null) {
          Phonenumber = "NA";
        } else {
          Phonenumber = item.mobilePhone;
        }
        /* if (item.UserProfileProperties[14].Value == "") {
          RepManager = "NA";
        } else {
          RepManager = item.UserProfileProperties[14].Value; //Manager
        } */
        return (
          <tr>
            <td className="cust-img" >
              <a href="#" className="person-name" data-interception="off">
                <img
                  src={`${ImgObj}`}
                  className="user-img"
                  alt="image"
                />{" "}
              </a>
            </td>
            <td className="user_Fname"  >
              {item.givenName}
            </td>
            <td className="user_Lname"  >
              {item.surname}
            </td>
            <td className="user_EmpID" >
              {EmployeeId}
            </td>
            <td className="user_Job" >
              {JobTitle}
            </td>
            <td className="user_Dept" >
              {Dept}
            </td>

            <td className="user_OfficePhone" >
              {OfficePhone}
            </td>
            <td className="user_Phone">
              {Phonenumber}
            </td>
            <td className="user_Emailid" >
              {EmailId}
            </td>
            <td className="user_City" >
              {City}
            </td>
            <td className="user_Country" >
              {Country}
            </td>
          </tr>
        );
      } else {
        if (item.jobTitle == null) {
          JobTitle = "NA";
        } else {
          JobTitle = item.jobTitle;
        }
        if (item.department == null) {
          Dept = "NA";
        } else {
          Dept = item.department;
        }
        if (item.city == null) {
          City = "NA";
        } else {
          City = item.city;
        }
        if (item.country == null) {
          Country = "NA";
        } else {
          Country = item.country;
        }
        if (item.businessPhones == "") {
          OfficePhone = "NA";
        } else {
          OfficePhone = item.businessPhones;
        }
        if (item.mail == null) {
          EmailId = "NA";
        } else {
          EmailId = item.mail;
          //console.log("EmailId", EmailId);
        }
        if (item.employeeId == null) {
          EmployeeId = "NA";
        } else {
          EmployeeId = item.employeeId;
        }
        if (item.mobilePhone == null) {
          Phonenumber = "NA";
        } else {
          Phonenumber = item.mobilePhone;
        }
        /* if (item.UserProfileProperties[14].Value == "") {
          RepManager = "NA";
        } else {
          RepManager = item.UserProfileProperties[14].Value;
        } */
        return (
          <tr>
            {/* <td><img src={ImgObj.serverRelativeUrl} className="user-img" alt="image"/></td>  */}
            <td className="cust-img">
              <a href="#" className="person-name" data-interception="off">
                <img
                  src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/Img/Error%20Handling%20Images/userphoto (1).jpg`}
                  alt="image"
                />
              </a>
            </td>
            <td className="user_Fname" >
              {item.givenName}
            </td>
            <td className="user_Lname">
              {item.surname}
            </td>
            <td className="user_EmpID">
              {EmployeeId}
            </td>
            <td className="user_Job">
              {JobTitle}
            </td>
            <td className="user_Dept">
              {Dept}
            </td>

            <td className="user_OfficePhone">
              {OfficePhone}
            </td>
            <td className="user_Phone" >
              {Phonenumber}
            </td>
            <td className="user_Emailid" >
              {EmailId}
            </td>
            <td className="user_City">
              {City}
            </td>
            <td className="user_Country" >
              {Country}
            </td>

          </tr>
        );
      }
    });

    return (
      <div className={styles.contactDirectory}>
        <section>
          <div className="container relative" style={{ width: "100%" }}>
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Contact Directory </h1>
                  <ul className="breadcums">
                    <li>
                      {" "}
                      <a href={`${this.props.siteurl}/SitePages/Homepage.aspx?env=WebView`} data-interception="off">
                        {" "}
                        Home{" "}
                      </a>{" "}
                    </li>
                    <li>
                      {" "}
                      <a href="#" data-interception="off"> All Contacts </a>{" "}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec mb-20">
                  <div className="search-filter">
                    <div className="table-search-wrap clearfix">
                      <div className="table-search relative">
                        <h3>Contact Directory List</h3>
                      </div>
                      <div className="table-sort">
                        <div className="btn-filter relative">
                          {/* <button type="button" onClick={() => this.AddOpenClass()} className="btn filter-btn">
                            <span>
                              <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/filter.svg`} className="filter-icon" />
                            </span>
                            View
                          </button> */}
                          <div className=" filter-content "id="myDIV">
                            <ul>{ColumnName}</ul>
                            <div className="drpdwn-btn-wrap clearfix">
                              <a className="btn btn-primary apply_btn" onClick={() => this.DisplayColumn()} data-interception="off">
                                Apply
                              </a>
                              <a className="btn btn-primary cancel-btn" onClick={() => this.CancelCheckbox()} data-interception="off">
                                cancel
                              </a>
                            </div>
                          </div>
                        </div>
                        <a href={`${handler.props.siteurl}/SitePages/Add-Contact.aspx?env=WebView`} className="btn btn-primary" data-interception="off">
                          <span>
                            <img src={`${handler.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/add_contacts_plus.png`} className="add-contact-icon"/>
                          </span>
                          Add Contacts
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="contact-table-info">
                    <table className="table table-striped" id="example">
                      <thead className="table-head" id="filter-hide">
                        <tr>
                          <th className="cust-img" >
                            {/* IMAGE */}
                          </th>
                          <th className="user_Fname">
                            FIRST NAME
                          </th>
                          <th className="user_Lname">
                            LAST NAME
                          </th>
                          <th className="user_EmpID">
                            EMPLOYEE ID
                          </th>
                          <th className="user_Job" >
                            JOB TITLE
                          </th>
                          <th className="user_Dept" >
                            DEPARTMENT
                          </th>
                          <th className="user_OfficePhone">
                            OFFICE PHONE
                          </th>
                          <th
                            className="user_Phone">
                            PHONE NUMBER
                          </th>
                          <th
                            className="user_Emailid">
                            EMAIL ID
                          </th>
                          <th className="user_City">
                            CITY
                          </th>
                          <th
                            className="user_Country">
                            COUNTRY
                          </th>
                        </tr>
                      </thead>
                      <thead className="table-head">
                        <tr>
                          <th className="cust-img">
                            IMAGE
                          </th>
                          <th
                            className="user_Fname">
                            FIRST NAME
                          </th>
                          <th
                            className="user_Lname">
                            LAST NAME
                          </th>
                          <th
                            className="user_EmpID">
                            EMPLOYEE ID
                          </th>
                          <th className="user_Job">
                            JOB TITLE
                          </th>
                          <th className="user_Dept">
                            DEPARTMENT
                          </th>
                          <th
                            className="user_OfficePhone">
                            OFFICE PHONE
                          </th>
                          <th
                            className="user_Phone">
                            PHONE NUMBER
                          </th>
                          <th
                            className="user_Emailid">
                            EMAIL ID
                          </th>
                          <th className="user_City">
                            CITY
                          </th>
                          <th
                            className="user_Country">
                            COUNTRY
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ContactDirectory}
                      </tbody>
                    </table>
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

function myFunction() {
  var x = document.getElementById("myDIV");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
