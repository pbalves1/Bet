import { Component, OnInit } from '@angular/core';
import { AssistantService } from '../shared/services/assistant/assistant.service';
import { Assistant, Name, Location, ProfilePicture } from '../shared/model/assistants.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bookie = null
  constructor(private assistantService:AssistantService) {
  }

  DEFAULT_ASSISTANTS:string = '6';
  formShowing:boolean = false;
  
  errorMessage:string;

  model:Assistant;


  ngOnInit() {
    this.bookie = localStorage.getItem('bookie')
  }

  
}
