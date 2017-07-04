import { Component ,ViewChild, ElementRef} from '@angular/core';
import { NavController, NavParams ,AlertController, LoadingController, Loading  } from 'ionic-angular';
import {ComplaintService} from '../../providers/complaint-service';
import { HomePage } from '../home/home';
import { AuthService } from '../../providers/auth-service';
import {DomSanitizer} from '@angular/platform-browser';
import { Geolocation, Camera , CaptureVideoOptions, CaptureError} from 'ionic-native';



declare var google;

@Component({
  selector: 'page-edit-complain',
  templateUrl: 'edit-complain.html',
  providers: [ComplaintService]
})


export class EditComplainPage {

  @ViewChild('myvideo') myVideo: any;


  loading: Loading;
	public base64Images : Array<string> = [];
	complaint = {id:'',person: '', details: '', type:'', action:'',lat:0,lng:0, location:'',user:0, pid: -1, aid: -1,anonymous:false};
	public pollutionTypes: any;
	public expectedActions: any;
	public imageCounter: number;

	public complains : any;

	username = '';
	email = '';
	userid=0;
  videoFilePath;
  videoPath


	@ViewChild('map') mapElement: ElementRef;
	map: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public complainService: ComplaintService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private auth: AuthService, private _DomSanitizer: DomSanitizer) {
    let info = this.auth.getUserInfo();
		this.username = info.name;
		this.email = info.email;
		this.userid = info.id;

    this.loadComplain(navParams.get("id"));
    this.complaint.id = navParams.get("id");

		this.loadPollutionTypes();
		this.loadExpectedActions();
		this.imageCounter = 0;


	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddCompaintPage');
	}


/*  ionViewDidEnter(){
    let video = this.myVideo.nativeElement;
    video.src = 'http://139.59.58.196:3000/getvvv?id='+this.complaint.id+'&type=spec';
    video.load();
    video.play();
  }*/


	// loadMap(lat,lng){
	// 	Geolocation.getCurrentPosition().then((position) => {
  //
  //     let latLng = null;
  //     if(lat){
  //       latLng = new google.maps.LatLng(lat,lng);
  //     } else{
  //       latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //     }
  //
  //
	// 		let mapOptions = {
	// 			center: latLng,
	// 			zoom: 15,
	// 			mapTypeId: google.maps.MapTypeId.ROADMAP
	// 		}
  //
	// 		this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
	// 		this.addMarker();
	// 	}, (err) => {
	// 		console.log(err);
	// 	});
	// }

  loadMap(lat,lng){
    this.showLoadingGeneral();

    Geolocation.getCurrentPosition().then((position) => {

      let latLng = null;
      if(lat){
        latLng = new google.maps.LatLng(lat,lng);
      } else{
        latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      }
      let geocoder = new google.maps.Geocoder;

      geocoder.geocode({"location":latLng},(results,status) => {
        if(status === "OK"){
          if(results[0]){
            console.log(results[0].formatted_address);
            this.complaint.location = results[0].formatted_address;
            this.complaint.lat = position.coords.latitude;
            this.complaint.lng = position.coords.longitude;
            this.loading.dismiss();
          }
        }
      })

    }, (err) => {
      console.log(err);
      this.loading.dismiss();
    });

  }

  takePicture(){
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 320,
      targetHeight: 320,
      correctOrientation: true
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Images[this.imageCounter++] = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }

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


  updateComplain(){
    this.showLoading();
    console.log("UPDATING COMPLAIN");
    this.complaint.user=this.userid;
    this.complainService.updateComplain(this.complaint, this.base64Images).then(success => {
      if (success) {
        if(this.videoPath){
          /*this.complainService.upload(this.videoPath, success).then( success => {
            setTimeout(() => {
              this.loading.dismiss();
              this.navCtrl.setRoot(HomePage);
            });

          }

        );*/
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

  showLoadingGeneral() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading'
    });
    this.loading.present();
  }

  showError(text) {
    /*setTimeout(() => {
      this.loading.dismiss();
    });*/

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


	loadComplain(comp_id){
		this.complainService.loadComplain(comp_id, this.userid).then(data => {
    console.log(">>>>>>>"); console.log(data)
			if(data){

				this.complains = data;
        this.complaint.person = this.complains[0].res_person;
        this.complaint.details = this.complains[0].details;
        this.complaint.location = this.complains[0].location;
        this.complaint.action = this.complains[0].action;
        this.complaint.type = this.complains[0].type;
        this.complaint.pid = this.complains[0].pid;
        this.complaint.aid = this.complains[0].aid;

        this.complains.map(complain => {
          this.base64Images.push(complain.image);
          this.imageCounter++;
        });

				if(this.complains && this.complains[0]){
          if(this.complains[0].lat){

            this.loadMap(this.complains[0].lat, this.complains[0].lng);
          }else{
            this.loadMap(null, null);
          }

				}

			}else{
				this.showError("Please try again1");
			}

		},err => {
			this.showError("Please try again2");
		});

	}


/*  takeVideo() {
    let options: CaptureVideoOptions = { limit: 1 };
    MediaCapture.captureVideo(options).then((data: MediaFile[]) => {
      var i, path, len;
      for (i = 0, len = data.length; i < len; i += 1) {
        this.videoFilePath = data[i].fullPath;
      }
    },(err: CaptureError) => {
      console.error(err);
    }
  );
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
  }*/


}
