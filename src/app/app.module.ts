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
import { AddSpeciesPage } from '../pages/add-species/add-species';
import { ListSpeciesPage } from '../pages/list-species/list-species';
import { ViewSpeciesPage } from '../pages/view-species/view-species';
import { EditSpeciesPage } from '../pages/edit-species/edit-species';
import { VerifyPage } from '../pages/verify/verify';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PasswordResetPage } from '../pages/password-reset/password-reset';
import { VerifyResetPage } from '../pages/verify-reset/verify-reset';
import { DashboardPage } from '../pages/dashboard/dashboard';

import { Camera,Transfer,File } from 'ionic-native';


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
    LawPage,
    AddSpeciesPage,
    ListSpeciesPage,
    ViewSpeciesPage,
    EditSpeciesPage,
    VerifyPage,
    PasswordResetPage,
    VerifyResetPage,
    DashboardPage
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
    LawPage,
    AddSpeciesPage,
    ListSpeciesPage,
    ViewSpeciesPage,
    EditSpeciesPage,
    VerifyPage,
    PasswordResetPage,
    VerifyResetPage,
    DashboardPage
  ],
  providers: [SplashScreen,AuthService, Camera, Transfer, File]
})
export class AppModule {}
