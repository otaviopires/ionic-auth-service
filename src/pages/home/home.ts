import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { OAuthService } from 'angular-oauth2-oidc';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public app: App, public navCtrl: NavController, public oauthService: OAuthService) {
  }

  logout() {
    this.oauthService.logOut(true);
    this.app.getRootNav()[0].setRoot(LoginPage);
  }

  get givenName() {
    const claims: any = this.oauthService.getIdentityClaims();
    if(!claims) {
      return null;
    }
    return claims.name;
  }
  
  get claims() {
    return this.oauthService.getIdentityClaims();
  }
}
