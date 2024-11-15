# RealTimeCollabFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.4.

## Overview

RealTimeCollabFrontend is a collaborative document editing application that allows users to create, edit, view, and share documents in real-time. The application leverages the `ngx-editor` for a rich text editing experience and integrates with an API service for document management.

## Features

- **Document Management**: Users can view all documents, including owned and shared documents.
- **Rich Text Editing**: Utilize `ngx-editor` for editing documents with a user-friendly interface that supports various formatting options.
- **Auto-Save Functionality**: Changes made in the editor are automatically saved to ensure no data loss.
- **Document Sharing**: Share documents with other users via email, with validation for email addresses.
- **Error Handling**: The application provides user-friendly error messages for various operations, such as document loading and sharing.
- **Contributors Management**: Display contributor avatars and manage document contributors.
- **Time Tracking**: View the creation and last modified timestamps of documents in a user-friendly format.

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running Unit Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running End-to-End Tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
