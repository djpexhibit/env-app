import { Component } from '@angular/core';
import { NavController, NavParams ,AlertController, LoadingController, Loading  } from 'ionic-angular';
import {Camera} from 'ionic-native';
import {ComplaintService} from '../../providers/complaint-service';
import { HomePage } from '../home/home';

/*
  Generated class for the AddCompaint page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-compaint',
  templateUrl: 'add-compaint.html',
  providers: [ComplaintService]
})
export class AddCompaintPage {

  loading: Loading;
  public base64Images : Array<string> = [];
  complaint = {person: '', details: '', type:'', action:''};
  public pollutionTypes: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public complainService: ComplaintService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.loadPollutionTypes();
    this.base64Images[0] = 'def';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCompaintPage');
  }

  takePicture(){
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 320,
      targetHeight: 320
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Images[0] = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }


  loadPollutionTypes(){
    this.complainService.loadPollutionTypes()
      .then(data => {
        this.pollutionTypes = data;
        console.log(this.pollutionTypes);
      });
  }


  addComplain(){
    this.showLoading();
    console.log("SAVING COMPLAIN");
    this.complainService.addComplain(this.complaint, this.base64Images).then(allowed => {
      if (allowed) {
        setTimeout(() => {
          this.loading.dismiss();
          this.navCtrl.setRoot(HomePage)
        });
      } else {
        this.showError("Access Denied");
      }
    },
    error => {
      this.showError(error);
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
