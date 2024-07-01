
import React from 'react'
import {
    Message,
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    List,
    Menu,
    Segment,
    Sidebar,
    MenuMenu,
    MenuItem,
    GridColumn,
    GridRow,
    FormField,
    Form,
    Checkbox,
    FormGroup,
    FormInput,
    FormButton,
    Table,
    TableHeader,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
  } from 'semantic-ui-react'
import useAxio from '../hooks/useAxio'
  
  

//const url = "https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=a2f4db644e9107746535b0d2ca43b85d"


const AoHome = () => {

    const { response } = useAxio()

    console.log(response)

    if(!response) {
        return (
         <h4>loading</h4>
        )
      }

  return (
    <Container>

<Grid columns='equal'>
  
  <Divider/>


<GridColumn>

<Form size='large'>
    <span> AOC Balance: </span>
    <Segment stacked>
    <Image src='sunset.png' wrapped ui={false} />
     <Divider/>
     <span>Country : {response.sys.country}</span>
     <Divider/>
     <span>CountryId : {response.sys.id}</span>
     <Divider/>
     <span>City : {response.name}</span>
     <Divider/>

     <span> Current Temp : {response.main.temp}</span>
     <Divider/>
     <span>Current Time : {response.dt}</span>
     <Divider/>
      <Form.Input 
      fluid icon='money' iconPosition='left' 
      placeholder='Amount of AOC.' 
      
      />
        <Divider/>
      <Button color='teal' position ="left" fluid size='small'>
        Call.

      </Button>
    
    </Segment>
  </Form>
</GridColumn>
<GridColumn>
<Form size='large'>
    <Button size='mini' primary> Claim AOC</Button>
    <Segment stacked>
    <Image src='sunset.png' wrapped ui={false} />
    <Divider/>
    <span>Country : {response.sys.country}</span>
     <Divider/>
     <span>CountryId : {response.sys.id}</span>
     <Divider/>
     <span>City : {response.name}</span>
     <Divider/>

     <span> Current Temp : {response.main.temp}</span>
     <Divider/>
     <span>Current Time : {response.dt}</span>
     <Divider/>
      <Form.Input 
      fluid icon='money' iconPosition='left' 
      placeholder='Amount of AOC' 
      
      />
      <Divider/>
      <Button color='red' position ="right" fluid size='small'>
        Put.
      </Button>
    </Segment>
  </Form>
</GridColumn>
</Grid>

    </Container>
  )
}

export default AoHome
