import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewController, NavParams, Searchbar } from 'ionic-angular'; 
import { File } from 'ionic-native';
import { DeliverService } from '../../app/services/deliver.service';

@Component({
	templateUrl:'search.html'
})
export class SearchPage {
	@ViewChild('searchbarInput') _searchbarInput: Searchbar;

	items: Array<any> = [];
	results: Array<any> = [];
	appDir: string;

	constructor(public viewCtrl: ViewController, 
				public navParams: NavParams,
				public deliverService: DeliverService
	) {
		this.appDir = navParams.get('appDir');
		this.recursiveSearch(this.appDir, 'projects');
	}
	ngAfterViewInit() {
		this._searchbarInput.setFocus();
	}
	dismiss() {
		this.viewCtrl.dismiss();
	}
	recursiveSearch(basePath, directory) {
		console.log(basePath, directory);
		File.listDir(basePath, directory)
		.then((entries)=>{
			console.log(entries);
			entries.forEach((entry)=>{
				if(entry.isDirectory){
					let entryArray = entry.nativeURL.split('/');
					let directoryName = entryArray.pop();
					if(!directoryName){
						directoryName = entryArray.pop();
					}
					this.recursiveSearch(entryArray.join('/'), directoryName);
				}else{
					this.items.push(entry);
					this.results.push(entry);
				}
			});
		})
		.catch((err)=>{
			alert(JSON.stringify(err));
		});
	}
	getItems(ev) {
		this.results = [].slice.call(this.items);
		// set val to the value of the ev target
		var val = ev.target.value;

		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
		  this.results = this.items.filter((item) => {
		    return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
		  })
		}
	}
	open(isDirectory,path,name):void {
		let pathTmp=path.split('/');
		let last=pathTmp.pop();// 去除末尾的空格
		if(last!==''){
			pathTmp.push(last);
		}
		if(pathTmp.pop()===name){
			path=pathTmp.join('/');
		}
		this.deliverService.set({path, name});
		this.dismiss();
	}
}