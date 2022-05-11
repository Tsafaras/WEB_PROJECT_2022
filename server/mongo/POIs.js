async function add_POI(docs) {
    if (Array.isArray(docs)) {
        let bulkOpArray = [];

        for (let doc of docs) {
            let singleOperation = {
                replaceOne: {
                    filter: {id: doc.id},
                    replacement: doc,
                    upsert: true
                }
            }
            bulkOpArray.push(singleOperation);
        }

        await this.collection.bulkWrite(bulkOpArray).catch(err => {
            console.log(err.result);
        });
    } else
        await upsert_onePOI(docs);

}

/** Upserts one document */
async function upsert_onePOI(doc) {
    await this.collection.findOneAndReplace({id: doc.id}, doc, {
        upsert: true
    }).catch(err => {
        console.log(err.result);
        console.log("\nSchema validation failed. Doc skipped.");
        console.log("Details: " +
            JSON.stringify(err.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied, null, 1));
    })
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
                bsonType: 'object', minItems: 2, maxItems: 2, items: {
                    bsonType: 'double'
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

module.exports = {schema};
