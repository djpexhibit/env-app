import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import config from '../app/config.json';

/*
  Generated class for the AdvService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AdvService {

data = null;

  constructor(public http: Http) {
    console.log('Hello AdvService Provider');
  }

  load(id) {
  	if (this.data) {
  		// already loaded data
  		return Promise.resolve(this.data);
  	}

  	// don't have the data yet
  	return new Promise(resolve => {
      this.http.post(config.main.baseUrl + '/loadComplains',{user_id:id})
  			.map(res => res.json())
  			.subscribe(data => {
  				// we've got back the raw data, now generate the core schedule data
  				// and save the data for later reference
          console.log(data);
  				this.data = data;
  				resolve(this.data);
  			});
  		});
  	}

}
