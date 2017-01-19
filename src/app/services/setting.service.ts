import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class SettingService {
	private settingChangedSource = new Subject<any>();

	settingChanged$: any = this.settingChangedSource.asObservable();

	changeSetting(settings: any){
		this.settingChangedSource.next(settings);
	}
}