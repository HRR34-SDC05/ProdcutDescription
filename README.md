# Project Name

This service presents users with product descriptions for a specific product. 

## Related Projects

  - https://github.com/teamName/repo
  - https://github.com/teamName/repo
  - https://github.com/teamName/repo
  - https://github.com/teamName/repo

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

### Update Bundle
Before running the application for the first time, be sure to repack the bundle
> `npm run webstart` or
> `npm run webstartp`
The latter will minimize the code using webpack.

### Create a Config File
An example configuration file has been provided for your convenience in the root directory (`exampleConfig.json`).

1. Make a copy of the `exampleConfig.json` file
2. Rename the copy to `config.json`
3. Update the details of the `config.json` for your needs.

### Run the service
Once this is in place, you will be able to start the application with a node server.
> `npm start`

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```
### Seed Database

For testing and development purposes, it may be useful to seed the database.

Scripts have been included to aid in this process.

After installing dependencies and proceeding through the usage steps, run the following script: `npm run db:setup`

