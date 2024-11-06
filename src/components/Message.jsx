import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatsContext'

const Message = ({message}) => {
const {currentUser}= useContext(AuthContext)
const {data} = useContext(ChatContext)
  console.log(message);
  
  return (
    <div className='message owner'>
      <div className="messageInfo">
        <img src="/pp.jfif" width={40} height={40} alt="" />
        <span>just now</span>
      </div>
      <div className="messagseContaint">
        <p>hello lorem</p>
        <img src='/pp.png' alt="" />
      </div>
    </div>
  )
}

export default Message