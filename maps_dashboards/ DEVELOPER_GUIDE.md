## Developer Guide

So you want to contribute code to this project? Excellent! We're glad you're here. Here's what you need to do.

- [Forking](#forking)
- [Install Prerequisites](#install-prerequisites)
- [Setup](#setup)
- [Run](#run)
- [Test](#test)
- [Submitting Changes](#submitting-changes)
- [Backports](#backports)

### Forking

Fork the repository on GitHub.

### Install Prerequisites

You will need to install [node.js](https://nodejs.org/en/), [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md), and [yarn](https://yarnpkg.com/) in your environment to properly pull down dependencies to build and bootstrap the plugin.


### Setup

1. Download the OpenSearch Dashboards source code for the version specified in package.json you want to set up.
2. Change your node version by `nvm use <version>`to the version specified in `.node-version` inside the OpenSearch Dashboards root directory.
3. Create a `plugins` directory inside the OpenSearch Dashboards source code directory, if `plugins` directory doesn't exist.
4. cd into `plugins` directory in the OpenSearch Dashboards source code directory.
5. Check out this package from version control into the `plugins` directory.
```
git init
// Change to your forked repo link in below command
git remote add -f origin https://github.com/opensearch-project/dashboards-maps.git
git config core.sparsecheckout true
echo "maps_dashboards/" >> .git/info/sparse-checkout
git pull origin feature/new-maps
```
6. Run `yarn osd bootstrap` inside `OpenSearch-Dashboards/plugins/maps_dashboards` folder.

Ultimately, your directory structure should look like this:

```md
├── OpenSearch-Dashboards
│   ├── plugins
│   │   └── maps-dashboards
```

### Run

From OpenSearch-Dashbaords repo (root folder), run the following command:

```bash
yarn osd bootstrap
yarn start
```

  Starts OpenSearch Dashboards and includes this plugin. OpenSearch Dashboards will be available on `localhost:5601`.

### Test

From maps-dashboards folder running the following command runs the plugin unit tests -

`yarn test:jest`

### Submitting Changes

See [CONTRIBUTING](CONTRIBUTING.md).

### Backports

The Github backport workflow creates backport PRs automatically when the original PR
with an appropriate label `backport <backport-branch-name>` is merged to main with the backport workflow run successfully on the
PR. For example, if a PR on main needs to be backported to `1.x` branch, add a label `backport 1.x` to the PR and make sure the
backport workflow runs on the PR along with other checks. Once this PR is merged to main, the workflow will create a backport PR
to the `1.x` branch.