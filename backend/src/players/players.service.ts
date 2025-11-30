import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdateScoreDto } from './dto/update-score.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  async registerOrLogin(createPlayerDto: CreatePlayerDto) {
    // Check if user exists
    const existingPlayer = await this.playersRepository.findOne({
      where: { name: createPlayerDto.name },
    });

    if (existingPlayer) {
      return {
        message: 'Welcome back!',
        player: existingPlayer,
      };
    }

    // Create new player
    const newPlayer = this.playersRepository.create(createPlayerDto);
    const savedPlayer = await this.playersRepository.save(newPlayer);

    return {
      message: 'Player registered!',
      player: savedPlayer,
    };
  }

  async updateScore(updateScoreDto: UpdateScoreDto) {
    const player = await this.playersRepository.findOne({
      where: { id: updateScoreDto.id },
    });

    if (!player) {
      throw new Error('Player not found');
    }

    if (updateScoreDto.score > player.highScore) {
      player.highScore = updateScoreDto.score;
      await this.playersRepository.save(player);
      return {
        message: 'New high score!',
        newHighScore: updateScoreDto.score,
      };
    }

    return {
      message: 'Score updated (not a high score)',
      currentHighScore: player.highScore,
    };
  }

  async getLeaderboard() {
    return this.playersRepository.find({
      select: ['name', 'place', 'highScore'],
      order: { highScore: 'DESC' },
      take: 10,
    });
  }

  async findAll() {
    return this.playersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.playersRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const player = await this.findOne(id);
    if (!player) {
      throw new Error('Player not found');
    }
    await this.playersRepository.remove(player);
    return { message: 'Player deleted successfully' };
  }
}
