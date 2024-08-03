import { AddressConcatPipe } from './address-concat.pipe';

describe('AddressConcatPipe', () => {
  it('create an instance', () => {
    const pipe = new AddressConcatPipe();
    expect(pipe).toBeTruthy();
  });
});
