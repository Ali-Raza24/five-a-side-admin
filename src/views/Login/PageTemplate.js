import React from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";

const PageTemplate = (props) => {
  return (
    <React.Fragment>
      <Navbar user={props.user} navbarClass={props.navbarClass}/> 
      
      {props.children}

      {!props.noFooter &&
      <Footer wrapperClass="new-footer default-footer"/>
      }
    </React.Fragment>
  );
};

export default PageTemplate;