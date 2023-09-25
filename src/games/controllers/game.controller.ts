import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GameService } from '../services/game.service';
import { GameDTO, UpdateGameDTO } from '../dto/game.dto';
import { RolesAccess } from 'src/auth/decorators/roleaccess.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

//@UseGuards(AuthGuard)
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  // @RolesAccess('ADMIN')
  @Post('agregar')
  public async createPost(@Body() body: GameDTO) {
    return await this.gameService.createGame(body);
  }

  //  @RolesAccess('ADMIN')
  @Get('all')
  public async getAllGames() {
    return await this.gameService.getAllGames();
  }

  // @RolesAccess('EMPLOYEE')
  @Get('game/:gameId')
  public async getGameById(@Param('gameId') gameId: string) {
    return await this.gameService.getGameById(gameId);
  }

  // @RolesAccess('ADMIN')
  @Put('edit/:gameId')
  public async updateGame(
    @Param('gameId') gameId: string,
    @Body() body: UpdateGameDTO,
  ) {
    return await this.gameService.updateGame(gameId, body);
  }

  // @RolesAccess('ADMIN')
  @Delete('delete/:gameId')
  public async deleteGame(@Param('gameId') gameId: string) {
    return await this.gameService.deleteGame(gameId);
  }
}
