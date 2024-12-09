import 'reflect-metadata';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../models/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { PutOfferDto } from './dto/put-offer.dto.js';
import { City } from '../../models/index.js';
import { Types } from 'mongoose';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async checkIdExists(id: Types.ObjectId): Promise<boolean> {
    const result = await this.offerModel.findById(id);
    return Boolean(result);
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = this.offerModel.create(dto);

    this.logger.info(`New offer created: ${dto.name}`);
    return result;
  }

  public async findById(id: Types.ObjectId): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id).exec();
  }

  public async change(dto: PutOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndUpdate(dto.id, dto).exec();
    this.logger.info(`Update offer: ${result?.name}`);
    return result;
  }

  public async deleteById(id: Types.ObjectId): Promise<void> {
    const result = await this.offerModel.findByIdAndDelete(id).exec();
    this.logger.info(`Offer deleted: ${result?.name}`);
  }

  public async findAll(limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().skip(skip).limit(limit).exec();
  }

  public async findAllPremium(city: City, limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({isPremium: true, city: city}).skip(skip).limit(limit).exec();
  }

  public async findAllFavourite(userId: Types.ObjectId, limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({favouriteUsers: {'$in': [userId]}}).skip(skip).limit(limit).exec();
  }

  public async addToFavourite(orderId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    await this.offerModel.findByIdAndUpdate(orderId, {'$push': {favouriteUsers: userId}}).exec();
  }

  public async removeFromFavourite(orderId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    await this.offerModel.findByIdAndUpdate(orderId, {'$pop': {favouriteUsers: userId}}).exec();
  }
}
