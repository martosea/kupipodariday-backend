import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HashService } from '../hash/hash.service';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { email, username, password, avatar, about } = createUserDto;
    const hashedPassword = await this.hashService.hashPassword(password);
    const newUser = this.userRepository.create({
      email,
      username,
      avatar,
      about,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);
    return savedUser.toJSON();
  }

  async findOne(query: string, includePassword = false): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username: query } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return includePassword ? user : user.toJSON();
  }

  async findMany(query: FindUserDto): Promise<any[]> {
    if (!query.query) return [];
    const users = await this.userRepository.find({
      where: [{ username: ILike(`%${query.query}%`) }, { email: ILike(`%${query.query}%`) }],
    });
    return users.map((user) => user.toJSON());
  }

  async findById(id: number): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user.toJSON();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    const { password } = updateUserDto;
    if (password) {
      updateUserDto.password = await this.hashService.hashPassword(password);
    }
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async getOwnWishes(id: number): Promise<any[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['wishes', 'wishes.owner', 'wishes.offers', 'wishes.offers.user'],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user.wishes.map((wish) =>
      typeof (wish as any).toJSON === 'function' ? (wish as any).toJSON() : wish,
    );
  }

  async findWishes(username: string): Promise<any[]> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: [
        'wishes',
        'wishes.offers',
        'wishes.offers.item',
        'wishes.offers.user',
        'wishes.offers.item.owner',
      ],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user.wishes.map((wish) =>
      typeof (wish as any).toJSON === 'function' ? (wish as any).toJSON() : wish,
    );
  }
}
