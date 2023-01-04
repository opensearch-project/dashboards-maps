/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { ShowErrorModal } from './show_error_modal';
import renderer, { act } from 'react-test-renderer';
import { fireEvent } from '@testing-library/dom';
import { screen, render } from '@testing-library/react';

describe('display error modal', () => {
  const props = {
    modalTitle: 'testModalTitle',
    modalBody: 'testModalBody',
    buttonText: 'testButtonText',
  };

  it('renders the error modal based on the props passed', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<ShowErrorModal {...props} />);
    });
    expect(tree.toJSON().props.id).toBe('showModalOption');
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders the error modal when showModal button is clicked', () => {
    render(<ShowErrorModal {...props} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const closeButton = screen.getByTestId('closeModal');
    fireEvent.click(closeButton);
  });
});
