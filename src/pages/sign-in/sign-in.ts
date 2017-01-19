import { Component } from '@angular/core';
import { AlertController } from  'ionic-angular';


@Component({
	templateUrl: 'sign-in.html'
})
export class SignInPage {
	username: string;
	password: string;

	constructor(public alertCtrl: AlertController){
		this.username="";
		this.password="";
	}
	login(){
		let alert = this.alertCtrl.create();
		alert.setTitle('Choose sex');
		alert.addInput({
			type:'radio',
			label:'Male',
			value:'0',
			checked:true
		});
		alert.addInput({
			type:'radio',
			label:'Female',
			value:'1',
			checked:false
		});
		alert.addButton('Cancel');
		alert.addButton({
			text:'OKay',
			handler:data=>{
				// this.testRadioOpen=false;
				// this.testRadioResult=data;
				console.log(1)
			}
		});
		alert.present();
	}
}