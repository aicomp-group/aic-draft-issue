const cds = require("@sap/cds")

module.exports = cds.service.impl(async (srv) => {
  const widgetsService = await cds.connect.to("WidgetsService")
  const customersService = await cds.connect.to("CustomersService")
  const { Widgets, Components } = widgetsService.entities
  const { Customers } = customersService.entities

  srv.on("createDraft", async (req) => {
    // Create a new draft for a widget
    const { ID: widgetID } = await widgetsService.new(Widgets, {})

    await UPDATE.entity(Widgets.drafts, { ID: widgetID }).with({ name: "widget-01", description: "Widget 1" })

    const { DraftAdministrativeData_DraftUUID } = await SELECT.one.from(Widgets.drafts).columns(`DraftAdministrativeData_DraftUUID`).where({ ID: widgetID })

    // TODO: Add additional components
    const componentEntries = [
      { name: "comp-01", description: "Component 1", quantity: 2, widget_ID: widgetID, DraftAdministrativeData_DraftUUID },
      { name: "comp-02", description: "Component 2", quantity: 4, widget_ID: widgetID, DraftAdministrativeData_DraftUUID },
    ]

    await INSERT.into(Components.drafts).entries(componentEntries)

    // Create a new draft for a customer
    const { ID: customerID } = await customersService.new(Customers, {})

    // FIXME: Add more descriptive customer name and description
    await UPDATE.entity(Customers.drafts, { ID: customerID }).with({ name: "cust-01", description: "Customer 1" })

    return { widgetID, customerID }
  })

  srv.on("saveDraft", async (req) => {
    const { widgetID, customerID } = req.data

    await widgetsService.save(Widgets, { ID: widgetID })

    await customersService.save(Customers, { ID: customerID })

  })

  srv.on("editDraft", async (req) => {
    const { widgetID, customerID } = req.data

    await widgetsService.edit(Widgets, { ID: widgetID })
    await customersService.edit(Customers, { ID: customerID })

    const widgetDraft = await SELECT.one.from(Widgets.drafts).where({ ID: widgetID })
    if (widgetDraft) {
      console.log(`Widget draft found for ID: ${widgetID}`)
    } else {
      req.error(500, `Widget draft NOT found for ID: ${widgetID}`)
    }

    const customerDraft = await SELECT.one.from(Customers.drafts).where({ ID: customerID })
    if (customerDraft) {
      console.log(`Customer draft found for ID: ${customerID}`)
    } else {
      req.error(500, `Customer draft NOT found for ID: ${customerID}`)
    }
  })

  srv.on("discardDraft", async (req) => {
    const { widgetID, customerID } = req.data

    await widgetsService.cancel(Widgets.drafts, { ID: widgetID })
    await customersService.cancel(Customers.drafts, { ID: customerID })

  })
})
