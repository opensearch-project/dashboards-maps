[![Documentation](https://img.shields.io/badge/doc-reference-blue)](https://opensearch.org/docs/latest/)

<img src="https://opensearch.org/assets/img/opensearch-logo-themed.svg" height="64px">


- [OpenSearch Maps Explorer Dashboards Plugin](#opensearch-maps-explorer-dashboard-plugin)
- [Features](#features)
- [Installation Guide](#installation-guide)
- [Security](#security)
- [Copyright](#copyright)

## OpenSearch Maps Explorer Dashboard Plugin

The OpenSearch Maps Explorer Dashboards plugin enables you to add or remove specific layers on demand via layers panel.

## Features

 * Initialize maps workbench with default layers.

 * Add/Remove specific layers.


## Install Prerequisites

You will need to install [node.js](https://nodejs.org/en/), [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md), and [yarn](https://yarnpkg.com/) in your environment to properly pull down dependencies to build and bootstrap the plugin.

## Installation Guide

 * __Environment Setup__
 
    Set up [OpenSearch Dashboards](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/DEVELOPER_GUIDE.md) locally.

 * __Forking and Cloning__
 
    Fork this repository on GitHub, and clone locally in OpenSearch Dashboard **plugins** folder with `git clone`.

 * __Run__

    Starts OpenSearch Dashboards with this plugin. In the base OpenSearch Dashboards directory, run `yarn start`.

    OpenSearch Dashboards will be available on `localhost:5603`.



## Security

If you discover a potential security issue in this project we ask that you notify AWS/Amazon Security via our [vulnerability reporting page](http://aws.amazon.com/security/vulnerability-reporting/). Please do **not** create a public GitHub issue.


## Copyright

Copyright OpenSearch Contributors.