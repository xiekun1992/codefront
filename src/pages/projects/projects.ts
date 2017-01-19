import { Component, ViewChild } from '@angular/core';
import { 
	Platform, 
	AlertController, 
	ViewController, 
	NavController, 
	PopoverController, 
	NavParams,
	Nav,
	Tabs
} from 'ionic-angular';
import { File, Splashscreen } from 'ionic-native';
import { PopoverPage } from './popover';
// import { HelloIonicPage } from '../hello-ionic/hello-ionic';

import { SortService } from '../../app/services/sort.service';
import { DeliverService } from '../../app/services/deliver.service';

declare var cordova: any;

@Component({
	template:`
		<ion-tabs #tabs>
			<ion-tab color="primary" tabTitle="local" [root]="projectsPage"></ion-tab>
			<ion-tab color="primary" tabTitle="github" [root]="projectsPage"></ion-tab>
		</ion-tabs>
	`
})
export class ProjectsTabsPage {
	@ViewChild('tabs') tabs: Tabs;
	projectsPage: any = ProjectsPage;
	tabEle: any;

	ionViewDidEnter() {
		this.tabs.select(0);
	}
	ngAfterViewInit() {
		this.tabEle=document.querySelectorAll("ion-tabs>ion-tab");
		setTimeout(function(){
			this.tabEle[0].click();
		},0);
		document.querySelector("ion-menu ion-nav").addEventListener('touchstart',function(e){e.stopPropagation();});
	}
}

@Component({
	templateUrl:'projects.html'
})
export class ProjectsPage{
	@ViewChild('content') nav: Nav;

	appRoot: string;
	appDir: string;
	entries: any = [];
	currentPath: string;
	previousPath: string ='';
	rootDir: string ='';
	workDir: string ='';
	popover: any;

