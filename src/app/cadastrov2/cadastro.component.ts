import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  email: any;
  senha: any;
  confirmarSenha: any;
  telefone: any;
  telefoneddd: any;
  constructor(private apiService:ApiService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {
  }

  DEFAULT_ASSISTANTS:string = '6';
  formShowing:boolean = false;

  errorMessage:string;


  //only number will be add
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
 
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
 
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
       phonenumber: ['', [ Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(9), Validators.maxLength(9)]],
        phonenumberddd: ['', [ Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(3), Validators.maxLength(3)]],
          email: ['', [Validators.required]],
          senha: ['', [Validators.required,
            Validators.minLength(7), Validators.maxLength(50)]],
          confirmarSenha: ['', [Validators.required,
            Validators.minLength(7), Validators.maxLength(50)]],

    });
  }

  get f() { return this.registerForm.controls; }

  cadastro(){

    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
 
    if(this.registerForm.value.senha != this.registerForm.value.confirmarSenha){
      alert("Senhas não conferem")
    }else{

      this.apiService.cadastro({"email": this.registerForm.value.email, "senha": this.registerForm.value.senha, "telefone": "+"+this.registerForm.value.phonenumberddd+this.registerForm.value.phonenumber}).subscribe(
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
