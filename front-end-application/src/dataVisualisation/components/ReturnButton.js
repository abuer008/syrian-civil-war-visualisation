import React from 'react'
import returnLogo from '../../return.svg'

export const ReturnButton = () => {
    return (
        <>
            <div style={{backgroundColor: 'rgba(0, 0, 0, 0)', cursor: 'pointer'}}>
                <a href='https://boweisdesign.com/interactive-projects/data-visualisation'>
                <img src={returnLogo} alt='return to the description page' width='27' height='26' />
                </a>
            </div>
        </>
    )
}