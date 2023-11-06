import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'QuickLinkManagerWebPartStrings';
import QuickLinkManager from './components/QuickLinkManager';
import { IQuickLinkManagerProps } from './components/IQuickLinkManagerProps';

export interface IQuickLinkManagerWebPartProps {
  description: string;
}

export default class QuickLinkManagerWebPart extends BaseClientSideWebPart<IQuickLinkManagerWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IQuickLinkManagerProps> = React.createElement(
      QuickLinkManager,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        userid: this.context.pageContext.legacyPageContext["userId"],
        spHttpClient: this.context.spHttpClient, 
        context: this.context,
      
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
