// This service acts as the third party control of services with actual draft entities
// By using this service, we can create, save, edit, and discard drafts of widgets and customers
// no entities exist on this service since it is only for control purposes
// The control service is used to create, save, edit, and discard drafts of widgets and customers
service ControlService {

    action createDraft() returns {
        widgetID : UUID;
        customerID : UUID
    };

    action saveDraft(widgetID : UUID, customerID : UUID);
    action editDraft(widgetID : UUID, customerID : UUID);
    action discardDraft(widgetID : UUID, customerID : UUID);

}
