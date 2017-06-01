import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import config from '../app/config.json';

export class User {
  name: string;
  email: string;
  id:number;

  constructor(name: string, email: string, id: number) {
    this.name = name;
    this.email = email;
    this.id = id;
  }
}

@Injectable()
export class AuthService {
  currentUser: User;
  access:boolean;
  success = null;
  emailCheck = null;

  constructor(public http: Http) {
    console.log('Hello ComplaintService Provider');
  }




public login(credentials) {
  if (credentials.email === null || credentials.password === null) {
    return Observable.throw("Please insert credentials");
  } else {
    return Observable.create(observer => {
      let url = config.main.baseUrl + '/login';
      this.http.post(url,{"credentials":credentials}).map(res => res.json()).subscribe( data => {
        if (data.status === "OK"){
          this.currentUser = new User(data.username, data.email,data.id);
          this.access = true;
        }else{
          this.access = false;
        }
        observer.next(this.access);
        observer.complete();
      }, err => {
        this.access = false;
         observer.next(this.access);
        observer.complete();
      }
    );
    });
  }
}


  /*public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else if(credentials.password !== credentials.repassword){
      return Observable.throw("Password doens't match");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        let url = config.main.baseUrl + '/register';
        this.http.post(url,{"credentials":credentials}).map(res => res.json()).subscribe( data => {
          if (data.status === "OK"){
            observer.next(true);
          }else{
            observer.next(false);
          }

          observer.complete();
        }
        );
      });
    }
  }*/

  public register(credentials){
    return new Promise( resolve => {
      this.http.post(config.main.baseUrl + '/register',{credentials:credentials})
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.success = data;
          resolve(this.success);
        })
    });
  }

  public verifyMobileCode(verifyCredentials){
    return new Promise(
      resolve => {
        this.http.post(config.main.baseUrl + '/verifyMobileCode',{verifyCredentials:verifyCredentials})
          .map(res => res.json())
          .subscribe(data => {
            console.log(data);
            this.success = data;
            resolve(this.success)
          })
      }
    );
  }

  public checkEmailValidity(credentials){
  console.log(credentials);
    return new Promise( resolve => {
      this.http.post(config.main.baseUrl + '/checkEmailValidity',{credentials:credentials})
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.emailCheck = data;
          resolve(this.emailCheck);
        })
    });
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
