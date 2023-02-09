## Developer Guide

So you want to contribute code to this project? Excellent! We're glad you're here. Here's what you need to do.

- [Forking](#forking)
- [Install Prerequisites](#install-prerequisites)
- [Setup](#setup)
- [Run](#run)
- [Build](#build)
- [Test](#test)
- [Submitting Changes](#submitting-changes)
- [Backports](#backports)

### Forking

Fork the repository on GitHub.

### Install Prerequisites

You will need to install [node.js](https://nodejs.org/en/), [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md), and [yarn](https://yarnpkg.com/) in your environment to properly pull down dependencies to build and bootstrap the plugin.


### Setup

1. Download OpenSearch [Geospatial](https://github.com/opensearch-project/geospatial) plugin, which requires same version with OpenSearch-Dashboard and maps-dashboards plugin.
2. Run `./gradlew run` under Geospatial plugin root path to start OpenSearch cluster.
3. Download the OpenSearch Dashboards source code for the version specified in package.json you want to set up.
4. Change your node version by `nvm use <version>`to the version specified in `.node-version` inside the OpenSearch Dashboards root directory.
5. Create a `plugins` directory inside the OpenSearch Dashboards source code directory, if `plugins` directory doesn't exist.
6. cd into `plugins` directory in the OpenSearch Dashboards source code directory.
7. Check out this package from version control into the `plugins` directory.
8. Run `yarn osd bootstrap` inside `OpenSearch-Dashboards/plugins/maps_dashboards` folder.

Ultimately, your directory structure should look like this:

```md
├── OpenSearch-Dashboards
│   ├── plugins
│   │   └── maps-dashboards
```

### Run

From OpenSearch-Dashboards repo (root folder), the following commands start OpenSearch Dashboards and includes this plugin.

```
yarn osd bootstrap
yarn start --no-base-path
```

OpenSearch Dashboards will be available on `localhost:5601`.

### Build

To build the plugin's distributable zip simply run `yarn build`.

Example output: ./build/customImportMapDashboards-1.0.0.0.zip

### Test

From maps-dashboards folder running the following command runs the plugin unit tests:

#### Unit test
```
yarn test:jest
```

#### Integration Tests
Integration tests for this plugin are written using the Cypress test framework.
```
yarn run cypress run
```

### Submitting Changes

See [CONTRIBUTING](CONTRIBUTING.md).

### Backports

The Github backport workflow creates backport PRs automatically for PRs with label `backport <backport-branch-name>`. Label should be attached to the original PR, backport workflow starts when original PR merged to main branch. For example, if a PR on main needs to be backported to `1.x` branch, add a label `backport 1.x` to the PR and make sure the
backport workflow runs on the PR along with other checks. Once this PR is merged to main, the workflow will create a backport PR
to the `1.x` branch.
