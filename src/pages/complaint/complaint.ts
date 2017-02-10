import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AddCompaintPage} from '../add-compaint/add-compaint';
import {ComplaintService} from '../../providers/complaint-service';

/*
  Generated class for the Complaint page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-complaint',
  templateUrl: 'complaint.html',
  providers: [ComplaintService]
})
export class ComplaintPage {

  complain = {
    res_person:'',
    details:'',
    type:'',
    image:''
  };
  public complains : any;

	addComplaint = AddCompaintPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public complaintService: ComplaintService) {
    this.loadComplain(navParams.get("id"))
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplaintPage');
  }

  loadComplain(comp_id){
    this.complaintService.loadComplain(comp_id)
      .then(data => {
        this.complains = data;
        console.log("DDDDDDDDDD");
        console.log(JSON.stringify(this.complains));
    });
  }

}
