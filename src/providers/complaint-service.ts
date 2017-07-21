import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import config from '../app/config.json';
//import { Transfer } from 'ionic-native';
//import { FileUploadOptions, TransferObject } from '@ionic-native/transfer';
//import { File } from '@ionic-native/file';
//import { Platform } from 'ionic-angular';
/*
  Generated class for the ComplaintService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ComplaintService {

	data = null;
	favData = null;
  pollutionTypes = null;
  complain = null;
  expectedActions = null;
  success = null;
  comments = null;

  constructor(public http: Http) {
    console.log('Hello ComplaintService Provider');
  }



  load(id) {
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

		loadChunk(id,start,end) {
	  	/*if (this.data) {
	  		return Promise.resolve(this.data);
	  	*/
	  	return new Promise(resolve => {
	      this.http.post(config.main.baseUrl + '/loadComplainsChunk',{user_id:id, start:start, end:end})
	  			.map(res => res.json())
	  			.subscribe(data => {
	          console.log(data);
	  				this.data = data;
	  				resolve(this.data);
	  			});
	  		});
	  	}

		loadFavorites(id) {
			if (this.favData) {
				return Promise.resolve(this.favData);
			}

			return new Promise(resolve => {
				this.http.post(config.main.baseUrl + '/loadFavoriteComplains',{user_id:id})
					.map(res => res.json())
					.subscribe(data => {
						console.log(data);
						this.favData = data;
						resolve(this.favData);
					});
				});
			}


			loadFavoritesChunk(id,start,end) {

		  	return new Promise(resolve => {
		      this.http.post(config.main.baseUrl + '/loadFavoritesChunk',{user_id:id, start:start, end:end})
		  			.map(res => res.json())
		  			.subscribe(data => {
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
      this.http.get(config.main.baseUrl + '/loadPollutionTypes')
        .map(res => res.json())
        .subscribe(data => {
          this.pollutionTypes = data;
          resolve(this.pollutionTypes);
        });
      });
    }

  loadExpectedActions(){
    if (this.expectedActions){
      return Promise.resolve(this.expectedActions);
    }

    return new Promise(resolve => {
      this.http.get(config.main.baseUrl + '/loadExpectedActions')
        .map(res => res.json())
        .subscribe(data => {
          this.expectedActions = data;
          resolve(this.expectedActions);
        });
      });
    }




  loadComplain(comp_id, userId){
    return new Promise(resolve => {
      this.http.post(config.main.baseUrl + '/loadComplain',{comp_id:comp_id, userId:userId})
        .map(res => res.json())
        .subscribe(data => {
          console.log("CCCC"); console.log(data);
          this.complain = data;
          resolve(this.complain);
        }, err=> {
          console.log("CCCC 1");
          this.complain = null;
          resolve(this.complain);
        });
    });
  }

  loadComments(comp_id){
    return new Promise(resolve => {
      this.http.post(config.main.baseUrl + '/loadComments',{comp_id:comp_id})
        .map(res => res.json())
        .subscribe(data => {
          console.log(JSON.stringify(data));
          this.comments = data;
          resolve(this.comments);
        });
    });
  }


  /*upload(path, compId) {

		this.platform.ready().then(()=>{

    let options = {
      fileKey: 'file',
      fileName: 'vid_'+compId.id+'.mp4',
      headers: {}
    };

    const fileTransfer = new Transfer();

 return new Promise(resolve => {
fileTransfer.upload(path, config.main.baseUrl + '/addVideo', options).then((data) => {

        resolve(data);
    }, (err) => {
      // error
    })

 });
});

  }*/


  addComplain(complain,base64Images){
    console.log("ADDING");
    let toSend = {
      complain:complain,
      images:base64Images
    }
    return new Promise( resolve => {
      this.http.post(config.main.baseUrl + '/addComplain',{details:toSend})
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.success = data;
          resolve(this.success);
        })
    });
  }


  updateComplain(complain,base64Images){
    console.log("UPDATING");
    let toSend = {
      complain:complain,
      images:base64Images
    }
    return new Promise( resolve => {
      this.http.post(config.main.baseUrl + '/updateComplain',{details:toSend})
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.success = data;
          resolve(this.success);
        })
    });
  }



  addComment(comment){
    return new Promise( resolve => {
      this.http.post(config.main.baseUrl + '/addComment',{details:comment})
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.success = data;
          resolve(this.success);
        })
    });
  }

	addAsFavorite(fav){
		return new Promise( resolve => {
      this.http.post(config.main.baseUrl + '/addAsFavoriteComp',{fav:fav})
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.success = data;
          resolve(this.success);
        })
    });
	}

}
