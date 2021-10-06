import Phaser from 'phaser';
import Colors from '~enums/Colors';
import Block from '~sprites/Block';

interface IChangeColor{
    block1: Block;
    block2: Block;
    color: Colors;
    swapText: boolean;
}

export default class Shuffle extends Phaser.Scene {

    private _blocks?: Phaser.GameObjects.Group;

    private _changeQueue?: Array<IChangeColor>;

    private _clicked: boolean = false;

    constructor() {
        super('Fisher-Yates Shuffle');

        this._changeQueue = [];
    }

    create()
    {
        this._blocks = this.add.group(
            {
                classType: Block
            }
        );
        
        let arr: Array<number> = [1,2,3,4,5,6,7,8,9,10];

        const title = this.add.text(
            100, 60,
            'Click anywhere on the scene to start shuffle..',
            {
                color: '#000'
            }
        );

        
        this.input.on(
            Phaser.Input.Events.POINTER_UP,
            (pointer: Phaser.Input.Pointer) => {
                
                console.log(pointer);

                if (this._clicked){
                    return;
                }
                
                this._clicked = true;

                this.fisher_yates_shuffle(arr);

                this.time.addEvent(
                    {
                        delay: 1000,
                        callback: () => {
                            let changeColor = this._changeQueue!.shift()!;

                            changeColor.block1.makeColor(changeColor.color);
                            changeColor.block2.makeColor(changeColor.color);

                            if (changeColor.swapText){
                                let tmp = changeColor.block1.text;
                                changeColor.block1.changeText(changeColor.block2.text);
                                changeColor.block2.changeText(tmp);
                            }
                        },
                        repeat: this._changeQueue!.length - 1
                    }
                );

            }
        );
    }

    update() {

    }

    private createBlock(x: number, y: number, text: string, color: Colors): Block{
        let block = this._blocks!.get(x, y) as Block;
        block.makeColor(color);
        block.changeText(text);

        return block;
    }

    private fisher_yates_shuffle(arr: Array<number>){

        let blocks: Array<Block> = [];

        for(let i = 0; i < arr.length; i++){

            let block = this.createBlock(100 + (i < 5 ? i : i - 5) * 60 , 100 + (i < 5 ? 0 : 60),
            arr[i].toString(),
            Colors.White
            );

            blocks.push(block);
        }

        console.log('before', arr);

        this._changeQueue = [];

        for(let j = arr.length - 1; j > 0; j--){
            
            let rand = Math.floor(Math.random() * (j + 1));

            this._changeQueue.push({
                block1: blocks[rand],
                block2: blocks[j],
                color: Colors.Red,
                swapText: false
            });

            let tmp = arr[j];

            arr[j] = arr[rand];

            arr[rand] = tmp;

            let txt = blocks[j].text;

            
            this._changeQueue.push({
                block1: blocks[rand],
                block2: blocks[j],
                color: Colors.Blue,
                swapText: true
            });

            
            this._changeQueue.push({
                block1: blocks[rand],
                block2: blocks[j],
                color: Colors.White,
                swapText: false
            });
        }
        
        console.log('after', arr);
    }
}
