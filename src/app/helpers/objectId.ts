import { BSON } from 'realm-web';

const ObjectId = BSON.ObjectId;

export { ObjectId };

export function compareIds(a: any, b: any) {
    const oa = new ObjectId(a);
    const ob = new ObjectId(b);

    return oa.equals(ob);
}
