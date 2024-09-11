import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { MenuItemLocalStorage, MenuService } from './app.menu.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  formGroup: FormGroup | undefined;

  constructor(
    public layoutService: LayoutService,
    private menuService: MenuService,
  ) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      dashboardName: new FormControl<string | null>(null, Validators.required),
    });

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

    this.menuService.menuDeletedEvent$.subscribe(id => {
      this.model[0].items =  this.model[0].items.filter(item => item.id !== id);
    });
  }

  addDashboard(op: OverlayPanel) {
    this.formGroup.markAllAsTouched();
    this.formGroup.markAsDirty();
    if (this.formGroup.valid) {
      const menu = {
        id: this.generateUniqueId(),
        name: this.formGroup.value.dashboardName,
        layout: [[0]],
        applicationLoadedMap: new Map()
      };
      this.menuService.addItem(menu);
      this.model[0].items.push({
        id: menu.id,
        label: this.formGroup.value.dashboardName,
        icon: 'pi pi-fw pi-image',
        deletable: true,
        routerLink: [`/${menu.id}`],
      });
      this.formGroup.reset();
      op.hide();
    }
  }

  generateUniqueId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
