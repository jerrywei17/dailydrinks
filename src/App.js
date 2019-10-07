import React, { Component } from 'react';
import styled from 'styled-components'
import Order from './components/Order'
import FormModal from './components/FormModal'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 50px;
`

const TableWrapper = styled.div`
  width: 950px;
  margin: 0 auto;
`

const Icon = styled.i`
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
`

const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 50px;
`

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      orders: [],
      submitOrder: null,
      action: {
        mode: 'create',
        index: 0
      }
    }
  }

  toggleMode (type, index) {
    this.setState({
      ...this.state,
      action: {
        mode: type,
        index
      }
    }, () => {
      if(type === 'edit'){
        this.modal.openModal({...this.state.orders[index]})
      } else {
        this.modal.openModal()
      }
    })
  }

  createOrder (form) {
    let orders = [...this.state.orders]
    orders.splice(this.state.action.index, 0, form)
    this.setState({
      ...this.state,
      orders
    })
  }

  editOrder (form) {
    let orders = [...this.state.orders]
    orders.splice(this.state.action.index, 1, form)

    this.setState({
      ...this.state,
      orders
    })
  }

  deleteOrder (index) {
    let orders = [...this.state.orders]
    orders.splice(index, 1)

    this.setState({
      ...this.state,
      orders
    })
  }

  render () {
    return (
      <Container>
          <h2 className="ui icon header">Daily Drinks</h2>
          <TableWrapper>
            <table className="ui striped table">
              <thead>
                <tr>
                  <th width="25%">名稱</th>
                  <th width="25%">價格</th>
                  <th width="30%">備註</th>
                  <th width="15%"></th>
                </tr>
              </thead>
              <tbody>
                {this.state.orders.map((row, i) => (
                  <Order
                    key={row.name}
                    row={row}>
                      {
                        <td>
                          <Icon onClick={() => {this.toggleMode('create', i+1)}}>
                            <i className="icon plus"></i>
                          </Icon>
                          <Icon onClick={() => {this.deleteOrder(i)}}>
                            <i className="icon minus"></i>
                          </Icon>
                          <Icon onClick={() => {this.toggleMode('edit', i)}}>
                            <i className="icon edit"></i>
                          </Icon>
                        </td>
                      }
                    </Order>
                ))}
              </tbody>
            </table>
          </TableWrapper>
          <FormModal
            orders={this.state.orders}
            ref={(modal) => { this.modal = modal; }}
            action={this.state.action}
            createOrder={this.createOrder.bind(this)}
            editOrder={this.editOrder.bind(this)}></FormModal>
          {this.state.orders.length===0?
            <Footer>
              <button type="button" className="small ui button" onClick={() => {this.toggleMode('create', 0)}}>
                新增品項
              </button>
            </Footer>
            :null
          }
        </Container>
    )
  }
}

export default App;
