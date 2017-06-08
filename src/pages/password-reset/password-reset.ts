import { Component } from '@angular/core';
import { NavController, NavParams, AlertController ,LoadingController, Loading  } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { VerifyResetPage } from '../verify-reset/verify-reset';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html'
})
export class PasswordResetPage {


    loading: Loading;
    createSuccess = false;
    resetCredentials = {email:'',mobile:''};

    constructor(private nav: NavController, private navParams: NavParams, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
      this.resetCredentials.mobile = navParams.get("mobile");
    }


    public reset(){
      this.showLoading();

      this.auth.verifyEmailWithMobile(this.resetCredentials).then(emailCheckPw => {
        if (emailCheckPw["status"] === 'OK' && emailCheckPw["msg"] && emailCheckPw["msg"] === 'VERIFIED') {
          setTimeout(() => {
            this.loading.dismiss();
            this.nav.push(VerifyResetPage, {
              mobile: this.resetCredentials.mobile
            });
          } );
        }else {
          this.showError("Email and Mobile number doesn't match !");
          this.nav.setRoot(LoginPage);
        }
      },error => {
        this.showError("Please try again");
        this.nav.setRoot(LoginPage);
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
