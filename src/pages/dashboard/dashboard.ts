import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SelectTaskPage } from '../select-task/select-task';
import { HomePage } from '../home/home';
import { AuthService, User } from '../../providers/auth-service';
import { EventsPage } from '../events/events';
import { DashboardProvider} from '../../providers/dashboard-provider';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  loggedUser : User;
  numberOfPosts = 0;
  numberOfUsers = 0;
  numberOfFollowings = 0;
  numberOfOwnPosts = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private dashboardService : DashboardProvider) {
    this.loggedUser = auth.getUserInfo();
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

  editProfile(){
    this.navCtrl.push(ProfilePage);
  }
}
