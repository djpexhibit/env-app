import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AddCompaintPage } from '../add-compaint/add-compaint';
import { AddSpeciesPage } from '../add-species/add-species';

@Component({
  selector: 'page-select-task',
  templateUrl: 'select-task.html'
})
export class SelectTaskPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectTaskPage');
  }

  addComplain(){
    this.navCtrl.push(AddCompaintPage);
  }

  addAnimal(){
    this.navCtrl.push(AddSpeciesPage,{type:"Animal"});
  }

  addPlant(){
    this.navCtrl.push(AddSpeciesPage,{type:"Plant"});
  }

}
