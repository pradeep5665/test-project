import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
    token: string;
constructor(public router: Router, private authService: AuthenticationService) {
}

  canActivate(){
   
    if (!this.authService.isTokenExpired()) {
        console.log('this.authService', !this.authService.isTokenExpired())
      //  this.router.navigate(['app-admin-dashboard']);
        return true;
      }
      window.location.href = 'https://nebo.utahhousingcorp.org/homeowner/';
      return false;
}

}