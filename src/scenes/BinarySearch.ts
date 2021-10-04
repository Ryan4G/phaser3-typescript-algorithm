import Phaser from 'phaser';
import Colors from '~enums/Colors';
import Block from '~sprites/Block';

interface IChangeColor{
    index: number,
    color: Colors
}

export default class BinarySearch extends Phaser.Scene {

    private _blocks?: Phaser.GameObjects.Group;

    private _changeQueue?: Array<IChangeColor>;

    private _clicked: boolean = false;

    private _numArray: Array<number>;

    constructor() {
        super('Binary Search');

        this._changeQueue = [];
        this._numArray = [];
    }

    create()
    {
        this._blocks = this.add.group(
            {
                classType: Block
            }
        );
    
        const title = this.add.text(
            100, 60,
            'Click a white block to set it for the search destination..',
            {
                color: '#000'
            }
        );

        // init blocks
        let blocks: Array<Block> = [];

        for(let row = 0; row < 5; row++){
            for(let col = 0; col < 10; col++){

                // the algorithm need a tidy sorted array
                let num = (row * 10) + col + 1;
                this._numArray.push(num);

                let block = this.createBlock(100 + col * 60 , 100 + row * 60,
                    num.toString(),
                    Colors.White
                );

                block.setInteractive();

                block.on(
                    Phaser.Input.Events.POINTER_UP,
                    () => {
                        if (this._clicked){
                            return;
                        }

                        this._clicked = true;

                        block.makeColor(Colors.Blue);

                        title.setText(`The number of ${block.text} block is the target block.`);

                        let result = this.binary_search(parseInt(block.text));

                        this.time.addEvent({
                            delay: 500,
                            callback: () => {
                                let item = this._changeQueue?.shift();

                                if (item){
                                    blocks[item.index].makeColor(item.color);
                                }

                                if (this._changeQueue!.length === 0){
                                    title.setText(`Search finished`);
                                }
                            },
                            repeat: this._changeQueue!.length - 1
                        });


                    }
                );

                blocks.push(block);
            }
        }

        
    }

    update() {

    }

    private createBlock(x: number, y: number, text: string, color: Colors): Block{
        let block = this._blocks!.get(x, y) as Block;
        block.makeColor(color);
        block.changeText(text);

        return block;
    }

    private binary_search(des: number){

        this._changeQueue = [];

        let left = 0;
        let right = this._numArray.length - 1;

        while(left <= right){

            let middle = Math.floor((left + right) * 0.5);

            this._changeQueue.push({ index: left, color: Colors.Red });
            this._changeQueue.push({ index: right, color: Colors.Red });            
            this._changeQueue.push({ index: middle, color: Colors.Green });

            if (this._numArray[middle] < des){
                
                this._changeQueue.push({ index: left, color: Colors.White });
                this._changeQueue.push({ index: right, color: Colors.White });            
                this._changeQueue.push({ index: middle, color: Colors.White });

                left = middle + 1;

                continue;
            }
            else if (this._numArray[middle] > des){

                this._changeQueue.push({ index: left, color: Colors.White });
                this._changeQueue.push({ index: right, color: Colors.White });            
                this._changeQueue.push({ index: middle, color: Colors.White });

                right = middle - 1;

                continue;
            }
            else{

                this._changeQueue.push({ index: middle, color: Colors.Blue });
                return true;
            }
        }

        // if left > right search unsuccessful
        return false;
    }
}
