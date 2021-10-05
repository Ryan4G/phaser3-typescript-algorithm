import Colors from "~enums/Colors"

export default class Block extends Phaser.GameObjects.Container{

    private _text: string;
    private _color: Colors;
    private _blockRect: Phaser.GameObjects.Rectangle;
    private _blockText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene, x, y, undefined)

        this._blockRect = scene.add.rectangle(20, 20, 40, 40, 0xffffff);

        this._blockText = scene.add.text(10, 10, '', {color: '#000000'});
        
        this.add(this._blockRect);
        this.add(this._blockText);

        this._color = Colors.White;
        this._text = '';

        scene.add.existing(this);

        this.setSize(40, 40);
    }

    get color(){
        return this._color;
    }
    
    get text(){
        return this._text;
    }

    makeColor(color: Colors){

        switch(color){
            case Colors.Red:{
                this._blockRect.fillColor = 0xff0000;
                break;
            }
            case Colors.Blue:{
                this._blockRect.fillColor = 0x0000ff;
                break;
            }
            case Colors.White:{
                this._blockRect.fillColor = 0xffffff;
                break;
            }
            case Colors.Black:{
                this._blockRect.fillColor = 0x000000;
                break;
            }
            case Colors.Green:{
                this._blockRect.fillColor = 0x00ff00;
                break;
            }
            case Colors.Yellow:{
                this._blockRect.fillColor = 0xffff00;
                break;
            }
        }

        this._color = color;
    }

    changeText(text: string){
        this._blockText.setText(text);
        this._text = text;
    }
}