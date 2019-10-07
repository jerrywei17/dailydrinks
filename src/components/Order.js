import React from 'react'

const Order = (props) => {
  return (
    <tr>
      <td>{props.row.name}</td>
      <td>{props.row.amount}</td>
      <td>{props.row.note}</td>
      {props.children}
    </tr>
  )
}

export default Order
