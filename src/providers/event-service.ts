import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import config from '../app/config.json';


@Injectable()
export class EventService {

  constructor(public http: Http) {
    console.log('Hello EventService Provider');
  }

  data = null;

  load(){
    if (this.data){
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http.get(config.main.baseUrl + '/loadEvents')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
      });
    }

}
