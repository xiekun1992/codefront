import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'fileType' })
export class FileTypePipe implements PipeTransform {
	transform(filename: string):string {
		let suffix = filename.split('.');
		if(suffix.length === 1){
			return 'file';
		}
		return suffix.pop();
	}
}