	constructor(
		platform: Platform,
		public alertCtrl: AlertController,
		public viewCtrl: ViewController,
		public navCtrl: NavController,
		public popoverCtrl: PopoverController,
		public navParams: NavParams,

		public sortService: SortService,
		public deliverService: DeliverService
	){
		// 检查应用程序目录
		platform.ready()
		.then(()=>{
			let t = setTimeout(function(){
				Splashscreen.hide();
				clearTimeout(t);
			},2000);
			this.appRoot=`${cordova.file.applicationDirectory}www`;
			this.appDir=cordova.file.externalRootDirectory;
			this.rootDir=this.appDir+'coding';
			this.workDir=this.rootDir+'/projects';
			return File.checkDir(this.appDir, 'coding')
			.catch(()=>{
				// 检查coding目录不存在
				return File.createDir(this.appDir,'coding',true);
			})
			.then(()=>{
				return File.checkDir(`${this.appDir}coding`,'projects')
				.catch(()=>{
					// 检查coding/projects目录不存在
					return File.createDir(`${this.appDir}coding`,'projects',true);
				});
			})
			.then(()=>{
				return File.checkDir(`${this.appDir}coding}`,'libs')
				.catch(()=>{
					// 检查coding/libs目录不存在
					return File.createDir(`${this.appDir}coding`,'libs',true);
				});
			})
		})
		.then(()=>{
			this.open(true,this.rootDir,'projects');
			File.copyFile(`${this.appRoot}/libs/eruda/`,'eruda.min.js',`${this.rootDir}/libs`,'')
			.then(entry=>{})
			.catch(err=>{
				alert(JSON.stringify(err));
			})
		});

		
	}
	ngAfterViewInit() {
		document.querySelector("ion-menu ion-nav").addEventListener('touchstart',function(e){e.stopPropagation();});
	}
	backward():void {
		let pathArr=this.previousPath.split('/');
		let folder=pathArr.pop();
		this.open(true,pathArr.join('/'),folder);
	}
	refreshDir(){
		this.open(true,this.currentPath,this.currentPath.split('/').pop());
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
		if(isDirectory){
			File.listDir(path,name)
			.then((entries)=>{
				this.entries=this.sortService.byType(entries);
				this.currentPath=`${path}/${name}`;
				// 去除末尾的'/'
				if(path.charAt(path.length-1)==='/'){
					this.previousPath=path.substr(0,path.length-1);
				}else{
					this.previousPath=path;
				}
			})
			.catch(err=>{
				alert(JSON.stringify(err));
			})
		}else{
			this.deliverService.set({path, name});
		}
	}
	createDir(data):void {
		// alert(data.title);
		if(data.type==='folder'){
			File.createDir(this.currentPath,data.title,true)
			.then(()=>{
				// 刷新目录
				this.refreshDir();
			})
			.catch(err=>{
				alert(err);
			})
		}else{
			File.createFile(this.currentPath,data.title,true)
			.then(()=>{
				// 刷新目录
				this.refreshDir();
			})
			.catch(err=>{
				alert(err);
			})
		}
	}
	removeDir(isDirectory, url):void {
		let urlArr=url.split('/');
		if(isDirectory){
			urlArr.pop();
			let name=urlArr.pop();
			File.removeRecursively(urlArr.join('/'),name)
			.then(()=>{
				// 刷新目录
				this.refreshDir();
			})
			.catch((err)=>{
				this.alertCtrl.create({
					title: 'delete folder',
					message: `delete folder ${name} fail, ${JSON.stringify(err)}`,
					buttons:['Ok']
				}).present();
			})
		}else{
			let name=urlArr.pop();
			File.removeFile(urlArr.join('/'),name)
			.then(()=>{
				// 刷新目录
				this.refreshDir();
			})
			.catch((err)=>{
				this.alertCtrl.create({
					title: 'delete file',
					message: `delete file ${name} fail, ${JSON.stringify(err)}`,
					buttons:['Ok']
				}).present();
			})

		}
	}
	moveDir(isDirectory, url, originName, destName):void {
		// 名字相同不修改
		if(originName === destName){
			return ;
		}
		let urlArr=url.split('/');
		urlArr.pop();
		if(isDirectory){
			urlArr.pop();
			File.moveDir(urlArr.join('/'), originName, urlArr.join('/'), destName)
			.then(()=>{
				this.refreshDir();
			})
			.catch(err=>{
				alert(JSON.stringify(err));
			});
		}else{
			File.moveFile(urlArr.join('/'), originName, urlArr.join('/'), destName)
			.then(()=>{
				this.refreshDir();
			})
			.catch(err=>{
				alert(JSON.stringify(err));
			});
		}
	}
	showRemove(isDirectory, name, url):void {
		this.alertCtrl.create({
			title: `delete ${isDirectory?'folder':'file'}`,
			message: `confirm to delete ${name}?`,
			buttons: [
				{
					text: 'Cancel',
					handler: ()=>{

					}
				},
				{
					text: 'Confirm',
					handler: ()=>{
						this.removeDir(isDirectory, url);
					}
				}
			]
		}).present();
	}
	showEdit(isDirectory, name, url):void {
		this.alertCtrl.create({
			title: `rename ${isDirectory?'folder':'file'}`,
			message: 'change the name',
			inputs: [
				{
					name: 'title',
					placeholder: 'Title',
					type:'text',
					value: name
				}
			],
			buttons: [
				{
					text: 'Cancel',
					handler: ()=>{}
				},
				{
					text: 'Confirm',
					handler: (data)=>{
						this.moveDir(isDirectory,url,name,data.title);
					}
				}
			]
		}).present();
	}
	showCreate(type):void {
		this.alertCtrl.create({
	      title: `New ${type==2?'folder':'file'}`,
	      message: "",
	      inputs: [
	        {
	          name: 'title',
	          placeholder: 'Title',
	          type:'text'
	        }
	      ],
	      buttons: [
	        {
	          text: 'Cancel',
	          handler: data => {}
	        },
	        {
	          text: 'Save',
	          handler: data => {
	          	if(type==2){
	          		data.type='folder';
	          	}else{
	          		data.type='file';
	          	}
	            this.createDir(data);
	          }
	        }
	      ]
	    }).present();
		this.popover.dismiss();
	}
	showPopover(ev):void {
		this.popover = this.popoverCtrl.create(PopoverPage,{
			newFolder:this.showCreate.bind(this,2),
			newFile:this.showCreate.bind(this,1)
		});
		this.popover.present({ev:ev});
	}
	editProject(name, url):void {
		alert(name+ ' ' +url );
	}
}