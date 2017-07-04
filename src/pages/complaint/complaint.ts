import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams ,AlertController, LoadingController, Loading  } from 'ionic-angular';
import {AddCompaintPage} from '../add-compaint/add-compaint';
import {EditComplainPage} from '../edit-complain/edit-complain';
import {HomePage} from '../home/home';
import {ComplaintService} from '../../providers/complaint-service';
import { Geolocation } from 'ionic-native';
import {DomSanitizer} from '@angular/platform-browser';
import { AuthService, User } from '../../providers/auth-service';
import config from '../../app/config.json';
import { SocialSharing } from '@ionic-native/social-sharing';


/*
  Generated class for the Complaint page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var google;

@Component({
  selector: 'page-complaint',
  templateUrl: 'complaint.html',
  providers: [ComplaintService],
  styles:[`
    .admin_comment{
      background-color:#617d87;
      color:#ffffff
    }
  `]
})
export class ComplaintPage {

   @ViewChild('myvideo') myVideo: any;

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
    user_id:0,
    complain_id:0
  }
  public complains : any;
  public comments : any;
  complainId:any;

  userId = 0;
  adv = config.main.baseUrl +  '/1.jpg';

	addComplaint = AddCompaintPage;
  editComplain = EditComplainPage;
  home = HomePage;

  hideMap = true;

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public complaintService: ComplaintService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private _DomSanitizer: DomSanitizer, private auth: AuthService, private sharingVar: SocialSharing) {

    this.userId = this.auth.getUserInfo().id;

    let u = this.auth.getUserInfo();
    this.comment.user_id=u.id;
    this.comment.type = u.type;

    if(u.type === 'Media' || u.type === 'Expert'){
      this.comment.type = 'EXPERT';
    }





    this.complainId = navParams.get("id");

    let adv_number = Math.floor((Math.random() * 10) + 1);
    this.adv = config.main.baseUrl + '/'+adv_number+'.jpg';


  }

  ionViewDidLoad(){
    this.loadComplain(this.navParams.get("id"));
    this.loadComments(this.navParams.get("id"));
  }

  /*ionViewDidEnter() {
    console.log('ionViewDidLoad AddCompaintPage');
    let video = this.myVideo.nativeElement;
    video.src = 'http://139.59.58.196:3000/getvvv?id='+this.complainId;
    video.load();
    video.play();

  }*/

  loadMap(lat,lng){
  Geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(lat,lng);


      let mapOptions = {
        center: latLng,
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.addMarker();

      }, (err) => {
      console.log(err);
    });
  }


  toggleMap(){
    if(this.hideMap){
      this.loadMap(this.complains[0].lat, this.complains[0].lng);
      this.hideMap = false;
    }else{
      this.hideMap=true;
    }
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
    this.complaintService.loadComplain(comp_id, this.userId)
      .then(data => {

        if(data){
        this.complains = data;

          // if(this.complains && this.complains[0] && this.complains[0].lat){
          //   this.loadMap(this.complains[0].lat, this.complains[0].lng);
          // }
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

    if(!this.comment.details){
      this.showError("Please enter details"); return;
    }

    this.comment.complain_id = this.complainId;
    this.complaintService.addComment(this.comment).then(success => {
      if (success) {
        setTimeout(() => {
          this.loading.dismiss();
          this.loadComments(this.complainId);
          this.comment.details="";
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


  checkAdminComment(comment){
    if(comment.type === 'ADMIN') return true
    else return false;
  }

  loadComplaints(id){
    this.complaintService.load(id)
      .then(data => {
        //dummy
      });
    }

    backHome(){
      //this.navCtrl.pop();
      this.navCtrl.setRoot(HomePage); // previous view will be cached
    this.navCtrl.setRoot(HomePage);
    }


    addAsFavorite(){
      this.showLoading();

      let fav={ compId:null, userId:null};
      fav.compId = this.complainId;
      fav.userId = this.userId;

      this.complaintService.addAsFavorite(fav).then(success => {
        if (success) {
          setTimeout(() => {
            this.loading.dismiss();
          });
        } else {
          this.showError("Please try again");
        }
      },
      error => {
        this.showError(error);
      });
    }


    toggleFavorite(){
      this.showLoading();

      let fav={ compId:null, userId:null, isFavorite:false};
      fav.compId = this.complains[0].id;
      fav.userId = this.userId;

      this.complains[0].fav = !this.complains[0].fav;

      fav.isFavorite = this.complains[0].fav;


      this.complaintService.addAsFavorite(fav).then(success => {
        if (success) {
          setTimeout(() => {
            this.loading.dismiss();
          });
        } else {
          this.showError("Please try again");
        }
      },
      error => {
        this.showError(error);
      });
    }

    facebookShare(){
      this.sharingVar.shareViaFacebookWithPasteMessageHint(this.complains[0].details,this.complains[0].image,this.complains[0].details,"https://play.google.com/store/apps/details?id=com.ionicframework.envapp657580")
      .then(()=>{
        alert("Success");
      },
      ()=>{
         alert("failed")
      })
  }

}
