import { Component } from '@angular/core';
import { NativeStorage } from 'ionic-native';
import { SettingService } from '../../app/services/setting.service';


@Component({
	templateUrl:'settings.html'
})
export class SettingsPage{
	brightness: number;
	theme: string;
	themes: Array<any> = [];
	language: any = '0';
	constructor(public settingService: SettingService){
		NativeStorage.getItem('codefront_theme')
		.then(data=>{
			this.theme=data.name;
		});

		this.brightness=50;
		this.themes=[
		    'default',
		    '3024-day',
		    '3024-night',
		    'abcdef',
		    'ambiance',
		    'base16-dark',
		    'base16-light',
		    'bespin',
		    'blackboard',
		    'cobalt',
		    'colorforth',
		    'dracula',
		    'duotone-dark',
		    'duotone-light',
		    'eclipse',
		    'elegant',
		    'erlang-dark',
		    'hopscotch',
		    'icecoder',
		    'isotope',
		    'lesser-dark',
		    'liquibyte',
		    'material',
		    'mbo',
		    'mdn-like',
		    'midnight',
		    'monokai',
		    'neat',
		    'neo',
		    'night',
		    'panda-syntax',
		    'paraiso-dark',
		    'paraiso-light',
		    'pastel-on-dark',
		    'railscasts',
		    'rubyblue',
		    'seti',
		    'solarized dark',
		    'solarized light',
		    'the-matrix',
		    'tomorrow-night-bright',
		    'tomorrow-night-eighties',
		    'ttcn',
		    'twilight',
		    'vibrant-ink',
		    'xq-dark',
		    'xq-light',
		    'yeti',
		    'zenburn'
		]
	}
	themeChange() {
		NativeStorage.setItem('codefront_theme', {name: this.theme})
		.then(()=>{
			this.settingService.changeSetting({theme: this.theme});
		})
		.catch(error=>{
			alert(JSON.stringify(error));
		})
	}
	scrollToView() {
	  	let t=setTimeout(function(){
		    let id=document.querySelector("ion-alert div.alert-radio-group").getAttribute("aria-activedescendant");
		    document.querySelector("#"+id).scrollIntoView();
		    clearTimeout(t);
	  	},1000);
	}
}