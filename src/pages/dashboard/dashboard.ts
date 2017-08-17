import { Component } from '@angular/core';
import { NavController, NavParams, Platform,  AlertController, LoadingController, Loading} from 'ionic-angular';
import { SelectTaskPage } from '../select-task/select-task';
import { HomePage } from '../home/home';
import { AuthService, User } from '../../providers/auth-service';
import { EventsPage } from '../events/events';
import { LawPage } from '../law/law';
import { AboutusPage } from '../aboutus/aboutus';
import { DashboardProvider} from '../../providers/dashboard-provider';
import { ProfilePage } from '../profile/profile';
import {DomSanitizer} from '@angular/platform-browser';
import { LoginPage } from '../../pages/login/login';
import config from '../../app/config.json';


import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  loading: Loading;

  selectedLanguage = 'en';

  loggedUser : User;
  numberOfPosts;
  numberOfUsers;
  numberOfFollowings;
  numberOfOwnPosts;
  appVersion;

  platform;

  private translate: TranslateService;

  tile1 = './assets/img/tile1.jpg';
  tile2 = './assets/img/tile2.jpg';
  tile3 = './assets/img/tile3.jpg';
  tile4 = './assets/img/tile4.jpg';
  tile5 = './assets/img/tile5.jpg';
  tile6 = './assets/img/tile6.jpg';

  profileImage = './assets/img/prof.jpg';

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService,
    private dashboardService : DashboardProvider, private _DomSanitizer: DomSanitizer, platform: Platform,translate: TranslateService,
  private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.loggedUser = auth.getUserInfo();
    this.platform = platform;

    this.translate = translate;
    this.translate.use(this.selectedLanguage);

  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad DashboardPage');


    this.loadAppVersion();

    this.loadNumberOfPosts();
    this.loadNumberOfUsers();
    this.loadNumberOfFollwings(this.loggedUser.id);
    this.loadNumberOfOwnPosts(this.loggedUser.id);

  }

  loadAppVersion(){

    let pform = this.platform.is('android')?"ANDROID":"IOS";

    this.showLoading();
    this.dashboardService.loadAppVersion(pform)
    .then(data => {
      this.appVersion=data[0].appVersion;
      let locAppVersion = this.platform.is('android')?config.main.appVersion:config.main.appVersionIOS;
      console.log("^^^^^^^^^^00"); console.log(this.appVersion); console.log(locAppVersion)

      if(locAppVersion !== this.appVersion){
        console.log("NOT");
        this.showError("Please update ecoforce application to a newer version. Otherwise some features will not work correctly. Go to <a href='https://play.google.com/store/apps/details?id=com.ionicframework.envapp657580'>Update</a>");
      }else{
        console.log("APP VERSION SAME");
        this.loading.dismiss();
      }
    });
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

  viewAU(){
    this.navCtrl.push(AboutusPage);

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

  getBackground() {
    return "url('./assets/img/bk.jpg')";
  }

  getr(){
    return this._DomSanitizer.bypassSecurityTrustStyle(`no-repeat`);
  }

  getp(){
    return this._DomSanitizer.bypassSecurityTrustStyle(`center`);
  }

  getz(){
    return this._DomSanitizer.bypassSecurityTrustStyle(`100% auto`);
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Update',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}
