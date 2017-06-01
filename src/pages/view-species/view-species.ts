import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams ,AlertController, LoadingController, Loading  } from 'ionic-angular';
import {AddSpeciesPage} from '../add-species/add-species';
import {EditSpeciesPage} from '../edit-species/edit-species';
import {SpeciesService} from '../../providers/species-service';
import { Geolocation } from 'ionic-native';
import {DomSanitizer} from '@angular/platform-browser';
import { AuthService } from '../../providers/auth-service';
import config from '../../app/config.json';


declare var google;

@Component({
	selector: 'page-view-species',
	templateUrl: 'view-species.html',
	providers: [SpeciesService],
	styles:[`
		.admin_comment{
			background-color:#617d87;
			color:#ffffff
		}
	`]
})
export class ViewSpeciesPage {

	@ViewChild('myvideo') myVideo: any;

	loading: Loading;
	specie = {
		name:'',
		details:'',
		type:'',
		image:''
	};

	comment = {
		type:'USER',
		details:'',
		user_id:0,
		species_id:0
	}

	public species : any;
	public comments : any;
	speciesId:any;

	userId = 0;
	adv = config.main.baseUrl +  '/1.jpg';

	addSpecies = AddSpeciesPage;
	editSpecies = EditSpeciesPage;

	@ViewChild('map') mapElement: ElementRef;
	map: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public speciesService: SpeciesService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private _DomSanitizer: DomSanitizer, private auth: AuthService) {

		this.comment.user_id=this.auth.getUserInfo().id;
		this.loadSpecies(navParams.get("id"));
		this.loadComments(navParams.get("id"));

		this.userId = this.auth.getUserInfo().id;

		this.speciesId = navParams.get("id");

		let adv_number = Math.floor((Math.random() * 10) + 1);
		this.adv = config.main.baseUrl + '/'+adv_number+'.jpg';

	}

	/*ionViewDidEnter() {
		console.log('ionViewDidLoad AddCompaintPage');
		let video = this.myVideo.nativeElement;
		video.src = 'http://139.59.58.196:3000/getvvv?id='+this.speciesId+'&type=spec';
		video.load();
		video.play();
	}*/

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

	loadSpecies(spec_id){
		this.speciesService.loadSpecies(spec_id)
		.then(data => {
			if(data){
				this.species = data;

				if(this.species && this.species[0] && this.species[0].lat){
					this.loadMap(this.species[0].lat, this.species[0].lng);
				}
			}else{
				this.showError("Please try again");
			}
		},err => {
			this.showError("Please try again");
		});
	}

	loadComments(spec_id){
		this.speciesService.loadComments(spec_id)
		.then(data => {
			this.comments = data;
		});
	}

	addComment(){
		this.showLoading();

		if(!this.comment.details){
			this.showError("Please enter details");
		}

		this.comment.species_id = this.speciesId;
		this.speciesService.addComment(this.comment).then(success => {
			if (success) {
				setTimeout(() => {
					this.loading.dismiss();
					this.loadComments(this.speciesId);
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

}
