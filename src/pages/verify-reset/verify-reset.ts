
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController ,LoadingController, Loading  } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-verify-reset',
  templateUrl: 'verify-reset.html'
})
export class VerifyResetPage {

  loading: Loading;
  createSuccess = false;
  verifyCredentials = {mobile:'', mobileCode:'', password:'', repassword:''};

  constructor(private nav: NavController, private navParams: NavParams, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.verifyCredentials.mobile = navParams.get("mobile");
  }

  public verify(){
    this.showLoading();

    if(this.verifyCredentials.password !== this.verifyCredentials.repassword){
      this.showError("Password doesn't match");
    }else{

    this.auth.verifyResetMobileCode(this.verifyCredentials).then(mobileCheck => {
      if (mobileCheck["status"] === 'OK' && mobileCheck["msg"] && mobileCheck["msg"] === 'VERIFIED') {
        setTimeout(() => {
          this.loading.dismiss();
          this.showPopup("Reset Password","Password Reset Successful!");
          this.nav.setRoot(LoginPage);
        } );
      }else {
        this.showError("Error");
      }
    },error => {
      this.showError("Please try again");
    });

  }
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

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
       {
         text: 'OK',
         handler: data => {
           if (this.createSuccess) {
             this.nav.popToRoot();
           }
         }
       }
     ]
    });
    alert.present();
  }
}
