import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPrisma(){
    return this.appService.getPrisma();
  }

  @Delete()
  deletePrisma(){
    return this.appService.deletePrisma();
  }
}
