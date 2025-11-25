import { Controller, Get } from '@nestjs/common';

@Controller('listings')
export class ListingsController {
  @Get()
  getAll() {
    return [
      { id: 1, title: 'Room in Abuja', price: 50000 },
      { id: 2, title: 'Flat in Lagos', price: 120000 },
    ];
  }
}
