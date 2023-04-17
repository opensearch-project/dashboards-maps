## Version 2.7.0.0 Release Notes
Compatible with OpenSearch and OpenSearch Dashboards Version 2.7.0

### Features
* Add localization for opensearch base map ([#312](https://github.com/opensearch-project/dashboards-maps/pull/312))
* Add geo shape query filter ([#319](https://github.com/opensearch-project/dashboards-maps/pull/319))
* Support adding static label to document layer ([#322](https://github.com/opensearch-project/dashboards-maps/pull/322))
* Add shape filter UI button ([#329](https://github.com/opensearch-project/dashboards-maps/pull/329))
* Add tooltip to draw shape filter ([#330](https://github.com/opensearch-project/dashboards-maps/pull/330))
* Support adding field label to document layer ([#336](https://github.com/opensearch-project/dashboards-maps/pull/336))
* Add search query ability on map([#370](https://github.com/opensearch-project/dashboards-maps/pull/370))

### Infrastructure
* Add CHANGELOG ([#342](https://github.com/opensearch-project/dashboards-maps/pull/342))
* Add stats API for maps and layers in maps plugin ([#362](https://github.com/opensearch-project/dashboards-maps/pull/362))
* Fix cypress test failed due to OSD dashboard create button updated ([#393](https://github.com/opensearch-project/dashboards-maps/pull/393))

### Refactoring
* Move zoom and coordinates as separate component ([#309](https://github.com/opensearch-project/dashboards-maps/pull/309))
* Move coordinates to footer ([#315](https://github.com/opensearch-project/dashboards-maps/pull/315))
* Refactor tooltip setup as component ([#320](https://github.com/opensearch-project/dashboards-maps/pull/320))
* Refactor get field options and add field label option on UI ([#328](https://github.com/opensearch-project/dashboards-maps/pull/328))

### Enhancements
* Enhance layer visibility status display ([#299](https://github.com/opensearch-project/dashboards-maps/pull/299))
* Introduce disable tooltip on hover property ([#313](https://github.com/opensearch-project/dashboards-maps/pull/313))
* Update tooltip behavior change ([#317](https://github.com/opensearch-project/dashboards-maps/pull/317))
* Update max supported layer count ([#332](https://github.com/opensearch-project/dashboards-maps/pull/332))
* BWC for document layer label textType ([#340](https://github.com/opensearch-project/dashboards-maps/pull/340))
* Add mapbox-gl draw mode ([#347](https://github.com/opensearch-project/dashboards-maps/pull/347))
* Add support to draw rectangle shape to filter documents ([#348](https://github.com/opensearch-project/dashboards-maps/pull/348))
* Avoid trigger tooltip from label ([#350](https://github.com/opensearch-project/dashboards-maps/pull/350))
* Remove cancel button on draw shape and use Escape to cancel draw ([#359](https://github.com/opensearch-project/dashboards-maps/pull/359))
* Add support to build GeoShapeFilterMeta and GeoShapeFilter ([#360](https://github.com/opensearch-project/dashboards-maps/pull/360))
* Update listener on KeyUp ([#364](https://github.com/opensearch-project/dashboards-maps/pull/364))
* Add geoshape filter while render data layers ([#365](https://github.com/opensearch-project/dashboards-maps/pull/365))
* Add filter bar to display global geospatial filters ([#371](https://github.com/opensearch-project/dashboards-maps/pull/371))
* Update draw filter shape ui properties ([#372](https://github.com/opensearch-project/dashboards-maps/pull/372))
* Change font opacity along with OpenSearch base map layer ([#373](https://github.com/opensearch-project/dashboards-maps/pull/373))
* Toast Warning Message if OpenSearch base map is used in conflicting regions ([#382](https://github.com/opensearch-project/dashboards-maps/pull/382))
* Add before layer id when adding documents label ([#387](https://github.com/opensearch-project/dashboards-maps/pull/387))

### Bug Fixes
* Fix: fixed filters not reset when index pattern changed ([#234](https://github.com/opensearch-project/dashboards-maps/pull/234))
* Fix property value undefined check ([#276](https://github.com/opensearch-project/dashboards-maps/pull/276))
* Show scroll bar when panel height reaches container bottom ([#295](https://github.com/opensearch-project/dashboards-maps/pull/295))
* Add custom layer visibility config to render ([#297](https://github.com/opensearch-project/dashboards-maps/pull/297))
* Fix color picker component issue ([#305](https://github.com/opensearch-project/dashboards-maps/pull/305))
* Fix: layer filter setting been reset unexpectedly ([#327](https://github.com/opensearch-project/dashboards-maps/pull/327))
* Fix data query in dashboard mode when enable around map filter ([#339](https://github.com/opensearch-project/dashboards-maps/pull/339))
* Sync maplibre layer order after layers rendered ([#353](https://github.com/opensearch-project/dashboards-maps/pull/353))

### Maintenance
* Bump to 2.7.0 version ([#356](https://github.com/opensearch-project/dashboards-maps/pull/356))
