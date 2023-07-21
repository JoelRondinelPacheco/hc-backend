import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { GameEntity } from '../entities/game.entity';
import { GameDTO, UpdateGameDTO } from '../dto/game.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
  ) {}

  public async createGame(body: GameDTO): Promise<GameEntity> {
    try {
      const game = await this.gameRepository.save(body);
      if (!game) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo crear el empleado',
        });
      }
      return game;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getAllGames(): Promise<GameEntity[]> {
    try {
      const games: GameEntity[] = await this.gameRepository.find();
      if (games.length === 0) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No se encontraron resultados',
        });
      }
      return games;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getGameById(id: string): Promise<GameEntity> {
    try {
      //VERIICAR UUID
      const game = await this.gameRepository
        .createQueryBuilder('game')
        .where({ id })
        .getOne();
      if (!game) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No se encontro el juego',
        });
      }
      return game;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateGame(
    id: string,
    body: UpdateGameDTO,
  ): Promise<UpdateResult | undefined> {
    try {
      //VERIFICAR QUE SEA UUID, SI NO LES ES BAD_REQUEST
      // VERIFICAR QUE EXISTA
      // SI NO EXISTE NOT FOUND
      const game = await this.gameRepository.update(id, body);
      if (game.affected === 0) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo actualizar el juego',
        });
      }
      return game;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteGame(id: string): Promise<DeleteResult | undefined> {
    try {
      //VERIFICAR QUE SEA UUID, SI NO LES ES BAD_REQUEST
      // VERIFICAR QUE EXISTA
      // SI NO EXISTE NOT FOUND
      const game = await this.gameRepository.delete(id);
      if (game.affected === 0) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo eliminar el juego',
        });
      }
      return game;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
