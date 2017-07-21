import {Component} from '@angular/core';
import {NavController,Loading,AlertController, LoadingController, NavParams, Platform} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { ViewSpeciesPage } from '../view-species/view-species';
import {SpeciesService} from '../../providers/species-service';
import {AddSpeciesPage} from '../add-species/add-species';
import {DomSanitizer} from '@angular/platform-browser';
import config from '../../app/config.json';
import {HomePage} from '../home/home';


@Component({
	selector: 'page-list-species',
	templateUrl: 'list-species.html',
	providers: [SpeciesService]
})
export class ListSpeciesPage {

	public species: any;
	public tempSpecies: any;
  start; end;

	username = '';
	email = '';

	postType:null

	//adv = '';
	adv = config.main.baseUrl +  '/1.jpg';

	viewSpecies = ViewSpeciesPage;
	addSpecies = AddSpeciesPage;

  noInfoMsg:string = "Loading Species";

	loading: Loading;
	selectedFav = false;
	userId = 0;

	platform;

	constructor(private nav: NavController, private auth: AuthService, public alertCtrl: AlertController ,
		public loadingCtrl:LoadingController ,public speciesService: SpeciesService, private _DomSanitizer: DomSanitizer,
		 platform: Platform,public navParams: NavParams) {
			this.platform = platform;
		let info = this.auth.getUserInfo();
		this.username = info.name;
		this.email = info.email;
		this.userId = info.id;

		this.start = 0;
    this.end = 15;

		this.postType = navParams.get("type");


		if(this.postType === 'SPEC'){
      this.loadSpecies(info.id);
    }else if(this.postType === 'FAV'){
      this.loadFavorites(info.id);
    }else{
      this.loadSpecies(info.id);
    }

		//this.loadAdv(Math.floor((Math.random() * 10) + 1));
		let adv_number = Math.floor((Math.random() * 10) + 1);
		this.adv = config.main.baseUrl + '/'+adv_number+'.jpg';


	}

	ionViewDidEnter(){
		console.log("test")
	}

	public logout() {
		this.auth.logout().subscribe(succ => {
			localStorage.setItem("logged",null);
			localStorage.setItem("currentUser",null);
			this.nav.setRoot(LoginPage)
		});
	}

	// loadSpecies(id){
	// 	this.speciesService.load(id)
	// 	.then(data => {
	// 		this.species = data;
  //     if(this.species.length ==0 ){
  //       this.noInfoMsg = "No Species Found.";
  //     }
	// 	});
	// }

	loadSpecies(id){
    this.tempSpecies=[];
    this.speciesService.loadChunk(id,this.start,this.end)
      .then(data => {
        console.log(data);
        this.tempSpecies = data;
        if(this.tempSpecies && this.tempSpecies.length >0){
          if(!this.species || this.species.length === 0){
            this.species = data;
          }else{
            this.species = this.species.concat(this.tempSpecies);

          }
          this.start += 15;
          this.end = 15;
        }

        if(this.species.length == 0){
          this.noInfoMsg = "No Species Found.";
        }
      });
    }


	toggleFavorite(specId,index){
		this.showLoading();
		this.selectedFav = !this.selectedFav;

		let fav={ specId:null, userId:null, isFavorite:false};
		fav.specId = specId;
		fav.userId = this.userId;


		this.species[index].fav = !this.species[index].fav;
		fav.isFavorite = this.species[index].fav;



		this.speciesService.addAsFavorite(fav).then(success => {
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

	/*loadAdv(id){
		this.advService.load(id).then(data => {
			this.adv = data;
		})
	}*/

	public exitApp(){
    this.platform.exitApp();
  }

	backHome(){
		//this.navCtrl.pop();


	if(this.postType === 'SPEC'){
		this.nav.push(HomePage); // previous view will be cached
		this.nav.push(HomePage,);
	}else if(this.postType === 'FAV'){
		this.nav.push(HomePage,{
      type: 'FAV'
    }); // previous view will be cached
	this.nav.push(HomePage,{
		type: 'FAV'
	});
	}else{
		this.nav.push(HomePage); // previous view will be cached
		this.nav.push(HomePage);
	}
	}


		doInfinite(infiniteScroll) {
			setTimeout(() => {
				let info = this.auth.getUserInfo();
				if(this.postType === 'SPEC'){
					this.loadSpecies(info.id);
				}else if(this.postType === 'FAV'){
					this.loadFavorites(info.id);
				}else{
					this.loadSpecies(info.id);
				}
				infiniteScroll.complete();
			}, 5000);
	}



	loadFavorites(id){
		this.tempSpecies=[];
		this.speciesService.loadFavoritesSpeciesChunk(id,this.start,this.end)
			.then(data => {
				console.log(data);
				this.tempSpecies = data;
				if(this.tempSpecies && this.tempSpecies.length >0){
					if(!this.species || this.species.length === 0){
						this.species = data;
					}else{
						this.species = this.species.concat(this.tempSpecies);

					}
					this.start += 15;
					this.end = 15;
				}

				if(this.species.length == 0){
					this.noInfoMsg = "No Complains Found.";
				}
			});
		}

		getImgUrl(id){
			let loc = config.main.baseUrl + '/species/thumb/'+id+'_0_thumb.jpg';

      return this._DomSanitizer.bypassSecurityTrustUrl(loc);
		}
}
