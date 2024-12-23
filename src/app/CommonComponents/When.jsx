import React from 'react'

const When = ({ component, when }) => {
    return (
        when ? component  : null
    )
}

export default When