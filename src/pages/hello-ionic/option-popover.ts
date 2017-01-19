import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';


@Component({
	template: `
		<ion-list class="popover-page" radio-group>
			<button ion-item (click)="save()">
				Save
			</button>
		</ion-list>
	`
})
export class OptionPopoverPage {
	constructor(private navParams: NavParams,
				private viewCtrl: ViewController) {

	}
	save() {
		this.viewCtrl.dismiss();
		this.navParams.data.save();
	}
}