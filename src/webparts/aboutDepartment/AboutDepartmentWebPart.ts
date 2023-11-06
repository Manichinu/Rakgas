import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AboutDepartmentWebPartStrings';
import AboutDepartment from './components/AboutDepartment';
import { IAboutDepartmentProps } from './components/IAboutDepartmentProps';

export interface IAboutDepartmentWebPartProps {
  description: string;
}

export default class AboutDepartmentWebPart extends BaseClientSideWebPart<IAboutDepartmentWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAboutDepartmentProps> = React.createElement(
      AboutDepartment,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        PageName: this.context.pageContext.web.title,
        context: this.context

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
