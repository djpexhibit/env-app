import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-mobile-update',
  templateUrl: 'mobile-update.html'
})
export class MobileUpdatePage {

  mobile:''

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MobileUpdatePage');
  }

  updateMobile(){

  }
}
