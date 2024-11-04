import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { Types } from 'mongoose';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: Types.ObjectId): Promise<DocumentType<OfferEntity> | null>;
}
