export enum PropertyErrorCode {
    PRODUCER_NOT_FOUND = 'PROPERTIES_001',
    PROPERTY_NOT_FOUND = 'PROPERTIES_002',
    INVALID_AREA_SUM = 'PROPERTIES_003',
}

export enum ProducerErrorCode {
    PRODUCER_NOT_FOUND = 'PRODUCER_001'
}

export enum HarvestErrorCode {
    HARVEST_NOT_FOUND = 'HARVEST_001',
    INVALID_YEAR = 'HARVEST_002',
}

export enum PlantedCultureErrorCode {
    CULTURE_NOT_FOUND = 'CULTURE_001',
    DUPLICATE_CULTURE_IN_HARVEST = 'CULTURE_002',
}