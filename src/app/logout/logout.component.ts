import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {
  email: any;
  senha: any;
  constructor(private router: Router, private route: ActivatedRoute) {
  }

  formShowing:boolean = false;
  
  errorMessage:string;

  ngOnInit() {

    localStorage.removeItem("token")
    this.router.navigate(['login']);

  }

}
