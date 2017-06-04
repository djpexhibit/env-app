import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { ViewSpeciesPage } from '../view-species/view-species';
import {SpeciesService} from '../../providers/species-service';
import {AddSpeciesPage} from '../add-species/add-species';
import {DomSanitizer} from '@angular/platform-browser';
import config from '../../app/config.json';


@Component({
	selector: 'page-list-species',
	templateUrl: 'list-species.html',
	providers: [SpeciesService]
})
export class ListSpeciesPage {

	public species: any;

	username = '';
	email = '';

	//adv = '';
	adv = config.main.baseUrl +  '/1.jpg';

	viewSpecies = ViewSpeciesPage;
	addSpecies = AddSpeciesPage;

  noInfoMsg:string = "Loading Species";

	constructor(private nav: NavController, private auth: AuthService, public speciesService: SpeciesService, private _DomSanitizer: DomSanitizer) {
		let info = this.auth.getUserInfo();
		this.username = info.name;
		this.email = info.email;

		this.loadSpecies(info.id);
		//this.loadAdv(Math.floor((Math.random() * 10) + 1));
		let adv_number = Math.floor((Math.random() * 10) + 1);
		this.adv = config.main.baseUrl + '/'+adv_number+'.jpg';
	}

	public logout() {
		this.auth.logout().subscribe(succ => {
			localStorage.setItem("logged",null);
			localStorage.setItem("currentUser",null);
			this.nav.setRoot(LoginPage)
		});
	}

	loadSpecies(id){
		this.speciesService.load(id)
		.then(data => {
			this.species = data;
      if(this.species.length ==0 ){
        this.noInfoMsg = "No Species Found.";
      }
		});
	}

	/*loadAdv(id){
		this.advService.load(id).then(data => {
			this.adv = data;
		})
	}*/
}
