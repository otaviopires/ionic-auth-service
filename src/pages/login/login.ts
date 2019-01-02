import { HomePage } from './../home/home';
import { IonicPage, NavController } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { OAuthService,  JwksValidationHandler } from 'angular-oauth2-oidc';
import * as OktaAuth from '@okta/okta-auth-js';
import { ResponseType } from '@angular/http';


declare const OktaAuth: any;

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    @ViewChild('email') email: any;
    private username: string;
    private password: string;
    private error: string;

    constructor(private navCtrl: NavController, private oauthService: OAuthService){
        oauthService.redirectUri = window.location.origin;
        oauthService.clientId = '0oaiq45c11HOBe9oB0h7';
        oauthService.scope = 'openid profile email';
        oauthService.oidc = true;
        oauthService.issuer = 'https://dev-863568.oktapreview.com/oauth2/default';
        oauthService.tokenValidationHandler = new JwksValidationHandler();
        
        this.oauthService.loadDiscoveryDocument().then(() => {
            this.oauthService.tryLogin();
          });
    }

    ionViewDidLoad(): void {
        setTimeout(() => {
            this.email.setFocus();
        }, 500);
    }
    
    login(): void {
        this.oauthService.createAndSaveNonce().then(nonce => {
            const authClient = new OktaAuth({
                clientId: this.oauthService.clientId,
                redirectUri: this.oauthService.redirectUri,
                url: 'hhtps://dev-863568.oktapreview.com',
                issuer: 'default'
            });
            return authClient.signIn({
                username: this.username,
                password: this.password
            }).then((response) => {
                if (response.status === 'SUCCESS') {
                    return authClient.token.getWithoutPrompt({
                        nonce: nonce,
                        ResponseType: ['id_token', 'token'],
                        sessionToken: response.sessionToken,
                        scopes: this.oauthService.scope.split(' ')
                    }).then ((tokens) => {
                        const idToken = tokens[0].idToken;
                        const accessToken = tokens[1].accessToken;
                        const keyValuePair = `#id_token=${encodeURIComponent(idToken)}&access_token=${encodeURIComponent(accessToken)}`;
                        this.oauthService.tryLogin({
                            customHashFragment: keyValuePair,
                            disableOAuth2StateCheck: true
                        });
                        this.navCtrl.push(HomePage);
                    });
                } else {
                    throw new Error('We cannot handle the ' + response.status + ' status');
                }
            }).fail((error) => {
                console.error(error);
                this.error = error.message;
            })
        });
    }
}
