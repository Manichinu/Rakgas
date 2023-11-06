import * as React from 'react';
import styles from './GlobalHeader.module.scss';
import { IGlobalHeaderProps } from './IGlobalHeaderProps';
import { escape } from '@microsoft/sp-lodash-subset';
import GlobalSideNav from "../../../extensions/globalCustomFeatures/GlobalSideNav";

export default class GlobalHeader extends React.Component<IGlobalHeaderProps, {}> {
  public render(): React.ReactElement<IGlobalHeaderProps> {
    return (
      <div className={ styles.globalHeader }>
         <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={''} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
      </div>
    );
  }
}
