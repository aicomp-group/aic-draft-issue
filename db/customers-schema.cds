using {
    cuid,
    managed,
} from '@sap/cds/common';

//Main Customers Entity
entity Customers : cuid, managed {
    name        : String(10);
    description : String(60);
}



