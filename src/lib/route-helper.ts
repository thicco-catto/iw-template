import { Filter, ObjectId, Document } from "mongodb";

export interface Params<T> {
    params: T
}

/**
 * Returns a filter object used in mongodb queries that only contains a filter for the id.
 * @param id 
 */
export function GetIdFilter(id: string): Filter<Document> {
    return {_id: {$eq: ObjectId.createFromHexString(id)}};
}