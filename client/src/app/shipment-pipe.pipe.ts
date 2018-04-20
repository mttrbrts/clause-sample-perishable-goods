import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shipmentPipe'
})
export class ShipmentPipePipe implements PipeTransform {

  transform(items: any[]): any {
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => {
      return item.sensorReadings.length > 0 && item.status === 'IN_TRANSIT';
    });
  }

}
