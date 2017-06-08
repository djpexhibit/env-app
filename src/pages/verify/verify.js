var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthService } from '../../providers/auth-service';
export var VerifyPage = (function () {
    function VerifyPage(nav, navParams, auth, alertCtrl, loadingCtrl) {
        this.nav = nav;
        this.navParams = navParams;
        this.auth = auth;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.createSuccess = false;
        this.verifyCredentials = { mobile: '', mobileCode: '' };
        this.verifyCredentials.mobile = navParams.get("mobile");
    }
    VerifyPage.prototype.verify = function () {
        var _this = this;
        this.showLoading();
        this.auth.verifyMobileCode(this.verifyCredentials).then(function (mobileCheck) {
            if (mobileCheck["status"] === 'OK' && mobileCheck["msg"] && mobileCheck["msg"] === 'VERIFIED') {
                setTimeout(function () {
                    _this.loading.dismiss();
                    _this.nav.setRoot(LoginPage);
                });
            }
            else {
                _this.showError("Error");
            }
        }, function (error) {
            _this.showError("Please try again");
        });
    };
    VerifyPage.prototype.showLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
    };
    VerifyPage.prototype.showError = function (text) {
        var _this = this;
        setTimeout(function () {
            _this.loading.dismiss();
        });
        var alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present(prompt);
    };
    VerifyPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    VerifyPage = __decorate([
        Component({
            selector: 'page-verify',
            templateUrl: 'verify.html'
        }), 
        __metadata('design:paramtypes', [NavController, NavParams, AuthService, AlertController, LoadingController])
    ], VerifyPage);
    return VerifyPage;
}());
//# sourceMappingURL=verify.js.map