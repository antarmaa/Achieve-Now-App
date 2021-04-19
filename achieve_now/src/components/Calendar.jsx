import React from "react";

/**
 * This links the side menu calendar button to google calendar
 */

export const Calendar = () => {
  React.useEffect(() => {
    window.open("https://calendar.google.com/", "_blank");
  }, []);
  return <div></div>;
};
