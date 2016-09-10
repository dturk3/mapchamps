/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var uuid = require('uuid');

module.exports = {

  attributes: {
      id: {
          type: 'string',
          primaryKey: true
      },
      numberRounds: {
          type: 'integer',
          required: true
      },
      turnTimeSeconds: {
          type: 'integer',
          required: true
      },
      timeMultiplier: {
          type: 'boolean',
          required: true
      },
      difficultyLower: {
          type: 'integer',
          required: true
      },
      difficultyUpper: {
          type: 'integer',
          required: true
      },
      startTime: {
          type: 'dateTime'
      },
      endTime: {
          type: 'dateTime'
      },
      regions: {
          collection: 'region'
      },
      players: {
          collection: 'user'
      }
  }
};

