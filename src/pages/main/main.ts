import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LawPage } from '../law/law';


@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  private rootPage;
  private homePage;
  private lawPage;
 

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.rootPage = HomePage;

    this.homePage = HomePage;
    this.lawPage = LawPage;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

  openPage(p) {
    this.rootPage = p;
  }

}