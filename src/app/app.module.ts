import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth-service';
import { RegisterPage } from '../pages/register/register';
import { ComplaintPage } from '../pages/complaint/complaint';
import { AddCompaintPage } from '../pages/add-compaint/add-compaint';
import { MainPage } from '../pages/main/main';
import { LawPage } from '../pages/law/law';
 
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ComplaintPage,
    AddCompaintPage,
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
    MainPage,
    LawPage
  ],
  providers: [AuthService]
})
export class AppModule {}