## Developer Guide

So you want to contribute code to this project? Excellent! We're glad you're here. Here's what you need to do.

- [Forking and Cloning](#forking-and-cloning)
- [Install Prerequisites](#install-prerequisites)
- [Setup](#setup)
- [Run](#run)
- [Test](#test)
- [Submitting Changes](#submitting-changes)
- [Backports](#backports)

### Forking and Cloning

Fork this repository on GitHub, and clone locally with `git clone`.

### Install Prerequisites

You will need to install [node.js](https://nodejs.org/en/), [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md), and [yarn](https://yarnpkg.com/) in your environment to properly pull down dependencies to build and bootstrap the plugin.


### Setup

1. Download the OpenSearch Dashboards source code for the [version specified in package.json](./src/plugins/custom_import_map/package.json#L3) you want to set up.
2. Change your node version to the version specified in `.node-version` inside the OpenSearch Dashboards root directory.
3. Create a `plugins` directory inside the OpenSearch Dashboards source code directory, if `plugins` directory doesn't exist.
4. cd into `plugins` directory in the OpenSearch Dashboards source code directory.
5. Check out this package from version control into the `plugins` directory.
```bash
git clone git@github.com:opensearch-project/dashboards-maps.git plugins --no-checkout
cd plugins
echo 'src/plugins/custom_import_map/*' >> .git/info/sparse-checkout
git config core.sparseCheckout true
git checkout main
```
6. Run `yarn osd bootstrap` inside `OpenSearch-Dashboards/plugins/src/plugins/custom_import_map`.

Ultimately, your directory structure should look like this:

```md
.
├── OpenSearch-Dashboards
│   └── plugins
│       └── src/plugins/custom_import_map
```

### Run

From OpenSearch-Dashbaords repo (root folder), run the following command -
- `yarn start`

  Starts OpenSearch Dashboards and includes this plugin. OpenSearch Dashboards will be available on `localhost:5601`.

### Test

From custom_import_map folder running the following command runs the plugin unit tests -

`yarn test:jest`

### Submitting Changes

See [CONTRIBUTING](CONTRIBUTING.md).

### Backports

The Github workflow in [`backport.yml`](.github/workflows/backport.yml) creates backport PRs automatically when the original PR
with an appropriate label `backport <backport-branch-name>` is merged to main with the backport workflow run successfully on the
PR. For example, if a PR on main needs to be backported to `1.x` branch, add a label `backport 1.x` to the PR and make sure the
backport workflow runs on the PR along with other checks. Once this PR is merged to main, the workflow will create a backport PR
to the `1.x` branch.