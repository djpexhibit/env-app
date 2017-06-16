import { Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Gesture } from "ionic-angular/gestures/gesture";

/**
 * Generated class for the PressDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */

@Directive({
  selector: '[longPress]' // Attribute selector
})


export class PressDirective implements OnInit, OnDestroy {
  el: HTMLElement;
  pressGesture: Gesture;
  @Output('longPress') onPressRelease: EventEmitter<any> = new EventEmitter();

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  public theCallback() {

  }

  ngOnInit() {
   this.pressGesture = new Gesture(this.el);
   this.pressGesture.listen();

   // instead of this..
   this.pressGesture.on('press', (event) => {
     this.onPressRelease.emit('released');
   });

   // i want the callback to come from the template like this:
   // <ion-col (longPress)="showActionSheet(object)">
 }

 ngOnDestroy() {
   this.pressGesture.destroy();
 }
}
