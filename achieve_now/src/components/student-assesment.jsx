import React from 'react';
import { formatDiagnostic } from 'typescript';
import { AssessmentTable } from "../components/Tables/assessment-table"


/**
 * This file uses assement-table to keep 
 */

export const StudentAssesment = () => {
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const [showForm,setShowForm] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("")
    const [searchResults,setSearchResuls] = React.useState([])
    React.useEffect(() => {
        fetch("http://localhost:3012/getData", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result);
                    setSearchResuls(result)
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    const getStudentList = (event) =>{
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        if(searchTerm===""){
            setSearchResuls(items)
        }
        const results = items.filter((sentence)=> `${sentence.student_first} ${sentence.student_last} ${sentence.teacher}`.includes(searchTerm));
        setSearchResuls(results)
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <>

                <input type= "text" onChange = {getStudentList}></input>
                <AssessmentTable data={searchResults}></AssessmentTable>
                <button onClick={()=>setShowForm(true)}>Add assessment</button>
                {showForm && ( <form action="http://localhost:3012/sendData" method="POST">
                    <input placeholder = "first name" name = "student_first" type="text"/>
                    <input placeholder = "last name" name = "student_last" type="text"/>
                    <input placeholder = "teacher" name = "teacher" type="text"/>
                    <button type="submit">Submit</button>
                </form> )}
            </>
        );
    }



 }