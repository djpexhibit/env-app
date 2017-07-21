import { Component } from '@angular/core';
import { NavController, NavParams, Platform} from 'ionic-angular';
import { SelectTaskPage } from '../select-task/select-task';
import { HomePage } from '../home/home';
import { AuthService, User } from '../../providers/auth-service';
import { EventsPage } from '../events/events';
import { LawPage } from '../law/law';

import { DashboardProvider} from '../../providers/dashboard-provider';
import { ProfilePage } from '../profile/profile';
import {DomSanitizer} from '@angular/platform-browser';
import { LoginPage } from '../../pages/login/login';

import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  selectedLanguage = 'en';

  loggedUser : User;
  numberOfPosts = 0;
  numberOfUsers = 0;
  numberOfFollowings = 0;
  numberOfOwnPosts = 0;

  platform;

  private translate: TranslateService;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService,
    private dashboardService : DashboardProvider, private _DomSanitizer: DomSanitizer, platform: Platform,translate: TranslateService) {
    this.loggedUser = auth.getUserInfo();
    this.platform = platform;

    this.translate = translate;
    this.translate.use(this.selectedLanguage);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    this.loadNumberOfPosts();
    this.loadNumberOfUsers();
    this.loadNumberOfFollwings(this.loggedUser.id);
    this.loadNumberOfOwnPosts(this.loggedUser.id);

  }

  loadNumberOfPosts(){
    this.dashboardService.loadNumberOfPosts()
      .then(data => {
        this.numberOfPosts = data;
      });
  }

  loadNumberOfUsers(){
    this.dashboardService.loadNumberOfUsers()
      .then(data => {
        this.numberOfUsers = data;
      });
  }

  loadNumberOfFollwings(id){
    this.dashboardService.loadNumberOfFollwings(id)
      .then(data => {
        this.numberOfFollowings = data;
      });
  }

  loadNumberOfOwnPosts(id){
    this.dashboardService.loadNumberOfOwnPosts(id)
      .then(data => {
        this.numberOfOwnPosts = data;
      });
  }

  selectTask(){
    this.navCtrl.push(SelectTaskPage);
  }

  viewComplains(){
    this.navCtrl.push(HomePage,{
      type: 'COMP'
    });
  }

  viewFavorites(){
    this.navCtrl.push(HomePage,{
      type: 'FAV'
    });
  }

  viewEvents(){
    this.navCtrl.push(EventsPage);
  }

  viewLaws(){
    this.navCtrl.push(LawPage);

  }

  editProfile(){
    this.navCtrl.push(ProfilePage);
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
        localStorage.setItem("logged",null);
        localStorage.setItem("currentUser",null);
        this.navCtrl.setRoot(LoginPage);
    });
  }

  public exitApp(){
    this.platform.exitApp();
  }
}
