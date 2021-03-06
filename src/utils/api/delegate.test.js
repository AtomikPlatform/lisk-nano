import { expect } from 'chai';
import sinon from 'sinon';
import { listAccountDelegates,
  listDelegates,
  getDelegate,
  vote,
  voteAutocomplete,
  unvoteAutocomplete,
  registerDelegate } from './delegate';
import * as peers from './peers';

const username = 'genesis_1';
const secret = 'sample_secret';
const secondSecret = 'samepl_second_secret';
const publicKey = '';

describe('Utils: Delegate', () => {
  let peersMock;
  let activePeer;

  beforeEach(() => {
    peersMock = sinon.mock(peers);
    activePeer = {};
  });

  afterEach(() => {
    peersMock.verify();
    peersMock.restore();
  });

  describe('listAccountDelegates', () => {
    it('should return a promise', () => {
      const promise = listAccountDelegates();
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('listDelegates', () => {
    it('should return requestToActivePeer(activePeer, `delegates/`, options) if options = {}', () => {
      const options = {};
      const mockedPromise = new Promise((resolve) => { resolve(); });
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'delegates/', options).returns(mockedPromise);

      const returnedPromise = listDelegates(activePeer, options);
      expect(returnedPromise).to.equal(mockedPromise);
    });

    it('should return requestToActivePeer(activePeer, `delegates/search`, options) if options.q is set', () => {
      const options = {
        q: 'genesis_1',
      };
      const mockedPromise = new Promise((resolve) => { resolve(); });
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'delegates/search', options).returns(mockedPromise);

      const returnedPromise = listDelegates(activePeer, options);
      expect(returnedPromise).to.equal(mockedPromise);
    });
  });

  describe('getDelegate', () => {
    it('should return requestToActivePeer(activePeer, `delegates/get`, options)', () => {
      const options = { publicKey: '"86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19"' };
      const mockedPromise = new Promise((resolve) => { resolve(); });
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'delegates/get', options).returns(mockedPromise);

      const returnedPromise = getDelegate(activePeer, options.publicKey);
      expect(returnedPromise).to.equal(mockedPromise);
    });
  });

  describe('unvoteAutocomplete', () => {
    it('should return a promise', () => {
      const voteList = {
        genesis_1: { confirmed: true, unconfirmed: false, publicKey: 'sample_key' },
        genesis_2: { confirmed: true, unconfirmed: false, publicKey: 'sample_key' },
        genesis_3: { confirmed: true, unconfirmed: false, publicKey: 'sample_key' },
      };
      const nonExistingUsername = 'genesis_4';
      const promise = unvoteAutocomplete(username, voteList);
      expect(typeof promise.then).to.be.equal('function');
      promise.then((result) => {
        expect(result).to.be.equal(true);
      });

      unvoteAutocomplete(nonExistingUsername, voteList).then((result) => {
        expect(result).to.be.equal(false);
      });
    });
  });

  describe('registerDelegate', () => {
    it('should return requestToActivePeer(activePeer, `delegates`, data)', () => {
      const data = {
        username: 'test',
        secret: 'wagon dens',
        secondSecret: 'wagon dens',
      };
      const mockedPromise = new Promise((resolve) => { resolve(); });
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'delegates', data).returns(mockedPromise);

      const returnedPromise = registerDelegate(
        activePeer, data.username, data.secret, data.secondSecret);
      expect(returnedPromise).to.equal(mockedPromise);
    });

    it('should return requestToActivePeer(activePeer, `delegates`, data) even if no secondSecret specified', () => {
      const data = {
        username: 'test',
        secret: 'wagon dens',
      };
      const mockedPromise = new Promise((resolve) => { resolve(); });
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'delegates', data).returns(mockedPromise);

      const returnedPromise = registerDelegate(activePeer, data.username, data.secret);
      expect(returnedPromise).to.equal(mockedPromise);
    });
  });

  describe('vote', () => {
    it('should return a promise', () => {
      const voteList = [{
        username: 'genesis_1',
        publicKey: 'sample_publicKey_1',
      }];
      const unvoteList = [{
        username: 'genesis_2',
        publicKey: 'sample_publicKey_2',
      }];
      const promise = vote(null, secret, publicKey, voteList, unvoteList, secondSecret);
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('voteAutocomplete', () => {
    it('should return requestToActivePeer(activePeer, `delegates/`, data)', () => {
      const delegates = [
        { username: 'genesis_42' },
        { username: 'genesis_44' },
      ];
      const votedDict = { username: 'genesis_11' };
      peersMock.expects('requestToActivePeer').withArgs(activePeer, 'delegates/search', { q: username }).returns(Promise.resolve({ success: true, delegates }));

      const returnedPromise = voteAutocomplete(activePeer, username, votedDict);
      expect(returnedPromise).to.eventually.become({ success: true, delegates });
    });
  });
});
