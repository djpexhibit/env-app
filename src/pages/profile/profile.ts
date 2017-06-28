import { Component } from '@angular/core';
import { AuthService, User } from '../../providers/auth-service';
import { NavController,NavParams, AlertController ,LoadingController, Loading  } from 'ionic-angular';
import {  Camera } from 'ionic-native';
import { MobileUpdatePage } from '../mobile-update/mobile-update';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  loading: Loading;
  createSuccess = false;
  loggedUser: User;
  registerCredentials = {id:0,email: '',curPassword:'', password: '',repassword:'',username:'',name:'',image:'',type:'', expertType:'', mediaType:'', isJoined:false};
  public profileImage :string;

  verifyCredentials={email:'',password:''}
  passwordVerified = false;



  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private loadingCtrl: LoadingController,  private alertCtrl: AlertController) {
    this.loggedUser = auth.getUserInfo();
    this.registerCredentials.email = this.loggedUser.email;
    this.registerCredentials.name = this.loggedUser.fullName;
    this.registerCredentials.image = this.loggedUser.image;
    this.registerCredentials.username = this.loggedUser.name;
    this.registerCredentials.id = this.loggedUser.id;

    if(this.loggedUser.type){
      this.registerCredentials.type = this.loggedUser.type;
    }else{
      this.registerCredentials.type = 'Public';
    }

    this.registerCredentials.expertType = this.loggedUser.expertType;
    this.registerCredentials.mediaType = this.loggedUser.mediaType;
    this.registerCredentials.isJoined = this.loggedUser.isJoined;

    if(this.loggedUser.image){
      this.profileImage = this.loggedUser.image;
    }else{
      this.profileImage = 'prof.jpg';
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  public editProfile(){
    this.showLoading();

    if(this.registerCredentials.curPassword){
      if(!this.registerCredentials.password || !this.registerCredentials.repassword || (this.registerCredentials.password !== this.registerCredentials.repassword)){
        this.showError("Cannot have empty passwords or Password doesn't match");
      }else{
        this.verifyCredentials.email = this.registerCredentials.email;
        this.verifyCredentials.password = this.registerCredentials.curPassword;
        this.auth.verifyPassword(this.verifyCredentials).subscribe(allowed => {
          if (allowed) {
            this.auth.editProfile(this.registerCredentials).then(success => {
              if (success) {
                setTimeout(() => {
                  this.loading.dismiss();
                  this.showPopup("Edit Profile","Successfully Edited");
                } );
              } else {
                this.showError("Please try again");
              }
            },
            error => {
              this.showError("Please try again");
            });
          } else {
            this.showError("Current password is wrong");
          }
        },
        error => {
          this.showError("Please try again");
        });

      }
    }else{
      this.auth.editProfileWOPW(this.registerCredentials).then(success => {
        if (success) {
          setTimeout(() => {
            this.loading.dismiss();
            this.showPopup("Edit Profile","Successfully Edited");
          } );
        } else {
          this.showError("Error");
        }
      },
      error => {
        this.showError("Please try again");
      });
    }


  }

  selectPicture(){
    let options = {
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      allowEdit : true,
  targetWidth: 512,
  targetHeight: 512
    };

    Camera.getPicture(options).then((imageData) => {
      this.profileImage = "data:image/jpeg;base64," + imageData;
      this.registerCredentials.image = this.profileImage;
    }, (err) => {
      console.log(err);
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
              this.navCtrl.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

  navUpdateMobile(){
    this.navCtrl.push(MobileUpdatePage,{
      id: this.registerCredentials.id
    });
  }

}
