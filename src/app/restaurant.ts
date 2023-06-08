import { BSON } from 'realm-web';

export interface Restaurant {
    _id: string | BSON.ObjectId;
    name: string;
    text: string;
}
