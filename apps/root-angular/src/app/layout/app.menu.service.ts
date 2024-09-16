import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuChangeEvent } from './api/menuchangeevent';

export interface MenuItemLocalStorage {
  name: string;
  id: string;
  layout: number[][]; // Adjust the type according to your needs
  applicationLoadedMap :object;
}

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private readonly MENU_STORAGE_KEY = 'menus';


    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject();

    private menuDeletedEvent = new Subject<string>();


    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();
    menuDeletedEvent$ = this.menuDeletedEvent.asObservable();

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }

    onMenuDeleted(id: string) {
      this.menuDeletedEvent.next(id);
    }


    getItems(): MenuItemLocalStorage[] {
      const items = localStorage.getItem(this.MENU_STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    }

    updateLayout(id: string, layout: number[][]): void {
      console.log("Update layout", new Date());
      const items = this.getItems();
      // Check if item with the same id exists
      const existingIndex = items.findIndex(item => item.id ===id);

      if (existingIndex > -1) {
        // Replace the existing item
        items[existingIndex].layout = layout;
      }

      localStorage.setItem(this.MENU_STORAGE_KEY, JSON.stringify(items));
    }

    updateApplicationLoaded(id: string, applicationLoadedMap: Map<string,string>): void {
      console.log("Update layout", new Date());
      const items = this.getItems();
      // Check if item with the same id exists
      const existingIndex = items.findIndex(item => item.id ===id);

      if (existingIndex > -1) {
        // Replace the existing item
        items[existingIndex].applicationLoadedMap =  Object.fromEntries(applicationLoadedMap);
      }

      localStorage.setItem(this.MENU_STORAGE_KEY, JSON.stringify(items));
    }

    // Retrieve a specific item by id from local storage
    getItem(id: string): MenuItemLocalStorage | undefined {
      const items = this.getItems();
      return items.find(item => item.id == id);
    }

    addItem(newItem: MenuItemLocalStorage): void {

      const items = this.getItems();
      // Check if item with the same id exists
      const existingIndex = items.findIndex(item => item.id === newItem.id);

      if (existingIndex > -1) {
        // Replace the existing item
        items[existingIndex] = newItem;
      } else {
        // Add new item
        items.push(newItem);
      }

      localStorage.setItem(this.MENU_STORAGE_KEY, JSON.stringify(items));

    }

    removeItem(itemToRemove: MenuItemLocalStorage): void {
      let items = this.getItems();
      items = items.filter(item => item.id !== itemToRemove.id);
      localStorage.setItem(this.MENU_STORAGE_KEY, JSON.stringify(items));
    }
}
