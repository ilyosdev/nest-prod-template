import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {IPayStubRepository} from 'src/Domain/HumanResource/PayStub/Repository/IPayStubRepository';
import {PayStub} from 'src/Domain/HumanResource/PayStub/PayStub.entity';
import {User} from 'src/Domain/HumanResource/User/User.entity';

export class PayStubRepository implements IPayStubRepository {
  constructor(
    @InjectRepository(PayStub)
    private readonly repository: Repository<PayStub>
  ) {}

  public save(payStub: PayStub): Promise<PayStub> {
    return this.repository.save(payStub);
  }

  public findOneByUserAndDate(
    user: User,
    date: Date
  ): Promise<PayStub | undefined> {
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();

    return this.repository
      .createQueryBuilder('payStub')
      .select(['payStub.id'])
      .where('payStub.user = :userId', {userId: user.getId()})
      .andWhere('extract(month FROM payStub.date) = :month', {month})
      .andWhere('extract(year FROM payStub.date) = :year', {year})
      .getOne();
  }

  public findAll(): Promise<PayStub[]> {
    return this.repository
      .createQueryBuilder('payStub')
      .select([
        'payStub.id',
        'payStub.date',
        'user.id',
        'user.firstName',
        'user.lastName',
        'file.id',
        'file.name',
        'file.size'
      ])
      .innerJoin('payStub.file', 'file')
      .innerJoin('payStub.user', 'user')
      .orderBy('payStub.date', 'DESC')
      .getMany();
  }
}
