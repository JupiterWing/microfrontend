import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { employee } from './models/employee.model';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private path = environment.apiUrl;

  private EmployeeConnection?: HubConnection;

  private employeesSubject = new BehaviorSubject<employee[]>([]);
  employees$ = this.employeesSubject.asObservable();

  CreateConnection() {
    this.EmployeeConnection = new HubConnectionBuilder()
      .withUrl(`${this.path}hub/EmployeeInfo`)
      .withAutomaticReconnect()
      .build();
    this.EmployeeConnection.start();
    this.EmployeeConnection.on('ReceiveEmployee', (employees: employee[]) => {
      this.employeesSubject.next(employees);

      // Send data to the status bar
      const detail = {
        widgetId: 3,
        data: {
          employees: employees,
        },
      };
      const dataUpdatedEvent = new CustomEvent('DataUpdated', {
        detail: detail,
      });
      window.dispatchEvent(dataUpdatedEvent);
    });
  }
}
