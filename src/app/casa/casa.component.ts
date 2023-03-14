import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-casa',
  templateUrl: './casa.component.html',
  styleUrls: ['./casa.component.css']
})
export class CasaComponent implements OnInit {
  diasRestantes: any;
  constructor(private router: Router, private apiService:ApiService) {
  }

  DEFAULT_ASSISTANTS:string = '6';
  formShowing:boolean = false;
  errorMessage:string;

  setBookie(value) {

    

    if(this.diasRestantes > 0){
      localStorage.setItem('bookie', value);
      this.router.navigate(['nextgames/'+value+'/copa']);
    }else{
      this.router.navigate(['renewal']);
    }

    this.router.navigate(['nextgames/'+value+'/copa']);
    

  }

  ngOnInit() {

    var token = localStorage.getItem("token")
    
    this.apiService.isTokenExpired(token).subscribe(
      data => {
        this.diasRestantes = data['diasrestantes']
      },
      error => {
        if(error){
          this.router.navigate(['login']);
        }
      }
    );
  }

}
