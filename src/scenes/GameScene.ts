import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }

    preload()
    {
    }

    create()
    {
        this.add.text(
            this.scale.width * 0.5,
            this.scale.height * 0.2,
            'Algorithm Show With Phaser3',
            {
                fontStyle: 'bolder',
                fontSize: '4em'
            }
        ).setOrigin(0.5);

        let algorithmTitles = [
            'Fisher-Yates Shuffle',
            'Flood Fill',
            'Binary Search',
            'Breadth-first Search'
        ];

        let titles: Array<Phaser.GameObjects.Text> = [];

        for(let i = 0; i < algorithmTitles.length; i++){

            titles[i] = this.add.text(
                40,
                this.scale.height * 0.3 + 40 * i,
                algorithmTitles[i]
            ).setInteractive();

            titles[i].on(
                Phaser.Input.Events.POINTER_DOWN,
                () => {
                    titles[i].setAlpha(0.5);
                }
            );

            titles[i].on(
                Phaser.Input.Events.POINTER_UP,
                () => {
                    titles[i].setAlpha(1);

                    this.scene.start(algorithmTitles[i]);
                }
            );
        }
    }

    update() {

    }
}
