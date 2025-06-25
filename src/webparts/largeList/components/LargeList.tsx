import * as React from 'react';
// import styles from './LargeList.module.scss';
import type { ILargeListProps } from './ILargeListProps';
import { ILargeListState } from './ILargeListState';
import { service } from '../../../LargeListService/Service';
import { DetailsList } from '@fluentui/react';

const  LargeList:React.FC<ILargeListProps>=(props)=>{
  const[ListResults,setListResults]=React.useState<ILargeListState[]>([]);
  const _service=new service(props.context);

  React.useEffect(()=>{
    const fetchData=async()=>{
      try{
        const result=await _service.getMoreThanitemsUsingWhereClause(props.ListName);
        setListResults(result);
      }
      catch(err){
        console.log(err);
        throw err;
      }
    };
    fetchData();
    
  },[props.ListName,_service])
  return(
    <>
    <DetailsList
    items={ListResults}

    />
    </>
  )
}
export default  LargeList;