import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { AgentEvent } from '../models/agent-event';
import { AgentEventService } from '../services/agent-event.service';
import { prettyPrintJson } from 'pretty-print-json';
import { ConnectionService } from '../services/connection.service';
import { AgentTemplate } from '../models/agent-template';
import { Connection } from '../models/connection';

@Component({
  selector: 'agent-connections',
  templateUrl: './agent-connections.component.html',
  styleUrls: ['./agent-connections.component.css']
})
export class AgentConnectionsComponent implements OnInit, OnDestroy {


  agentTemplate: AgentTemplate | null = null;


  @Input('agentTemplate') 
  set setAgentTemplate(value: AgentTemplate | null) {
    this.agentTemplate = value;
    this.load();
  };

  agentConnections: Connection[] = [];

  selectedConnection: Connection = new Connection;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  
  totalRecords: number = 0;

  loading: boolean = false;

  connectionDetails: string = '';

  agentConnectionDetailsDialogVisible: boolean = false;

  constructor(private readonly agentConnectionService: ConnectionService,) { 
  }

  viewDetails(index: number): void { 
    this.selectedConnection = this.agentConnections[index]
    const html = prettyPrintJson.toHtml(this.selectedConnection);
    this.connectionDetails = html;
    this.agentConnectionDetailsDialogVisible = true;
  }

  cancel(): void {
    this.agentConnectionDetailsDialogVisible = false;
  }

  load(): void {
    if (this.agentTemplate === null) return;
    if (this.agentTemplate.url === '') return;
    this.agentConnectionService.getAll(this.agentTemplate).pipe(takeUntil(this.ngUnsubscribe)).subscribe(connections => {
        console.log(connections)
        this.agentConnections = connections;
        this.totalRecords = connections.length
    });
  }  

  ngOnInit(): void {
  }

  ngOnDestroy(): any {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}