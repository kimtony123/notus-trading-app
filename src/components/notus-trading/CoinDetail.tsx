import React from "react";
import { useParams } from "react-router-dom";
import useAxios from "../../hooks/useAxios"; // Adjust the import path as necessary
import {
  Button,
  Header,
  Grid,
  Divider,
  Form,
  Segment,
  Image,
  Table,
  Message,
  Menu,
  MenuItem,
  FormGroup,
  FormButton,
  FormInput,
  MenuMenu,
  Input,
  Container,
} from "semantic-ui-react";
import {
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "semantic-ui-react";
import Skeleton from "./Skeleton"; // Adjust the import path as necessary
import { useEffect, useState } from "react";
import { message, createDataItemSigner, result } from "@permaweb/aoconnect";
import { PermissionType } from "arconnect";
import Coin from "./Coin";

// Define types for route parameters
type RouteParams = {
  id: string;
};
interface Tag {
  name: string;
  value: string;
}

type CoinResponse = {
  name: string;
  image: {
    small: string;
  };
  id: string;
  market_data: {
    current_price: {
      usd: number;
    };
  };
};

interface TradeDetails {
  TradeId: number;
  BetAmount: number;
  ContractType: string;
  Name: string;
  AssetPrice: string;
  ContractStatus: string;
  AssetId: string;
  ContractExpiry: string;
  CreatedTime: string;
  ClosingPrice: number;
  ClosingTime: number;
}

interface Trade {
  TradeId: number;
  BetAmount: number;
  ContractType: string;
  Name: string;
  AssetPrice: string;
  ContractStatus: string;
  AssetId: string;
  ContractExpiry: string;
  CreatedTime: string;
  ClosingPrice: number;
  ClosingTime: number;
}

// Define the CoinDetail component
const CoinDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const { response } = useAxios<CoinResponse>(`coins/${id}`);
  console.log(response);

  const permissions: PermissionType[] = [
    "ACCESS_ADDRESS",
    "SIGNATURE",
    "SIGN_TRANSACTION",
    "DISPATCH",
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "betAmountCall":
        setBetAmountCall(value);
        break;
      case "betAmountPut":
        setBetAmountPut(value);
        break;
      case "expiryDayCall":
        setExpiryDayCall(value);
        break;
      case "expiryDayPut":
        setExpiryDayPut(value);
        break;
      default:
        break;
    }
  };
  const AOC = "HmOxNfr7ZCmT7hhx1LTO7765b-NGoT6lhha_ffjaCn4";

  const [aocBalance, setAocBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [betAmountCall, setBetAmountCall] = useState("");
  const [betAmountPut, setBetAmountPut] = useState("");
  const [expiryDayCall, setExpiryDayCall] = useState("");
  const [expiryDayPut, setExpiryDayPut] = useState("");
  const [trades, setTrades] = useState<Trade[]>([]);

  const [claimSuccess, setSuccess] = useState(false);

  const claim = async () => {
    try {
      const getSwapMessage = await message({
        process: AOC,
        tags: [{ name: "Action", value: "RequestTokens" }],
        signer: createDataItemSigner(window.arweaveWallet),
      });
      try {
        let { Messages, Error } = await result({
          message: getSwapMessage,
          process: AOC,
        });
        if (Error) {
          alert("Error handling claim:" + Error);
          return;
        }
        if (!Messages || Messages.length === 0) {
          alert("No messages were returned from ao. Please try later.");
          return;
        }
        const actionTag = Messages[0].Tags.find(
          (tag: Tag) => tag.name === "Action"
        );
        if (actionTag.value === "Debit-Notice") {
          setSuccess(true);
        }
      } catch (error) {
        alert("There was an error when claiming AOC: " + error);
      }
    } catch (error) {
      alert("There was an error claiming: " + error);
    }
  };

  const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const tradeCall = async () => {
    try {
      const getPropMessage = await message({
        process: AOC,
        tags: [
          { name: "Action", value: "trade" },
          { name: "TradeId", value: String(randomInt(1, 1000000000)) },
          { name: "Name", value: String(response?.name!) },
          { name: "AssetId", value: String(response?.id!) },
          {
            name: "AssetPrice",
            value: String(response?.market_data.current_price.usd),
          },
          { name: "CreatedTime", value: String(Date.now()) },
          { name: "ContractType", value: "Call" },
          { name: "ContractStatus", value: "Open" },
          {
            name: "ContractExpiry",
            value: String(Date.now() + Number(expiryDayCall) * 60),
          },
          {
            name: "BetAmount",
            value: String(Number(betAmountCall) * 1000),
          },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });
      try {
        let { Messages, Error } = await result({
          message: getPropMessage,
          process: AOC,
        });
        if (Error) {
          alert("Error handling staking:" + Error);
          return;
        }
        if (!Messages || Messages.length === 0) {
          alert("No messages were returned from ao. Please try later.");
          return;
        }
        alert(Messages[0].Data);
        setBetAmountCall("");
        setExpiryDayCall("");
      } catch (error) {
        alert("There was an error when Buying: " + error);
      }
    } catch (error) {
      alert("There was an error staking: " + error);
    }
  };

  const randomIntPut = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const tradePut = async () => {
    try {
      const getPropMessage = await message({
        process: AOC,
        tags: [
          { name: "Action", value: "trade" },
          { name: "TradeId", value: String(randomIntPut(1, 1000000000)) },
          { name: "Name", value: String(response?.name!) },
          { name: "AssetId", value: String(response?.id!) },
          {
            name: "AssetPrice",
            value: String(response?.market_data.current_price.usd),
          },
          { name: "CreatedTime", value: String(Date.now()) },
          { name: "ContractType", value: "Put" },
          { name: "ContractStatus", value: "Open" },
          {
            name: "ContractExpiry",
            value: String(Date.now() + Number(expiryDayPut) * 60),
          },
          { name: "BetAmount", value: String(Number(betAmountPut) * 1000) },
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });
      try {
        let { Messages, Error } = await result({
          message: getPropMessage,
          process: AOC,
        });
        if (Error) {
          alert("Error handling staking:" + Error);
          return;
        }
        if (!Messages || Messages.length === 0) {
          alert("No messages were returned from ao. Please try later.");
          return;
        }
        alert(Messages[0].Data);
        setBetAmountPut("");
        setExpiryDayPut("");
      } catch (error) {
        alert("There was an error when Buying: " + error);
      }
    } catch (error) {
      alert("There was an error staking: " + error);
    }
  };

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const messageResponse = await message({
          process: AOC,
          tags: [{ name: "Action", value: "Trades" }],
          signer: createDataItemSigner(window.arweaveWallet),
        });
        const getProposalsMessage = messageResponse;
        try {
          let { Messages, Error } = await result({
            message: getProposalsMessage,
            process: AOC,
          });
          if (Error) {
            alert("Error fetching proposals:" + Error);
            return;
          }
          if (!Messages || Messages.length === 0) {
            alert("No messages were returned from ao. Please try later.");
            return;
          }
          const data = JSON.parse(Messages[0].Data);
          const proposalsData = Object.entries(data).map(([name, details]) => {
            const typedDetails: TradeDetails = details as TradeDetails;
            return {
              name,
              BetAmount: typedDetails.BetAmount / 1000,
              ContractType: typedDetails.ContractType,
              Name: typedDetails.Name,
              AssetPrice: typedDetails.AssetPrice,
              ContractStatus: typedDetails.ContractStatus,
              AssetId: typedDetails.AssetId,
              ContractExpiry: typedDetails.ContractExpiry,
              TradeId: typedDetails.TradeId,
              CreatedTime: typedDetails.CreatedTime,
              ClosingTime: typedDetails.ClosingTime,
              ClosingPrice: typedDetails.ClosingPrice,
            };
          });
          setTrades(proposalsData);
        } catch (error) {
          alert("There was an error when loading balances: " + error);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrades();
  }, []);

  useEffect(() => {
    const fetchBalance = async (process: string) => {
      try {
        const messageResponse = await message({
          process,
          tags: [{ name: "Action", value: "Balance" }],
          signer: createDataItemSigner(window.arweaveWallet),
        });
        const getBalanceMessage = messageResponse;
        try {
          let { Messages, Error } = await result({
            message: getBalanceMessage,
            process,
          });
          if (Error) {
            alert("Error fetching balances:" + Error);
            return;
          }
          if (!Messages || Messages.length === 0) {
            alert("No messages were returned from ao. Please try later.");
            return;
          }
          const balanceTag = Messages[0].Tags.find(
            (tag: Tag) => tag.name === "Balance"
          );
          const balance = balanceTag
            ? parseFloat((balanceTag.value / 1000).toFixed(4))
            : 0;
          if (process === AOC) {
            setAocBalance(balance);
          }
        } catch (error) {
          alert("There was an error when loading balances: " + error);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBalance(AOC);
  }, [address]);

  if (!response) {
    return (
      <div className="wrapper-container mt-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-72 w-full mb-10" />
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="flex gap-2 items-center">
        <img src={response.image.small} alt={response.name} />
        <h1 className="text-2xl mb-2 capitalize font-bold">{response.id}</h1>
      </div>
      <Container>
        <Menu pointing secondary>
          <MenuItem>
            <span> Staked Balance: {aocBalance}</span>
          </MenuItem>
          <MenuItem>
            <Form>
              <FormGroup>
                <FormInput type="number" size="mini" placeholder="Amount" />
                <FormButton secondary size="mini" content="Unstake." />
              </FormGroup>
            </Form>
          </MenuItem>
          <MenuMenu position="right">
            <MenuItem>
              <Form>
                <FormGroup>
                  <FormInput type="number" size="mini" placeholder="Amount" />
                  <FormButton size="mini" primary content="Stake." />
                </FormGroup>
              </Form>
            </MenuItem>
          </MenuMenu>
        </Menu>
        <Header as="h2" color="teal" textAlign="center">
          <Image src="/logox.png" alt="logo" /> Create a Trade.
        </Header>
        <Divider />
        <Grid columns="equal">
          <Divider />
          <Grid.Column>
            <Form size="large">
              <span> AOC Balance: {aocBalance}</span>
              <Segment stacked>
                <Image src={response.image.small} wrapped ui={false} />
                <span> Asset Name: {response.name}</span>
                <Divider />
                <span>Asset Id : {response.id}</span>
                <Divider />
                <span>
                  Asset Price : {response.market_data.current_price.usd}
                </span>
                <Divider />
                <Form.Input
                  type="number"
                  name="betAmountCall"
                  value={betAmountCall}
                  onChange={handleInputChange}
                  icon="money"
                  iconPosition="left"
                  placeholder="Amount of AOC."
                />
                <Form.Input
                  fluid
                  name="expiryDayCall"
                  icon="calendar alternate outline"
                  iconPosition="left"
                  placeholder="Expiry in Minutes"
                  type="number"
                  value={expiryDayCall}
                  onChange={handleInputChange}
                />
                <Divider />
                <span>Payoff: 60%</span>
                <Button onClick={tradeCall} color="teal" fluid size="small">
                  Call
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
          <Grid.Column>
            <Form size="large">
              <Button onClick={claim} size="mini" primary>
                Claim AOC
              </Button>
              <Segment stacked>
                <Image src={response.image.small} wrapped ui={false} />
                <span> Asset Name: {response.name}</span>
                <Divider />
                <span>Asset Id : {response.id}</span>
                <Divider />
                <span>
                  Asset Price : {response.market_data.current_price.usd}
                </span>
                <Divider />
                <Form.Input
                  type="number"
                  name="betAmountPut"
                  value={betAmountPut}
                  onChange={handleInputChange}
                  icon="money"
                  iconPosition="left"
                  placeholder="Amount of AOC."
                />
                <Form.Input
                  fluid
                  name="expiryDayPut"
                  icon="calendar alternate outline"
                  iconPosition="left"
                  placeholder="Expiry in Minutes"
                  type="number"
                  value={expiryDayPut}
                  onChange={handleInputChange}
                />
                <Divider />
                <span>Payoff: 60 %</span>
                <Button onClick={tradePut} color="red" fluid size="small">
                  Put
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
        <Header as="h2" color="teal" textAlign="center">
          <Image src="/logox.png" alt="logo" /> Trades.
        </Header>

        <div className="table border-collapse table-auto w-full text-sm">
          <div className="table-header-group">
            <div className="table-row">
              <div className="table-cell border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 blue:text-slate-200 text-left">
                Asset Name
              </div>

              <div className="table-cell border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 blue:text-slate-200 text-left">
                Asset Price.
              </div>
              <div className="table-cell border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 blue:text-slate-200 text-left">
                Contract type
              </div>
              <div className="table-cell border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 blue:text-slate-200 text-left">
                BetAmount
              </div>
              <div className="table-cell border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 blue:text-slate-200 text-left">
                CreatedTime
              </div>
              <div className="table-cell border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 blue:text-slate-200 text-left">
                ContractExpiry
              </div>
              <div className="table-cell border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 blue:text-slate-200 text-left">
                ContractStatus
              </div>
              <div className="table-cell border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 blue:text-slate-200 text-left">
                ClosingTime
              </div>
              <div className="table-cell border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 blue:text-slate-200 text-left">
                ClosingPrice
              </div>
            </div>
          </div>
          <div className="table-row-group bg-white dark:bg-slate-800">
            {trades.map((Trade, index) => (
              <div key={index} className="table-row">
                <div className="table-cell border-b border-slate-100 p-4 pl-8 text-slate-500 dark:text-slate-400">
                  {Trade.Name}
                </div>
                <div className="table-cell border-b border-slate-100 p-4 pl-8 text-slate-500 dark:text-slate-400">
                  {Trade.AssetPrice}
                </div>
                <div className="table-cell border-b border-slate-100 p-4 pl-8 text-slate-500 dark:text-slate-400">
                  {Trade.ContractType}
                </div>
                <div className="table-cell border-b border-slate-100 p-4 pl-8 text-slate-500 dark:text-slate-400">
                  {Trade.BetAmount}
                </div>
                <div className="table-cell border-b border-slate-100 p-4 pl-8 text-slate-500 dark:text-slate-400">
                  {Trade.CreatedTime}
                </div>
                <div className="table-cell border-b border-slate-100 p-4 pl-8 text-slate-500 dark:text-slate-400">
                  {Trade.ContractExpiry}
                </div>
                <div className="table-cell border-b border-slate-100 p-4 pl-8 text-slate-500 dark:text-slate-400">
                  {Trade.ContractStatus}
                </div>
                <div className="table-cell border-b border-slate-100 p-4 pl-8 text-slate-500 dark:text-slate-400">
                  {Trade.ClosingTime}
                </div>
                <div className="table-cell border-b border-slate-100 p-4 pl-8 text-slate-500 dark:text-slate-400">
                  {Trade.ClosingPrice}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider />
        <Menu>
          <MenuItem href="https://notus-memeframe.vercel.app/" header>
            Notus DAO.
          </MenuItem>

          <MenuItem>
            <Button
              href="https://x.com/NotusOptions"
              content="Twitter."
              icon="twitter"
              labelPosition="right"
            />
          </MenuItem>
          <MenuItem position="right">
            <Button
              href="https://github.com/kimtony123/notus-trading-app"
              content="Github."
              icon="github"
              labelPosition="left"
            />
          </MenuItem>
        </Menu>
      </Container>
    </div>
  );
};

export default CoinDetail;
