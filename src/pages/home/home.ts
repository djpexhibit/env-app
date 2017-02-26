
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { ComplaintPage } from '../complaint/complaint';
import {ComplaintService} from '../../providers/complaint-service';
import {AddCompaintPage} from '../add-compaint/add-compaint';
import {DomSanitizer} from '@angular/platform-browser';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ComplaintService]
})
export class HomePage {

  public complaints: any;

  username = '';
  email = '';

  complaint = ComplaintPage;
  addComplaint = AddCompaintPage;

  constructor(private nav: NavController, private auth: AuthService, public complaintService: ComplaintService, private _DomSanitizer: DomSanitizer) {
    let info = this.auth.getUserInfo();
    this.username = info.name;
    this.email = info.email;

    this.loadComplaints(info.id);
  }
 
  public logout() {
    this.auth.logout().subscribe(succ => {
        this.nav.setRoot(LoginPage)
    });
  }

  loadComplaints(id){
    this.complaintService.load(id)
      .then(data => {
        this.complaints = data;
      });
    }
}