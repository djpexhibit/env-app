
import { Component } from '@angular/core';
import { NavController, AlertController ,LoadingController, Loading  } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { VerifyPage } from '../verify/verify';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  type= "password";
  show = false;

  loading: Loading;
  createSuccess = false;
  registerCredentials = {email: '', password: '',repassword:'',username:'',name:'',mobile:'', type:'', expertType:'', mediaType:'', isJoined:false};

  expertTypes = [
    'Marine and Coastal Ecologist',
    'Terrestrial ecologist',
    'Environmental Laws regulation and Institutional',
    'Water Quality & pollution',
    'Hydrologist',
    'Air Quality',
    'Geologist',
    'Archaeologist',
    'Solid waste & Waste water',
    'Quarantine & customs'
  ];

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {}

  /*public register() {
    this.auth.register(this.registerCredentials).subscribe(success => {
      if (success) {
        console.log("sssssss");
        this.createSuccess = true;
          this.showPopup("Success", "Account created.");
      } else {
        console.log("sddddddddd");
        this.showPopup("Error", "Problem creating account.");
      }
    },
    error => {
      this.showPopup("Error", error);
    });
  }*/


  public register(){
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
          this.auth.register(this.registerCredentials).then(success => {
          if (success) {
            setTimeout(() => {
              this.loading.dismiss();
              //this.nav.setRoot(VerifyPage);
              this.nav.push(VerifyPage, {
                mobile: this.registerCredentials.mobile
              });
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
             this.nav.popToRoot();
           }
         }
       }
     ]
    });
    alert.present();
  }

  displayJoinedMessage(){
    if(this.registerCredentials.isJoined) this.showPopup("Join to panel","You can only join after the verification process");
  }

  toggleShow(){
        this.show = !this.show;
        if (this.show){
            this.type = "text";
        }
        else {
            this.type = "password";
        }
    }
}
