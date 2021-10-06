import Phaser from 'phaser';
import Colors from '~enums/Colors';
import Block from '~sprites/Block';
import PriorityQueue from '~utils/PriorityQueue';

interface IBlockWithPriority{
    key: string;
    row: number;
    col: number;
    priority: number;
}

interface IChangeBlock{
    row: number;
    col: number;
    color: Colors;
}

interface ITreeNode{
    row: number;
    col: number;
    parent?: ITreeNode;
}

export default class AStarSearch extends Phaser.Scene {

    private _blocks: Array<Array<Block>>;
    private _changeQueue: Array<IChangeBlock>;
    private _map: number[][];
    private _blockSetHistory: Array<string>;
    private _clicked: boolean = false;
    private _desBlock?: IChangeBlock;
    private _cost: number[][];

    constructor() {
        super('A Star Search');
        this._blocks = [];
        this._changeQueue = [];
        this._map = [];
        this._blockSetHistory = [];
        this._cost = [];
    }

    create()
    {
        this._map = [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,1,1,0,0,0,0],
            [0,0,0,1,0,0,1,1,1],
            [0,1,1,1,0,0,0,0,0],
            [0,1,0,0,2,0,0,1,0],
            [0,0,0,0,0,0,1,1,0],
            [0,0,0,0,1,1,0,0,0],
            [0,0,0,0,1,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
        ];

        this._cost = [
            [  1,  1,  1,  1,  1,  1,  1,  1,  1],
            [  1,  1,  1,100,100,  1,  1,  1,  1],
            [  1,  1,  1,100,  1,  1,100,100,100],
            [  1,100,100,100,  1,  1,  1,  1,  1],
            [  1,100,  1,  1,  1,  1,  1,100,  1],
            [  1,  1,  1,  1,  1,  1,100,100,  1],
            [  1,  1,  1,  1,100,100,  1,  1,  1],
            [  1,  1,  1,  1,100,  1,  1,  1,  1],
            [  1,  1,  1,  1,  1,  1,  1,  1,  1],
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

                if (this._map[row][col] == 1){
                    block.makeColor(Colors.Black);
                }
                else if (this._map[row][col] == 2){
                    block.makeColor(Colors.Red);
                    this._desBlock = {
                        row: row,
                        col: col,
                        color: Colors.Red
                    };
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
            'Click a white block , it\'s will start to find a path to the red block',
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
                        
                        this.a_star_search(row, col);

                        if (this._changeQueue.length > 1){
                            this.time.addEvent({
                                delay: 100,
                                callback: () => {
                                    let changeBlock = this._changeQueue.shift()!;

                                    this._blocks[changeBlock.row][changeBlock.col].makeColor(changeBlock.color);
                                },
                                repeat: this._changeQueue.length - 1
                            });
                        }
                    }
                }
            }, this
        );
    }

    update() {

    }

    private a_star_search(row: number, col: number){
        
        let currentKey = `${row},${col}`;

        // a priority queue
        const priorityQueue = new PriorityQueue<IBlockWithPriority>();

        priorityQueue.enqueue({
            key: currentKey,
            row: row,
            col: col,
            priority: 0,
        });

        const path: Map<string, ITreeNode> = new Map<string, ITreeNode>();

        const gScore: Map<string, number> = new Map<string, number>();
        
        gScore.set(currentKey, 0);

        const fScore: Map<string, number> = new Map<string, number>();
        fScore.set(currentKey, this._cost[row][col]);

        path.set(currentKey, {
            row,
            col,
            parent: undefined
        });

        while(priorityQueue.length > 0){

            let node = priorityQueue.dequeue()!;

            console.log(node);

            currentKey = `${node.row},${node.col}`;

            if (node.row == this._desBlock!.row && node.col == this._desBlock!.col){
                break;
            }

            
            // this._changeQueue.push(
            //     {
            //         row: node.row,
            //         col: node.col,
            //         color: Colors.Blue
            //     }
            // );

            const neighbors:Array<ITreeNode> = [
                {row: node.row + 1, col: node.col, parent: path.get(currentKey)},
                {row: node.row - 1, col: node.col, parent: path.get(currentKey)},
                {row: node.row, col: node.col + 1, parent: path.get(currentKey)},
                {row: node.row, col: node.col - 1, parent: path.get(currentKey)},
            ];

            for(let i in neighbors){
                let neighborNode = neighbors[i];

                if (neighborNode.row < 0 || neighborNode.row > this._map.length - 1){
                    continue;
                }

                if (neighborNode.col < 0 || neighborNode.col > this._map[neighborNode.row].length - 1){
                    continue;
                }

                
                // this._changeQueue.push(
                //     {
                //         row: neighborNode.row,
                //         col: neighborNode.col,
                //         color: Colors.Yellow
                //     }
                // );
                
                let distance = Math.abs(node.row - neighborNode.row) + Math.abs(node.col - neighborNode.col);

                let neighborKey = `${neighborNode.row},${neighborNode.col}`;
                
                let tentative_gScore = gScore.get(currentKey)! + distance;
                
                // if gScore not has neighborKey, means it is infinity;
                if (!gScore.has(neighborKey) || tentative_gScore < gScore.get(neighborKey)!){
                    path.set(neighborKey, neighborNode);

                    gScore.set(neighborKey, tentative_gScore);

                    let cost =  this._cost[neighborNode.row][neighborNode.col];
                    fScore.set(neighborKey, tentative_gScore + cost);

                    let enqueueOne = {
                        key: neighborKey,
                        row: neighborNode.row,
                        col: neighborNode.col,
                        priority: tentative_gScore + cost,
                    };

                    if (!priorityQueue.contain(enqueueOne)){
                        priorityQueue.enqueue(enqueueOne);
                    }
                }
            }
        }

        let currentPath = path.get(`${this._desBlock!.col},${this._desBlock!.col}`)

        while(currentPath !== undefined){
            
            this._changeQueue.push(
                {
                    row: currentPath.row,
                    col: currentPath.col,
                    color: Colors.Green
                }
            );

            console.log(currentPath.row, currentPath.col);
            currentPath = currentPath.parent;
        }
    }
}
