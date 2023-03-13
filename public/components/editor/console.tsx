import React from 'react';
import ReactDOM from 'react-dom'




export const Console = (props) => {
    let newText = props.testResponse;

    return (
        <div>
            <div id="background">
                <div id="console">
                    <p id="consoletext">
                        {newText}
                    </p>
                </div>
            </div>
        </div>
    )

};