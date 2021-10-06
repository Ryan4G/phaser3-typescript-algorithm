import IPriority from "~interfaces/IPriority";

export default class PriorityQueue<T extends IPriority>{
    private _queue: Array<T>;

    constructor(){
        this._queue = [];
    }

    enqueue(t: T){
        this._queue.push(t);
        this._queue.sort((a, b)=> a.priority - b.priority);
    }

    dequeue(){
        return this._queue.shift();
    }

    contain(t: T){
        return this._queue.some(item => item.key === t.key);
    }

    get length(){
        return this._queue.length;
    }
}