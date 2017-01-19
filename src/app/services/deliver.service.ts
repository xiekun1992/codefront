import { Injectable } from '@angular/core';

@Injectable()
export class DeliverService {
	callback: Function;

	set(file){
		this.callback(file);
	}
	regist(cb) {
		this.callback=cb;
	}
}