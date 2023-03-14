import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';

declare const gtag: Function;

@Component({
  selector: 'app-nextgames',
  templateUrl: './nextgames.component.html',
  styleUrls: ['./nextgames.component.css']
})
export class NextgamesComponent implements OnInit {
  bookie = null
  leagueId: any
  league: any
  season: any
  events: any
  dataVencimento: any
  event = {}
  constructor(private apiService:ApiService, private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-C8TG1BGEVR', { 'page_path': event.urlAfterRedirects });
      }      
    })
  }

  DEFAULT_ASSISTANTS:string = '6';
  formShowing:boolean = false;
  
  errorMessage:string;

  getDashboard(event){
    this.event = event
    if(this.event['dashboard']){
      console.log("DashboardOn")
    }else{

      this.event['dashboard'] = null

      this.apiService.geteventsdashboardbyhometeamandawayteam(this.event['homeTeam'], this.event['awayTeam']).subscribe(
        data  => {

          // Geral Data
          data['homeWinPercentage'] =  ((100 * data['homeWin']) / data['jogos']).toFixed(2);
          data['awaywinPercentage'] =  ((100 * data['awaywin']) / data['jogos']).toFixed(2);
          data['empatesPercentage'] =  ((100 * data['empates']) / data['jogos']).toFixed(2);
          data['over1_5Percentage'] =  ((100 * data['over1_5']) / data['jogos']).toFixed(2);
          data['over2_5Percentage'] =  ((100 * data['over2_5']) / data['jogos']).toFixed(2);
          data['over3_5Percentage'] =  ((100 * data['over3_5']) / data['jogos']).toFixed(2);
          data['over4_5Percentage'] =  ((100 * data['over4_5']) / data['jogos']).toFixed(2);
          data['homeGolsMedia'] =  (data['homeGols'] / data['jogos']).toFixed(2);
          data['awayGolsMedia'] =  (data['awayGols'] / data['jogos']).toFixed(2);
          data['ambasPercentage'] =  ((100 * data['ambas']) / data['jogos']).toFixed(2);
          data['empatesPercentage'] =  ((100 * data['empates']) / data['jogos']).toFixed(2);

          // Home Win Data
          data['homeTeamHomeWinPercentage'] =  ((100 * data['homeTeamHomeWin']) / data['homeTeamJogos']).toFixed(2);
          data['homeTeamAwayWinPercentage'] =  ((100 * data['homeTeamAwayWin']) / data['homeTeamJogos']).toFixed(2);
          data['homeTeamEmpatesPercentage'] =  ((100 * data['homeTeamEmpates']) / data['homeTeamJogos']).toFixed(2);
          data['homeTeamOver1_5Percentage'] =  ((100 * data['homeTeamOver1_5']) / data['homeTeamJogos']).toFixed(2);
          data['homeTeamOver2_5Percentage'] =  ((100 * data['homeTeamOver2_5']) / data['homeTeamJogos']).toFixed(2);
          data['homeTeamOver3_5Percentage'] =  ((100 * data['homeTeamOver3_5']) / data['homeTeamJogos']).toFixed(2);
          data['homeTeamOver4_5Percentage'] =  ((100 * data['homeTeamOver4_5']) / data['homeTeamJogos']).toFixed(2);
          data['homeTeamHomeGolsMedia'] =  (data['homeTeamHomeGols'] / data['homeTeamJogos']).toFixed(2);
          data['homeTeamAwayGolsMedia'] =  (data['homeTeamAwayGols'] / data['homeTeamJogos']).toFixed(2);
          data['homeTeamAmbasPercentage'] =  ((100 * data['homeTeamAmbas']) / data['homeTeamJogos']).toFixed(2);
          data['homeTeamEmpatesPercentage'] =  ((100 * data['homeTeamEmpates']) / data['homeTeamJogos']).toFixed(2);

          
          this.event['dashboard'] = data
        },
        error => {
          if(error){
            this.router.navigate(['login']);
          }
        }
      );

      this.apiService.getEventsConfrontoDireto(this.event['homeTeam'], this.event['awayTeam']).subscribe(
        data  => {
          this.event['confrontoDireto'] = data
        },
        error => {
          if(error){
            this.router.navigate(['login']);
          }
        }
      );

      this.apiService.getEventsByTeam(this.event['homeTeam']).subscribe(
        data  => {
          this.event['homeTeamEvents'] = data
        },
        error => {
          if(error){
            this.router.navigate(['login']);
          }
        }
      );

      this.apiService.getEventsByTeam(this.event['awayTeam']).subscribe(
        data  => {
          this.event['awayTeamEvents'] = data
        },
        error => {
          if(error){
            this.router.navigate(['login']);
          }
        }
      );
    }

    

  }

  

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
          console.log(this.dataVencimento)
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

   
    if(this.season == 'copa'){
      this.league = 'Copa'
      this.leagueId = 200039
    }else if(this.season == 'premier'){
      this.league = 'Premier'
      this.leagueId = 195679
    }else if(this.season  == 'champions'){
      this.league = 'Campeões'
      this.leagueId = 199330
    }else if(this.season  == 'tacage'){
      this.league = 'Taça Glória eterna'
      this.leagueId = 199959
    }else if(this.season  == 'america'){
      this.league = 'Ligas America'
      this.leagueId = 197476
    }else if(this.season  == 'estrelas'){
      this.league = 'Copa das estrelas'
      this.leagueId = 199960
    }else if(this.season  == 'italiano'){
      this.league = 'Campeonato Italiano'
      this.leagueId = 199961
    }


    this.bookie = localStorage.getItem('bookie')

    this.apiService.getNextEvents(this.leagueId).subscribe(
      data  => {
        console.log(data)
        this.events = data
        this.getDashboard(data[0])
      },
      error => {
        console.log(error)
      }
    );

    setTimeout(function(){
      window.location.reload();
   }, 180000);
    


  }

}
