import React, { useEffect, useState } from "react";

const Welcome = () => {
  const [countDown, setCountDown] = useState(3);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountDown((prevCountDown) => {
        if (prevCountDown <= 1) {
          clearInterval(countdownInterval);
          return prevCountDown;
        } else {
          return prevCountDown - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [countDown]);

  return (
    <div className="welcomeWrapper">
      <div className="welcomeMsg">
        Welcome to the arena. <br /> May the best player wins.
      </div>

      <div className={`countdown `}>{countDown}</div>
    </div>
  );
};

export default Welcome;
