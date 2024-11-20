const cds = require("@sap/cds")

module.exports = cds.service.impl(async (srv) => {
  const widgetsService = await cds.connect.to("WidgetsService")
  const customersService = await cds.connect.to("CustomersService")
  const { Widgets, Components } = widgetsService.entities
  const { Customers } = customersService.entities

  srv.on("createDraft", async (req) => {
    // Create a new draft for a widget
    const { ID: widgetID } = await widgetsService.send({ query: INSERT.into(Widgets).entries({}), event: "NEW" })

    await UPDATE.entity(Widgets.drafts, { ID: widgetID }).with({ name: "widget-01", description: "Widget 1" })

    const { DraftAdministrativeData_DraftUUID } = await SELECT.one.from(Widgets.drafts).columns(`DraftAdministrativeData_DraftUUID`).where({ ID: widgetID })

    const componentEntries = [
      { name: "comp-01", description: "Component 1", quantity: 2, widget_ID: widgetID, DraftAdministrativeData_DraftUUID },
      { name: "comp-02", description: "Component 2", quantity: 4, widget_ID: widgetID, DraftAdministrativeData_DraftUUID },
    ]

    await INSERT.into(Components.drafts).entries(componentEntries)

    // Create a new draft for a customer
    const { ID: customerID } = await customersService.send({ query: INSERT.into(Customers).entries({}), event: "NEW" })

    await UPDATE.entity(Customers.drafts, { ID: customerID }).with({ name: "cust-01", description: "Customer 1" })

    return { widgetID, customerID }
  })

  srv.on("saveDraft", async (req) => {
    const { widgetID, customerID } = req.data

    await widgetsService.send({ event: "draftPrepare", query: SELECT.from(Widgets.drafts).where({ ID: widgetID, IsActiveEntity: false }) })
    await widgetsService.send({ event: "draftActivate", query: SELECT.from(Widgets.drafts).where({ ID: widgetID, IsActiveEntity: false }) })

    await customersService.send({ event: "draftPrepare", query: SELECT.from(Customers.drafts).where({ ID: customerID, IsActiveEntity: false }) })
    await customersService.send({ event: "draftActivate", query: SELECT.from(Customers.drafts).where({ ID: customerID, IsActiveEntity: false }) })
  })

  srv.on("editDraft", async (req) => {
    const { widgetID, customerID } = req.data

    // Create Edit draft for the widget
    const requestWidget = new cds.Request({
      event: "draftEdit",
      query: SELECT.from(Widgets).where({ ID: widgetID, IsActiveEntity: true }),
      res: { set: () => {}, status: () => {} },
    })
    await widgetsService.send(requestWidget)

    const requestCustomer = new cds.Request({
      event: "draftEdit",
      query: SELECT.from(Customers).where({ ID: customerID, IsActiveEntity: true }),
      res: { set: () => {}, status: () => {} },
    })
    await customersService.send(requestCustomer)

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

    await widgetsService.send({ event: "CANCEL", query: DELETE.from(Widgets.drafts).where({ ID: widgetID, IsActiveEntity: false }) })
    await customersService.send({ event: "CANCEL", query: DELETE.from(Customers.drafts).where({ ID: customerID, IsActiveEntity: false }) })
  })
})
