import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'hasChildren',
    standalone:true
})

export class HasChildrenPipe implements PipeTransform {
    transform(element:HTMLElement) {
        if(element && element.children && element.children.length > 0) {
            return true;
        }
        return false;
    }
}