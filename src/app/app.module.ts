import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth-service';
import { RegisterPage } from '../pages/register/register';
import { ComplaintPage } from '../pages/complaint/complaint';
import { AddCompaintPage } from '../pages/add-compaint/add-compaint';
import { EditComplainPage } from '../pages/edit-complain/edit-complain';
import { MainPage } from '../pages/main/main';
import { LawPage } from '../pages/law/law';

import { MediaCapture, Camera,Transfer,File } from 'ionic-native';

 
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ComplaintPage,
    AddCompaintPage,
    EditComplainPage,
    MainPage,
    LawPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ComplaintPage,
    AddCompaintPage,
    EditComplainPage,
    MainPage,
    LawPage
  ],
  providers: [AuthService, MediaCapture, Camera, Transfer, File]
})
export class AppModule {}