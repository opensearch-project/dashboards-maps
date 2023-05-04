/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';

export type SetValidity = (modelName: string, value: boolean) => void;
export type SetTouched = (value: boolean) => void;

const initialFormState = {
  validity: {},
  touched: false,
  invalid: false,
};

function useEditorFormState() {
  const [formState, setFormState] = useState(initialFormState);

  const setValidity: SetValidity = useCallback((modelName, value) => {
    setFormState((model) => {
      const validity = {
        ...model.validity,
        [modelName]: value,
      };

      return {
        ...model,
        validity,
        invalid: Object.values(validity).some((valid) => !valid),
      };
    });
  }, []);

  const resetValidity = useCallback(() => {
    setFormState(initialFormState);
  }, []);

  const setTouched = useCallback((touched: boolean) => {
    setFormState((model) => ({
      ...model,
      touched,
    }));
  }, []);

  return {
    formState,
    setValidity,
    setTouched,
    resetValidity,
  };
}

export { useEditorFormState };
