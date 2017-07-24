import { Component ,ViewChild, ElementRef} from '@angular/core';
import { NavController, NavParams ,AlertController, LoadingController, Loading , Platform } from 'ionic-angular';
import {SpeciesService} from '../../providers/species-service';
import { ListSpeciesPage } from '../list-species/list-species';
import { Geolocation } from 'ionic-native';
import { AuthService } from '../../providers/auth-service';
import {DomSanitizer} from '@angular/platform-browser';
import { Camera , CaptureVideoOptions, CaptureError} from 'ionic-native';


/*
  Generated class for the AddCompaint page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var google;

@Component({
  selector: 'page-add-species',
  templateUrl: 'add-species.html',
  providers: [SpeciesService]
})
export class AddSpeciesPage {

  @ViewChild('myvideo') myVideo: any;

  loading: Loading;
  public base64Images : Array<string> = [];
  species = {type: '', name:'', specname: '',lat:0,lng:0, location:'',datetime:new Date().toISOString(),user:0,anonymous:false};
  public imageCounter: number;

  username = '';
  email = '';
  userid=0;
  videoFilePath='';
  public videoPath = '';
    vidRecoded = false;

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  platform;

  marker;

  constructor(public navCtrl: NavController, public navParams: NavParams, public speciesService: SpeciesService,
    private alertCtrl: AlertController, private loadingCtrl: LoadingController, private auth: AuthService,
    private _DomSanitizer: DomSanitizer, platform: Platform) {
      this.platform = platform;
    this.imageCounter = 0;

    let newTime_date = new Date(this.species.datetime);
    newTime_date.setHours(newTime_date.getHours()+5);
    newTime_date.setMinutes(newTime_date.getMinutes()+30);
    this.species.datetime = newTime_date.toISOString();

    let typ = navParams.get("type");
    this.species.type = typ;

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
        mapTypeId: google.maps.MapTypeId.TERRAIN
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });

  }

  takePicture(){
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 640,
      targetHeight: 640,
      quality:90,
      correctOrientation: true
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Images[this.imageCounter++] = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }

/*  takeVideo() {
    let options: CaptureVideoOptions = { limit: 1 };
    MediaCapture.captureVideo(options).then((data: MediaFile[]) => {
      var i, path, len;
      for (i = 0, len = data.length; i < len; i += 1) {
        console.log(path);
        // data[i].fullPath = "file:/storage/extSdCard/DCIM/Camera/20160827_225041.mp4"
        // data[i].localURL = "cdvfile://localhost/root/storage/extSdCard/DCIM/Camera/20160827_225041.mp4"
        // How do I display this video to the user?
        this.videoFilePath = data[i].fullPath;
      }
      this.vidRecoded=true;
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
      video.src = data;
      this.videoPath=data;
      video.play();
    })
  }
*/
  selectPicture(){
    let options = {
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    };

    Camera.getPicture(options).then((imageData) => {
      this.base64Images[this.imageCounter++] = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  deletePicture(index){
    this.base64Images = [...this.base64Images.slice(0,index), ...this.base64Images.slice(index + 1)];
    this.imageCounter--;
  }

  deleteVideo(){
    this.videoPath = null;
    let video = this.myVideo.nativeElement;
    video.src=null;
    //this.vidRecoded=false;
  }


  addSpecies(){
    this.showLoading();
    if((this.species.name && this.imageCounter > 0)
      || (this.species.name && this.species.lat)
      || (this.species.name && this.species.specname)
      || (this.species.name && this.species.location)
      || (this.species.specname && this.imageCounter > 0)
      || (this.species.specname && this.species.lat)
      || (this.species.specname && this.species.location)
      || (this.species.location && this.imageCounter > 0)
      || (this.species.location && this.species.lat)){
      console.log("SAVING SPECIES");
      this.species.user=this.userid;
      this.speciesService.addSpecies(this.species, this.base64Images).then(success => {
        if (success) {
          if(this.videoPath){
            /*this.speciesService.upload(this.videoPath, success).then( success => {
              setTimeout(() => {
                this.loading.dismiss();
                this.navCtrl.setRoot(ListSpeciesPage);
              });

            }

          );*/
          }

          this.loading.dismiss();
          this.clearSpecies();
          this.navCtrl.setRoot(ListSpeciesPage);

        } else {
          this.clearSpecies();
          this.showError("Access Denied");
        }
      },
      error => {
        this.clearSpecies();
        this.showError(error);
      });
    }else{
      this.showError("Insufficient information");
    }
  }

  clearSpecies(){
    this.species.type = '';
    this.species.name = '';
    this.species.specname = '';
    this.species.lat = 0;
    this.species.lng = 0;
    this.species.location = '';
    this.species.datetime = '';
    this.species.user = 0;
    this.species.anonymous = false;
  }


  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Uploading Content (This will take a while depending on image/video sizes and your network connection)'
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
    if(this.marker)
           	this.marker.setMap(null)
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    this.species.lat = this.map.getCenter().lat();
    this.species.lng = this.map.getCenter().lng();


    let content = "<h4>Marked Place!</h4>";
    this.addInfoWindow(this.marker, content);
  }

  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  public exitApp(){
    this.platform.exitApp();
  }


}
