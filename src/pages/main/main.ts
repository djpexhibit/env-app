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


  constructor(public navCtrl: NavController, public navParams: NavParams, private auth : AuthService) {
    this.rootPage = DashboardPage;

    this.homePage = HomePage;
    this.lawPage = LawPage;
    this.addSpeciesPage = AddSpeciesPage;
    this.listSpeciesPage = ListSpeciesPage;
    this.addCompaintPage = AddCompaintPage;
    this.dashboardPage = DashboardPage;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

  openPage(p) {
    this.rootPage = p;
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
        localStorage.setItem("logged",null);
        localStorage.setItem("currentUser",null);
        this.navCtrl.setRoot(LoginPage);
    });
  }

}
