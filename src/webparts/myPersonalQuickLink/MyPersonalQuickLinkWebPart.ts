import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'MyPersonalQuickLinkWebPartStrings';
import MyPersonalQuickLink from './components/MyPersonalQuickLink';
import { IMyPersonalQuickLinkProps } from './components/IMyPersonalQuickLinkProps';

export interface IMyPersonalQuickLinkWebPartProps {
  description: string;
}

export default class MyPersonalQuickLinkWebPart extends BaseClientSideWebPart<IMyPersonalQuickLinkWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMyPersonalQuickLinkProps> = React.createElement(
      MyPersonalQuickLink,
      {
        description: this.properties.description,
        siteurl:this.context.pageContext.web.absoluteUrl,
        context: this.context,
        userid: this.context.pageContext.legacyPageContext["userId"]
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
