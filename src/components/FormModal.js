import React, { Component } from 'react';
import styled from 'styled-components'

const Mask = styled.div`
  display: ${props => props.active?'block':'none'};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  background: rgba(0,0,0,.2);
  transition: opacity linear 0.5s;
  opacity: ${props => props.fadeType==='out'?0:1};
`

const Modal = styled.div`
  position: absolute;
  top: 15vh;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity linear 0.5s;
  opacity: ${props => props.fadeType==='out'?0:1};
`

const validators = {
  name: (v) => {
    if(!v && v !==0){
      return '名稱不可為空'
    }
    return ''
  },
  amount: (v) => {
    if(!v && v !==0){
      return '金額不可為空'
    } else if (v<=0) {
      return '金額須大於0'
    }
    return ''
  }
}
class FormModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false,
      fadeType: 'out',
      form: {
        name: '',
        amount: '',
        note: ''
      },
      errors: {
        name: '',
        amount: '',
        note: ''
      },
      errorList: []
    }
  }
  closeModal (e) {
    if(e){
      e.preventDefault()
    }
    this.setState({
      ...this.state,
      fadeType: 'out',
      form: {
        name: '',
        amount: '',
        note: ''
      },
      errors: {
        name: '',
        amount: '',
        note: ''
      },
      errorList: []
    })
    setTimeout(() => {
      this.setState({
        ...this.state,
        visible: false
      })
    }, 500)
  }

  openModal (form) {
    if(form){
      this.setState({
        ...this.state,
        visible: true,
        form
      })
    } else {
      this.setState({
        ...this.state,
        visible: true
      })
    }

    setTimeout(() => {
      this.setState({
        ...this.state,
        fadeType: 'in'
      })
    }, 0)
  }

  handleInput (e, prop) {
    let value = e.target.value
    let form = {
      ...this.state.form,
      [prop]: value
    }

    let errorMsg = validators[prop]?validators[prop](value):''
    let errorList = []
    if(errorMsg){
      errorList.push(errorMsg)
    }
    let errors = {
      ...this.state.error,
      [prop]: errorMsg
    }
    this.setState({
      ...this.state,
      form,
      errors,
      errorList
    })
  }

  submitForm () {
    let errors = {}
    let isAllvalid = true
    let errorList = []
    Object.keys(validators).forEach(prop => {
      let errorMsg = validators[prop](this.state.form[prop])
      if(errorMsg){
        errors[prop] = errorMsg
        errorList.push(errorMsg)
        isAllvalid = false
      }
    })

    if(isAllvalid){
      let existIdx = this.props.orders.findIndex(o => o.name === this.state.form.name)
      if(existIdx!==-1 && existIdx !== this.props.action.index){
        isAllvalid = false
        errors.name = '名稱不可重複'
        errorList.push('名稱不可重複')
      }
    }
    if(isAllvalid){
      if(this.props.action.mode === 'create'){
        this.props.createOrder({...this.state.form})
      } else {
        this.props.editOrder({...this.state.form})
      }

      this.closeModal()
    } else {
      this.setState({
        ...this.state,
        errors,
        errorList
      })
    }
  }

  render () {
    return (
      <div>
        <Mask active={this.state.visible} fadeType={this.state.fadeType} onClick={this.closeModal.bind(this)}></Mask>
        <Modal className={`ui modal tiny ${this.state.visible?'active':''}`} fadeType={this.state.fadeType}>
          <div className="header">品項</div>
          <div className="content">
            <form className="ui form">
              <div className={`field ${this.state.errors.name?'error': ''}`}>
                <label>名稱</label>
                <input onChange={(e) => {this.handleInput(e, 'name')}} value={this.state.form.name} type="text" placeholder="名稱" />
              </div>
              <div className={`field ${this.state.errors.amount?'error': ''}`}>
                <label>價格</label>
                <input onChange={(e) => {this.handleInput(e, 'amount')}} value={this.state.form.amount} type="number" placeholder="價格" step="1"></input>
              </div>
              <div className="field">
                <label>備註</label>
                <textarea onChange={(e) => {this.handleInput(e, 'note')}} value={this.state.form.note} placeholder="備註"></textarea>
              </div>
            </form>
          </div>
          <div className="actions">
            <div className={`ui blue button ${this.state.errorList.length>0?'disabled':''}`} onClick={this.submitForm.bind(this)}>送出</div>
            <div className="ui basic button" onClick={this.closeModal.bind(this)}>取消</div>
          </div>
          {
            this.state.errorList.length>0?
            <div className="ui error message">
              <ul className="list">
                {
                  this.state.errorList.map(err => (
                    <li key={err}>{err}</li>
                  ))
                }
              </ul>
            </div>
            :null
          }
        </Modal>
      </div>
    )
  }
}

export default FormModal
