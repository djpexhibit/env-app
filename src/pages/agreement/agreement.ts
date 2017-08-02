

import { Component } from '@angular/core';
import { NavController, NavParams,Platform ,MenuController} from 'ionic-angular';
import { DashboardProvider} from '../../providers/dashboard-provider';
import { AuthService, User } from '../../providers/auth-service';
import { DashboardPage } from '../dashboard/dashboard';
import { LoginPage } from '../login/login';
import {ProfilePage } from '../profile/profile';

/*
  Generated class for the Aboutus page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-agreement',
  templateUrl: 'agreement.html'
})
export class AgreementPage {

  platform;
  loggedUser : User;
  agreed=false;
  showNav=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,  platform: Platform,private dashboardService : DashboardProvider, private auth : AuthService, private menu: MenuController) {
    this.loggedUser = auth.getUserInfo();

    this.showNav = navParams.get("showNav");

    this.platform = platform;

    if(!this.showNav){
      this.menu.swipeEnable(false);
    }


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutusPage');
  }

  public exitApp(){
    this.platform.exitApp();
  }

  agree(){
    this.dashboardService.updateAgree(this.loggedUser.id).then(data => {

        this.navCtrl.push(DashboardPage);

    });
  }


  public logout() {
    if(!this.showNav){
      this.auth.logout().subscribe(succ => {
          localStorage.setItem("logged",null);
          localStorage.setItem("currentUser",null);
          this.navCtrl.setRoot(LoginPage);
      });
    }else{
      this.navCtrl.push(ProfilePage);
    }

  }



}
