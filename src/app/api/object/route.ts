import { NextRequest, NextResponse } from "next/server";
import { Filter, Document } from "mongodb";
import { GetNombreDeLaColeccion } from "@/lib/database";
import { HasAllKeys } from "@/lib/dict-helper";

//Esta ruta es para el GET de varios elementos y el POST (crear un elemento nuevo)

const KEYS: string[] = [
    //Cada una de las claves que tengan los objetos en la base de datos
    //Al menos las que hagan falta para crear un objeto
];

export async function GET(request: NextRequest) {
    const coleccion = await GetNombreDeLaColeccion();
    const params = request.nextUrl.searchParams;

    const filter: Filter<Document> = {$and: []};

    const number = params.get("number");
    if(number) {
        const parsedNumber = parseInt(number);
        if(Number.isNaN(parsedNumber)) {
            return NextResponse.json({}, {status: 406});
        }

        filter.$and?.push({"Number": {$gte: parsedNumber}});
    }
    
    
    const string = params.get("string");
    if(string) {
        filter.$and?.push({"String": {$eq: string}});
    }

    //En el caso de que el and este vacio, hay que borrar el and porque sino no funciona
    if (filter.$and?.length === 0) {
        delete filter.$and;
    }
    const res = await coleccion.find(filter).toArray();

    return NextResponse.json(
        res,
        {
            status: 200
        }
    );
}

export async function POST(request: NextRequest) {
    const coleccion = await GetNombreDeLaColeccion();
    const json = await request.json();

    if(!HasAllKeys(json, KEYS)) {
        return NextResponse.json(
            {
                msg: "Fields are not correct"
            },
            {
                status: 406
            }
        );
    }

    //Si es una fecha, el json te la pasa como un string, hay que convertirla a fecha
    json["Date"] = new Date(json["Date"]);
    
    const result = await coleccion.insertOne(json);

    const status = result.acknowledged? 201: 500;
    const id = result.insertedId;

    return NextResponse.json(
        {
            id: id
        },
        {
            status: status
        }
    );
}