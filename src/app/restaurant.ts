import { BSON } from 'realm-web';
import { Grade } from './grade';
import { Address } from './address';

export interface Restaurant {
    _id: string | BSON.ObjectId;
    name: string;
    imageURL: string;
    borough: string;
    cuisine: string;
    grades: Grade[];
    address: Address;
}
