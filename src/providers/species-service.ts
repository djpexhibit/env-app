import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import config from '../app/config.json';
//import { Transfer } from 'ionic-native';
//import { Platform } from 'ionic-angular';

@Injectable()
export class SpeciesService {

	data = null;
	specie = null;
	success = null;
	comments = null;

	constructor(public http: Http) {
		console.log('Hello ComplaintService Provider');
	}


	load(id) {
		if (this.data) {
			// already loaded data
			return Promise.resolve(this.data);
		}

		// don't have the data yet
		return new Promise(resolve => {
			this.http.post(config.main.baseUrl + '/loadSpecies',{user_id:id})
			.map(res => res.json())
			.subscribe(data => {
				console.log(data);
				this.data = data;
				resolve(this.data);
			});
		});
	}

	loadChunk(id,start,end,term) {
		/*if (this.data) {
			return Promise.resolve(this.data);
		*/
		return new Promise(resolve => {
			this.http.post(config.main.baseUrl + '/loadSpeciesChunk',{user_id:id, start:start, end:end,term:term})
				.map(res => res.json())
				.subscribe(data => {
					console.log(data);
					this.data = data;
					resolve(this.data);
				});
			});
		}



	loadSpecies(spec_id,userId){
		return new Promise(resolve => {
			this.http.post(config.main.baseUrl + '/loadSpecie',{spec_id:spec_id , userId:userId})
			.map(res => res.json())
			.subscribe(data => {
				this.specie = data;
				resolve(this.specie);
			}, err=> {
				this.specie = null;
				resolve(this.specie);
			});
		});
	}

	loadFavoritesSpeciesChunk(id,start,end,term) {

		return new Promise(resolve => {
			this.http.post(config.main.baseUrl + '/loadFavoriteSpeciesChunk',{user_id:id, start:start, end:end, term:term})
				.map(res => res.json())
				.subscribe(data => {
					console.log(data);
					this.data = data;
					resolve(this.data);
				});
			});
		}

		loadFilteredSpeciesChunk(id,term,start,end){
			return new Promise(resolve => {
				this.http.post(config.main.baseUrl + '/loadFilteredSpeciesChunk',{user_id:id,term:term, start:start, end:end})
					.map(res => res.json())
					.subscribe(data => {
						console.log(data);
						this.data = data;
						resolve(this.data);
					});
				});
		}



	loadComments(spec_id){
		return new Promise(resolve => {
			this.http.post(config.main.baseUrl + '/loadSpeciesComments',{spec_id:spec_id})
			.map(res => res.json())
			.subscribe(data => {
				console.log(JSON.stringify(data));
				this.comments = data;
				resolve(this.comments);
			});
		});
	}


	/*upload(path, specId) {
		this.platform.ready().then(()=>{
		let options = {
			fileKey: 'file',
			fileName: 'vidSpec_'+specId.id+'.mp4',
			headers: {}
		};

		const fileTransfer = new Transfer();

		return new Promise(resolve => {
			fileTransfer.upload(path, config.main.baseUrl + '/addVideo', options).then((data) => {
				resolve(data);
			}, (err) => {
				// error
			})
		});
});
	}*/



	addSpecies(specie,base64Images){
		console.log("ADDING");
		let toSend = {
			specie:specie,
			images:base64Images
		}

		return new Promise( resolve => {
			this.http.post(config.main.baseUrl + '/addSpecies',{details:toSend})
			.map(res => res.json())
			.subscribe(data => {
				console.log(data);
				this.success = data;
				resolve(this.success);
			})
		});
	}


	updateSpecies(specie,base64Images){
		console.log("UPDATING");
		let toSend = {
			specie:specie,
			images:base64Images
		}

		return new Promise( resolve => {
			this.http.post(config.main.baseUrl + '/updateSpecie',{details:toSend})
			.map(res => res.json())
			.subscribe(data => {
				console.log(data);
				this.success = data;
				resolve(this.success);
			})
		});
	}


	addComment(comment){
		return new Promise( resolve => {
			this.http.post(config.main.baseUrl + '/addSpeciesComment',{details:comment})
			.map(res => res.json())
			.subscribe(data => {
				console.log(data);
				this.success = data;
				resolve(this.success);
			})
		});
	}

	addAsFavorite(fav){
		return new Promise( resolve => {
			this.http.post(config.main.baseUrl + '/addAsFavoriteSpec',{fav:fav})
				.map(res => res.json())
				.subscribe(data => {
					console.log(data);
					this.success = data;
					resolve(this.success);
				})
		});
	}

}
