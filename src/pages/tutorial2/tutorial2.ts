import { Component } from '@angular/core';
import { NavController, NavParams ,Platform} from 'ionic-angular';
import { Tutorial1Page } from '../../pages/tutorial1/tutorial1';
import { Tutorial3Page } from '../../pages/tutorial3/tutorial3';

/*
  Generated class for the Tutorial2 page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tutorial2',
  templateUrl: 'tutorial2.html'
})
export class Tutorial2Page {

  platform;

  constructor(public navCtrl: NavController, public navParams: NavParams,  platform: Platform) {
    this.platform = platform;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Tutorial2Page');
  }

  public exitApp(){
    this.platform.exitApp();
  }
  prev(){
    this.navCtrl.push(Tutorial1Page)
  }

  next(){
    this.navCtrl.push(Tutorial3Page)
  }
}
