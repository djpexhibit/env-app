import { Component ,ViewChild, ElementRef} from '@angular/core';
import { NavController, NavParams ,AlertController, LoadingController, Loading  } from 'ionic-angular';
import {ComplaintService} from '../../providers/complaint-service';
import { HomePage } from '../home/home';
import { Geolocation } from 'ionic-native';
import { AuthService } from '../../providers/auth-service';
import {DomSanitizer} from '@angular/platform-browser';
import { MediaCapture, Camera , CaptureVideoOptions, MediaFile, CaptureError} from 'ionic-native';


/*
  Generated class for the AddCompaint page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var google;

@Component({
  selector: 'page-add-compaint',
  templateUrl: 'add-compaint.html',
  providers: [ComplaintService]
})
export class AddCompaintPage {

  @ViewChild('myvideo') myVideo: any;

  loading: Loading;
  public base64Images : Array<string> = [];
  complaint = {person: '', details: '', type:'', action:'',lat:0,lng:0, location:'',user:0};
  public pollutionTypes: any;
  public expectedActions: any;
  public imageCounter: number;

  username = '';
  email = '';
  userid=0;
  videoFilePath='';
  public videoPath = '';

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public complainService: ComplaintService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private auth: AuthService, private _DomSanitizer: DomSanitizer, private mediaCapture: MediaCapture) {
    this.loadPollutionTypes();
    this.loadExpectedActions();
    this.imageCounter = 0;

    let info = this.auth.getUserInfo();
    this.username = info.name;
    this.email = info.email;
    this.userid = info.id;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCompaintPage');
    this.loadMap();
  }

  loadMap(){

    Geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);


      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });

  }

  takePicture(){
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 320,
      targetHeight: 320
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Images[this.imageCounter++] = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  takeVideo() {
    let options: CaptureVideoOptions = { limit: 1, duration: 10, quality:0 };
    MediaCapture.captureVideo(options).then((data: MediaFile[]) => {
      var i, path, len;
      for (i = 0, len = data.length; i < len; i += 1) {
        console.log(path);
        // data[i].fullPath = "file:/storage/extSdCard/DCIM/Camera/20160827_225041.mp4"
        // data[i].localURL = "cdvfile://localhost/root/storage/extSdCard/DCIM/Camera/20160827_225041.mp4"
        // How do I display this video to the user?
        this.videoFilePath = data[i].fullPath;
      }
    },(err: CaptureError) => {
      console.error(err);
    }
  );
  }



  startrecording() {
    MediaCapture.captureVideo((videodata) => {
      //this.base64Video = 'data:video/mp4;base64,'+videodata;
      alert(JSON.stringify(videodata));
    })
  }

  selectvideo() {
    let video = this.myVideo.nativeElement;
    var options = {
      sourceType: 2,
      mediaType: 1
    };

    Camera.getPicture(options).then((data) => {
      //this.showError(video.size);
      video.src = data;
      this.videoPath=data;
      video.play();
    })
  }

  deletePicture(index){
    this.base64Images = [...this.base64Images.slice(0,index), ...this.base64Images.slice(index + 1)];
    this.imageCounter--;
  }


  loadPollutionTypes(){
    this.complainService.loadPollutionTypes()
      .then(data => {
        this.pollutionTypes = data;
        console.log(this.pollutionTypes);
      });
  }

  loadExpectedActions(){
    this.complainService.loadExpectedActions()
      .then(data => {
        this.expectedActions = data;
        console.log(this.expectedActions);
      });
  }


  addComplain(){
    this.showLoading();
    console.log("SAVING COMPLAIN");
    this.complaint.user=this.userid;
    this.complainService.addComplain(this.complaint, this.base64Images).then(success => {
      if (success) {
        if(this.videoPath){
          this.complainService.upload(this.videoPath, success).then( success => {
            setTimeout(() => {
              this.loading.dismiss();
              this.navCtrl.setRoot(HomePage);
            });

          }

          );
        }

        this.loading.dismiss();
        this.navCtrl.setRoot(HomePage);

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


  addMarker(){
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    this.complaint.lat = this.map.getCenter().lat();
    this.complaint.lng = this.map.getCenter().lng();


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



}
