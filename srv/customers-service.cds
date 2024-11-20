using {Customers as schemaCustomers} from '../db/customers-schema';

service CustomersService {

  entity Customers as projection on schemaCustomers;
  annotate Customers with @odata.draft.enabled;

}
