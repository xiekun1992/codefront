import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';


@Component({
	template: `
		<ion-list class="popover-page" radio-group>
			<button ion-item (click)="close()">
				Close
			</button>
			<button ion-item (click)="closeOthers()">
				Close others
			</button>
			<button ion-item (click)="closeAll()">
				Close all
			</button>
		</ion-list>
	`
})
export class CodePopoverPage {
	constructor(private navParams: NavParams,
				private viewCtrl: ViewController){

	}
	close(){
		this.viewCtrl.dismiss();
		this.navParams.data.close();
	}
	closeOthers(){
		this.viewCtrl.dismiss();
		this.navParams.data.closeOthers();
	}
	closeAll(){
		this.viewCtrl.dismiss();
		this.navParams.data.closeAll();
	}
}
