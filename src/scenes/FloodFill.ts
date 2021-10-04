import Phaser from 'phaser';
import Colors from '~enums/Colors';
import Block from '~sprites/Block';

interface IChangeBlock{
    row: number;
    col: number;
    color: Colors;
}

export default class FloodFill extends Phaser.Scene {

    private _blocks: Array<Array<Block>>;
    private _changeQueue: Array<IChangeBlock>;
    private _map: number[][];
    private _blockSetHistory: Array<string>;
    private _clicked: boolean = false;

    constructor() {
        super('Flood Fill');
        this._blocks = [];
        this._changeQueue = [];
        this._map = [];
        this._blockSetHistory = [];
    }

    create()
    {
        this._map = [
            [1,1,1,1,1,1,1,1,1],
            [1,0,0,0,1,0,0,0,1],
            [1,0,0,0,1,0,0,0,1],
            [1,0,0,1,0,0,0,0,1],
            [1,1,1,0,0,0,1,1,1],
            [1,0,0,0,0,1,0,0,1],
            [1,0,0,0,1,0,0,0,1],
            [1,0,0,0,1,0,0,0,1],
            [1,1,1,1,1,1,1,1,1],
        ];

        const blockGroup = this.add.group(
            {
                classType:  Block
            }
        );

        for(let row = 0; row < this._map.length; row++){
            let blockRow = [];

            for(let col = 0; col < this._map[row].length; col++){

                let block = blockGroup.get(
                    100 + col * 40 , 
                    100 + row * 40) as Block;

                if (this._map[row][col]){
                    block.makeColor(Colors.Black);
                }
                else{
                    block.makeColor(Colors.White);
                }

                blockRow.push(block);
            }

            this._blocks.push(blockRow);
        }

        this.add.text(
            100, 60,
            'Click a white block , it\'s will start to fill',
            {
                color: '#000'
            }
        );

        const blockRect = new Phaser.Geom.Rectangle(
            100, 100,
            40 * this._map.length,
            40 * this._map.length
        );

        this.input.on(
            Phaser.Input.Events.POINTER_UP,
            (pointer: Phaser.Input.Pointer) => {
                
                console.log(pointer);

                if (this._clicked){
                    return;
                }

                if (blockRect.contains(pointer.x, pointer.y)){
                    let col = Math.floor((pointer.x - 100) / 40);
                    let row = Math.floor((pointer.y - 100) / 40);

                    if (this._map[row][col] === 0){
                        this._clicked = true;
                        
                        this.flood_fill_no_recursive(row, col);

                        this.time.addEvent({
                            delay: 500,
                            callback: () => {
                                let changeBlock = this._changeQueue.splice(0, 1)[0];

                                this._blocks[changeBlock.row][changeBlock.col].makeColor(changeBlock.color);
                            },
                            repeat: this._changeQueue.length - 1
                        });
                    }
                }
            }, this
        );
    }

    update() {

    }

    private flood_fill_recursive(row: number, col: number){
        
        if (row < 0 || row > this._map.length - 1){
            return;
        }

        if (col < 0 || col > this._map[row].length - 1){
            return;
        }

        if (this._map[row][col]){
            return;
        }   

        //let block = this._blocks[row][col];

        if (this._blockSetHistory.indexOf(`${row},${col}`) !== -1){
            return;
        }

        //block.makeColor(Colors.Red);

        this._blockSetHistory.push(`${row},${col}`);

        this._changeQueue.push(
            {
                row: row,
                col: col,
                color: Colors.Red 
            }
        );

        this.flood_fill_recursive(row + 1, col);
        this.flood_fill_recursive(row - 1, col);
        this.flood_fill_recursive(row, col + 1);
        this.flood_fill_recursive(row, col - 1);
    }

    private flood_fill_no_recursive(row: number, col: number){
        this._changeQueue = [];
        const queue: Array<IChangeBlock> = [];

        queue.push({
            row: row,
            col: col,
            color: Colors.Red
        });

        while(queue.length > 0){
            let block = queue.shift()!;

            if (block.row < 0 || block.row > this._map.length - 1 ||
                block.col < 0 || block.col > this._map[block.row].length - 1 ||
                this._map[block.row][block.col]){
                    continue;
            }

            if (this._blockSetHistory.indexOf(`${block.row},${block.col}`) !== -1){
                continue;
            }

            this._blockSetHistory.push(`${block.row},${block.col}`);

            this._changeQueue.push(
                {
                    row: block.row,
                    col: block.col,
                    color: Colors.Red
                }
            );

            queue.push({row: block.row + 1, col: block.col, color: Colors.Red});
            queue.push({row: block.row - 1, col: block.col, color: Colors.Red});
            queue.push({row: block.row, col: block.col + 1, color: Colors.Red});
            queue.push({row: block.row, col: block.col - 1, color: Colors.Red});
        }
    }
}
