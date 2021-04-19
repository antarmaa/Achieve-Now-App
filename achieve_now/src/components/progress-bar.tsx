import * as React from "react";
import { ProgressBar } from "react-bootstrap";


/**
 *Progress bar that calculates progress from cert check scores from gradbook and parent gradbook 
 */

type props = {
    grades:any
    studentName:string;
    setShowProgressBar:any
}
export const StudentProgressBar:React.FC<props> = ({grades,studentName,setShowProgressBar}) => {
    const total = Object?.keys(grades)?.length * 100
    let sum = 0
    for(let i =0;i<Object?.keys(grades).length;i++){
        sum+=+grades[`cert-${i}`]
    }

  return (
    <>
    <div className="container">
        <h4 >Grade Progress for {studentName}</h4>
        <button onClick={()=>setShowProgressBar(false)} >Go Back</button>
        <br/>
        <br/>
      <ProgressBar animated now={(sum/total*100)||0} label={`${((sum/total)*100)||0}%`} />
    </div>
    </>
  );
};
