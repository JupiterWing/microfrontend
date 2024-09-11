import { EmployeeService } from './employee.service';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { employee } from './models/employee.model';

jest.mock('@microsoft/signalr');

describe('EmployeeService', () => {
  let serviceTest: EmployeeService;
  let mockHubConnection: jest.Mocked<HubConnection>;
  let mockEmployees: employee[];
  let mockHubConnectionBuilder: jest.Mocked<HubConnectionBuilder>;

  beforeEach(() => {
    mockHubConnection = {
      start: jest.fn(),
      on: jest.fn(),
    } as unknown as jest.Mocked<HubConnection>;

    mockHubConnectionBuilder = {
      withUrl: jest.fn().mockReturnThis(),
      withAutomaticReconnect: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue(mockHubConnection),
    } as unknown as jest.Mocked<HubConnectionBuilder>;

    (
      HubConnectionBuilder as jest.MockedClass<typeof HubConnectionBuilder>
    ).mockImplementation(() => mockHubConnectionBuilder);

    mockEmployees = [
      { employee_ID: 1, name: 'Jhon', age: 30, address: '123 test' },
    ];
    serviceTest = new EmployeeService();
  });

  it('should create connection', () => {
    serviceTest.CreateConnection();
    expect(mockHubConnection.start).toHaveBeenCalled();
    expect(mockHubConnection.on).toHaveBeenCalledWith(
      'ReceiveEmployee',
      expect.any(Function),
    );
  });

  it('should handle ReceiveEmployee event', () => {
    serviceTest.CreateConnection();
    const callback = mockHubConnection.on.mock.calls[0][1];
    callback(mockEmployees);
    serviceTest.employees$.subscribe((employees) => {
      expect(employees).toEqual(mockEmployees);
    });
  });
});
