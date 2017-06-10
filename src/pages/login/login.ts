
import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { RegisterPage } from '../register/register';
//import { HomePage } from '../home/home';
import { MainPage } from '../main/main';
import { HomePage } from '../home/home';
import { PasswordResetPage } from '../password-reset/password-reset';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: Loading;
  registerCredentials = {email: '', password: ''};
  logoImg = 'assets/img/logo.jpg';
  ta = 'ta.png';


  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

  }
  ionViewDidLoad(){
      if(localStorage.getItem("logged") === 'true'){
        this.auth.setUserInfo(JSON.parse(localStorage.getItem("currentUser")));
        this.nav.setRoot(MainPage);
      }
  }

  public createAccount() {
    this.nav.push(RegisterPage);
  }

  public forgetPassword(){
    this.nav.push(PasswordResetPage);
  }

  public login() {
    this.showLoading()
    this.auth.login(this.registerCredentials).subscribe(allowed => {
      if (allowed) {
        setTimeout(() => {
        this.loading.dismiss();
        this.nav.setRoot(MainPage)
        });
      } else {
        this.showError("Access Denied");
      }
    },
    error => {
      this.showError("Please try again");
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}
