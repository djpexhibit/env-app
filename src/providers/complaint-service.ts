import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ComplaintService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ComplaintService {

	data = null;
  pollutionTypes = null;
  complain = null;

  constructor(public http: Http) {
    console.log('Hello ComplaintService Provider');
  }

  load() {
  	if (this.data) {
  		// already loaded data
  		return Promise.resolve(this.data);
  	}

  	// don't have the data yet
  	return new Promise(resolve => {
  		// We're using Angular HTTP provider to request the data,
  		// then on the response, it'll map the JSON data to a parsed JS object.
  		// Next, we process the data and resolve the promise with the new data.
  		//this.http.get('https://randomuser.me/api/?results=10')
      this.http.get('http://139.59.58.196:3000/loadComplains')
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


  loadPollutionTypes(){
    if (this.pollutionTypes){
      return Promise.resolve(this.pollutionTypes);
    }

    return new Promise(resolve => {
      this.http.get('http://139.59.58.196:3000/loadPollutionTypes')
        .map(res => res.json())
        .subscribe(data => {
          this.pollutionTypes = data;
          resolve(this.pollutionTypes);
        });
      });
    }




  loadComplain(comp_id){
    return new Promise(resolve => {
      this.http.post('http://139.59.58.196:3000/loadComplain',{comp_id:comp_id})
        .map(res => res.json())
        .subscribe(data => {
          this.complain = data;
          resolve(this.complain);
        });
    });
  }


  addComplain(complain,base64Images){
    console.log("ADDING");
    let toSend = {
      complain:complain,
      images:base64Images
    }
    return new Promise( resolve => {
      this.http.post('http://139.59.58.196:3000/addComplain',{details:toSend})
        .map(res => res.json())
        .subscribe(data => {
          console.log(data)
        })
    });
  }

}
