import React from 'react'

function CardId() {
    const generateRandomString = () => {
        const length = 30
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let randomString = ""
        
        for(let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length)
            randomString += characters.charAt(randomIndex)
        }
        localStorage.setItem("randomString", randomString)
    }
    const existingRandomString = localStorage.getItem("randomString")
    if (!existingRandomString) {
        generateRandomString()
    }else{

    }
  return  existingRandomString
}

export default CardId