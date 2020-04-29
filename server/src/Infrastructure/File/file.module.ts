import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BusModule} from '../bus.module';
import {File} from 'src/Domain/File/File.entity';
import {FileRepository} from './Repository/FileRepository';
import {LocalFileStorageAdapter} from '../Adapter/LocalFileStorageAdapter';
import {UploadFileCommandHandler} from 'src/Application/File/Command/UploadFileCommandHandler';
import {DateUtilsAdapter} from '../Adapter/DateUtilsAdapter';
import {FileDirectoryStrategy} from 'src/Domain/File/Strategy/FileDirectoryStrategy';

@Module({
  imports: [BusModule, ConfigModule, TypeOrmModule.forFeature([File])],
  controllers: [],
  providers: [
    {provide: 'IFileRepository', useClass: FileRepository},
    {provide: 'IFileStorage', useClass: LocalFileStorageAdapter},
    {provide: 'IDateUtils', useClass: DateUtilsAdapter},
    UploadFileCommandHandler,
    FileDirectoryStrategy
  ]
})
export class FileModule {}