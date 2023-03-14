import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  email: any;
  senha: any;
  confirmarSenha: any;
  telefone: any;
  constructor(private apiService:ApiService, private router: Router, private route: ActivatedRoute) {
  }

  DEFAULT_ASSISTANTS:string = '6';
  formShowing:boolean = false;

  errorMessage:string;


  ngOnInit() {
    
  }

  cadastro(){
    if(!this.email){
      alert("Email é obrigatório")
    }else if(!this.senha){
      alert("Senha é obrigatório")
    }else if(!this.telefone){
      alert("Telefone é obrigatório")
    }else if(this.senha != this.confirmarSenha){
      alert("Senhas não conferem")
    }else{
      this.apiService.cadastro({"email": this.email, "senha": this.senha, "telefone": "+"+this.telefone}).subscribe(
        data  => {
          alert("Cadastro realizado!! Enviamos um email para você com o link de confirmação")
          this.router.navigate(['login']);
        },
        error => {
          console.log(error)
          alert("Erro ao realizar o cadastro, tente novamente mais tarde.")
        }
      );
    }
  }
}
