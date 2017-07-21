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
import { SelectTaskPage } from '../pages/select-task/select-task';
import { EventsPage } from '../pages/events/events';
import { DashboardProvider } from '../providers/dashboard-provider';
import { ProfilePage } from '../pages/profile/profile';
import { MobileUpdatePage } from '../pages/mobile-update/mobile-update';
import { SocialSharing } from '@ionic-native/social-sharing';
//import { IonicImageViewerModule } from 'ionic-img-viewer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera,Transfer,File } from 'ionic-native';

import { PressDirective } from "../components/press-directive/press-directive";
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';
import { Http } from '@angular/http';


export function createTranslateLoader(http: Http){
  return new TranslateStaticLoader(http,'assets/i18n','.json')
}


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
    DashboardPage,
    SelectTaskPage,
    PressDirective,
    EventsPage,
    ProfilePage,
    MobileUpdatePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    //IonicImageViewerModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
			useFactory: (createTranslateLoader),
			deps: [Http]
    })
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
    DashboardPage,
    SelectTaskPage,
    EventsPage,
    ProfilePage,
    MobileUpdatePage
  ],
  providers: [SplashScreen,AuthService, Camera, Transfer, File, DashboardProvider, SocialSharing,PhotoViewer]
})
export class AppModule {}
