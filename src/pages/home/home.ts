
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { ComplaintPage } from '../complaint/complaint';
import {ComplaintService} from '../../providers/complaint-service';
 
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

  items = [
    'Pokémon Yellow',
    'Super Metroid',
    'Mega Man X',
    'The Legend of Zelda',
    'Pac-Man',
    'Super Mario World',
    'Street Fighter II',
    'Half Life',
    'Final Fantasy VII',
    'Star Fox',
    'Tetris',
    'Donkey Kong III',
    'GoldenEye 007',
    'Doom',
    'Fallout',
    'GTA',
    'Halo'
  ];


  constructor(private nav: NavController, private auth: AuthService, public complaintService: ComplaintService) {
    let info = this.auth.getUserInfo();
    this.username = info.name;
    this.email = info.email;

    this.loadComplaints();
  }
 
  public logout() {
    this.auth.logout().subscribe(succ => {
        this.nav.setRoot(LoginPage)
    });
  }

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }

  loadComplaints(){
    this.complaintService.load()
      .then(data => {
        this.complaints = data;
        console.log(this.complaints);
      });
    }
}