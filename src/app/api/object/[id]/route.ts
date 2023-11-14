import { GetNombreDeLaColeccion } from "@/lib/database";
import { HasCorrectKeys } from "@/lib/dict-helper";
import { GetIdFilter, Params } from "@/lib/route-helper";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

//Esta ruta es para el GET de un elemento especifico y el PUT (actualizar un elemento)
//y el DELETE de un elemento especifico.

//Aqui hay que poner una key por cada uno de los [id] o lo que sea que haya en la ruta
interface RouteParams {
    id: string
}

const KEYS: string[] = [
    //Cada una de las claves que tengan los objetos en la base de datos
    //Al menos todas las que se puedan actualizar
];

export async function GET(_: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if(!ObjectId.isValid(id)) {
        return NextResponse.json({}, {status: 406});
    }

    const coleccion = await GetNombreDeLaColeccion();

    const res = await coleccion.findOne(GetIdFilter(id));

    if(!res) {
        return NextResponse.json({}, {status: 404});
    }

    return NextResponse.json(res, {status: 200});
}

export async function PUT(request: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if(!ObjectId.isValid(id)) {
        return NextResponse.json({}, {status: 406});
    }

    const json = await request.json();

    const coleccion = await GetNombreDeLaColeccion();

    if(!HasCorrectKeys(json, KEYS)) {
        return NextResponse.json({}, {status: 406});
    }

    const res = await coleccion.updateOne(
        GetIdFilter(id),
        {
            $set: json
        }
    );

    if(res.matchedCount === 0) {
        return NextResponse.json({}, {status: 404});
    }

    return NextResponse.json({}, {status: 200});
}

export async function DELETE(_: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if(!ObjectId.isValid(id)) {
        return NextResponse.json({}, {status: 406});
    }

    const coleccion = await GetNombreDeLaColeccion();

    const res = await coleccion.deleteOne(GetIdFilter(id));

    const status = res.acknowledged ? 200: 500;

    return NextResponse.json(
        {},
        {
            status: status
        }
    );
}