import {sp,ICamlQuery}from "@pnp/sp/presets/all";
import { ILargeListState } from "../webparts/largeList/components/ILargeListState";
import { WebPartContext } from "@microsoft/sp-webpart-base";
// import { List } from "antd";

export class service{
    constructor(context:WebPartContext){
        sp.setup({
            spfxContext:context as any
        });
    }

    //Get All by defualt it can fetch upto 2000 items later it won't work

    public async getListItems(ListName:string):Promise<ILargeListState[]>{
        try{
            const items=await sp.web.lists.getByTitle(ListName).items.getAll();
            return items.map((item:any)=>({
                Title:item.Title,
                EmailAddress:item.EmailAddress
            }));
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
    // More than 5000 items using Where clause

    public async getMoreThanitemsUsingWhereClause(ListName:string):Promise<ILargeListState[]>{
        const allItems:ILargeListState[]=[];
        let position:any;
        do{
            const camlQuery:ICamlQuery={
                ViewXml:`
                <View>
                <Query>
                <Where>
                <IsNotNull>
                <FieldRef Name='Title'/>
                </IsNotNull>
                </Where>
                </Query>
                <RowLimit>2000</RowLimit>
                </View>
                `
            }
            const response=await sp.web.lists.getByTitle(ListName).getItemsByCAMLQuery(camlQuery,position);
            console.log(`Fetched batch of ${response.length} items`);

            allItems.push(
                ...response.map((item:any)=>({
                    Title:item.Title,
                    EmailAddress:item.EmailAddress
                }))
            );
        }
        while(position)
            console.log(`Total items fetched ${allItems.length}`);
        return allItems;
    }
}