import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { MenuItemLocalStorage, MenuService } from './app.menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',

  styles: `
  :host {
    flex-grow:1
  }
`
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];


  constructor(
    public layoutService: LayoutService,
    private menuService: MenuService,
  ) {}

  ngOnInit() {


    this.model = [
      {
        label: 'Home',
        items: [
          {
            id: "1",
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/1'],
            deletable: false,
          },
        ],
      },
    ];

    this.menuService.addItem({
      id: "1",
      name:'Dashboard',
      layout: [[0]],
      applicationLoadedMap: new Map()
    });

    const menus: MenuItemLocalStorage[] = this.menuService.getItems();
    menus.filter(menu => menu.id != "1").forEach((menu) => {
      this.model[0].items.push({
        id: menu.id,
        label: menu.name,
        icon: 'pi pi-fw pi-image',
        deletable: true,
        routerLink: [`/${menu.id}`],
      });
    });


  }



  generateUniqueId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
