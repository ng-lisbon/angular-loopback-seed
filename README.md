# Angular + Loopback + Bootstrap

A basic project seed for Angular with user registration and login.

This project is a seed for web application based on Angular that uses
[Bootstrap](https://ng-bootstrap.github.io) for UI and 
[Loopback](https://loopback.io/) as backend. The project contains all
functionality to register users via e-mail and password on Loopback. It
provides login and a simple profile page where users can change their e-mail
address and password.

Please adapt to your needs :)

## Install prerequisites

You need a database for the Loopback backend. Per default the backend will use
postgres. So download and start postgres before you start the app or change the
Loopback configuration.

## Configuration

You can configure any database settings in the file `server/datasources.json`.

You also need to set up an email account to send the email confirmation mails
after user registration, those settings are again in the file
`server/datasources.json`.

### Backend (Loopack)
Run `npm install` in the root folder of this repository to download and install
all modules that the app needs to run.

### Frontend (Angular)
Run `npm install` in the folder `client`:

    $ cd client
    $ npm install

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:3000/`. This
will also generate the Angular fronend. It will start the CLI build process and
put all Angular files in the `dist` folder, from which Loopback will serve the
files. The process will keep running and watch the files in the `client`
folder, so whenever you change a file of the Angular frontend the files will
be built again.

# License
This boilerplate is published under The MIT License. See LICENSE file for
details.