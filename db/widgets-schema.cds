using {
    cuid,
    managed,
} from '@sap/cds/common';

// main entity for draft control
entity Widgets : cuid, managed {
    name        : String(10);
    description : String(60);
    components  : Composition of many Components
                      on components.widget = $self;
}

// Components of a Widget - want to ensure composition works with programmatic draft control
entity Components : cuid, managed {
    key widget   : Association to Widgets;
        name        : String(10);
        description : String(60);
        quantity    : Integer;
}



