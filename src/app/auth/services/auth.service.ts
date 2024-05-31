import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { User } from '../interfaces/user.interface';
import { jwtDecode } from 'jwt-decode';

@Injectable({providedIn: 'root'})
export class AuthService {

    //! Propiedades privadas
    private readonly authBaseUrl: string = environment.authBaseUrl;
    private http = inject(HttpClient);
    private _currentUser = signal<User|null>(null);
    private _authStatus = signal<AuthStatus>(AuthStatus.checking);

    //! Propiedades publicas
    public currentUser = computed(() => this._currentUser());
    public authStatus = computed(() => this._authStatus());



    constructor() { 
        this.checkAuthStatus().subscribe();
    }

    login(email: string, password: string): Observable<boolean>
    {
        const url = `${this.authBaseUrl}/user/Login`;
        const body = {email, password};
        
        return this.http.post<LoginResponse>(url,body)
        .pipe(
            tap( response => {
                this.setAuthentication(response.accessToken!);

                // const user = jwtDecode<User>(response.accessToken);
                // this._currentUser.set(user);
                // this._authStatus.set(AuthStatus.authenticated);
                // localStorage.setItem('token', response.accessToken);
                
            }),
            map( () => true ),

            // TODO: errores
            catchError(err => {
                return throwError( ()=> err.error.title );

            })
        );



        return of(true);
    }

    checkAuthStatus(): Observable<boolean>
    {
        const url = `${this.authBaseUrl}/user/CheckToken`;
        const token = localStorage.getItem('token');
        if (!token){
            this.logout();
            return of(false);
        }

        const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`);

        return this.http.post<boolean>(url,'',{headers})
        .pipe(
            map(() => {
                //this._authStatus.set(AuthStatus.authenticated);

                const token = localStorage.getItem('token');
                this.setAuthentication(token!);
                return true;
            }),
            catchError(() => {
                this._authStatus.set(AuthStatus.notAuthenticated);
                console.log('Token invalido');
                return of(false);
            }),
        );
    }

    logout(){
        localStorage.removeItem('token');
        this._currentUser.set(null);
        this._authStatus.set(AuthStatus.notAuthenticated);
    }

    private setAuthentication(accessToken: string): boolean
    {
        const user = jwtDecode<User>(accessToken);
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', accessToken);

        this._authStatus.set(AuthStatus.authenticated);
        return true;
    }
    
}