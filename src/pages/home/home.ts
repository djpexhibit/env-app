
import {Component} from '@angular/core';
import {NavController,AlertController,Loading, LoadingController, NavParams} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { ComplaintPage } from '../complaint/complaint';
import {ComplaintService} from '../../providers/complaint-service';
import {AddCompaintPage} from '../add-compaint/add-compaint';
import {DomSanitizer} from '@angular/platform-browser';
import config from '../../app/config.json';
import {ListSpeciesPage} from '../list-species/list-species';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ComplaintService]
})
export class HomePage {

  public complaints: any;

  postType:null

  username = '';
  email = '';
  userId = 0;

  selectedType = 'COMPLAIN';
  selectedTypes = [{id:'COMPLAIN', value:"Complains"},{id:'SPECIES', value:"Species"}]

  seletedComplainId = 0;
  showFAB = false;
  selectedFav = false;
  selectedIndex = 0;

  //adv = '';
  adv = config.main.baseUrl +  '/1.jpg';

  complaint = ComplaintPage;
  addComplaint = AddCompaintPage;

  noInfoMsg:string = "Loading";

  thumbsImg = './assets/img/thumbs.jpg';

  loading: Loading;

  constructor(private alertCtrl: AlertController,private nav: NavController,
    private auth: AuthService, public navParams: NavParams, public complaintService: ComplaintService, private _DomSanitizer: DomSanitizer, private loadingCtrl: LoadingController) {
    let info = this.auth.getUserInfo();
    this.username = info.name;
    this.email = info.email;
    this.userId = info.id;

    this.postType = navParams.get("type");

    //this.loadComplaints(info.id);
    //this.loadAdv(Math.floor((Math.random() * 10) + 1));
    let adv_number = Math.floor((Math.random() * 10) + 1);
    this.adv = config.main.baseUrl + '/'+adv_number+'.jpg';
  }

  ionViewDidEnter() {
    let info = this.auth.getUserInfo();
    this.username = info.name;
    this.email = info.email;

    if(this.postType === 'COMP'){
      this.loadComplaints(info.id);
    }else if(this.postType === 'FAV'){
      this.loadFavorites(info.id);
    }else{
      this.loadComplaints(info.id);
    }
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
        localStorage.setItem("logged",null);
        localStorage.setItem("currentUser",null);
        this.nav.setRoot(LoginPage);
    });
  }

  loadComplaints(id){
    this.complaintService.load(id)
      .then(data => {
        this.complaints = data;
        if(this.complaints.length == 0){
          this.noInfoMsg = "No Complains Found.";
        }
      });
    }

    loadFavorites(id){
      this.complaintService.loadFavorites(id)
        .then(data => {
          this.complaints = data;
          if(this.complaints.length == 0){
            this.noInfoMsg = "No Complains Found.";
          }
        });
      }

    onLongPress(e,id,fav, i){
      console.log(i)
      //this.showPopup("ss","ss "+id);
      if(this.showFAB){
        this.seletedComplainId = 0;
        this.showFAB = false;
        this.selectedFav = false;
        this.selectedIndex = 0;
      }else{
        this.seletedComplainId = id;
        this.showFAB = true;
        this.selectedFav = fav;
        this.selectedIndex  = i;
      }

    }

    closeFAB(){
      this.seletedComplainId = 0;
      this.showFAB=false;
      //fab.close();
    }

    showPopup(title, text) {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: text,
        buttons: [
         {
           text: 'OK',
           handler: data => {

           }
         }
       ]
      });
      alert.present();
    }

    getBackground (image) {
      return this._DomSanitizer.bypassSecurityTrustStyle(`url(${image})`);
    }

    toggleFavorite(){
      this.showLoading();
      this.selectedFav = !this.selectedFav;

      let fav={ compId:null, userId:null, isFavorite:false};
      fav.compId = this.seletedComplainId;
      fav.userId = this.userId;
      fav.isFavorite = this.selectedFav;

      this.complaints[this.selectedIndex].fav = !this.complaints[this.selectedIndex].fav;




      this.complaintService.addAsFavorite(fav).then(success => {
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

    getb () {
      return this._DomSanitizer.bypassSecurityTrustStyle(`5px groove yellow`);
    }

    getr(){
      return this._DomSanitizer.bypassSecurityTrustStyle(`no-repeat`);
    }

    getp(){
      return this._DomSanitizer.bypassSecurityTrustStyle(`center`);
    }

    getz(){
      return this._DomSanitizer.bypassSecurityTrustStyle(`100% auto`);
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

    navType(){
      if(this.selectedType === 'SPECIES')
      this.nav.push(ListSpeciesPage);
    }

  /*loadAdv(id){
    this.advService.load(id).then(data => {
      this.adv = data;
    })
  }*/
}
