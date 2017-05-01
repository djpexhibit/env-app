import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LawPage } from '../law/law';
import { AddSpeciesPage } from '../add-species/add-species';
import { ListSpeciesPage } from '../list-species/list-species';
import { AddCompaintPage } from '../add-compaint/add-compaint';


@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  private rootPage;
  private homePage;
  private lawPage;
  private addSpeciesPage;
  private listSpeciesPage;
  private addCompaintPage;
 

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.rootPage = HomePage;

    this.homePage = HomePage;
    this.lawPage = LawPage;
    this.addSpeciesPage = AddSpeciesPage;
    this.listSpeciesPage = ListSpeciesPage;
    this.addCompaintPage = AddCompaintPage;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

  openPage(p) {
    this.rootPage = p;
  }

}