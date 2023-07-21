import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { SaleEntity } from '../entities/sale.entity';
import {
  CreateSaleDTO,
  CreateSaleResDTO,
  finishSaleDTO,
} from '../dto/sale.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(SaleEntity)
    private readonly saleRepository: Repository<SaleEntity>,
  ) {}

  public async createSale(body: CreateSaleDTO): Promise<CreateSaleResDTO> {
    try {
      const sale = await this.saleRepository.save(body);
      if (!sale) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo crear la venta',
        });
      }
      return sale;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async finishSale(
    id: string,
    body: finishSaleDTO,
  ): Promise<UpdateResult | undefined> {
    try {
      const sale = await this.saleRepository.update(id, body);
      if (!sale) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo crear la venta',
        });
      }
      return sale;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getSaleById(id: string) {
    try {
      const sale = await this.saleRepository
        .createQueryBuilder('sale')
        .where({ id })
        .getOne();
      if (!sale) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Venta no econtrado',
        });
      }
      return sale;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getAllSales(): Promise<SaleEntity[]> {
    try {
      const sales = await this.saleRepository.find();
      if (sales.length === 0) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No se encontraro ventas',
        });
      }
      return sales;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
