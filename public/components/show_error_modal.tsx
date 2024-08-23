/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  EuiSmallButton,
  EuiButton,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiCodeBlock,
  EuiText,
} from '@elastic/eui';

export interface ShowErrorModalProps {
  modalTitle: string;
  modalBody: string;
  buttonText: string;
}

const ShowErrorModal = (props: ShowErrorModalProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);

  let modal;

  if (isModalVisible) {
    modal = (
      <EuiModal onClose={closeModal}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            <EuiText size="s">
              <h2>{props.modalTitle}</h2>
            </EuiText>
          </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiCodeBlock isCopyable>{props.modalBody}</EuiCodeBlock>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiSmallButton
            id="closeModal"
            aria-label="closeModal"
            data-testid="closeModal"
            onClick={closeModal}
          >
            Close
          </EuiSmallButton>
        </EuiModalFooter>
      </EuiModal>
    );
  }

  return (
    <div id="showModalOption" aria-label="showModalOption" data-testid="showModalOption">
      <EuiButton onClick={showModal} size="s">
        {props.buttonText}
      </EuiButton>
      {modal}
    </div>
  );
};

export { ShowErrorModal };
