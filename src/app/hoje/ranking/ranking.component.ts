import { Component, OnInit } from '@angular/core';
import { AssistantService } from '../../shared/services/assistant/assistant.service';
import { Assistant, Name, Location, ProfilePicture } from '../../shared/model/assistants.model';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  constructor(private assistantService:AssistantService) {
  }

  DEFAULT_ASSISTANTS:string = '6';
  formShowing:boolean = false;
  views:Object[] = [
    {
      name: "My Account",
      description: "Edit my account",
      icon: "assignment ind"
    },
    {
      name: "Next events",
      description: "Find incoming events!",
      icon: "event"
    }
  ];

  assistants:Assistant[];
  errorMessage:string;

  model:Assistant;

  add() {
    this.assistants.push(this.model);
    this.initModel();
  }

  getAssistants() {
    this.assistantService.getAssistants(this.DEFAULT_ASSISTANTS).subscribe(
      assistants => {
        this.assistants = assistants.results;
      },
      error => this.errorMessage = <any>error
    );
  }

  ngOnInit() {
    this.getAssistants();
    this.initModel();
  }

  initModel() {
    this.model = new Assistant(new Name('', ''), new Location(''), '', new ProfilePicture(''), '');
  }
}
