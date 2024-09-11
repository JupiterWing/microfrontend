import { AppComponent } from './app.component';
import { EmployeeService } from './employee.service';
import { of } from 'rxjs';
import { employee } from './models/employee.model';

jest.mock('./employee.service');

describe('AppComponent', () => {
  let component: AppComponent;
  let service: EmployeeService;
  let mockEmployees: employee[];

  beforeEach(() => {
    service = new EmployeeService();
    component = new AppComponent(service);
    mockEmployees = [
      { employee_ID: 1, name: 'John Doe', age: 30, address: '123 Street' },
    ];
    service.employees$ = of(mockEmployees);
    service.CreateConnection = jest.fn();
    window.dispatchEvent = jest.fn();
  });

  it('should call CreateConnection and subscribe to employees$', () => {
    component.ngOnInit();
    expect(service.CreateConnection).toHaveBeenCalled();
  });

  it('should dispatch unloadEmployeeInfo event', () => {
    component.unloadWidget();
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      new Event('unloadEmployeeInfo'),
    );
  });
});
