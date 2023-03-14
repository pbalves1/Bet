import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  season: any
  leagueId: any
  eventsCopa: any
  eventsPremier: any
  eventsChampions: any
  eventsTaca: any
  eventsAmerica: any
  eventsCopaEstrelas: any
  eventsCampeonatoItaliano: any
  dataVencimento: any
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 10;
  constructor(private apiService:ApiService, private router: Router, private route: ActivatedRoute) {
  }

  DEFAULT_ASSISTANTS:string = '6';
  formShowing:boolean = false;
  
  errorMessage:string;

  ngOnInit() {

    var token = localStorage.getItem("token")
    
    this.apiService.isTokenExpired(token).subscribe(
      data => {
        if(data['diasrestantes'] < 1){
          this.router.navigate(['renewal']);
        }else{
          var currenttimestamp = new Date().getTime();
          var onedayaftertimestamp=currenttimestamp+(86400000*data['diasrestantes']);//1 day=86400000 ms;
          this.dataVencimento = new Date(onedayaftertimestamp);
          
        }
      },
      error => {
        if(error){
          this.router.navigate(['login']);
        }
      }
    );
    
    this.route.params.subscribe(params => {
      this.season = params['season'];
    })

    this.apiService.getLastEvents(200039).subscribe(
      data  => {
        this.eventsCopa = data
      },
      error => {
        console.log(error)
        //this.router.navigate(['login']);
      }
    );

    this.apiService.getLastEvents(195679).subscribe(
      data  => {
        this.eventsPremier = data
      },
      error => {
        console.log(error)
        //this.router.navigate(['login']);
      }
    );

    this.apiService.getLastEvents(199330).subscribe(
      data  => {
        this.eventsChampions = data
      },
      error => {
        console.log(error)
        //this.router.navigate(['login']);
      }
    );

    this.apiService.getLastEvents(199959).subscribe(
      data  => {
        this.eventsTaca = data
      },
      error => {
        console.log(error)
        //this.router.navigate(['login']);
      }
    );

    this.apiService.getLastEvents(199961).subscribe(
      data  => {
        this.eventsCampeonatoItaliano = data
      },
      error => {
        console.log(error)
        //this.router.navigate(['login']);
      }
    );

    this.apiService.getLastEvents(199960).subscribe(
      data  => {
        this.eventsCopaEstrelas = data
      },
      error => {
        console.log(error)
        //this.router.navigate(['login']);
      }
    );

    this.apiService.getLastEvents(197476).subscribe(
      data  => {
        this.eventsAmerica = data
      },
      error => {
        console.log(error)
        //this.router.navigate(['login']);
      }
    );

    setTimeout(function(){
      window.location.reload();
   }, 180000); 


  }

}
