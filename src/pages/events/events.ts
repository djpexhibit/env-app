import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import {EventService} from '../../providers/event-service';

/*
  Generated class for the Events page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
  providers: [EventService],

})
export class EventsPage {

  events;

  noInfoMsg="No Events Found";

  platform;

  constructor(public navCtrl: NavController, public navParams: NavParams, plaform: Platform, public eventService:EventService) {
    this.platform = Platform;
  }



  ionViewDidLoad() {
    this.loadEvents();
  }

  loadEvents(){
    this.eventService.load()
      .then(data => {
        this.events = data;
    });
  }

  public exitApp(){
    this.platform.exitApp();
  }

}
