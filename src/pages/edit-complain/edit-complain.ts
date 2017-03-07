import { Component ,ViewChild, ElementRef} from '@angular/core';
import { NavController, NavParams ,AlertController, LoadingController, Loading  } from 'ionic-angular';
import {Camera} from 'ionic-native';
import {ComplaintService} from '../../providers/complaint-service';
import { HomePage } from '../home/home';
import { Geolocation } from 'ionic-native';
import { AuthService } from '../../providers/auth-service';
import {DomSanitizer} from '@angular/platform-browser';


declare var google;

@Component({
  selector: 'page-edit-complain',
  templateUrl: 'edit-complain.html',
  providers: [ComplaintService]
})


export class EditComplainPage {


  loading: Loading;
	public base64Images : Array<string> = [];
	complaint = {person: '', details: '', type:'', action:'',lat:0,lng:0, location:'',user:0, pid: -1, aid: -1};
	public pollutionTypes: any;
	public expectedActions: any;
	public imageCounter: number;

	public complains : any;

	username = '';
	email = '';
	userid=0;


	@ViewChild('map') mapElement: ElementRef;
	map: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public complainService: ComplaintService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private auth: AuthService, private _DomSanitizer: DomSanitizer) {
		this.loadComplain(navParams.get("id"));

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
	}


	loadMap(lat,lng){
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
		this.complainService.loadComplain(comp_id).then(data => {
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

				if(this.complains && this.complains[0] && this.complains[0].lat){
					this.loadMap(this.complains[0].lat, this.complains[0].lng);
				}

			}else{
				this.showError("Please try again1");
			}

		},err => {
			this.showError("Please try again2");
		});

	}


}
