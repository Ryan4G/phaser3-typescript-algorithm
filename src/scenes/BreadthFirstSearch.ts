import Phaser from 'phaser';
import Colors from '~enums/Colors';
import Block from '~sprites/Block';

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

export default class FloodFill extends Phaser.Scene {

    private _blocks: Array<Array<Block>>;
    private _changeQueue: Array<IChangeBlock>;
    private _map: number[][];
    private _blockSetHistory: Array<string>;
    private _clicked: boolean = false;
    private _desBlock?: IChangeBlock;

    constructor() {
        super('Breadth-first Search');
        this._blocks = [];
        this._changeQueue = [];
        this._map = [];
        this._blockSetHistory = [];
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
                        
                        this.breadth_first_search(row, col);

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

    private breadth_first_search(row: number, col: number){
        
        // build a tree
        const tree: Map<string, ITreeNode> = new Map<string, ITreeNode>();
        const desKey = `${this._desBlock!.row},${this._desBlock!.col}`;
        
        let currentNode = {
            row: this._desBlock!.row,
            col: this._desBlock!.col,
            parent: undefined
        };

        tree.set(desKey, currentNode);

        const buildQueue: Array<ITreeNode> = [];
        buildQueue.push(currentNode);

        while(buildQueue.length > 0){

            let node = buildQueue.shift()!;

            this._changeQueue.push(
                {
                    row: node.row,
                    col: node.col,
                    color: node.parent ? Colors.Blue : Colors.Red
                }
            );
            
            if (node.row == row && node.col == col){
                break;
            }
            
            const neighbors:Array<ITreeNode> = [
                {row: node.row + 1, col: node.col, parent: node},
                {row: node.row - 1, col: node.col, parent: node},
                {row: node.row, col: node.col + 1, parent: node},
                {row: node.row, col: node.col - 1, parent: node},
            ];

            for(let i in neighbors){
                let neighborNode = neighbors[i];

                if (neighborNode.row < 0 || neighborNode.row > this._map.length - 1){
                    continue;
                }

                if (neighborNode.col < 0 || neighborNode.col > this._map[neighborNode.row].length - 1){
                    continue;
                }
                
                if (this._map[neighborNode.row][neighborNode.col] === 1){
                    continue;
                }

                let neighborKey = `${neighborNode.row},${neighborNode.col}`;
                if (tree.has(neighborKey)){
                    continue;
                }

                this._changeQueue.push(
                    {
                        row: neighborNode.row,
                        col: neighborNode.col,
                        color: Colors.Green
                    }
                );

                tree.set(neighborKey, neighborNode);

                buildQueue.push(neighborNode);
            }
        }

        //console.log(tree);
        // find a path to root node

        let startKey = `${row},${col}`;
        const pathToRoot: Array<ITreeNode> = [];
        
        //console.log('start key', startKey);
        let startNode = tree.get(startKey);

        while(startNode !== undefined){

            this._changeQueue.push(
                {
                    row: startNode.row,
                    col: startNode.col,
                    color: Colors.Yellow
                }
            );
            pathToRoot.push(startNode);
            startNode = startNode.parent;
        }

        //console.log(pathToRoot);
    }
}
