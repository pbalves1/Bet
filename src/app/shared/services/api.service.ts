import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private localstorage: LocalStorageService) {
  }

  //private USER_URL = 'http://192.168.0.232:5007/';
  private BETANO_URL = 'https://55tnwfz37f.execute-api.us-east-1.amazonaws.com/master/';

  isTokenExpired(token) {

    var body = {'acessToken': localStorage.getItem("acessToken")}

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token,
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin'
      })
     };
    return this.http.post(this.BETANO_URL+'istokenexpired',body, httpOptions);
  }

  setuseratribute(d) {

    var body = {'acessToken': localStorage.getItem("acessToken"), 'd': d}
    var token = localStorage.getItem("token")

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token,
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin'
      })
     };
    return this.http.post(this.BETANO_URL+'setuseratribute',body, httpOptions);
  }

  cadastro(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin'
      })
     };
    return this.http.post(this.BETANO_URL+'cadastro', data, httpOptions);
  }

  login(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin'
      })
     };
    return this.http.post(this.BETANO_URL+'login', data, httpOptions);
  }

  getNextEvents(leagueId) {

    var token = localStorage.getItem("token")

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token,
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin'
      })
     };
    return this.http.get(this.BETANO_URL+'nextevents?leagueId='+leagueId, httpOptions);
  }

  getLastEvents(leagueId) {

    var token = localStorage.getItem("token")

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token,
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin'
      })
     };
    return this.http.get(this.BETANO_URL+'lastevents?leagueId='+leagueId, httpOptions);
  }

  getEventsByStarttime(leagueId, starttime, endTime) {

    var token = localStorage.getItem("token")

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token,
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin'
      })
     };
    return this.http.get(this.BETANO_URL+'getevents24hours?leagueId='+leagueId+"&start="+starttime+"&end="+endTime, httpOptions);
  }

  geteventsdashboardbyhometeamandawayteam(homeTeam, awayTeam) {

    var token = localStorage.getItem("token")

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token,
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin'
      })
     };
    return this.http.get(this.BETANO_URL+'geteventsdashboardbyhometeamandawayteam?homeTeam='+homeTeam+'&awayTeam='+awayTeam, httpOptions);
  }

  getEventsConfrontoDireto(homeTeam, awayTeam) {

    var token = localStorage.getItem("token")

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token,
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin'
      })
     };
    return this.http.get(this.BETANO_URL+'geteventslistbyteamsandhomewin?homeTeam='+homeTeam+'&awayTeam='+awayTeam, httpOptions);
  }

  getEventsByTeam(team) {

    var token = localStorage.getItem("token")

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token,
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin'
      })
     };
    return this.http.get(this.BETANO_URL+'geteventslistbyhometeam?team='+team, httpOptions);
  }

  createPreferences(preference){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer APP_USR-4509129961769264-020605-bb991a5b59f3090055e88a524686bcdd-1011933126'
      })
     };
    return this.http.post('https://api.mercadopago.com/checkout/preferences', preference, httpOptions);

  }

  getOdds(id) {

    var token = localStorage.getItem("token")

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token,
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin'
      })
     };
    return this.http.get(this.BETANO_URL+'odds?id='+id, httpOptions);
  }

}
