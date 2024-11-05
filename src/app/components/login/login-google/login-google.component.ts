import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { AuthService } from '../../../services/auth.service';
import { AuthDTO } from '../../../models/auth-dto';
import { UserService } from '../../../services/user.service';
import { SelectionService } from '../../../services/selection.service';

@Component({
  selector: 'app-login-google',
  standalone: true,
  imports: [
    FormsModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    MdbFormsModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login-google.component.html',
  styleUrls: ['./login-google.component.scss'],
})
export class LoginGoogleComponent implements OnInit {
  userName: string = '';

  constructor(
    private selectionService: SelectionService,
    private userService: UserService,
    private socialAuth: SocialAuthService,
    private authService: AuthService,
    private route: Router
  ) {
    // authService.logout();
  }

  ngOnInit() {
    this.socialAuth.authState.subscribe((res: any) => {
      const userName = res.name;
      console.log('Nome do usuário que logou com o Google: ', userName);
      localStorage.setItem('userName', userName); //armazena o nome do usuário no local storage

      this.authService.login(res.idToken).subscribe({
        next: (auth: AuthDTO) => {
          console.log('AccessToken: ', auth.accessToken);
          console.log('RefreshToken: ', auth.refreshToken);
          this.authService.setAuthToken(auth);
          this.userService.getInfo().subscribe({
            next: (user) => {
              // Se o usuario tiver jointIntensities (ja fez o formulario) vai direto pro resultado
              if (user.jointIntensities && user.jointIntensities?.length > 0) {
                this.selectionService.setJointIntensities(user.jointIntensities)
                this.route.navigate(['/result']);
              } else {
                // Se nao, continua o cadastro.
                this.route.navigate(['/login/userinfo']);
              }
            },
            error: (err) => {
              console.log(err);
            },
          });
        },
        error: (error: any) => {
          console.log(
            "Something ain't right!",
            `The error is: ${error.error.message}`
          );
        },
      });
    });
  }
}
