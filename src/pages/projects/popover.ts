import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';


@Component({
	template: `
		<ion-list class="popover-page" radio-group>
			<button ion-item (click)="newFolder()">
				New folder
			</button>
			<button ion-item (click)="newFile()">
				New file
			</button>
		</ion-list>
	`
})
export class PopoverPage {
	constructor(private navParams: NavParams){

	}
	newFile(){
		this.navParams.data.newFile();
	}
	newFolder(){
		this.navParams.data.newFolder();
	}
}
