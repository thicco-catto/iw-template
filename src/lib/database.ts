import { MongoClient, ServerApiVersion } from "mongodb";


const uri = process.env.MONGODB_URI;
let clientPromise: Promise<MongoClient>;
if (uri === undefined) {
    console.log("[ERROR] Need to define MongoDB uri as an environment variable");
} else {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    clientPromise = client.connect();
}

/**
 * Returns a database instance.
 * 
 * @param name Don't specify a name to get the Rastro database.
 * @returns
 */
export async function GetDatabase(name = "Nombre de tu db") {
    return (await clientPromise).db(name);
}

//Este metodo sirve para devolver cada una de las direcciones, cambiar para cada una de tus colecciones
//Cambiar lo de nombre de la coleccion para cada una de tus colecciones
export async function GetNombreDeLaColeccion() {
    const db = await GetDatabase();
    return db.collection("Nombre de la coleccion");
}