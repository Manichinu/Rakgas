import * as React from 'react';
import styles from './DepartmentGallery.module.scss';
import { IDepartmentGalleryProps } from './IDepartmentGalleryProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";   
 
export interface IDepartmentGalleryState {  
  Items:any[];
  Galleryitems:any[];  
  VideoItemsss:any[]; 
}
var FolderNames = [];
var FolderNamesExits = [];

var FolderNamesVideo = [];
var FolderNamesExitsVideo = [];
const NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet");

export default class DepartmentGallery extends React.Component<IDepartmentGalleryProps,IDepartmentGalleryState, {}> {
  public constructor(props: IDepartmentGalleryProps, state: IDepartmentGalleryState) {
    super(props);
    this.state = {
      Items: [],
      Galleryitems: [],
      VideoItemsss: []
    };
  }

  public componentDidMount(){    

           
    setTimeout(() => {
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $('#spLeftNav').attr('style', 'display: none !important');      
      $("#CommentsWrapper").attr("style", "display: none !important");
    }, 2000);
      
        
    this.GetGalleryFilesFolder(); 
      
  }


  public GetGalleryFilesFolder(){    
    var reactHandler = this;
    $.ajax({
        url: `${reactHandler.props.siteurl}/_api/Web/Lists/getByTitle('Picture Gallery')/items?$expand=Folder,File&$top=1000&$orderby=Created desc&$select=ID,Title,FileRef,FileSystemObjectType,FileLeafRef,Folder/ServerRelativeUrl,Folder/Name`,// URL to fetch data from sharepoint Picture Library                
        method: "GET",  
        headers: {
            "accept": "application/json;odata=verbose",    
            "content-type": "application/json;odata=verbose"    
        },
        success: function(resultData) {                                                         
          if(resultData.d.results.length != 0){
            $("#if-gallery-present").show();
            $("#if-no-gallery-present").hide();
            reactHandler.setState({  
              Galleryitems: resultData.d.results                                    
            });
          }else{
            $("#if-gallery-present").hide();
            $("#if-no-gallery-present").show();
          }    
          //reactHandler.calculateDynamicHeight();              
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });  
         
  }

  // private async GetGalleryFilesFolder() {
  //   var reactHandler = this;

  //   await NewWeb.lists.getByTitle("Picture Gallery").items.expand("Folder", "File").top(1000).orderBy("Created", false)
  //     .select("ID", "Title", "FileRef", "FileSystemObjectType", "FileLeafRef", "Folder/ServerRelativeUrl", "Folder/Name")
  //     .get().then((items) => { // //orderby is false -> decending          

  //       if (items.length != 0) {
  //         $("#if-gallery-present").show();
  //         $("#if-no-gallery-present").hide();
  //         reactHandler.setState({
  //           Galleryitems: items
  //         });
  //       } else {
  //         $("#if-gallery-present").hide();
  //         $("#if-no-gallery-present").show();
  //       }
  //     }).catch((err) => {
  //       console.log(err);
  //     });
  // }
 

  public findValueInArray(value, arr) {
    var result = false;

    for (var i = 0; i < arr.length; i++) {
      var name = arr[i];
      if (name == value) {
        result = true;
        break;
      }
    }
    return result;
  }



  // public findValueInArrayVideos(value,arr){
  //   var result1 = false;
   
  //   for(var j=0; j<arr.length; j++){
  //     var name = arr[j];
  //     if(name == value){
  //       result1 = true;
  //       break;
  //     }
  //   }
  //   return result1;
  // }
  public render(): React.ReactElement<IDepartmentGalleryProps> {
    var reactHandler = this;
    let x: number = 1;
    let y = 1;
    const Images: JSX.Element[] = this.state.Galleryitems.map(function (item, key) {

      if (item.FileSystemObjectType == 1) {

      }
      if (item.FileSystemObjectType != 1) {

        var filename = item.File.Name;
        var completeurl = item.File.ServerRelativeUrl;
        var Len = filename.length;
        var Dot = filename.lastIndexOf(".");
        var type = Len - Dot;
        var res = filename.substring(Dot + 1, Len);
        var ext = res.toLowerCase();
       

        var string = completeurl.split('/');
        var str2 = "Videos";
        if (string.indexOf(str2) != -1) {
          //console.log(str2 + " found");
        } else {
          if (ext != "mp4" && ext != "mov" && ext != "wmv" && ext != "flv" && ext != "mov" && ext != "avi" && ext != "avchd" && ext != "webm" && ext != "mkv") {
            var foldernameval = string[string.length - 2];
            var gFolderUrl = (completeurl).replace(filename, '');
            FolderNames.push(foldernameval);
            if (reactHandler.findValueInArray(foldernameval, FolderNamesExits)) {

            }
            else {
              if (reactHandler.findValueInArray(foldernameval, FolderNames)) {
                FolderNamesExits.push(foldernameval);
                if (x <= 4) {
                  x = x + 1;
                  return (
                    <li>
                      <a className="relative image-hover-gal" href={reactHandler.props.siteurl + "/SitePages/Gallery-Grid-View.aspx?env=WebView&FolderName='" + gFolderUrl + "'&Type=Img"} data-interception="off"> <img src={`${item.File.ServerRelativeUrl}`} alt={item.File.Name} />
                        <p>{foldernameval} </p>
                      </a>
                    </li>
                  );
                }

              }
            }
          }
        }
      }
    });
    return (
          <div className={ styles.departmentGallery } id="dept-gallery-home">
           <div className="images-social dept-sub">
          <div className="row">
            <div className="col-md-6" id="if-gallery-present">
              <div className="sec event-cal image-videos">
                <div className="heading clearfix">
                  <h3> <a href={`${this.props.siteurl}/SitePages/Gallery-ViewMore.aspx?env=WebView`} data-interception="off"> Gallery </a> </h3>
                  {/*<h3 className=""><a href="#" onClick={()=> this.ShowVideos()}>Videos</a> </h3>*/}
                </div>

                <div className="section-part clearfix latest-events-bck">
                  <ul className="clearfix img-block-area">
                    {Images}
                  </ul>

                  {/*<ul className="clearfix vdo-block-area" style={{display:"none"}}>
                  </ul>*/}
                </div>
              </div>
            </div>

            <div className="col-md-6" id="if-no-gallery-present" style={{ display: "none" }}>
              <div className="sec event-cal image-videos">
                <div className="heading clearfix">
                  <h3 className="images active">
                    <a href="#" data-interception="off"> Gallery </a> </h3>
                </div>
                <div className="section-part clearfix latest-events-bck">
                  <div className="clearfix img-block-area">
                    <img className="err-img" src="https://rakgasae.sharepoint.com/sites/Intranet/SiteAssets/Remo%20Portal%20Assets/img/Error%20Handling%20Images/ContentEmpty.png" alt="no-image-uploaded" />
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