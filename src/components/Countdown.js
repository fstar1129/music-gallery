import React from 'react';

const Countdown = ({ countdown }) => {
  return (
    <div className="countdown">
      {countdown.days !== 0 && countdown.hours !== 0 && countdown.mins !== 0 && countdown.secs !== 0 && (
        <div>
          <p>This Session Will Begin In</p>
          <div className="card">
            {countdown.days !== 0 && (<>
                <div className="countdown-value">{countdown.days}</div>
                <div className="countdown-unit">d</div>
              </>)}
            <div className="countdown-value">{countdown.hours}</div>
            <div className="countdown-unit">hr</div>
            <div className="countdown-value">{countdown.mins}</div>
            <div className="countdown-unit">m</div>
            <div className="countdown-value">{countdown.secs}</div>
            <div className="countdown-unit">s</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Countdown;