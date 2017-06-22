import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Events page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {

  events = [
    {
      title : "Event 1",
      date: "2017-01-01",
      location: "Colombo"
    },
    {
      title : "Event 2",
      date: "2017-01-02",
      location: "Colombo"
    }
  ];

  noInfoMsg="No Events Found";

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }

}
