import Phaser from 'phaser';
import Colors from '~enums/Colors';
import Block from '~sprites/Block';

interface IChangeColor{
    index: number;
    color: Colors;
    swap?: number;
}

export default class BubbleSort extends Phaser.Scene {

    private _blocks?: Phaser.GameObjects.Group;

    private _changeQueue?: Array<IChangeColor>;

    private _clicked: boolean = false;

    private _numArray: Array<number>;

    constructor() {
        super('Bubble Sort');

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
            'Click anywhere to start insertion sort...',
            {
                color: '#000'
            }
        );

        // init blocks
        let blocks: Array<Block> = [];

        let i = 0;
        while (i < 30){
            this._numArray.push(i + 1);
            i++;
        }

        this.fisher_yates_shuffle(this._numArray);
        
        for(let row = 0; row < 3; row++){
            for(let col = 0; col < 10; col++){

                // the algorithm need a tidy sorted array
                let num = (row * 10) + col;

                let block = this.createBlock(100 + col * 60 , 100 + row * 60,
                    this._numArray[num].toString(),
                    Colors.White
                );
  
                blocks.push(block);
            }
        }

        this.input.on(
            Phaser.Input.Events.POINTER_UP,
            (pointer: Phaser.Input.Pointer) => {
                
                if (this._clicked){
                    return;
                }

                this._clicked = true;

                this.bubble_sort();

                this.time.addEvent({
                    delay: 200,
                    callback: () => {
                        let item = this._changeQueue?.shift();

                        if (item){
                            blocks[item.index].makeColor(item.color);

                            if (item.swap !== undefined){
                                let tmp = blocks[item.index].text;
                                blocks[item.index].changeText(blocks[item.swap].text);
                                blocks[item.swap].changeText(tmp);
                            }
                        }

                        if (this._changeQueue!.length === 0){
                            title.setText(`Bubble Sort finished`);
                        }
                    },
                    repeat: this._changeQueue!.length - 1
                });

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

        for(let j = arr.length - 1; j > 0; j--){
            
            let rand = Math.floor(Math.random() * (j + 1));

            let tmp = arr[j];

            arr[j] = arr[rand];

            arr[rand] = tmp;
        }
    }

    private bubble_sort(){
        let n = this._numArray.length;
        
        this._changeQueue = [];

        do{
            let newn = 0;

            for(let i = 1; i < n; i++){
                
                this._changeQueue.push({
                    index: i - 1,
                    color: Colors.Red
                });

                this._changeQueue.push({
                    index: i,
                    color: Colors.Red
                });

                if (this._numArray[i - 1] > this._numArray[i]){
                    let tmp = this._numArray[i - 1];
                    this._numArray[i - 1] = this._numArray[i];
                    this._numArray[i] = tmp;

                    newn = i;

                    this._changeQueue.push({
                        index: i - 1,
                        color: Colors.Blue
                    });

                    this._changeQueue.push({
                        index: i,
                        color: Colors.Blue,
                        swap: i - 1
                    });

                }
                
                this._changeQueue.push({
                    index: i - 1,
                    color: Colors.White
                });

                this._changeQueue.push({
                    index: i,
                    color: Colors.White
                });

            }

            n = newn
        }
        while(n > 1)
        
        console.log(this._numArray);
    }
}
