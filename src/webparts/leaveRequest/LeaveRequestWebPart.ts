import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import LeaveRequest from './components/LeaveRequest';
import { ILeaveRequestProps } from './components/ILeaveRequestProps';
import { LeaveRequestService } from './services/LeaveRequestService';

export interface ILeaveRequestWebPartProps {
  listTitle: string;
}

export default class LeaveRequestWebPart extends BaseClientSideWebPart<ILeaveRequestWebPartProps> {
  public render(): void {
    const service = new LeaveRequestService(
      this.context,
      this.properties.listTitle || 'Leave Requests'
    );

    const element: React.ReactElement<ILeaveRequestProps> = React.createElement(
      LeaveRequest,
      {
        service
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
            description: 'Leave request list settings'
          },
          groups: [
            {
              groupName: 'Data source',
              groupFields: [
                PropertyPaneTextField('listTitle', {
                  label: 'SharePoint list title'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
