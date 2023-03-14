import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loginv2',
  templateUrl: './loginv2.component.html',
  styleUrls: ['./loginv2.component.css']
})
export class LoginV2Component implements OnInit {
  email: any;
  senha: any;
  constructor(private apiService:ApiService, private router: Router, private route: ActivatedRoute) {
  }

  formShowing:boolean = false;
  
  errorMessage:string;

  ngOnInit() {
  }

  login(){

    if(!this.email){
      alert("Email é obrigatório")
    }else if(!this.senha){
      alert("Senha é obrigatório")
    }else{
      this.apiService.login({"email": this.email, "senha": this.senha}).subscribe(
        data  => {
          localStorage.setItem('token', data['token']);
          localStorage.setItem('acessToken', data['acessToken']);
          this.router.navigate(['bookies']);
        },
        error => {
          alert("Erro ao realizar o login, tente novamente mais tarde.")
        }
      );
      
    }
  }

}
