import React, { Component } from 'react';
import AppNav from './AppNav';
import DatePicker from 'react-datepicker';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";
import { Button, Container, FormGroup, Form, Label, Input, Table } from 'reactstrap';
import {Link} from 'react-router-dom';
import Category from './Category';
import Moment from 'react-moment';

class Expenses extends Component {

  emptyItem = {
    description : '' ,
    expenseDate : new Date(),
    id:103,
    location : '',
    category : {id:1 , name:'Travel'}
}

  constructor(props){
    super(props)

    this.state = {
      date: new Date(),
      isLoading: false,
      expenses: [],
      categories: [],
      item: this.emptyItem

    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    
  }

  handleChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item ={...this.state.item};
    item[name] = value;
    this.setState({item});
    console.log(item);

  }

  handleDateChange(date){
    let item = {...this.state.item};
    item.expenseDate = date;
    this.setState({item});
  }

  async handleSubmit(event){
    
    const item = this.state.item;
    await fetch(`/api/expenses`, {
      method: 'POST',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(item),

    });
    event.preventDefault();
    this.props.history.push("/expenses");
  }

   async componentDidMount(){
     const response = await fetch('/api/categories');
     const body = await response.json();
     this.setState({ categories: body, isLoading: false});

     const responseExp = await fetch('/api/expenses');
     const bodyExp = await responseExp.json();
     this.setState({ expenses: bodyExp, isLoading: false});

   }

   async remove(id){
     await fetch(`/api/expenses/${id}`, {
       method: 'DELETE',
       headers: {
         'Accept' : 'application/json',
         'Content-Type' : 'application/json'
       }
     }).then(() => {
       let updatedExpenses = [...this.state.expenses].filter(i => i.id !== id);
       this.setState({expenses: updatedExpenses});
     }

     )
   }


  render() { 
    const title = <h3>Add Expense</h3>
    const {categories} = this.state;
    const {expenses, isLoading} = this.state

    if(isLoading)
      return (<div>Loading...</div>)

    let optionList = categories.map( (category) =>
      <option value={category.id} key={category.id}>
          {category.name}  
      </option>
    )

    let rows=
            expenses.map( expense =>
              <tr key={expense.id}>
                <td>{expense.description}</td>
                <td>{expense.location}</td>
                <td><Moment date={expense.expenseDate} format="YYYY/MM/DD"/></td>
                <td>{expense.category.name}</td>
                <td><Button size="sm" color="danger" onClick={() => this.remove(expense.id)}>Delete</Button></td>

              </tr>
      )
  

    return ( 
    <div>
      <AppNav/>
      <Container>
        {title}

        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="description">Title</Label>
            <Input type="description" name="description" id="description" onChange={this.handleChange} autoComplete="name"/>
          </FormGroup>

          <FormGroup>
            <Label for="category">Category</Label>
            <select name="category" onChange={this.handleChange}>
              {optionList}
            </select>
          </FormGroup>

          <FormGroup>
            <Label for="expenseDate">Expense Date</Label>
            <DatePicker selected={this.state.item.expenseDate} onChange={this.handleDateChange}/>
          </FormGroup>

          <div className="row">
                        <FormGroup className="col-md-4 mb-3">
                        <Label for="location">Location</Label>
                        <Input type="text" name="location" id="location" onChange={this.handleChange}/>
                        </FormGroup>
                      
                    </div>

          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to='/categories'>Cancel</Button>
          </FormGroup>

        </Form>
      </Container>

    {''}
      <Container>
        <h3>Expense List</h3>
        <Table className="mt-4">
          <thead>
            <tr>
              <th width="30%">Description</th>
              <th width="10%">Location</th>
              <th>Date</th>
              <th>Category</th>
              <th width="10%">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>

        </Table>
      </Container>
      
    </div>
    );
  }
}
 
export default Expenses;