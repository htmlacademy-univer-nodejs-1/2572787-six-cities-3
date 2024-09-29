import { HousingType } from './housing-type.enum.js';
import { ConvenienceType } from './convenience-type.enum.js';

export function ConvertToHousingType(value: string): HousingType {
  switch (value) {
    case 'apartment':
      return HousingType.Apartment;
    case 'house':
      return HousingType.House;
    case 'room':
      return HousingType.Room;
    case 'hotel':
      return HousingType.Hotel;
    default:
      throw new Error(`Failed to convert this value to HousingType: ${value}`);
  }
}

export function ConvertToConvenienceType(value: string): ConvenienceType {
  switch (value) {
    case 'Breakfast':
      return ConvenienceType.Breakfast;
    case 'Air conditioning':
      return ConvenienceType.AirConditioning;
    case 'Laptop friendly workspace':
      return ConvenienceType.LaptopFriendlyWorkspace;
    case 'Baby seat':
      return ConvenienceType.BabySeat;
    case 'Washer':
      return ConvenienceType.Washer;
    case 'Towels':
      return ConvenienceType.Towels;
    case 'Fridge':
      return ConvenienceType.Fridge;
    default:
      throw new Error(`Failed to convert this value to HousingType: ${value}`);
  }
}
