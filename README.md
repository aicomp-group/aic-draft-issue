# Abstract

This is a CAP project to highlight the issues with programmatic draft control in CDS.

While this feature is in Beta, we were able to get it to work as expected using version 8.5.1, but are now having issues getting it to work with any minor release after 8.5.1.

## Supporting Documentation

Programmatic control of draft is documented at https://cap.cloud.sap/docs/node.js/fiori#programmatic-invocation-of-draft-actions


## To Replicate Issues

- run `npm install` on root directory of project
- Open a new terminal and run `cds watch`
- Run local test scripts in draft-test.http

## Working Branch

Branch `main` shows where the application is failing using version 8.7.0 while branch `working` shows the application successfully working using 8.5.1
