import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LawPage } from '../law/law';
import { AddSpeciesPage } from '../add-species/add-species';
import { ListSpeciesPage } from '../list-species/list-species';
import { AddCompaintPage } from '../add-compaint/add-compaint';
import { DashboardPage } from '../dashboard/dashboard';
import { AuthService, User } from '../../providers/auth-service';
import { LoginPage } from '../../pages/login/login';
import { Tutorial1Page } from '../../pages/tutorial1/tutorial1';
import { AboutusPage } from '../../pages/aboutus/aboutus';
import { AgreementPage } from '../../pages/agreement/agreement';

import { DashboardProvider} from '../../providers/dashboard-provider';



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
  private dashboardPage;
  private tutorial1Page;
  private aboutusPage;
  private agreementPage;

  loggedUser : User;
  agreed=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth : AuthService,private dashboardService : DashboardProvider) {

    this.loggedUser = auth.getUserInfo();

    this.rootPage = DashboardPage;

    this.homePage = HomePage;
    this.lawPage = LawPage;
    this.addSpeciesPage = AddSpeciesPage;
    this.listSpeciesPage = ListSpeciesPage;
    this.addCompaintPage = AddCompaintPage;
    this.dashboardPage = DashboardPage;
    this.tutorial1Page = Tutorial1Page;
    this.aboutusPage = AboutusPage;
    this.agreementPage = AgreementPage;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
    this.loadAgreement();
  }

  loadAgreement(){
    this.dashboardService.loadAgreement(this.loggedUser.id).then(data => {
      this.agreed=data[0].agreed;
      if(!this.agreed){
        this.rootPage = AgreementPage;
      }
    });
  }

  openPage(p) {
    this.rootPage = p;
  }

  changeLanguage(){

  }

  public logout() {
    this.auth.logout().subscribe(succ => {
        localStorage.setItem("logged",null);
        localStorage.setItem("currentUser",null);
        this.navCtrl.setRoot(LoginPage);
    });
  }

}
