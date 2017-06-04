import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { LoginPage } from '../pages/login/login';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = LoginPage;

  constructor(platform: Platform, public _SplashScreen: SplashScreen) {
    platform.ready().then(() => {
      setTimeout(() => {
        this._SplashScreen.hide();
      }, 100);
      StatusBar.styleDefault();
    });
  }
}
