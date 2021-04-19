import React from "react";

/**
 * 
 */


type TableProps = {
    data: { student_first: string, student_last: string, teacher: string }[];
};

export const AssessmentTable: React.FC<TableProps> = ({ data }) => {
    return (
        <div className="container">
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">First Name</th>
                        <br/>
                        <th scope="col">Last Name</th>
                        <br/>
                        <th scope="col">Teacher</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {data.map((row, index) => {
                            return (
                                <>
                                    <div key={index}></div>
                                    <tr>
                                        <td>
                                            <p>{row.student_first}</p>
                                        </td>
                                        
                                        <td>
                                            <p>{row.student_last}</p>
                                        </td>
                                        <td>
                                            <p>{row.teacher}</p>
                                        </td>
                                    </tr>
                               
                                </>
                            );
                        })}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
