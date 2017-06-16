
import {Component} from '@angular/core';
import {NavController,AlertController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { ComplaintPage } from '../complaint/complaint';
import {ComplaintService} from '../../providers/complaint-service';
import {AddCompaintPage} from '../add-compaint/add-compaint';
import {DomSanitizer} from '@angular/platform-browser';
import config from '../../app/config.json';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ComplaintService]
})
export class HomePage {

  public complaints: any;

  username = '';
  email = '';

  seletedComplainId = 0;
  showFAB = false;

  //adv = '';
  adv = config.main.baseUrl +  '/1.jpg';

  complaint = ComplaintPage;
  addComplaint = AddCompaintPage;

  noInfoMsg:string = "Loading";

  constructor(private alertCtrl: AlertController,private nav: NavController, private auth: AuthService, public complaintService: ComplaintService, private _DomSanitizer: DomSanitizer) {
    let info = this.auth.getUserInfo();
    this.username = info.name;
    this.email = info.email;

    //this.loadComplaints(info.id);
    //this.loadAdv(Math.floor((Math.random() * 10) + 1));
    let adv_number = Math.floor((Math.random() * 10) + 1);
    this.adv = config.main.baseUrl + '/'+adv_number+'.jpg';
  }

  ionViewDidEnter() {
    let info = this.auth.getUserInfo();
    this.username = info.name;
    this.email = info.email;
    this.loadComplaints(info.id);
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

    onLongPress(e,id){
      //this.showPopup("ss","ss "+id);
      this.seletedComplainId = id;
      this.showFAB = true;
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
           console.log("TOGGLING FAV")
         }

         getb () {
           console.log("DDDDDDDDDDDDDDDDDDd")
              return this._DomSanitizer.bypassSecurityTrustStyle(`5px groove yellow`);
              }




  /*loadAdv(id){
    this.advService.load(id).then(data => {
      this.adv = data;
    })
  }*/
}
