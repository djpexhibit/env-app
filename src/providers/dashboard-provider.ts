import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import config from '../app/config.json';


/*
  Generated class for the DashboardProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DashboardProvider {

  numberOfPosts = 0;
  numberOfUsers = 0;
  numberOfFollowings = 0;
  numberOfOwnPosts = 0;
  appVersion;
  agreement;
  agreed;

  constructor(public http: Http) {
    console.log('Hello DashboardProvider Provider');
  }

  loadNumberOfPosts(){
    if (this.numberOfPosts !== 0){
      return Promise.resolve(this.numberOfPosts);
    }

    return new Promise(resolve => {
      this.http.post(config.main.baseUrl + '/loadNumberOfPosts',{user_id:0})
        .map(res => res.json())
        .subscribe(data => {
          this.numberOfPosts = data[0].species + data[0].complains;
          resolve(this.numberOfPosts);
        });
    });
  }


  loadNumberOfUsers(){
    if (this.numberOfUsers !== 0){
      return Promise.resolve(this.numberOfUsers);
    }

    return new Promise(resolve => {
      this.http.post(config.main.baseUrl + '/loadNumberOfUsers',{user_id:0})
        .map(res => res.json())
        .subscribe(data => {
          this.numberOfUsers = data[0].users;
          resolve(this.numberOfUsers);
        });
    });
  }


  loadNumberOfFollwings(id){
    if (this.numberOfFollowings !== 0){
      return Promise.resolve(this.numberOfFollowings);
    }

    return new Promise(resolve => {
      this.http.post(config.main.baseUrl + '/loadNumberOfFollwings',{user_id:id})
        .map(res => res.json())
        .subscribe(data => {
          this.numberOfFollowings = data[0].species + data[0].complains;
          resolve(this.numberOfFollowings);
        });
    });
  }


  loadNumberOfOwnPosts(id){
    if (this.numberOfPosts !== 0){
      return Promise.resolve(this.numberOfPosts);
    }

    return new Promise(resolve => {
      this.http.post(config.main.baseUrl + '/loadNumberOfOwnPosts',{user_id:id})
        .map(res => res.json())
        .subscribe(data => {
          this.numberOfPosts = data[0].species + data[0].complains;
          resolve(this.numberOfPosts);
        });
    });
  }

  loadAppVersion(){
    return new Promise(resolve => {
      this.http.get(config.main.baseUrl + '/loadAppVersion')
        .map(res => res.json())
        .subscribe(data => {
          this.appVersion = data;
          resolve(this.appVersion);
        });
    });
  }

  loadAgreement(id){
    return new Promise(resolve => {
      this.http.post(config.main.baseUrl + '/loadAgreement',{user_id:id})
        .map(res => res.json())
        .subscribe(data => {
          this.agreement = data;
          resolve(this.agreement);
        });
    });
  }

  updateAgree(id){
    return new Promise(resolve => {
      this.http.post(config.main.baseUrl + '/updateAgree',{user_id:id})
        .map(res => res.json())
        .subscribe(data => {
          this.agreed = data;
          resolve(this.agreed);
        });
    });
  }

}
