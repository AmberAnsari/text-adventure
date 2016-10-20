'use strict';

const StartGameCommand = require('../commands/start-game-command');
const AddInventoryCommand = require('../commands/add-inventory-command');
const EquipItemCommand = require('../commands/equip-item-command');
const TeleportCommand = require('../commands/teleport-command');

class StartGameHandler {

  static canHandle(command) {
    return StartGameCommand.matches(command);
  }

  static handle(command, game) {
    if (!StartGameHandler.canHandle(command)) {
      throw new Error(`handler can't handle command ${command.command}`);
    }

    // initialize starting inventory
    game.acceptCommand(new AddInventoryCommand(game.itemRepository.startSet));

    for (const startItem of game.itemRepository.startSet) {
      if (startItem.equip) {
        game.acceptCommand(new EquipItemCommand(startItem.item));
      }
    }

    game.emit('game-started', { banner: game.gameDefinition.banner, text: game.gameDefinition.opening });

    game.acceptCommand(new TeleportCommand(game.nodeMapRepository.entryNode.id));
  }
}

module.exports = StartGameHandler;