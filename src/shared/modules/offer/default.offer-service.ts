import 'reflect-metadata';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../models/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { UUID } from 'node:crypto';
import { PutOfferDto } from './dto/put-offer.dto.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.name}`);
    return result;
  }

  public async findById(id: UUID): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id);
  }

  public async change(dto: PutOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel.findByIdAndUpdate(dto.id, dto);
    this.logger.info(`Update offer: ${result?.name}`);
    return result;
  }

  public async deleteById(id: UUID): Promise<void> {
    const result = this.offerModel.findByIdAndDelete(id);
    this.logger.info(`Offer deleted: ${result.name}`);
  }

  public async findAll(limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().skip(skip).limit(limit);
  }

  public async findAllPremium(limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({isPremium: true}).skip(skip).limit(limit);
  }

  public async findAllFavourite(userId: UUID, limit: number, skip: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({favouriteUsers: {'$in': [userId]}}).skip(skip).limit(limit);
  }

  public async addToFavourite(orderId: UUID, userId: UUID): Promise<void> {
    await this.offerModel.findByIdAndUpdate(orderId, {'$push': {favouriteUsers: userId}});
  }

  public async removeFromFavourite(orderId: UUID, userId: UUID): Promise<void> {
    await this.offerModel.findByIdAndUpdate(orderId, {'$pop': {favouriteUsers: userId}});
  }
}
