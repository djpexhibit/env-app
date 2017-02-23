import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams ,AlertController, LoadingController, Loading  } from 'ionic-angular';
import {AddCompaintPage} from '../add-compaint/add-compaint';
import {ComplaintService} from '../../providers/complaint-service';
import { Geolocation } from 'ionic-native';
import {DomSanitizer} from '@angular/platform-browser';


/*
  Generated class for the Complaint page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var google;

@Component({
  selector: 'page-complaint',
  templateUrl: 'complaint.html',
  providers: [ComplaintService]
})
export class ComplaintPage {

  loading: Loading;
  complain = {
    res_person:'',
    details:'',
    type:'',
    image:''
  };
  comment = {
    type:'USER',
    details:'',
    user_id:1,
    complain_id:0
  }
  public complains : any;
  public comments : any;
  complainId:any;

	addComplaint = AddCompaintPage;

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public complaintService: ComplaintService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private _DomSanitizer: DomSanitizer) {

    this.loadComplain(navParams.get("id"));
    this.loadComments(navParams.get("id"));

    this.complainId = navParams.get("id");
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad AddCompaintPage');
    

  }

  loadMap(lat,lng){
console.log(">>>>>>>>>>>>");
  Geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(lat,lng);

    
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.addMarker();

      }, (err) => {
      console.log(err);
    });
  }

  addMarker(){
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Marked Place!</h4>";
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  loadComplain(comp_id){
    this.complaintService.loadComplain(comp_id)
      .then(data => {
      
        if(data){
        this.complains = data;

          if(this.complains && this.complains[0] && this.complains[0].lat){
            this.loadMap(this.complains[0].lat, this.complains[0].lng);
          }
         }else{
          this.showError("Please try again");
         }
    },err => {
      
          this.showError("Please try again");
    });
  }

  loadComments(comp_id){
    this.complaintService.loadComments(comp_id)
      .then(data => {
        this.comments = data;
    });
  }

  addComment(){
    this.showLoading();
    this.comment.complain_id = this.complainId;
    this.complaintService.addComment(this.comment).then(success => {
      if (success) {
        setTimeout(() => {
          this.loading.dismiss();
          this.loadComments(this.complainId);
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
