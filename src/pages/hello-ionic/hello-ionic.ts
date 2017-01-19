import { Component, ViewChild } from '@angular/core';

import { 
	Platform, 
	NavController, 
	NavParams, 
	LoadingController, 
	Slides, 
	ViewController,
	ModalController, 
	PopoverController
} from 'ionic-angular';
import { File, Httpd, HttpdOptions, Toast, NativeStorage, Keyboard } from 'ionic-native';
import { Subscription } from 'rxjs/Subscription';

import { PreviewPage } from '../preview/preview';
import { SearchPage } from '../search/search';
import { CodePopoverPage } from './code-popover';
import { OptionPopoverPage } from './option-popover';

import { DeliverService } from '../../app/services/deliver.service';
import { SettingService } from '../../app/services/setting.service';


declare var CodeMirror: any;
declare var cordova: any;
declare var $: any;


@Component({
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
	@ViewChild('slide') slide: Slides;

	code:any;
	ref:any;
	httpURL:any;
	appDir: any;
	loading: any;
	server: any;
	settings: any = {
		theme: 'pastel-on-dark',
		language: 'en'
	};
	settingSubscription: Subscription;

	slideId:number;
	path:string ='';
	name:string ='';

	selectedFilename: string;
	selects: Array<any> = [];
	segment: any;
	codePopover: any;
	codePopoverElement: any;

	canExit: boolean = false;

	deviceWidth: any;

	showSymbols: boolean = false;
	isKeyboardShow: boolean = false;

	symbols: any = ['<','>','/','(',')','{','}','[',']',"'",'"',';',',','.','`','~','!','@','#','$','%','^','&','*','-','_','+','=','|','\\',':','?'];


	constructor(public platform: Platform,
				public navCtrl: NavController,
				public navParams: NavParams,
				public loadingCtrl: LoadingController,
				public viewCtrl: ViewController,
				public modalCtrl: ModalController,
				public popoverCtrl: PopoverController,

				public deliverService: DeliverService,
				public settingService: SettingService
	){
		this.settingSubscription=settingService.settingChanged$.subscribe(setting=>{
			Object.assign(this.settings, setting);
			console.log(this.settings);
			for(let s of this.selects){
				if(s.codeElement){
					let value = s.codeElement.getValue();
					s.codeElement.setValue("");
					s.codeElement.setOption("theme", this.settings.theme);
					s.codeElement.setValue(value);
					s.codeElement.setOption("lineNumbers", true);
				}
			}
		});
		this.selects=[];
		this.selects.push({id:this.selects.length, path:'', name:``, uri: ``});
		this.selectedFilename=this.selects[0].uri;

		// 手机返回键
		platform.registerBackButtonAction((e)=>{
			console.log(this.isKeyboardShow);
			if(navCtrl.canGoBack()){
				navCtrl.pop();
			}else if(this.isKeyboardShow){
				// 键盘隐藏在返回键回调函数之前执行
				Keyboard.close();
				this.isKeyboardShow=false;
			}else if(this.canExit){
				platform.exitApp();
			}else if(navCtrl.last()===viewCtrl){
				this.canExit = true;
				setTimeout(()=>{
					this.canExit=false;
				},2000);
				Toast.showShortBottom('press again to exit')
				.subscribe(toast=>{console.log('succes')});
				return false;
			}

		}, 101);
	}
	ngAfterViewInit() {
		this.segment = document.querySelector('.file-title ion-segment');
		document.querySelector(".file-title").addEventListener('touchstart',function(e){e.stopPropagation();});
		document.querySelector(".symbol-input").addEventListener("touchstart",function(e){e.stopPropagation();});
		this.platform.ready()
		.then(()=>{
			// 键盘显示的时候
			Keyboard.onKeyboardShow().subscribe((data)=>{
				this.isKeyboardShow=true;
				this.showSymbols=true;
			});
			Keyboard.onKeyboardHide().subscribe((data)=>{
				this.showSymbols=false;
				console.log(this.showSymbols)
			});

			this.deviceWidth=this.platform.width();
			this.appDir=cordova.file.externalRootDirectory;
			this.deliverService.regist(this.setSelectedFiles());
			this.initSettings();
		})
		
		let segBtn = Array.from(document.querySelectorAll('.file-title ion-segment ion-segment-button'));
		segBtn.forEach(function(o){
			o.ontouchstart=null;
		});
	}
	ngOnDestroy() {
		if(this.server){
			this.server.unsubscribe();
		}
	}
	setSelectedFiles():void {
		return function(file){
			// this.initSettings();
			// console.log(file, this.selects);
			if(this.selects[0].uri===''){
				this.selects.shift();
			}
			file['id']=this.selects.length;
			file['uri']=`${file.path}/${file.name}`;
			// 重复打开则选中
			let tmpSelect = this.selects.filter(function(o){
				return o.uri==file.uri;
			})[0];
			if(tmpSelect){
				this.selectFilename(tmpSelect);
				return ;
			}
			this.selects.push(file);
			this.selectedFilename=file.uri;

			let suffix = [], mode;
      		suffix = file.name.split('.');
			switch(suffix[1]){
				case 'html': mode = 'text/html';break;
				case 'js': mode = 'javascript';break;
				case 'css': mode = 'css';break;
				default: mode = 'text/html';
			}

			setTimeout(()=>{
				let segmentBtns = Array.from(document.querySelectorAll(".file-title ion-segment-button")),
					segmentWidthSum = 0;
				segmentBtns.forEach(function(o){
					segmentWidthSum += o.clientWidth;
				});
				this.segment.style.width = segmentWidthSum + 'px';
				let codeElement=document.querySelector(`#code${file.id}`);
				console.log(codeElement, mode);
				this.code=CodeMirror(codeElement,{
				  	value: `enter your code here.`,
				  	mode: mode,
				  	lineNumbers: true,
				  	// styleActiveLine: true,
	    			matchBrackets: true,
	    			extraKeys: {"Space": "autocomplete"},
	    			theme: this.settings.theme
				});
				file.codeElement=this.code;
				//电脑键盘正常，但手机键盘不行
				file.codeElement.on('keypress', function() {  
	                file.codeElement.showHint(); //满足自动触发自动联想功能  
	            });  
				this.selectFilename(file);
				this.code.setSize('100%', window.screen.availHeight);
				// 防止事件冒泡导致slide滑动
		      	codeElement.addEventListener('touchstart',function(e){
		      		e.stopPropagation();
		      		return false;
		      	});
		      	if(file.path && file.name){
				 	File.readAsText(file.path,file.name)
				  	.then(content=>{
				  		this.code.setValue(content);
				  	})
				  	.catch(err=>{
				  		alert(JSON.stringify(err));
				  	})
				}
			},500);
		}.bind(this);
	}
	debug(event):void {
		console.log(this.path,this.name);
		if(!this.path)
			return ;
		let options: HttpdOptions = {
		     www_root: this.appDir.match(/^file:\/\/([\s\S]+)$/).pop() + `coding`, // relative path to app's www directory
		     port: 3000,
		     localhost_only: false
		 };
		if(this.server){
			this.server.unsubscribe();
		}
		this.server = Httpd.startServer(options).subscribe((data) => {
			this.httpURL=data;
			this.save().then(()=>{
				this.navCtrl.push(PreviewPage, {
					serverPath: this.httpURL,
					entryPath: `${this.path.slice(this.path.indexOf('/projects'))}/${this.name}`
				});
			})
		});
	}
	save() {
		let loading=this.loadingCtrl.create({
			content: 'Saving file...'
		});
		loading.present();
		return File.writeFile(this.path,this.name,this.code.getValue(),true)
			.then(fileEntry=>{
				loading.dismiss();
			})
			.catch(err=>{
				loading.dismiss();
				alert(JSON.stringify(err));
			});
	}
	search() {
		this.modalCtrl.create(SearchPage, {
			appDir: `${this.appDir}coding`
		}).present();
	}
	selectFilename(selected,ev) {
		if(selected.id==this.slideId && ev){
			console.log(selected);
			if(selected.uri=='')
				return;
			this.codePopover=this.popoverCtrl.create(CodePopoverPage, {
				close: this.close.bind(this, selected, ev),
				closeOthers: this.closeOthers.bind(this, selected),
				closeAll: this.closeAll.bind(this)
			},{
				cssClass: 'code-popover'
			});
			this.codePopover.present({ev:ev});
			let t=setTimeout(()=>{
				this.codePopoverElement=document.querySelector(".code-popover .popover-content");
				this.codePopoverElement.style.left=`${Math.abs(ev._elementRef.nativeElement.offsetLeft-ev._elementRef.nativeElement.offsetParent.scrollLeft)}px`;
				clearTimeout(t);
			},0);
		}else{
			this.slideId = selected.id;
			this.slide.slideTo(selected.id);
			this.path = selected.path;
			this.name = selected.name;
			this.selectedFilename=selected.uri;
			this.code = selected.codeElement;
		}
	}
	close(selected, event){
		if(this.selects.length==1){
			this.closeAll();
		}else{
			for(var i = 0; i < this.selects.length; i++){
				if(this.selects[i].id==selected.id){
					let segmentWidth=parseInt(this.segment.style.width);
					let segmentLeftWidth=segmentWidth-event._elementRef.nativeElement.clientWidth;
					if(segmentLeftWidth<=this.deviceWidth){
						this.segment.style.width = 'auto';
					}else{
						this.segment.style.width=`${segmentLeftWidth}px`;
					}
					this.selects.splice(i,1);
					// 从删除点开始依次往前移一位
					for(var j = i; j < this.selects.length; j++){
						this.selects[j].id--;
					}
					if(this.selects[i]){
						// this.slide.slideTo(this.selects[i].id);
						// this.selectedFilename=this.selects[i].uri;
						this.selectFilename(this.selects[i], null);
					}else if(this.selects[i-1]){
						this.selectFilename(this.selects[i-1], null);
						// this.slide.slideTo(this.selects[i-1].id);
						// this.selectedFilename=this.selects[i-1].uri;
					}
				}
			}
		}
	}
	closeOthers(selected){
		this.selects=[];
		selected.id=0;
		this.selects.push(selected);
		this.selectedFilename=selected.uri;
		this.slide.slideTo(0);
		this.segment.style.width = 'auto';
	}
	closeAll(){
		this.selects=[{id:0, path:'', name:``, uri: ``}];
		this.selectedFilename='';
		this.slide.slideTo(0);
		this.segment.style.width = 'auto';
	}
	initSettings() {
		// 编辑器相关的设置
		NativeStorage.getItem('codefront_theme')
		.then(data=>{
			this.settings.theme = data.name;
		})
		.catch(error=>{
			// alert(JSON.stringify(error));
			NativeStorage.setItem('codefront_theme', {name: this.settings.theme})
			.then(()=>{})
			.catch(error=>{
				alert('Fail to initialize editor default settings');
			});
		});
	}
	showOption(ev) {
		this.popoverCtrl.create(OptionPopoverPage, {
			save: this.save.bind(this)
		}).present({ev: ev});
	}
	insertSymbol(symbol) {
		// alert(symbol);
		let pos=this.code.getCursor();
		console.log(pos);
		this.code.replaceRange(symbol, pos);
		this.code.focus();
		pos.ch++;
		this.code.setCursor(pos);
	}
}