import { Component } from '@angular/core';

@Component({
	templateUrl:'sign-up.html'
})
export class SignUpPage{
	username: string;
	password: string;
	repeatPassword: string;

	constructor(){
		this.username="";
		this.password="";
		this.repeatPassword="";
	}

	signUp(){
		
	}
}