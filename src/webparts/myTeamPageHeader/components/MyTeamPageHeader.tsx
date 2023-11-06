import * as React from 'react';
import styles from './MyTeamPageHeader.module.scss';
import { IMyTeamPageHeaderProps } from './IMyTeamPageHeaderProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class MyTeamPageHeader extends React.Component<IMyTeamPageHeaderProps, {}> {
  public render(): React.ReactElement<IMyTeamPageHeaderProps> {
    return (
      <div className={ styles.myTeamPageHeader }>
       <section>
          <div className="relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">  
                  <div className="inner-banner-overlay"></div>
                  <div className="inner-banner-contents">
                    <h1> My Team </h1>
                    <ul className="breadcums">
                      <li>  <a href={`${this.props.siteurl}/SitePages/Homepage.aspx?env=WebView`} data-interception="off"> Home </a> </li>
                      <li>  <a href="#" style={{pointerEvents:"none"}} data-interception="off"> My Teams </a> </li>
                    </ul>
                  </div>  
                </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
