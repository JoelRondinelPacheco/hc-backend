import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SaleService } from '../services/sale.service';
import { CreateSaleDTO, finishSaleDTO } from '../dto/sale.dto';
import { RolesAccess } from 'src/auth/decorators/roleaccess.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

//@UseGuards(AuthGuard)
@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  //@RolesAccess('SALEEMPLOYEE')
  @Post('agregar')
  public async createSale(@Body() body: CreateSaleDTO) {
    return await this.saleService.createSale(body);
  }

  @RolesAccess('ADMIN')
  @Get('all')
  public async getAllSales() {
    return await this.saleService.getAllSales();
  }

  @Get(':saleId')
  public async getSaleById(@Param('saleId') saleId: string) {
    return await this.saleService.getSaleById(saleId);
  }

  @RolesAccess('SALEOWNER')
  @Put('edit/:saleId')
  public async finishSale(
    @Param('saleId') saleId: string,
    @Body() body: finishSaleDTO,
  ) {
    return await this.saleService.finishSale(saleId, body);
  }
}
