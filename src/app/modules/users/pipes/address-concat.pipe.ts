import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '../models/user.model';

@Pipe({
  name: 'addressConcat',
  standalone: true,
})
export class AddressConcatPipe implements PipeTransform {
  transform(value: Address): string {
    if (!Object.values(value).length) return 'address not found';
    let addressConcat = '';
    addressConcat = addressConcat.concat(value.street);
    addressConcat = value.street
      ? addressConcat.concat(', ' + value.suite)
      : addressConcat.concat(value.suite);
    addressConcat =
      value.street || value.suite
        ? addressConcat.concat(', ' + value.city)
        : addressConcat.concat(value.city);
    addressConcat =
      value.street || value.suite || value.city
        ? addressConcat.concat(', ' + value.zipcode)
        : addressConcat.concat(value.zipcode);
    return addressConcat;
  }
}
