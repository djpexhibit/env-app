import { Component } from '@angular/core';
import { NavController, AlertController ,LoadingController, Loading , NavParams } from 'ionic-angular';
import { VerifyPage } from '../verify/verify';
import { AuthService } from '../../providers/auth-service';


@Component({
  selector: 'page-mobile-update',
  templateUrl: 'mobile-update.html'
})
export class MobileUpdatePage {

  loading: Loading;
  createSuccess = false;

  mobile:'';
  userId;

  constructor(public nav: NavController, public navParams: NavParams, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.userId = navParams.get("id");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MobileUpdatePage');
  }

  updateMobile(){
    this.showLoading();

    if(!this.validatePhoneNumber(this.mobile)){
      this.showError("Invalid Phone Number");
      return;
    }
    this.auth.checkMobileValidity(this.userId,this.mobile).then(mobileCheck => {
      if (mobileCheck["status"] === 'OK' && mobileCheck["msg"] && mobileCheck["msg"] === 'EMAIL_EXIST') {
        setTimeout(() => {
          this.loading.dismiss();
          this.showError("Mobile Number Already Exists"); return;
        });
      } else {
          this.auth.updateMobile({"id":this.userId, "mobile":this.mobile}).then(success => {
          if (success) {
            setTimeout(() => {
              this.loading.dismiss();
              //this.nav.setRoot(VerifyPage);
              this.nav.push(VerifyPage, {
                mobile: this.mobile,
                type:'MOBUPDATE'
              });
            } );
          } else {
            this.showError("Error");
          }
        });
      }
    },
    error => {
      this.showError("Please try again");
    });


  }

  validatePhoneNumber(value) {
    if (value === undefined || value === null || !(/^0[0-9]{9}$/.test(value))) {
      return false;
    }
    return true;
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
