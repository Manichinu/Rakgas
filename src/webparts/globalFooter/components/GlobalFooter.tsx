import * as React from 'react';
import styles from './GlobalFooter.module.scss';
import { IGlobalFooterProps } from './IGlobalFooterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import GlobalSideNav from "../../../extensions/globalCustomFeatures/GlobalFooter";
export default class GlobalFooter extends React.Component<IGlobalFooterProps, {}> {
  public render(): React.ReactElement<IGlobalFooterProps> {
    return (
      <div className={ styles.globalFooter }>
       <div id="Global-Bottom-Footer-Navigation">
          <GlobalSideNav siteurl={''} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
      </div>
    );
  }
}
