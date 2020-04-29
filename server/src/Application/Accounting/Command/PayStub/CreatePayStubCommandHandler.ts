import {CommandHandler} from '@nestjs/cqrs';
import {Inject} from '@nestjs/common';
import {CreatePayStubCommand} from './CreatePayStubCommand';
import {IPayStubRepository} from 'src/Domain/Accounting/Repository/IPayStubRepository';
import {PayStub} from 'src/Domain/Accounting/PayStub.entity';
import {IUserRepository} from 'src/Domain/User/Repository/IUserRepository';
import {IFileRepository} from 'src/Domain/File/Repository/IFileRepository';
import {UserNotFoundException} from 'src/Domain/User/Exception/UserNotFoundException';
import {FileNotFoundException} from 'src/Domain/File/Exception/FileNotFoundException';

@CommandHandler(CreatePayStubCommand)
export class CreatePayStubCommandHandler {
  constructor(
    @Inject('IPayStubRepository')
    private readonly payStubRepository: IPayStubRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IFileRepository')
    private readonly fileRepository: IFileRepository
  ) {}

  public async execute(command: CreatePayStubCommand): Promise<string> {
    const {date, fileId, userId} = command;

    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const file = await this.fileRepository.findOneById(fileId);
    if (!file) {
      throw new FileNotFoundException();
    }

    const payStub = await this.payStubRepository.save(
      new PayStub(date, file, user)
    );

    return payStub.getId();
  }
}
