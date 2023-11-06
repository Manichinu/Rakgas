import * as React from 'react';
import styles from './AddContacts.module.scss';
import { IAddContactsProps } from './IAddContactsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItemAddResult } from "@pnp/sp/items";
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import swal from 'sweetalert';
import { Web } from "@pnp/sp/presets/all";
import * as moment from "moment";
//import Box from '@mui/material/Box';
//import TextField from '@mui/material/TextField';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

//  import { display } from '@mui/system';
SPComponentLoader.loadScript("https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js");
SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.bundle.min.js");
SPComponentLoader.loadCss("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css");
SPComponentLoader.loadScript("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
SPComponentLoader.loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");

export interface IAddContactsState {
  items: any[];

}
let MyQlinkArr = [];
var AttachmentURL = "";
const NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet/");
export default class AddContacts extends React.Component<IAddContactsProps, IAddContactsState, {}> {
  public constructor(props: IAddContactsProps, state: IAddContactsState) {
    super(props);
    this.state = {
      items: [],

    };
  }

  public componentDidMount() {
    setTimeout(function () {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');

    }, 2000);

  }
  public validation_Fname() {
    //Name validation
    var FormStatus = true;
    var firstname = $.trim(($("#txt-emp-fname") as any).val());
    if (FormStatus == true && firstname != "") {

      $("#fname-error").hide();
      $("#fname-format").hide();
      var fnameregex = /[a-zA-Z][a-zA-Z ]*/;
      var c = /[!@#$%^&*;,<>'"|+]/;
      var d = /[\d+]/
      var testfname = fnameregex.test(firstname);
      if (firstname.match(c)) {
        $("#fname-error").hide();
        $("#fname-format").show();
        $("#txt-emp-fname").focus();
        $("#er-fname").addClass("error");
        FormStatus = false;

      }

      else if (firstname.match(fnameregex)) {
        $("#fname-error").hide();
        $("#fname-format").hide();
        $("#txt-emp-fname").focus();

        FormStatus = true;

      }

    } else {

      $("#fname-error").show();
      $("#fname-format").hide();
      $("#txt-emp-fname").focus();
      $("#er-fname").addClass("error");
      FormStatus = false;


    }
    return FormStatus;

  }
  public validation_Lname() {
    //Name validation
    var FormStatus_Lname = true;
    var lastname = $.trim(($("#txt-emp-lname") as any).val());
    if (FormStatus_Lname == true && lastname != "") {

      $("#lname-error").hide();
      $("#lname-format").hide();
      var lnameregex = /[a-zA-Z][a-zA-Z ]*/;
      var c = /[!@#$%^&*;,<>'"|+]/;
      var d = /[\d+]/
      var testfname = lnameregex.test(lastname);
      if (lastname.match(c)) {
        $("#lname-error").hide();
        $("#lname-format").show();
        $("#txt-emp-lname").focus();
        $("#er-lname").addClass("error");
        FormStatus_Lname = false;

      }

      else if (lastname.match(lnameregex)) {
        $("#lname-error").hide();
        $("#lname-format").hide();
        $("#txt-emp-lname").focus();

        FormStatus_Lname = true;

      }

    } else {

      $("#lname-error").show();
      $("#lname-format").hide();
      $("#txt-emp-lname").focus();
      $("#er-lname").addClass("error");
      FormStatus_Lname = false;


    }
    return FormStatus_Lname;

  }
  public validation_empid() {
    var empid_status = true;
    let Empid: any = $.trim(($("#txt-empid") as any).val());
    if (Empid == "") {
      $("#empid-error").show();
      $("#er-empid").addClass("error");
      $("#txt-empid").focus();
      empid_status = false;
    }
    return empid_status;
  }

  public validation_phone() {
    //Phone validation   txt-emailid
    var phone_status = true;
    var phone = $.trim(($("#txt-phone-no") as any).val());

    if (phone_status == true && phone != "") {
      $("#phone-error").hide();
      $("#phone-format").hide();
      var phonereg = /[+\d+][\d+]*/;
      var b = /[a-zA-Z][a-zA-Z ]*/;
      var c = /[!@#$%^&*;,<>'"|]/;
      var testphone = phonereg.test(phone);
      var a = phone.match(phonereg);
      if (phone.match(b)) {
        $("#phone-error").hide();
        $("#phone-format").show();
        $("#txt-phone-no").focus();
        $("#er-phone").addClass("error");
        phone_status = false;

      }
      else if (phone.match(c)) {
        $("#phone-error").hide();
        $("#phone-format").show();
        $("#txt-phone-no").focus();
        $("#er-phone").addClass("error");
        phone_status = false;

      }
      else if (phone.match(phonereg)) {
        $("#phone-error").hide();
        $("#phone-format").hide();
        $("#txt-phone-no").focus();
        //$("#er-phone").addClass("error");
        phone_status = true;

      }


    } else {

      $("#phone-error").show();
      $("#phone-format").hide();
      $("#txt-phone-no").focus();
      $("#er-phone").addClass("error");
      phone_status = false;


    }

    return phone_status;

  }

  public async UploadAttachment() {
    var fileArr = [];
    var FileNameGenerated: string;
    var CurrentTime;
    let myfile = (
      document.querySelector("#file_upload") as HTMLInputElement
    ).files.length;

    if (myfile != 0) {
      for (var j = 0; j < myfile; j++) {
        let fileVal = (
          document.querySelector("#file_upload") as HTMLInputElement
        ).files[j];
        fileArr.push(fileVal);
      }
      for (var i = 0; i < fileArr.length; i++) {
        CurrentTime = moment().format("DMYYYYHMS"); //1110202191045      
        var tempfilename = fileArr[i].name.split(".");
        FileNameGenerated =
          tempfilename[0] + "-" + CurrentTime + "." + tempfilename[1] + "";
        await NewWeb.getFolderByServerRelativeUrl(
          this.props.context.pageContext.web.serverRelativeUrl +
          "/ContactDirectoryUploads"
        )
          .files.add(FileNameGenerated, fileArr[i], true)
          .then((data) => {
            data.file.getItem().then((item) => {
              AttachmentURL = "" + data.data.ServerRelativeUrl + "";
              this.AddtoListItem(AttachmentURL, FileNameGenerated);
              // this.ImageFileValidation(FileNameGenerated);

            });
          })
          .catch((error) => { });

      }
    }
    //file is not available

    // if (myfile == 0) {
    //   AttachmentURL = `${this.props.siteurl}/SiteAssets/Remo%20Portal%20Assets/img/userphoto.jpg`;
    //   FileNameGenerated = "userphoto.jpg"
    //   this.AddtoListItem(AttachmentURL, FileNameGenerated);
    //   //this.ImageFileValidation(FileNameGenerated);

    // }
    if (myfile == 0) {
      AttachmentURL = "/sites/intranet/SiteAssets/Remo%20Portal%20Assets/img/userphoto.jpg";
      FileNameGenerated = "userphoto.jpg"
      this.AddtoListItem(AttachmentURL, FileNameGenerated);
      //this.ImageFileValidation(FileNameGenerated);

    }


  }
  // public ImageFileValidation(FileNameGenerated){
  //   var imageStatus=true;
  //   var ext = FileNameGenerated.split('.')[1].toLowerCase();
  //        if(ext=="jpg"||ext=="jpeg"||ext=="png"||ext=="jpe"||ext=="jif"||ext=="jfif"||ext=="pjpeg"||ext=="pjp"){
  //        alert("true")
  //        $("#image-format").hide();
  //       imageStatus=true;
  //        }else{
  //          alert("false")
  //          $("#image-format").show();
  //        imageStatus=false;
  //        } 
  //        return imageStatus;
  // }
  public async ImageFileValidation() {
    var imageStatus = true;
    var fileArr = [];
    var FileNameGenerated: string;
    var CurrentTime;
    let myfile = (
      document.querySelector("#file_upload") as HTMLInputElement
    ).files.length;

    if (myfile != 0) {
      for (var j = 0; j < myfile; j++) {
        let fileVal = (
          document.querySelector("#file_upload") as HTMLInputElement
        ).files[j];
        fileArr.push(fileVal);
      }
      for (var i = 0; i < fileArr.length; i++) {
        CurrentTime = moment().format("DMYYYYHMS"); //1110202191045      
        var tempfilename = fileArr[i].name.split(".");
        FileNameGenerated =
          tempfilename[0] + "-" + CurrentTime + "." + tempfilename[1] + "";
        await NewWeb.getFolderByServerRelativeUrl(
          this.props.context.pageContext.web.serverRelativeUrl +
          "/ContactDirectoryUploads"
        )
          .files.add(FileNameGenerated, fileArr[i], true)
          .then((data) => {
            data.file.getItem().then((item) => {
              AttachmentURL = "" + data.data.ServerRelativeUrl + "";

              var ext = FileNameGenerated.split('.')[1].toLowerCase();

              if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "jpe" || ext == "jif" || ext == "jfif" || ext == "pjpeg" || ext == "pjp") {

                $("#er-img").removeClass("error");
                $("#image-format").hide();
                imageStatus = true;
              } else {

                $("#er-img").addClass("error");
                $("#image-format").show();
                imageStatus = false;
              }
              return imageStatus
            });
          })
          .catch((error) => { });

      }

    }
    else {
      imageStatus = true;
    }
    return imageStatus;
  }

  public HasImage() {
    var imgstatus = true;
    var result = $("#er-img").hasClass("error");

    if (result == true) {
      imgstatus = false;
      $("#file_upload").focus();
    }
    else {
      imgstatus = true;
    }
    return imgstatus;
  }

  public saveitem() {
    let myfile = (
      document.querySelector("#file_upload") as HTMLInputElement
    ).files.length;
    if (this.validation_Fname() && this.validation_Lname() && this.validation_empid() && this.validation_phone() && this.HasImage()) {

      this.UploadAttachment();
      // this.HasImage();
      swal({
        title: "Submitted Successfully",
        icon: "success"
      } as any).then(() => {
        location.reload();
      });
    }
  }

  public errorbox_Fname() {
    $("#er-fname").removeClass("error");
    $("#fname-error").hide();
    $("#fname-format").hide();

  }
  public errorbox_Lname() {
    $("#er-lname").removeClass("error");
    $("#lname-error").hide();
    $("#lname-format").hide();

  }
  public errorbox_phone() {
    $("#er-phone").removeClass("error");
    $("#phone-error").hide();
    $("#phone-format").hide();

  }
  public errorbox_employeeID() {
    $("#er-empid").removeClass("error");
    $("#empid-error").hide();
    $("#empid-format").hide();
  }
  public errorbox_img() {
    $("#er-img").removeClass("error");
    $("#image-format").hide();
  }

  public focusin(From) {
    let Fname = $("#txt-emp-fname").val();
    let Lname = $("#txt-emp-lname").val();
    let Email = $("#txt-emailid").val();
    let Empid = $("#txt-empid").val();
    let Phone = $("#txt-phone-no").val();
    let Office = $("#txt-office").val();
    let Dept = $("#txt-dept").val();
    let Job = $("#txt-job-title").val();
    let City = $("#txt-city").val();
    let Country = $("#txt-country").val();
    // let Reporting: any = $.trim(($("#txt-rm") as any).val());


    if (From == "First Name") {
      if (Fname == "") {
        $("#lbl-fname").removeClass("empty");

      }
    }
    else if (From == "Last Name") {
      if (Lname == "") {
        $("#lbl-lname").removeClass("empty");
      }
    }
    else if (From == "EmployeeID") {
      if (Empid == "") {
        $("#lbl-empid").removeClass("empty");
      }
    }
    else if (From == "E-mail id") {
      if (Email == "") {
        $("#lbl-email").removeClass("empty");
      }
    }
    else if (From == "Phone Number") {
      if (Phone == "") {
        $("#lbl-phone").removeClass("empty");
      }
    }
    else if (From == "Office Phone") {
      if (Office == "") {
        $("#lbl-office").removeClass("empty");
      }
    }
    else if (From == "Department") {
      if (Dept == "") {
        $("#lbl-dept").removeClass("empty");
      }
    }
    else if (From == "job-title") {
      if (Job == "") {
        $("#lbl-job-title").removeClass("empty");
      }
    }
    else if (From == "City") {
      if (City == "") {
        $("#lbl-city").removeClass("empty");
      }
    }
    else if (From == "Country") {
      if (Country == "") {
        $("#lbl-country").removeClass("empty");
      }
    }

    // else if (From == "ReportingManager") {
    //   if (Reporting == "") {
    //     $("#lbl-rm").removeClass("empty");
    //   }
    // }

  }

  public focusout(From) {
    let Fname: any = $.trim(($("#txt-emp-fname") as any).val());
    let Lname: any = $.trim(($("#txt-emp-lname") as any).val());
    let Email: any = $.trim(($("#txt-emailid") as any).val());
    let Empid: any = $.trim(($("#txt-empid") as any).val());
    let Phone: any = $.trim(($("#txt-phone-no") as any).val());
    let Office: any = $.trim(($("#txt-office") as any).val());
    let Dept: any = $.trim(($("#txt-dept") as any).val());
    let Job: any = $.trim(($("#txt-job-title") as any).val());
    let City: any = $.trim(($("#txt-city") as any).val());
    let Country: any = $.trim(($("#txt-country") as any).val());
    //let Reporting: any = $.trim(($("#txt-rm") as any).val());

    if (From == "First Name") {
      if (Fname == 0) {
        $("#lbl-fname").addClass("empty");
      }
    }
    else if (From == "Last Name") {
      if (Lname == 0) {
        $("#lbl-lname").addClass("empty");
      }
    }
    else if (From == "Phone Number") {
      if (Phone == 0) {
        $("#lbl-phone").addClass("empty");
      }
    }
    else if (From == "Office Phone") {
      if (Office == 0) {
        $("#lbl-office").addClass("empty");
      }
    }
    else if (From == "E-mail id") {
      if (Email == 0) {
        $("#lbl-email").addClass("empty");
      }
    }
    else if (From == "EmployeeID") {
      if (Empid == 0) {
        $("#lbl-empid").addClass("empty");
      }
    }
    else if (From == "Department") {
      if (Dept == 0) {
        $("#lbl-dept").addClass("empty");
      }
    }
    else if (From == "City") {
      if (City == 0) {
        $("#lbl-city").addClass("empty");
      }
    }
    else if (From == "job-title") {
      if (Job == 0) {

        $("#lbl-job-title").addClass("empty");
      }
    }
    else if (From == "Country") {
      if (Country == 0) {
        $("#lbl-country").addClass("empty");
      }
    }

    // else if (From == "ReportingManager") {
    //   if (Reporting == 0) {
    //     $("#lbl-rm").addClass("empty");
    //   }
    // }


  }

  public key_up(Form) {
    let Fname: any = $.trim(($("#txt-emp-fname") as any).val());
    let Lname: any = $.trim(($("#txt-emp-lname") as any).val());
    let Email: any = $.trim(($("#txt-emailid") as any).val());
    let Empid: any = $.trim(($("#txt-empid") as any).val());
    let Phone: any = $.trim(($("#txt-phone-no") as any).val());
    let Office: any = $.trim(($("#txt-office") as any).val());
    let Dept: any = $.trim(($("#txt-dept") as any).val());
    let Job: any = $.trim(($("#txt-job-title") as any).val());
    let City: any = $.trim(($("#txt-city") as any).val());
    let Country: any = $.trim(($("#txt-country") as any).val());
    // let Reporting: any = $.trim(($("#txt-rm") as any).val());


    if (Form == "First Name") {
      if (Fname != 0) {
        $("#lbl-fname").removeClass("empty");
        $("#er-fname").removeClass("error");
        $("#fname-error").hide();
        $("#fname-format").hide();

      }
    }
    else if (Form == "Last Name") {
      if (Lname != 0) {
        $("#lbl-lname").removeClass("empty");
        $("#er-lname").removeClass("error");
        $("#lname-error").hide();
        $("#lname-format").hide();

      }
    }
    else if (Form == "Email") {
      if (Email != 0) {
        $("#lbl-email").removeClass("empty");
        $("#er-email").removeClass("error");
        $("#email-error").hide();
        $("#email-format").hide();
      }
    }
    else if (Form == "EmployeeID") {
      if (Empid != 0) {
        $("#lbl-empid").removeClass("empty");
        $("#er-empid").removeClass("error");

      }
    }
    else if (Form == "Phone Number") {
      if (Phone != 0) {
        $("#lbl-phone").removeClass("empty");
        $("#er-phone").removeClass("error");
        $("#phone-error").hide();
        $("#phone-format").hide();
      }
    }
    else if (Form == "Office Phone") {
      if (Office != 0) {
        $("#lbl-office").removeClass("empty");
        $("#er-office").removeClass("error");

      }
    }
    else if (Form == "job-title") {
      if (Job != 0) {
        $("#lbl-job-title").removeClass("empty");

      }
    }
    else if (Form == "City") {
      if (City != 0) {
        $("#lbl-city").removeClass("empty");
      }
    }

    else if (Form == "Country") {
      if (Country != 0) {
        $("#lbl-country").removeClass("empty");
      }
    }


    else if (Form == "Department") {
      if (Dept != 0) {
        $("#lbl-dept").removeClass("empty");
      }
    }
    // else if (Form == "ReportingManager") {
    //   if (Reporting != 0) {
    //     $("#lbl-rm").removeClass("empty");
    //   }
    // }
  }

  public async AddtoListItem(AttachmentURL, FileNameGenerated) {
    var picurl = "https://rakgasae.sharepoint.com"+AttachmentURL+"";
    let json = {};
    json = {
      "fileName": "" + FileNameGenerated + "",
      "serverUrl": "https://rakgasae.sharepoint.com",
      "serverRelativeUrl": "" + AttachmentURL + ""
    };



    let jsonstr = JSON.stringify(json);

    await NewWeb.lists.getByTitle("ContactDirectoryMaster").items.add({
      givenName: $("#txt-emp-fname").val(),
      surname: $("#txt-emp-lname").val(),
      mail: $("#txt-emailid").val(),
      employeeId: $("#txt-empid").val(),
      mobilePhone: $("#txt-phone-no").val(),
      businessPhones: $("#txt-office").val(),
      department: $("#txt-dept").val(),
      jobTitle: $("#txt-job-title").val(),
      city: $("#txt-city").val(),
      country: $("#txt-country").val(),
      //ProfileImage: jsonstr
      ProfilePictureURL:picurl

    });
  }


  public render(): React.ReactElement<IAddContactsProps> {
    const mystyle = {
      color: "red",
      display: "none"
    };
    return (
      <div className={styles.addContacts}>
        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Contact Directory </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/Homepage.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                    <li>  <a href="#" data-interception="off"> Add Contact </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec mb-20">
                  <div>
                    <div className="search-filter">
                      <div className="table-search-wrap clearfix">
                        <div className="table-search">
                          <h3 className="contact-pg-title">Add Contacts</h3>
                        </div>
                        <div className="table-sort">
                          <a href={`${this.props.siteurl}/SitePages/ContactDirectory.aspx?env=WebView`} type="button" className="btn btn-primary" data-interception="off">View Contacts</a>
                        </div>
                      </div>
                    </div>
                    <div className="contact-form-info">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="textOnInput required" id="er-fname" onClick={() => this.errorbox_Fname()} >
                            <label htmlFor="inputText" id="lbl-fname" className="floating-label empty">First Name</label>
                            <input className="form-input-1" onMouseLeave={() => this.focusout("First Name")} onMouseEnter={() => this.focusin("First Name")} onKeyUp={() => this.key_up("First Name")} type="text" id="txt-emp-fname" autoComplete='off' />
                            <p id="fname-error" style={mystyle} >First Name should not be empty</p>
                            <p id="fname-format" style={mystyle} >First Name should be in correct format</p>

                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="textOnInput required" id="er-lname" onClick={() => this.errorbox_Lname()} >
                            <label htmlFor="inputText" id="lbl-lname" className="floating-label empty">Last Name</label>
                            <input className="form-input-1" onMouseLeave={() => this.focusout("Last Name")} onMouseEnter={() => this.focusin("Last Name")} onKeyUp={() => this.key_up("Last Name")} type="text" id="txt-emp-lname" autoComplete='off' />
                            <p id="lname-error" style={mystyle} >Last Name should not be empty</p>
                            <p id="lname-format" style={mystyle} >Last Name should be in correct format</p>

                          </div>
                        </div>

                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="textOnInput " id="er-email" >
                            <label htmlFor="inputText" id="lbl-email" className="floating-label empty">E-mail id</label>
                            <input className="form-input-1" onMouseLeave={() => this.focusout("E-mail id")} onMouseEnter={() => this.focusin("E-mail id")} onKeyUp={() => this.key_up("Email")} type="text" id="txt-emailid" autoComplete='off' />

                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="textOnInput required" id="er-empid" onClick={() => this.errorbox_employeeID()} >
                            <label htmlFor="inputText" id="lbl-empid" className="floating-label empty">Employee ID</label>
                            <input className="form-input-1" onMouseLeave={() => this.focusout("EmployeeID")} onMouseEnter={() => this.focusin("EmployeeID")} onKeyUp={() => this.key_up("EmployeeID")} type="text" id="txt-empid" autoComplete='off' />
                            {/* <span id="location-error" style={mystyle} >Location should not be empty</span> */}
                            <p id="empid-error" style={mystyle} >EmployeeID should not be empty</p>
                            {/* <p id="empid-format" style={mystyle} >EmployeeID should  be in correct format</p> */}

                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="textOnInput" id="er-office" >
                            <label htmlFor="inputText" id="lbl-office" className="floating-label empty">Office Phone</label>
                            <input className="form-input-1" onMouseLeave={() => this.focusout("Office Phone")} onMouseEnter={() => this.focusin("Office Phone")} onKeyUp={() => this.key_up("Office Phone")} type="text" id="txt-office" autoComplete='off' />
                            {/* <span id="dept-error" style={mystyle} >Department should not be empty</span> */}

                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="textOnInput required" id="er-phone" onClick={() => this.errorbox_phone()}>
                            <label htmlFor="inputText" id="lbl-phone" className="floating-label empty">Mobile Phone</label>
                            <input className="form-input-1" onMouseLeave={() => this.focusout("Phone Number")} onMouseEnter={() => this.focusin("Phone Number")} onKeyUp={() => this.key_up("Phone Number")} type="text" id="txt-phone-no" autoComplete='off' />
                            <p id="phone-error" style={mystyle} >Phone Number should not be empty</p>
                            <p id="phone-format" style={mystyle} >Phone Number should be in correct format</p>

                          </div>
                        </div>


                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="textOnInput " id="er-job-title" >
                            <label htmlFor="inputText" id="lbl-job-title" className="floating-label empty">Job Title</label>
                            <input className="form-input-1" onMouseLeave={() => this.focusout("job-title")} onMouseEnter={() => this.focusin("job-title")} onKeyUp={() => this.key_up("job-title")} type="text" id="txt-job-title" autoComplete='off' />

                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="textOnInput" id="er-dept" >
                            <label htmlFor="inputText" id="lbl-dept" className="floating-label empty">Department</label>
                            <input className="form-input-1" onMouseLeave={() => this.focusout("Department")} onMouseEnter={() => this.focusin("Department")} onKeyUp={() => this.key_up("Department")} type="text" id="txt-dept" autoComplete='off' />
                            {/* <span id="dept-error" style={mystyle} >Department should not be empty</span> */}

                          </div>
                        </div>



                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="textOnInput " id="er-city" >
                            <label htmlFor="inputText" id="lbl-city" className="floating-label empty">City</label>
                            <input className="form-input-1" onMouseLeave={() => this.focusout("City")} onMouseEnter={() => this.focusin("City")} onKeyUp={() => this.key_up("City")} type="text" id="txt-city" autoComplete='off' />


                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="textOnInput " id="er-country" >
                            <label htmlFor="inputText" id="lbl-country" className="floating-label empty">Country</label>
                            <input className="form-input-1" onMouseLeave={() => this.focusout("Country")} onMouseEnter={() => this.focusin("Country")} onKeyUp={() => this.key_up("Country")} type="text" id="txt-country" autoComplete='off' />

                          </div>
                        </div>
                      </div>

                      <div className="row">
                        {/* <div className="col-md-6">
                        <div className="textOnInput" id="er-rm" >
                          <label htmlFor="inputText" id="lbl-rm" className="floating-label empty">Manager</label>
                          <input className="form-input-1" onMouseLeave={() => this.focusout("ReportingManager")} onMouseEnter={() => this.focusin("ReportingManager")} onKeyUp={() => this.key_up("ReportingManager")} type="text" id="txt-rm" autoComplete='off' />
                           <span id="phone-error" style={mystyle} >Reporting Manager should not be empty</span> 

                        </div>
                      </div> */}
                        <div className="col-md-6 upload_wrap">
                          <div className="upload_img" id="er-img" onChange={() => this.errorbox_img()} >
                            <h5 className="image-heading">Profile Image</h5>
                            <button className="file_upload" type="button">

                              <span className="btn_lbl">Choose File</span>

                              <span className="btn_colorlayer"></span>

                              <input type="file" name="fileupload" id="file_upload" accept="image/*" onChange={() => this.ImageFileValidation()} />

                              {/* <span id="image-error" style={mystyle} >Image should not be empty</span> */}

                            </button>
                            <p id="image-format" style={mystyle} >File Should be in correct Format(jpg,jpeg,png,jpe,jif,jfif,pjpeg,pjp)</p>

                            {/* <div className="file-error" ><span id="image-error" style={mystyle} >Image should not be empty</span>
                          </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="submit-wrap">

                        <a href="#" type="button" onClick={() => this.saveitem()} className="btn btn-primary submit-btn" data-interception="off">Submit</a>

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

