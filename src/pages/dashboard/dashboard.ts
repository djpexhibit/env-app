import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SelectTaskPage } from '../select-task/select-task';
import { HomePage } from '../home/home';
import { AuthService, User } from '../../providers/auth-service';


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  loggedUser : User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService) {
    this.loggedUser = auth.getUserInfo();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }

  selectTask(){
    this.navCtrl.push(SelectTaskPage);
  }

  viewComplains(){
    this.navCtrl.push(HomePage);
  }
}
