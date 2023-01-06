import { Query, TimeRange } from '../../../../src/plugins/data/common';

export interface MapState {
  timeRange: TimeRange;
  query: Query;
  refreshInterval: {
    pause: boolean;
    value: number;
  };
}
