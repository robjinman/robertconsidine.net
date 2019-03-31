robjinman.com - Front-end
=========================

The front-end of my personal website.

Dev environment setup
---------------------

Download and install nodejs to /opt.

Install VS Code via the .deb from the official website.

Set the NODE_PATH environment variable, and add node's bin directory to the
PATH. To ~/.bashrc append the following:

```
    export NODE_PATH=/opt/node-v10.15.0-linux-x64
    PATH="$NODE_PATH/bin:$PATH"
```

Install the Angular CLI

```
    npm install -g @angular/cli
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.
The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You
can also use
`ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the
`dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via
[Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via
[Protractor](http://www.protractortest.org/).
