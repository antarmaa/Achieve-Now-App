import React from "react";
import "../../src/styles/home.css";


/**
* Contenets of the homepage 
*/
const logo1 = require("./thumbnail.png");

export const Home = () => {

  return (
 <div className="container">
 
<img className="homeImg" alt ="img"src={logo1}> </img>
<br></br>
 <p className= "contact">
   CONTACT US
   <br></br>
    Achieve Now
    <br></br>
    1735 Market St., Ste. A500
    <br></br>
    Philadelphia, PA 19103
    <br></br>
    Phone: (267) 515-3558
    <br></br>
    Email us: programs@achieve-now.com </p>

  
<button onClick={(e) => {
      e.preventDefault();
      window.location.href='https://www.achieve-now.com/donate';
      }}className="donate">Donate</button>

</div>

  );
};
