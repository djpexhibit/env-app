import { Component } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';

/*
  Generated class for the Aboutus page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-aboutus',
  templateUrl: 'aboutus.html'
})
export class AboutusPage {

  platform;

  constructor(public navCtrl: NavController, public navParams: NavParams,  platform: Platform) {
    this.platform = platform;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutusPage');
  }

  public exitApp(){
    this.platform.exitApp();
  }

  mailto() {
   window.open(`mailto:it@emlconsultants.com`, '_system');
  }

}
