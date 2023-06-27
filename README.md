# Voice Buddy

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.15

## Development server

Run `npm start` or `ng serve --host 0.0.0.0 --disable-host-check --port 4000` for a dev server. Navigate to `http://localhost:4000/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## GitHub Pages

1. Navigate to your project’s root directory and run command `npm install -g angular-cli-ghpages`. which will install angular-cli-ghpages. This is what we will use to host the Angular app on GitHub pages.
2. Run `npm run build` or `ng build --prod` to build the project. The build artifacts will be stored in the `dist/` directory.
3. Run `npm run build:pages` or `npx ngh --dir=dist/voice-buddy-widget/ --cname=chitchat.xkernel.com` to deploy the github pages.
