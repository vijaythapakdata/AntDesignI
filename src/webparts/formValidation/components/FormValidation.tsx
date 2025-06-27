import * as React from 'react';
import styles from './FormValidation.module.scss';
import type { IFormValidationProps } from './IFormValidationProps';
import { FormikClass } from '../../../FormikForm/FormikService';
import {sp} from "@pnp/sp/presets/all";
import * as yup from 'yup';
import {Formik,FormikProps} from 'formik';
import {PeoplePicker,PrincipalType} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import {Dialog} from "@microsoft/sp-dialog";
import { Label, Stack, TextField ,Dropdown,DatePicker, PrimaryButton} from '@fluentui/react';
// import { DatePicker } from 'antd';
// import { Dropdown } from 'antd';

const stackTokens={
  childrenGap:20
}

const  FormValidation :React.FC<IFormValidationProps>=(props)=>{
  const [service,setService]=React.useState<FormikClass|null>(null);

  React.useEffect(()=>{
    sp.setup({spfxContext:props.context as any});
    setService(new FormikClass(props.siteurl));
  },[props.context,props.siteurl]);

  //validate the form
  // Note : Apply Validation on 10 digit phone number
  // Apply validation on valid email address
  const validate=yup.object().shape({
    name:yup.string().required("Task name is required"),
    details:yup.string().min(15,"minimum 15 characters are required").required("Task deatails are required"),
    startDate:yup.date().required("Start Date is required"),
    endDate:yup.date().required("End Date is required"),
    projectName:yup.string().required("Project Name is required")
  });

  //field helpers
  const getFieldProps=(formik:FormikProps<any>,field:string)=>({
    ...formik.getFieldProps(field),errorMessage:formik.errors[field] as string
  });
  const createRecord=async(record:any)=>{
    try{
const item=await service?.createItems(props.ListName,{
  Title:record.name,
  TaskDetails:record.details,
  StartDate:record.startDate,
  EndDate:record.endDate,
  ProjectName:record.projectName
});
console.log(item);
Dialog.alert("Item saved successfullly");
    }
    catch(err){
      console.error(err);

    }
  }
return(
  <>
  <Formik
  initialValues={{
    name:"",
    projectName:"",
    details:"",
    startDate:null,
    endDate:null,

  }}
  validationSchema={validate}
  onSubmit={(values,helpers)=>{
    createRecord(values).then(()=>helpers.resetForm())
  }}
  >


{
  (formik:FormikProps<any>)=>(
    <form onSubmit={formik.handleSubmit}>
<div className={styles.formValidation}>
  <Stack tokens={stackTokens}>
    <Label className={styles.lblForm}>User Name</Label>
    <PeoplePicker
    context={props.context as any}
    ensureUser={true}
    personSelectionLimit={1}
    webAbsoluteUrl={props.siteurl}
    defaultSelectedUsers={[props.context.pageContext.user.displayName as any]}
    disabled={true}
    principalTypes={[PrincipalType.User]}
    />
    <Label className={styles.lblForm}>Task Name</Label>
    <TextField
    {...getFieldProps(formik,'name')}
    />
  <Label className={styles.lblForm}>Project Name</Label>
   <Dropdown
   options={[
    {key:'Project -1',text:'Project -1'},
     {key:'Project -2',text:'Project -2'},
      {key:'Project -3',text:'Project -3'},
       {key:'Project -4',text:'Project -4'},
   ]}
   selectedKey={formik.values.projectName}
   onChange={(_,options)=>formik.setFieldValue('projectName',options?.key)}
   errorMessage={formik.errors.projectName as string}
   />
    <Label className={styles.lblForm}>Start Date</Label>
    <DatePicker
    id='startDate'
    value={formik.values.startDate}
    textField={{...getFieldProps(formik,'startDate')}}
    onSelectDate={(date)=>formik.setFieldValue('startDate',date)}
    />
    <Label className={styles.lblForm}>End Date</Label>
    <DatePicker
    id='endDate'
    value={formik.values.endDate}
    textField={{...getFieldProps(formik,'endDate')}}
    onSelectDate={(date)=>formik.setFieldValue('endDate',date)}
    />
<Label className={styles.lblForm}>Task Details</Label>
    <TextField
    {...getFieldProps(formik,'details')}
    multiline
    rows={5}
    />
  </Stack>
  <PrimaryButton
  className={styles.btn}
  type='submit'
  text='Save'
  iconProps={{iconName:'save'}}
  />
  <PrimaryButton
  className={styles.btn}
  // type='submit'
  text='Cancel'
  iconProps={{iconName:'cancel'}}
  onClick={formik.resetForm as any}
  />
</div>

    </form>
  )
}

  </Formik>
  </>
)
}
export default  FormValidation ;
