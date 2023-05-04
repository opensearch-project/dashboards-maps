/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { IAggConfig } from '../../../../../../src/plugins/data/public';
import { isEmpty } from 'lodash';

export enum AGGS_ACTION_KEYS {
  TOUCHED = 'aggsTouched',
  VALID = 'aggsValid',
}

interface AggsItem {
  touched: boolean;
  valid: boolean;
}

export interface AggsState {
  [aggId: string]: AggsItem;
}

export interface AggsAction {
  type: AGGS_ACTION_KEYS;
  payload: boolean;
  aggId: string;
  newState?: AggsState;
}

function aggGroupReducer(state: AggsState, action: AggsAction): AggsState {
  const aggState = state[action.aggId] || { touched: false, valid: true };
  switch (action.type) {
    case AGGS_ACTION_KEYS.TOUCHED:
      return { ...state, [action.aggId]: { ...aggState, touched: action.payload } };
    case AGGS_ACTION_KEYS.VALID:
      return { ...state, [action.aggId]: { ...aggState, valid: action.payload } };
    default:
      throw new Error();
  }
}

function initAggsState(group: IAggConfig[]): AggsState {
  return group.reduce((state, agg) => {
    state[agg.id] = { touched: false, valid: true };
    return state;
  }, {} as AggsState);
}

function isInvalidAggsTouched(aggsState: AggsState) {
  const invalidAggs = Object.values(aggsState).filter((agg) => !agg.valid);

  if (isEmpty(invalidAggs)) {
    return false;
  }

  return invalidAggs.every((agg) => agg.touched);
}

export { aggGroupReducer, initAggsState, isInvalidAggsTouched };
