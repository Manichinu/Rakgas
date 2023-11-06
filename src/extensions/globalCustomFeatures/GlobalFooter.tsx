import * as React from 'react';
import styles from './loc/Global.module.scss';
import { Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

import { truncate } from '@microsoft/sp-lodash-subset';

export interface IGlobalFooterProps {
    siteurl: string;
    context: any;
    currentWebUrl: string;
    CurrentPageserverRequestPath: string;
}
export interface IGlobalFooter {
    Footeritems: any[];
}


const NewWeb = Web("https://rakgasae.sharepoint.com/sites/Intranet/");
export default class GlobalSideNav extends React.Component<IGlobalFooterProps, IGlobalFooter, {}>
{
    public constructor(props: IGlobalFooterProps, state: {}) {
        super(props);
        this.state = {
            Footeritems: []
        };
    }


    public componentDidMount() {
        this.GetFooterLinks();
    }

    private GetFooterLinks() {
        var reactHandler = this;
        return NewWeb.lists.getByTitle("FooterMaster").items.filter(`IsActive eq 1`).orderBy("Order0", true).get().then((response) => {
    
            
            this.setState({
                Footeritems: response
            });
        });
     
    }


    public render(): React.ReactElement<IGlobalFooterProps> {
        var handler = this;
        const FooterPanel: JSX.Element[] = handler.state.Footeritems.map(function (item, key) {
     
            return (
                <li> <a href={`${item.URL.Url}`} target="_blank"> {item.Title} </a></li>
            );
        });

        return (
            <div className="footer-top-wrap">
                <footer>
                    <div id="master_footer_parent">

                        <div id="master_footer_child">
                          

                            <div className="footer footer-webpart" >

                                <ul className="clearfix" id="footer-block-area-content">
                                        {FooterPanel}
                                </ul>

                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }


}