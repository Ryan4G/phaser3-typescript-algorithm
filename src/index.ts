import Phaser from 'phaser';
import BinarySearch from '~scenes/BinarySearch';
import BreadthFirstSearch from '~scenes/BreadthFirstSearch';
import FloodFill from '~scenes/FloodFill';
import Shuffle from '~scenes/Shuffle';

import GameScene from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
    backgroundColor: '#7d7d7d',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [GameScene, Shuffle, FloodFill, BinarySearch, BreadthFirstSearch]
}

export default new Phaser.Game(config)
