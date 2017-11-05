import { Component } from '@angular/core';
import { Platform ,AlertController} from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { LoginPage } from '../pages/login/login';
import { SplashScreen } from '@ionic-native/splash-screen';
declare var FirebasePlugin: any;


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = LoginPage;

  constructor(platform: Platform, public _SplashScreen: SplashScreen, public alertCtrl: AlertController) {
    platform.ready().then(() => {
      setTimeout(() => {
        this._SplashScreen.hide();
      }, 100);
      StatusBar.styleDefault();

      FirebasePlugin.getToken(token => {
        // save this server-side and use it to push notifications to this device
        console.log(`Obtained token: ${token}`);
        FirebasePlugin.subscribe('all');
        let youralert = this.alertCtrl.create({
          title: 'New Push notification',
          message: 'vvvvvvvvvv'
        });
        youralert.present();
      }, error => {
        console.error(`Error: ${error}`);
        let youralert = this.alertCtrl.create({
          title: 'New Push notification',
          message: 'gggggggggg'
        });
        youralert.present();
      });

      FirebasePlugin.onTokenRefresh(token => {
        // save this server-side and use it to push notifications to this device
        console.log(`Refreshed token: ${token}`);
        let youralert = this.alertCtrl.create({
          title: 'New Push notification',
          message: '9999'
        });
        youralert.present();
      }, function(error) {
        console.error(`Error: ${error}`);
        let youralert = this.alertCtrl.create({
          title: 'New Push notification',
          message: 'kkkkkkk'
        });
        youralert.present();
      });


      FirebasePlugin.onNotificationOpen(data => {
        // check notification contents and react accordingly
        console.log(JSON.stringify(data));
        if(data.wasTapped){
          let youralert = this.alertCtrl.create({
            title: 'New Push notification',
            message: data
          });
          youralert.present();
        }else{
          let youralert = this.alertCtrl.create({
            title: 'New Push notification',
            message: data
          });
          youralert.present();
        }
      }, function(error) {
        console.error(`Error: ${error}`);
        let youralert = this.alertCtrl.create({
          title: 'New Push notification',
          message: '5656'
        });
        youralert.present();
      });

    });
  }
}
