import { Injectable } from '@angular/core';

@Injectable()
export class SortService {
	byType(entries): any {
		let folders = entries.filter(function(o){
			return o.isDirectory===true;
		});
		let files = entries.filter(function(o){
			return o.isFile===true;
		});

		return [...this.byAlphabetic(folders), ...this.byAlphabetic(files)];
	}
	byAlphabetic(array) {
		return array.sort(function(a, b){
			return a.name > b.name;
		});
	}
}