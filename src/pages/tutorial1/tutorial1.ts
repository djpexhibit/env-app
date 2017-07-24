import { Component } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { Tutorial2Page } from '../../pages/tutorial2/tutorial2';

/*
  Generated class for the Tutorial1 page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tutorial1',
  templateUrl: 'tutorial1.html'
})
export class Tutorial1Page {

    platform;

  constructor(public navCtrl: NavController, public navParams: NavParams,  platform: Platform) {
    this.platform = platform;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Tutorial1Page');
  }

  public exitApp(){
    this.platform.exitApp();
  }

  close(){
    this.navCtrl.setRoot(DashboardPage)
  }

  next(){
    this.navCtrl.push(Tutorial2Page)
  }
}
