import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-odds',
  templateUrl: './odds.component.html',
  styleUrls: ['./odds.component.css']
})
export class OddsComponent implements OnInit {
  dataVencimento: any
  id: any
  season: any
  event: any
  constructor(private apiService:ApiService, private router: Router, private route: ActivatedRoute) {
  }

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
      this.id = params['id'];
    })

    this.route.params.subscribe(params => {
      this.season = params['season'];
    })

    this.apiService.getOdds(this.id).subscribe(
      data  => {
        this.event = data
        console.log(this.event['markets'])
        
      },
      error => {
        console.log(error)
        //this.router.navigate(['login']);
      }
    );
  }

  
}
