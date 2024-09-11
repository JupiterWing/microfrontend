import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { InputNumberInputEvent, InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { LayoutService } from '../service/app.layout.service';

@Component({
  selector: 'app-layout-select-popup',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DividerModule,
    InputNumberModule,
    ButtonModule,
    RippleModule,
  ],
  templateUrl: './layout-select-popup.component.html',
  styleUrls: ['./layout-select-popup.component.scss'],
})
export class LayoutSelectPopupComponent {
  MAX_COLS = 3;
  MAX_ROWS = 3;

  numberOfRowCustomLayout = 1;

  customLayout: number[][] = [[0]];

  customLayoutNumberOfCell: number[] = [1];

  constructor(private layoutService: LayoutService){

  }

  handleCustomLayoutApply() {
    this.setLayout(this.customLayout);
  }

  isTheSameLayout(): boolean {
    return false;
  }

  generateIcon(matrix: number[][]): string[] {
    const rows: string[] = [];

    for (let row = 0; row < matrix.length; row++) {
      const cols: string[] = [];
      for (let col = 0; col < matrix[row].length; col++) {
        cols.push(
          `<div key="col-${col}" class="w-full h-full flex flex-row bg-gray-100 dark:bg-white border-round-xs"></div>`,
        );
      }
      rows.push(
        `<div key="row-${row}" class="w-full h-full flex flex-row gap-1">${cols.join('')}</div>`,
      );
    }

    return rows;
  }

  onRowInputChange(event: InputNumberInputEvent) {
    if (parseInt(event.value) <= this.MAX_ROWS) {
      const rowInputValue = parseInt(event.value);
      this.numberOfRowCustomLayout = rowInputValue;
    } else {
      const rowInputValue = parseInt(event.formattedValue);
      this.numberOfRowCustomLayout = rowInputValue;
    }
    if (this.numberOfRowCustomLayout > this.customLayout.length) {
      this.addRow();
    } else {
      this.removeRow();
    }
  }

  addRow() {
    if (this.customLayout.length < this.MAX_ROWS) {
      this.customLayout.push([0]);
      this.customLayoutNumberOfCell.push(1);
    }
  }

  removeRow() {
    if (this.customLayout.length > 1) {
      this.customLayout.pop();
      this.customLayoutNumberOfCell.pop();
    }
  }

  addCol(index: number) {
    if (this.customLayout[index].length < this.MAX_COLS) {
      this.customLayout[index].push(0);
    }
  }

  removeCol(index: number) {
    if (this.customLayout[index].length > 1) {
      this.customLayout[index].pop();
    }
  }

  onRowCellInputChange(event: InputNumberInputEvent, index: number) {
    console.log(event, index);
    if (parseInt(event.value) <= this.MAX_ROWS) {
      const rowInputValue = parseInt(event.value);
      this.customLayoutNumberOfCell[index] = rowInputValue;
    } else {
      const rowInputValue = parseInt(event.formattedValue);
      this.customLayoutNumberOfCell[index] = rowInputValue;
    }
    if (
      this.customLayoutNumberOfCell[index] > this.customLayout[index].length
    ) {
      this.addCol(index);
    } else {
      this.removeCol(index);
    }
  }

  get layoutSelected(): number[][] {
    return this.layoutService.config().layout;
  }

  setLayout(_val: number[][]) {
    console.log("Set layout", new Date());
    this.layoutService.changeLayout(_val);
  }
}
