import React from 'react'

const When = ({ Component, when }) => {
    return (
        when ? <Component /> : null
    )
}

export default When