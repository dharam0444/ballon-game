import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdateScoreDto } from './dto/update-score.dto';

@Controller('api')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post('user')
  registerOrLogin(@Body(ValidationPipe) createPlayerDto: CreatePlayerDto) {
    return this.playersService.registerOrLogin(createPlayerDto);
  }

  @Post('score')
  updateScore(@Body(ValidationPipe) updateScoreDto: UpdateScoreDto) {
    return this.playersService.updateScore(updateScoreDto);
  }

  @Get('leaderboard')
  getLeaderboard() {
    return this.playersService.getLeaderboard();
  }

  // Admin endpoints
  @Get('players')
  findAll() {
    return this.playersService.findAll();
  }

  @Get('players/:id')
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(+id);
  }

  @Delete('players/:id')
  remove(@Param('id') id: string) {
    return this.playersService.remove(+id);
  }
}
