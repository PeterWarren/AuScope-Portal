import { Component, OnInit} from '@angular/core';
import { LayerHandlerService } from '../portal-core-ui/service/cswrecords/layer-handler.service';
import * as $ from 'jquery'
import '../../template/js/apps.js'
import { NgbdModalStatusReportComponent } from '../modalwindow/renderstatus/renderstatus.component';
import { UILayerModel } from './model/ui/uilayer.model';
import { UITabPanel } from './model/ui/uitabpanel.model';
import { RenderStatusService } from '../portal-core-ui/service/openlayermap/renderstatus/render-status.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';


declare var App: any;

@Component({
    selector: '[appLayerPanel]',
    templateUrl: './layerpanel.component.html'
})


export class LayerPanelComponent implements OnInit {

    layerGroups: {};
    uiLayerModels: {};
    bsModalRef: BsModalRef;

    constructor(private layerHandlerService: LayerHandlerService, private renderStatusService: RenderStatusService, private modalService: BsModalService) {
      this.uiLayerModels = {};

    }




    public selectTabPanel(layerId, panelType) {
      (<UILayerModel>this.uiLayerModels[layerId]).tabpanel.setPanelOpen(panelType);
     }

     ngOnInit(): void {
      this.layerHandlerService.getLayerRecord().subscribe(
        response => {this.layerGroups = response;
          for (const key in this.layerGroups) {
             for (let i = 0; i < this.layerGroups[key].length; i++) {
               const uiLayerModel = new UILayerModel(this.layerGroups[key][i].id, this.renderStatusService.getStatusBSubject(this.layerGroups[key][i]));
               this.uiLayerModels[this.layerGroups[key][i].id] = uiLayerModel;
             }
          }
          $(document).ready(function() {
            App.init();
          });
        });
     }

    public openStatusReport(uiLayerModel: UILayerModel) {
      this.bsModalRef = this.modalService.show(NgbdModalStatusReportComponent, {class: 'modal-lg'});
      uiLayerModel.statusMap.getStatusBSubject().subscribe((value) => {
        this.bsModalRef.content.resourceMap = value.resourceMap;
      });
    }




}