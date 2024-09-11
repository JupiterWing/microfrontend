export class employee {
  public employee_ID: number;
  public name: string;
  public age: number;
  public address: string;

  constructor(employee_ID: number, name: string, age: number, address: string) {
    this.employee_ID = employee_ID;
    this.name = name;
    this.age = age;
    this.address = address;
  }
}
