
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController ,LoadingController, Loading  } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-verify',
  templateUrl: 'verify.html'
})
export class VerifyPage {

  loading: Loading;
  createSuccess = false;
  verifyCredentials = {mobile:'', mobileCode:''};
  type;

  constructor(private nav: NavController, private navParams: NavParams, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.verifyCredentials.mobile = navParams.get("mobile");
    this.type = navParams.get("type");
  }

  public verify(){
    this.showLoading();

    this.auth.verifyMobileCode(this.verifyCredentials).then(mobileCheck => {
      if (mobileCheck["status"] === 'OK' && mobileCheck["msg"] && mobileCheck["msg"] === 'VERIFIED') {
        setTimeout(() => {
          this.loading.dismiss();
          if(this.type === 'MOBUPDATE'){
            this.showPopup("Update Mobile","Update Successful! Please login again");
            this.auth.logout().subscribe(succ => {
                localStorage.setItem("logged",null);
                localStorage.setItem("currentUser",null);
                this.nav.setRoot(LoginPage);
            });

          }else{
            this.showPopup("Registration","Registration Successful!");
            this.nav.setRoot(LoginPage);
          }

        } );
      }else {
        this.showError("Incorrect pin number , please check the sms message ");
      }
    },error => {
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
