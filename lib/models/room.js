var Q = require('q');
var format = require('util').format;
var events = require('events');

var Gitter = require('../core/connection');
var logger = require('../core/logger');
var Message = require('./message');

var Room = function () {
  this._name = null;
  this._instance = null;

  var emitter = new events.EventEmitter();
  this.emit = emitter.emit;
  this.on = emitter.on;
};

/**
 * Join a room based on the room name.
 * @param  {string} roomName
 * @return {promise} roomPromise
 */
Room.prototype.join = function (roomName) {
  var self = this;
  var deferred = Q.defer();

  Gitter.then(function (gitter) {
    // Get the join room promise.
    var joinRoom = gitter.rooms.join(roomName);

    // Handle the room successful joined.
    joinRoom.then(function (room) {
      // Set the private room instance and name properties.
      self._name = roomName;
      self._instance = room;

      // Log the joined room event.
      logger.info(format('Joined room: %s', room.name));

      // Emit the joined room event.
      self.emit('join', self._instance);

      room.chatMessages().then(function (messages) {
        messages = Message.createInstancesList(messages);
        self.emit('chatMessages', messages);
      });

      // Fetch the streaming events.
      var roomStreaming = room.streaming().chatMessages();

      roomStreaming.on('chatMessages', function (message) {
        if (message.operation === 'create') {
          message = Message.createInstance(message);
          self.emit('streaming:chatMessages', message);
        } else if (message.operation === 'update') {
          // TODO Implement message updating.
        } else {
          // TODO
        }
      });

    });

    // Handle the room failed joined.
    joinRoom.fail(function (err) {
      // Log the failed joined room event.
      logger.error(format('Not possible to join the room: %s', err));

      // Emit the joined room event.
      self.emit('joinError', err);

      deferred.reject(err);
    });

    deferred.resolve(joinRoom);
  });

  return deferred.promise;
};

/**
 * Write a new message in the current room.
 * @param  {string} msg
 * @return {promise}
 */
Room.prototype.writeMessage = function (msg) {
  if (this._instance === null) {
    logger.error('Not possible to write a message. No room instance.');
    // TODO: Throw new error
    return false;
  }

  return this._instance.send(msg);
};

// Export the room model.
exports = module.exports = Room;
