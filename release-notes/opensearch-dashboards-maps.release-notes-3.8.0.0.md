## Version 3.8.0 Release Notes

Compatible with OpenSearch and OpenSearch Dashboards version 3.8.0

### Bug Fixes

* Use CSP-safe MapLibre build and expose worker as a static asset to fix maps in strict Content Security Policy environments ([#842](https://github.com/opensearch-project/dashboards-maps/pull/842))

### Infrastructure

* Adopt ESLint 10 flat config to align with OpenSearch Dashboards core linting setup ([#847](https://github.com/opensearch-project/dashboards-maps/pull/847))
* Migrate Jest test suite to Jest 30 and jsdom 26 to match core OpenSearch Dashboards test infrastructure ([#852](https://github.com/opensearch-project/dashboards-maps/pull/852))

### Maintenance

* Resolve transitive @types dependencies from Mapbox to MapLibre to remove Mapbox from the yarn lock file ([#849](https://github.com/opensearch-project/dashboards-maps/pull/849))
