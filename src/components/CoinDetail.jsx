import { useParams } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import Skeleton from './Skeleton';
import { currencyFormat } from "../utils";
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
  TableFooter,
  Label
} from 'semantic-ui-react'




const CoinDetail = () => {
  const { id } = useParams();
  const { response } = useAxios(`coins/${id}?localization=false&tickers=false&market_data=false&community_data=false&sparkline=false`);
  console.log(response)
  
  if(!response) {
    return (
      <div className="wrapper-container mt-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-72 w-full mb-10" />
      </div>
    )
  }

  return (

    <div className='my-6'>
      <div className='flex gap-2 items-center'>
        <img src={response.image.small} alt={response.name} />
        <h1 className='text-2xl mb-2 capitalize font-bold'>{response.id}</h1>
        <Button primary > Asset_id : {response.id}</Button>
      </div>
      <Header as='h2' color='teal' textAlign='center'>
        <Image src='/logox.png' /> Create a Trade.
      </Header>
  <Grid columns='equal'>
  
      <Divider/>

    <GridColumn>

    <Form size='large'>
        <Segment stacked>
          <Form.Input 
          fluid icon='money' iconPosition='left' 
          placeholder='Amount of AO-CRED' 
          
          />
          <Form.Input
            fluid
            icon='calendar alternate outline'
            iconPosition='left'
            placeholder='Expiry in Days.'
            type='password'
          />
            <Divider/>
            <span> Payoff :{response.sentiment_votes_down_percentage}% </span>
          <Button color='teal' position ="left" fluid size='small'>
            Call.
          </Button>
        
        </Segment>
      </Form>
    </GridColumn>
    <GridColumn>
    <Form size='large'>
        <Segment stacked>
          <Form.Input 
          fluid icon='money' iconPosition='left' 
          placeholder='Amount of AO-CRED' 
          
          />
          <Form.Input
            fluid
            icon='calendar alternate outline'
            iconPosition='left'
            placeholder='Expiry in Days.'
            type='password'
          />
          <Divider/>
          <span> Payoff :{response.sentiment_votes_up_percentage} % </span>
          <Button color='red' position ="right" fluid size='small'>
            Put.
          </Button>
        </Segment>
      </Form>
    </GridColumn>
  </Grid>

      <Header as='h2' color='teal' textAlign='center'>
        <Image src='/logox.png' />  My trades.
      </Header>
      <Table celled>
    <TableHeader>
      <TableRow>
        <TableHeaderCell> Trade ID</TableHeaderCell>
        <TableHeaderCell>Asset Name.</TableHeaderCell>
        <TableHeaderCell>Asset ID.</TableHeaderCell>
        <TableHeaderCell>Buy Amount.</TableHeaderCell>
        <TableHeaderCell>Buy Type</TableHeaderCell>
        <TableHeaderCell> Time Created</TableHeaderCell>
        <TableHeaderCell>Contract Expiry.</TableHeaderCell>
        <TableHeaderCell>Contract Status</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>567894</TableCell>
        <TableCell>Bitcoin</TableCell>
        <TableCell>bitcoin</TableCell>
        <TableCell>5 AOCRED</TableCell>
        <TableCell>Call</TableCell>
        <TableCell>6/10/2024, 4:46:40 PM </TableCell>
        <TableCell>7/10/2024, 4:46:40 PM</TableCell>
        <TableCell>done</TableCell>
        
      </TableRow>
    </TableBody>
  </Table>

        <Message position="center" >
        Follow us on <a  position="center" href='https://x.com/NotusOptions'>Twitter.</a>
      </Message>

    </div>
  )
}

export default CoinDetail