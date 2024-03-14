import { BSON } from 'realm-web';
import { UploudedImage } from './uplouded-image';

export interface NewReview {
    name: string;
    text: string;
    date: string;
    images?: { fileName: string, mimeType: string }[];
    tags?: string[];
}

export interface RawReview extends NewReview {
    _id: string | BSON.ObjectId;
    restaurant_id: string | BSON.ObjectId;
}

export interface CustomerReview extends RawReview {
    sentiment: string;
    food: number;
    service: number;
    interior: number;
    total: number;
    images: UploudedImage[];
}
