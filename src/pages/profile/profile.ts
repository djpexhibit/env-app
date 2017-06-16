import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service';
import { NavController,NavParams, AlertController ,LoadingController, Loading  } from 'ionic-angular';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  loading: Loading;
  createSuccess = false;
  registerCredentials = {email: '', password: '',repassword:'',username:'',name:''};

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private loadingCtrl: LoadingController,  private alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  public editProfile(){
    this.showLoading();

    if(this.registerCredentials.password !== this.registerCredentials.repassword){
      this.showError("Password doesn't match");
    }else{
      this.auth.checkEmailValidity(this.registerCredentials).then(emailCheck => {
        if (emailCheck["status"] === 'OK' && emailCheck["msg"] && emailCheck["msg"] === 'EMAIL_EXIST') {
          setTimeout(() => {
            this.loading.dismiss();
            this.showError("Email Already Exists"); return;
          });
        } else {
          this.auth.editProfile(this.registerCredentials).then(success => {
            if (success) {
              setTimeout(() => {
                this.loading.dismiss();
                //this.nav.setRoot(VerifyPage);
              } );
            } else {
              this.showError("Error");
            }
          },
          error => {
            this.showError("Please try again");
          });
        }
      },
      error => {
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
              this.navCtrl.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

}
