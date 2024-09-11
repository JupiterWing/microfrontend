import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  getAppNames,
  mountRootParcel,
  Parcel,
  ParcelConfig,
  registerApplication,
  start,
  unregisterApplication,
} from 'single-spa';
import { MenuService } from 'src/app/layout/app.menu.service';
import {
  AppConfig,
  LayoutService,
} from 'src/app/layout/service/app.layout.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  applicationLoadedMap = new Map();
  items!: any[];
  layout: number[][] = [[0, 0], [0], [0, 0]];
  panelSizes = [100];
  panelColumnSize: number[][] = [[100]];
  showsPlitterLayout = false;
  config: AppConfig;
  dashboardId: string;
  private layoutChangeSub: Subscription = new Subscription();
  private layoutConfigeSub: Subscription = new Subscription();
  private routeParamSub: Subscription = new Subscription();
  private clearDashBoardSub: Subscription = new Subscription();

  parcels: Map<string, Parcel> = new Map();

  constructor(
    private layoutService: LayoutService,
    private changeDetRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private menuServie: MenuService,
  ) {}

  ngOnInit() {
    const registeredApps = getAppNames();
    console.log(registeredApps);
    registeredApps.forEach((registeredApp) => {
      unregisterApplication(registeredApp);
    });

    this.items = [
      {
        id: '@dk/rig-overview-vue',
        label: 'Rig Status',
        command: (event) => {
          const id =
            event.originalEvent.target.closest('p-menu').parentElement.id;
          this.mountParcel('@dk/rig-overview-vue', id + '-content');
        },
      },
      {
        id: '@dk/svelte-app',
        label: 'Well Info Cart',
        command: (event) => {
          const containerId =
            event.originalEvent.target.closest('p-menu').parentElement.id;
          this.mountParcel('@dk/svelte-app', containerId + '-content');
        },
      },

      {
        id: '@dk/rig-info-react',
        label: 'Rig Status Messages',
        command: (event) => {
          const containerId =
            event.originalEvent.target.closest('p-menu').parentElement.id;
          this.mountParcel('@dk/rig-info-react', containerId + '-content');
        },
      },
      {
        id: '@dk/re-react',
        label: 'Drilling Depth',
        command: (event) => {
          const containerId =
            event.originalEvent.target.closest('p-menu').parentElement.id;
          this.mountParcel('@dk/re-react', containerId + '-content');
        },
      },
    ];

    addEventListener('unloadDrillingReact', () => this.handleUnload(5));
    addEventListener('unloadReactMessenger', () => this.handleUnload(4));
    addEventListener('unloadEmployeeInfo', () => this.handleUnload(3));
    addEventListener('unloadRigInfoVue', () => this.handleUnload(2));
    addEventListener('unloadOilWellChartSvelte', () => this.handleUnload(1));

    this.layoutConfigeSub = this.layoutService.configUpdate$.subscribe(
      (config) => {
        if (this.config && this.layoutService.updateStyle(this.config)) {
          console.log('Style Updated');
        } else {
          console.log('Style Not Updated');
        }
        console.log(config);
        this.config = config;
      },
    );

    this.clearDashBoardSub = this.layoutService.clearDashBoard$.subscribe(() => {
      if (this.dashboardId) {
        for (const value of this.applicationLoadedMap.values()) {
          this.unmountParcel(value);
        }
        this.menuServie.updateApplicationLoaded(this.dashboardId, new Map());
        this.menuServie.updateLayout(this.dashboardId, this.layout);
        this.initLayout();
      }
    });

    this.layoutChangeSub = this.layoutService.layoutChange$.subscribe(
      (layout) => {
        console.log('Sub layout', new Date());
        if (this.dashboardId) {
          for (const value of this.applicationLoadedMap.values()) {
            this.unmountParcel(value);
          }
          this.menuServie.updateApplicationLoaded(this.dashboardId, new Map());
          const changeLayout = layout;
          this.menuServie.updateLayout(this.dashboardId, changeLayout);
          this.initLayout();
        }
      },
    );
    this.initLayout();

    this.routeParamSub = this.route.paramMap.subscribe((paramAsMap: Params) => {
      const id = paramAsMap?.['params']?.id;
      if (id && this.dashboardId != id) {
        const registeredApps = getAppNames();
        console.log(registeredApps);
        registeredApps.forEach((registeredApp) => {
          if (registeredApp) {
            unregisterApplication(registeredApp);
          }
        });

        this.dashboardId = id;
        this.initLayout();
      }
    });
  }

  initLayout() {
    this.dashboardId = this.route.snapshot.paramMap.get('id');
    const menu = this.menuServie.getItem(
      this.dashboardId ? this.dashboardId : '1',
    );
    this.layout = menu.layout;
    this.reloadLayout();
    this.applicationLoadedMap = new Map(
      Object.entries(menu.applicationLoadedMap),
    );
    this.parcels = new Map();
    this.applicationLoadedMap.forEach((value, key) => {
      this.mountParcel(key, value);
    });
  }

  reloadLayout() {
    this.showsPlitterLayout = false;
    this.changeDetRef.detectChanges();
    this.generateLayout();
    this.showsPlitterLayout = true;
    this.changeDetRef.detectChanges();
  }

  getItems() {
    return this.items.filter((x) => !this.applicationLoadedMap.has(x.id));
  }

  handleUnload(widgetID) {
    if (widgetID == 1) {
      this.unmountParcel(this.applicationLoadedMap.get('@dk/svelte-app'));
      this.applicationLoadedMap.delete('@dk/svelte-app');
    } else if (widgetID == 2) {
      this.unmountParcel(this.applicationLoadedMap.get('@dk/rig-overview-vue'));
      this.applicationLoadedMap.delete('@dk/rig-overview-vue');
    } else if (widgetID == 4) {
      this.unmountParcel(this.applicationLoadedMap.get('@dk/rig-info-react'));
      this.applicationLoadedMap.delete('@dk/rig-info-react');
    } else if (widgetID == 5) {
      this.unmountParcel(this.applicationLoadedMap.get('@dk/re-react'));
      this.applicationLoadedMap.delete('@dk/re-react');
    }
    this.menuServie.updateApplicationLoaded(
      this.dashboardId,
      this.applicationLoadedMap,
    );
  }

  checkContainerIsEmpty(containerId: string) {
    return [...this.applicationLoadedMap.values()].some(
      (value) => value == containerId,
    );
  }

  async addApplication(appName: string, containerId: string) {
    this.applicationLoadedMap.set(appName, containerId);
    this.menuServie.updateApplicationLoaded(
      this.dashboardId,
      this.applicationLoadedMap,
    );
    const registeredApps = getAppNames();

    if (!registeredApps.includes(appName)) {
      // Register the application
      registerApplication({
        name: appName,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        app: () => (window as any).System.import(appName),
        customProps: {
          domElement: document.getElementById(containerId),
        },

        activeWhen: (location) => location.pathname.includes('/'),
      });
      console.log(
        `Application ${appName} registered. Container Id ${containerId}`,
      );
      start();
    } else {
      // If already registered, mount it to the specified container
      console.log(
        `Application ${appName} is already registered. Container Id ${containerId}`,
      );
      const containerElement = document.getElementById(containerId);

      if (!containerElement) {
        console.error(`Container element with id ${containerId} not found.`);
        return;
      }
      try {
        const parcelConfig = {
          domElement: containerElement,
        };
        await mountRootParcel(
          () => (window as any).System.import(appName),
          parcelConfig,
        );
        console.log(`Application ${appName} mounted successfully.`);
      } catch (error) {
        console.error(`Error mounting application ${appName}:`, error);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async mountParcel(appName: string, containerId: string, props: any = {}) {
    this.applicationLoadedMap.set(appName, containerId);
    this.menuServie.updateApplicationLoaded(
      this.dashboardId,
      this.applicationLoadedMap,
    );
    console.log(this.parcels);
    console.log(containerId);

    if (!this.parcels.has(containerId)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parcelConfig: ParcelConfig = await (window as any).System.import(
        appName,
      );
      const parcel = mountRootParcel(parcelConfig, {
        domElement: document.getElementById(containerId),
        ...props,
      });
      this.parcels.set(containerId, parcel);
    }
  }

  async unmountParcel(containerId: string) {
    const parcel = this.parcels.get(containerId);
    if (parcel) {
      await parcel.unmount();
      this.parcels.delete(containerId);
    }
  }

  generateLayout() {
    this.applicationLoadedMap = new Map();
    this.panelColumnSize = [];
    this.panelSizes = Array(this.layout.length).fill(100 / this.layout.length);
    this.layout.forEach((row, rowIndex) => {
      this.panelColumnSize[rowIndex] = Array(row.length).fill(100 / row.length);
    });
  }

  async ngOnDestroy(): Promise<void> {
    this.layoutChangeSub.unsubscribe();
    this.layoutConfigeSub.unsubscribe();
    this.routeParamSub.unsubscribe();
    this.clearDashBoardSub.unsubscribe();
    for (const parcel of this.parcels.values()) {
      await parcel.unmount();
    }
  }
}
