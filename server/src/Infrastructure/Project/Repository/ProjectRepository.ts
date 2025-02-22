import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProjectRepository } from 'src/Domain/Project/Repository/IProjectRepository';
import { Project } from 'src/Domain/Project/Project.entity';
import { MAX_ITEMS_PER_PAGE } from 'src/Application/Common/Pagination';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>
  ) {}

  public save(project: Project): Promise<Project> {
    return this.repository.save(project);
  }

  public findOneByName(name: string): Promise<Project | undefined> {
    return this.repository
      .createQueryBuilder('project')
      .where('LOWER(project.name) = LOWER(:name)', { name })
      .getOne();
  }

  public findOneById(id: string): Promise<Project | undefined> {
    return this.repository
      .createQueryBuilder('project')
      .select([
        'project.id',
        'project.name',
        'project.invoiceUnit',
        'customer.id',
        'customer.name'
      ])
      .innerJoin('project.customer', 'customer')
      .where('project.id = :id', { id })
      .getOne();
  }

  public findProjects(
    page: number = 1,
    customerId?: string
  ): Promise<[Project[], number]> {
    const query = this.repository
      .createQueryBuilder('project')
      .select([
        'project.id',
        'project.name',
        'project.invoiceUnit',
        'customer.id',
        'customer.name'
      ])
      .innerJoin('project.customer', 'customer')
      .orderBy('customer.name', 'ASC')
      .addOrderBy('project.name', 'ASC')
      .limit(MAX_ITEMS_PER_PAGE)
      .offset((page - 1) * MAX_ITEMS_PER_PAGE);

    if (customerId) {
      query.andWhere('customer.id = :customerId', { customerId });
    }

    return query.getManyAndCount();
  }
}
