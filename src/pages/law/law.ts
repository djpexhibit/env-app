import { Component } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';
import {AddCompaintPage} from '../add-compaint/add-compaint';

/*
  Generated class for the Law page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-law',
  templateUrl: 'law.html'
})
export class LawPage {

	addComplaint = AddCompaintPage;

  platform;

  constructor(public navCtrl: NavController, public navParams: NavParams, platform: Platform) {
    this.platform = platform;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LawPage');
  }

  public exitApp(){
    this.platform.exitApp();
  }

}
