using {Widgets as schemaWidgets} from '../db/widgets-schema';

service WidgetsService {

  entity Widgets as projection on schemaWidgets;
  annotate Widgets with @odata.draft.enabled;

}
