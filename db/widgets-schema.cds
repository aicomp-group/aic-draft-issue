using {
    cuid,
    managed,
} from '@sap/cds/common';


entity Widgets : cuid, managed {
    name        : String(10);
    description : String(60);
    components  : Composition of many Components
                      on components.widget = $self;
}


entity Components : cuid, managed {
    key widget   : Association to Widgets;
        name        : String(10);
        description : String(60);
        quantity    : Integer;
}



