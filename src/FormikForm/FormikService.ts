import {Web} from "@pnp/sp/presets/all";
export class FormikClass{
    private web:any;

    constructor(url:string){
        this.web=Web(url);

    }
    
public async createItems(ListName:string,body:any){
    try{
let createItem=await this.web.lists.getByTitle(ListName).items.add(body);
return createItem;
    }
    catch(err){
console.error("Error while creatig the item");
throw err;
    }
    finally{
        console.log("I will always run");
    }
}
}