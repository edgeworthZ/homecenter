import React, { createContext, useState } from 'react'
export const SampleContext = createContext()
const SampleContextProvider = (props) => {
    const [variableOne, setVariableOne] = useState('somethingRandom')
    const Url = "http://localhost:3000"
    return (
         <SampleContext.Provider 
            value={{
                variableOne,
                Url
             }}>
               {props.children}
         </SampleContext.Provider>
    )
}
export default SampleContextProvider