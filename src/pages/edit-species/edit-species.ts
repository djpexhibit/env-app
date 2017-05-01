import { Component ,ViewChild, ElementRef} from '@angular/core';
import { NavController, NavParams ,AlertController, LoadingController, Loading  } from 'ionic-angular';
import {Camera} from 'ionic-native';
import {SpeciesService} from '../../providers/species-service';
import { HomePage } from '../home/home';
import { Geolocation } from 'ionic-native';
import { AuthService } from '../../providers/auth-service';
import {DomSanitizer} from '@angular/platform-browser';

declare var google;

@Component({
	selector: 'page-edit-species',
	templateUrl: 'edit-species.html',
	providers: [SpeciesService]
})


export class EditSpeciesPage {


  loading: Loading;
	public base64Images : Array<string> = [];
	specie = {id:'',name: '', details: '', type:'',lat:0,lng:0, location:'',user:0};
	public imageCounter: number;

	public species : any;

	username = '';
	email = '';
	userid=0;


	@ViewChild('map') mapElement: ElementRef;
	map: any;


	constructor(public navCtrl: NavController, public navParams: NavParams, public speciesService: SpeciesService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private auth: AuthService, private _DomSanitizer: DomSanitizer) {
		this.loadSpecies(navParams.get("id"));
		this.specie.id = navParams.get("id");

		this.imageCounter = 0;

		let info = this.auth.getUserInfo();
		this.username = info.name;
		this.email = info.email;
		this.userid = info.id;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddCompaintPage');
	}


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
      targetWidth: 320,
      targetHeight: 320
    }).then((imageData) => {
      // imageData is a base64 encoded string
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
		this.speciesService.loadSpecies(spec_id).then(data => {
			if(data){
        
				this.species = data;
        this.specie.name = this.species[0].name;
        this.specie.details = this.species[0].details;
        this.specie.location = this.species[0].location;
        this.specie.type = this.species[0].type;
      

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


}
