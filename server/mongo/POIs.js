const {getCollection} = require("./helpers");

async function add_POI(docs) {
    const collection = getCollection(process.env.COLL_POIS);
    if (Array.isArray(docs)) {
        let bulkOpArray = [];

        for (let doc of docs) {
            doc.coordinates = JSON.parse(JSON.stringify(doc.coordinates, ['lng', 'lat']))
            let singleOperation = {
                replaceOne: {
                    filter: {id: doc.id}, replacement: doc, upsert: true
                }
            }
            bulkOpArray.push(singleOperation);
        }

        await collection.bulkWrite(bulkOpArray, {ordered: false})
            .catch(err => {
                console.log(err.result);
            });
    } else await upsert_onePOI(collection, docs);

}

/** Upserts one document */
async function upsert_onePOI(collection, doc) {
    doc.coordinates = JSON.parse(JSON.stringify(doc.coordinates, ['lng', 'lat']))
    await collection.findOneAndReplace({id: doc.id}, doc, {
        upsert: true
    }).catch(err => {
        console.log(err.result);
        console.log("\nSchema validation failed. Doc skipped.");
        console.log("Details: " + JSON.stringify(err.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied, null, 1));
    })
}

const searchPOI = (query) => {
    const collection = getCollection(process.env.COLL_POIS);
    return collection.find({$text: {$search: query}});
}

const searchNear = (center, distance) => {
    const collection = getCollection(process.env.COLL_POIS);
    const filter = {
        'coordinates': {
            '$geoWithin': {
                '$centerSphere': [
                    [
                        center.lng, center.lat
                    ], distance / process.env.EARTH_CIRCUM_IN_KM
                ]
            }
        }
    };
    const projection = {
        '_id': 0,
        'id': 1
    };
    return collection.find(filter, { projection: projection }
    //     , (cmdErr, result) => {
    //     assert.equal(null, cmdErr);
    // }
    );
}

/** The schema used for the collection's validation */
const schema = {
    $jsonSchema: {
        properties: {
            id: {
                bsonType: 'string'
            }, name: {
                bsonType: 'string'
            }, address: {
                bsonType: 'string'
            }, types: {
                bsonType: 'array', minItems: 1, items: {
                    bsonType: 'string'
                }
            }, coordinates: {
                bsonType: 'object', minItems: 2, maxItems: 2, properties: {
                        lng: {
                            bsonType: 'double',
                            minimum: -180,
                            maximum: 180
                        }, lat: {
                            bsonType: 'double',
                            minimum: -90,
                            maximum: 90
                        },
                }
            }, rating: {
                bsonType: 'number'
            }, rating_n: {
                bsonType: 'int'
            }, current_popularity: {
                bsonType: 'int'
            }, populartimes: {
                bsonType: 'array', minItems: 7, maxItems: 7, items: {
                    bsonType: 'object', minItems: 2, maxItems: 2, properties: {
                        name: {
                            bsonType: 'string', uniqueItems: true
                        }, data: {
                            bsonType: 'array', minItems: 24, maxItems: 24, items: {
                                bsonType: 'int'
                            }
                        }
                    }
                }
            }, time_spent: {
                bsonType: 'array', minItems: 2, maxItems: 2, items: {
                    bsonType: 'int'
                }
            }, time_wait: {
                bsonType: 'array', minItems: 7, maxItems: 7, items: {
                    bsonType: 'object', minItems: 2, maxItems: 2, properties: {
                        name: {
                            bsonType: 'string'
                        }, data: {
                            bsonType: 'array', minItems: 24, maxItems: 24, items: {
                                bsonType: 'int'
                            }
                        }
                    }
                }
            }
        }, required: ['id', 'name', 'address', 'types', 'coordinates', 'populartimes']
    }
};

const index = [[{
    id: 1
}, {
    unique: true, name: "UniquePOI_Index"
},], [{
    name: 'text', address: 'text', types: 'text'
}, {
    weights: {
        name: 10, types: 5,
    }, name: 'WeightedSearchIndex'
}], [{
    coordinates: '2dsphere'
}]]


module.exports = {schema, index, add_POI};
