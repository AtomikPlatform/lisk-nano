import { IconButton } from 'react-toolbox/lib/button';
import { translate } from 'react-i18next';
import Input from 'react-toolbox/lib/input';
import React from 'react';
import Tooltip from 'react-toolbox/lib/tooltip';

import { findSimilarWord, inDictionary } from '../../utils/similarWord';
import { isValidPassphrase } from '../../utils/passphrase';
import styles from './passphraseInput.css';

// eslint-disable-next-line new-cap
const TooltipIconButton = Tooltip(IconButton);

class PassphraseInput extends React.Component {
  constructor() {
    super();
    this.state = { inputType: 'password' };
  }

  handleValueChange(value) {
    let error;
    if (!value) {
      error = 'Required';
    } else if (!isValidPassphrase(value)) {
      error = this.getPassphraseValidationError(value);
    }
    this.props.onChange(value, error);
  }

  // eslint-disable-next-line class-methods-use-this
  getPassphraseValidationError(passphrase) {
    const mnemonic = passphrase.trim().split(' ');
    if (mnemonic.length < 12) {
      return `Passphrase should have 12 words, entered passphrase has ${mnemonic.length}`;
    }

    const invalidWord = mnemonic.find(word => !inDictionary(word.toLowerCase()));
    if (invalidWord) {
      if (invalidWord.length >= 2 && invalidWord.length <= 8) {
        const validWord = findSimilarWord(invalidWord);
        if (validWord) {
          return `Word "${invalidWord}" is not on the passphrase Word List. Most similar word on the list is "${findSimilarWord(invalidWord)}"`;
        }
      }
      return `Word "${invalidWord}" is not on the passphrase Word List.`;
    }
    return 'Passphrase is not valid';
  }

  toggleInputType() {
    this.setState({ inputType: this.state.inputType === 'password' ? 'text' : 'password' });
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <Input label={this.props.label} required={true}
          className={this.props.className}
          error={this.props.error}
          value={this.props.value || ''}
          type={this.state.inputType}
          theme={this.props.theme}
          onChange={this.handleValueChange.bind(this)} />
        <TooltipIconButton className={`show-passphrase-toggle ${styles.eyeIcon}`}
          tooltipPosition='horizontal'
          tooltip={this.state.inputType === 'password' ?
            this.props.t('Show passphrase') :
            this.props.t('Hide passphrase')}
          icon={this.state.inputType === 'password' ? 'visibility' : 'visibility_off'}
          onClick={this.toggleInputType.bind(this)}/>
      </div>);
  }
}

export default translate()(PassphraseInput);
