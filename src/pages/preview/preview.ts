import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController, NavParams } from 'ionic-angular';


@Component({
	templateUrl: 'preview.html'
})
export class PreviewPage {
	serverPath: any;

	constructor(
			public navCtrl: NavController,
			public navParams: NavParams,
			public sanitizer: DomSanitizer
		) {
		this.serverPath = sanitizer.bypassSecurityTrustResourceUrl(navParams.get('serverPath') + navParams.get('entryPath')+ `?nocache=${Date.now()}`);
	}
}