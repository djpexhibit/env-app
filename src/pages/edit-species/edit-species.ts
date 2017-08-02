import { Component ,ViewChild, ElementRef} from '@angular/core';
import { NavController, NavParams ,AlertController, LoadingController, Loading , Platform } from 'ionic-angular';
import {SpeciesService} from '../../providers/species-service';
import { HomePage } from '../home/home';
import { AuthService } from '../../providers/auth-service';
import {DomSanitizer} from '@angular/platform-browser';
import { Geolocation, Camera , CaptureVideoOptions, CaptureError} from 'ionic-native';
import { ListSpeciesPage } from '../list-species/list-species';



declare var google;

@Component({
	selector: 'page-edit-species',
	templateUrl: 'edit-species.html',
	providers: [SpeciesService]
})


export class EditSpeciesPage {

  @ViewChild('myvideo') myVideo: any;

  loading: Loading;
	public base64Images : Array<string> = [];
	specie = {id:'',name: '', specname: '', type:'',lat:0,lng:0, location:'',datetime:'',user:0};
	public imageCounter: number;

	public species : any;

	username = '';
	email = '';
	userid=0;
  videoFilePath;
  videoPath;

	@ViewChild('map') mapElement: ElementRef;
	map: any;

	platform;
	constructor(public navCtrl: NavController, public navParams: NavParams, public speciesService: SpeciesService,
		private alertCtrl: AlertController, private loadingCtrl: LoadingController, private auth: AuthService,
		private _DomSanitizer: DomSanitizer, platform: Platform) {
			this.platform = platform;
		let info = this.auth.getUserInfo();
		this.username = info.name;
		this.email = info.email;
		this.userid = info.id;

		this.loadSpecies(navParams.get("id"));
		this.specie.id = navParams.get("id");

		this.imageCounter = 0;


	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddCompaintPage');
	}

  /*ionViewDidEnter(){
    let video = this.myVideo.nativeElement;
    video.src = 'http://139.59.58.196:3000/getvvv?id='+this.specie.id+'&type=spec';
    video.load();
    video.play();
  }*/


	loadMap(lat,lng){
		Geolocation.getCurrentPosition().then((position) => {

      let latLng = null;
      if(lat){
        latLng = new google.maps.LatLng(lat,lng);
      } else{
        latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      }


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

  takePicture(){
    Camera.getPicture({
			destinationType: Camera.DestinationType.DATA_URL,
      quality: 90,
      targetWidth: 640,
      targetHeight: 640,
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


  updateSpecies(){
    this.showLoading();
    console.log("UPDATING SPECIES");
    this.specie.user=this.userid;
    this.speciesService.updateSpecies(this.specie, this.base64Images).then(success => {
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
        this.navCtrl.setRoot(ListSpeciesPage);

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
			content: `<div>
									<div><img src='./assets/img/logo.jpg' /></div>
									<div>Uploading Content (This will take a while depending on image sizes and your network connection)</div>
								</div>`
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

    this.species.lat = this.map.getCenter().lat();
    this.species.lng = this.map.getCenter().lng();


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


	loadSpecies(spec_id){
		this.speciesService.loadSpecies(spec_id, this.userid).then(data => {
			if(data){

				this.species = data;
        this.specie.name = this.species[0].name;
        this.specie.specname = this.species[0].specname;
        this.specie.location = this.species[0].location;
        this.specie.type = this.species[0].type;
				this.specie.datetime = this.species[0].datetime;


        this.species.map(species => {
          this.base64Images.push(species.image);
          this.imageCounter++;
        });

				if(this.species && this.species[0]){
          if(this.species[0].lat){

            this.loadMap(this.species[0].lat, this.species[0].lng);
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

	public exitApp(){
    this.platform.exitApp();
  }

}
