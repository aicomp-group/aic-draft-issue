service ControlService {

    action createDraft() returns {
        widgetID : UUID;
        customerID : UUID
    };

    action saveDraft(widgetID : UUID, customerID : UUID);
    action editDraft(widgetID : UUID, customerID : UUID);
    action discardDraft(widgetID : UUID, customerID : UUID);

}
