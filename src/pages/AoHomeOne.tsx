import axios from "axios";
import React from "react";
import {
  Button,
  Container,
  Divider,
  Grid,
  Image,
  Segment,
  Sidebar,
  MenuMenu,
  MenuItem,
  GridColumn,
  Form,
  Menu,
  FormGroup,
  FormInput,
  FormButton,
  Input,
  Icon,
} from "semantic-ui-react";

import { useEffect, useState } from "react";
import { message, createDataItemSigner, result } from "@permaweb/aoconnect";
import { PermissionType } from "arconnect";

const AoHomeOne = () => {
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
      default:
        break;
    }
  };

  const AOC = "pdKYJSk3n2XuFSt6AX-A7n_DhMmTWxCH3W8dxGBPXjM";
  interface Tag {
    name: string;
    value: string;
  }
  interface WeatherDataProps {
    name: string;
    id: number;
    dt: number;

    main: {
      temp: number;
    };
    sys: {
      country: string;
    };
  }

  interface TradeDetails {
    TradeId: number;
    BetAmount: number;
    ContractType: string;
    Country: string;
    CurrentTemp: string;
    ContractStatus: string;
    CountryId: string;
    ContractExpiry: string;
    CreatedTime: string;
  }

  interface Trade {
    TradeId: number;
    BetAmount: number;
    ContractType: string;
    Country: string;
    CurrentTemp: string;
    ContractStatus: string;
    CountryId: string;
    ContractExpiry: string;
    CreatedTime: string;
  }

  const api_key = "a2f4db644e9107746535b0d2ca43b85d";
  const api_Endpoint = "https://api.openweathermap.org/data/2.5/";

  const [weatherData, setWeatherData] = React.useState<WeatherDataProps | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const [searchCity, setSearchCity] = React.useState("");
  const [betAmountCall, setBetAmountCall] = useState("");
  const [betAmountPut, setBetAmountPut] = useState("");
  const [trades, setTrades] = useState<Trade[]>([]);

  const fetchCurrentWeather = React.useCallback(
    async (lat: number, lon: number) => {
      const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
      const response = await axios.get(url);
      return response.data;
    },
    [api_Endpoint, api_key]
  );

  const fetchWeatherData = async (city: string) => {
    try {
      const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
      const searchResponse = await axios.get(url);

      const currentWeatherData: WeatherDataProps = searchResponse.data;
      return { currentWeatherData };
    } catch (error) {
      throw error;
    }
  };
  const handleSearch = async () => {
    if (searchCity.trim() === "") {
      return;
    }

    try {
      const { currentWeatherData } = await fetchWeatherData(searchCity);
      setWeatherData(currentWeatherData);
    } catch (error) {}
  };

  React.useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const [currentWeather] = await Promise.all([
          fetchCurrentWeather(latitude, longitude),
        ]);
        setWeatherData(currentWeather);
        setIsLoading(true);
      });
    };

    fetchData();
  }, [fetchCurrentWeather]);

  const oneDayInSeconds = 86400;
  const contractExpiryValue =
    weatherData?.dt !== undefined
      ? String(oneDayInSeconds + weatherData.dt)
      : "undefined";

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
          { name: "Country", value: String(weatherData?.sys.country!) },
          { name: "CountryId", value: String(weatherData?.id!) },
          { name: "CurrentTemp", value: String(weatherData?.main.temp) },
          { name: "CreatedTime", value: String(weatherData?.dt) },
          { name: "ContractType", value: "Call" },
          { name: "ContractStatus", value: "Open" },
          { name: "ContractExpiry", value: contractExpiryValue },
          { name: "BetAmount", value: String(Number(betAmountCall) * 1000) },
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
      } catch (error) {
        alert("There was an error when Buying: " + error);
      }
    } catch (error) {
      alert("There was an error staking: " + error);
    }
  };

  const tradePut = async () => {
    try {
      const getPropMessage = await message({
        process: AOC,
        tags: [
          { name: "Action", value: "trade" },
          { name: "TradeId", value: String(randomInt(1, 1000000000)) },
          { name: "Country", value: String(weatherData?.sys.country!) },
          { name: "CountryId", value: String(weatherData?.id!) },
          { name: "CurrentTemp", value: String(weatherData?.main.temp) },
          { name: "CreatedTime", value: String(weatherData?.dt) },
          { name: "ContractType", value: "Put" },
          { name: "ContractStatus", value: "Open" },
          { name: "ContractExpiry", value: contractExpiryValue },
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
              Country: typedDetails.Country,
              CurrentTemp: typedDetails.CurrentTemp,
              ContractStatus: typedDetails.ContractStatus,
              CountryId: typedDetails.CountryId,
              ContractExpiry: typedDetails.ContractExpiry,
              TradeId: typedDetails.TradeId,
              CreatedTime: typedDetails.CreatedTime,
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

  const [address, setAddress] = useState("");
  const [aocBalance, setAocBalance] = useState(0);

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

  return (
    <Container>
      <Divider />
      <Menu pointing secondary>
        <MenuItem>
          <Form>
            <FormGroup>
              <FormInput size="mini" placeholder="Amount" />
              <FormButton secondary size="mini" content="Unstake." />
            </FormGroup>
          </Form>
        </MenuItem>
        <MenuMenu position="right">
          <MenuItem>
            <Form>
              <FormGroup>
                <FormInput size="mini" placeholder="Amount" />
                <FormButton size="mini" primary content="Stake." />
              </FormGroup>
            </Form>
          </MenuItem>
          <MenuItem>
            <Button onClick={claim} size="mini" primary>
              Claim AOC
            </Button>
          </MenuItem>
        </MenuMenu>
      </Menu>
      <Divider />
      <Menu pointing>
        <MenuItem>
          Staked Balance: <span className="font-bold">{aocBalance}</span>
        </MenuItem>
        <MenuItem>
          AOC Balance: <span className="font-bold">{aocBalance}</span>
        </MenuItem>
        <MenuMenu position="right">
          <MenuItem>
            <Input
              placeholder="Enter Location"
              value={searchCity}
              type="text"
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <Button primary size="mini" onClick={handleSearch}>
              search
            </Button>
          </MenuItem>
        </MenuMenu>
      </Menu>
      {weatherData && isLoading ? (
        <>
          <Grid columns="equal">
            <GridColumn>
              <Form size="large">
                <Segment stacked>
                  <Image src="sunset.png" wrapped ui={false} />
                  <Divider />
                  <span>Country : {weatherData.sys.country}</span>
                  <Divider />
                  <span>CountryId : {weatherData.id}</span>
                  <Divider />
                  <span>City : {weatherData.name}</span>
                  <Divider />

                  <span> Current Temp : {weatherData.main.temp}</span>
                  <Divider />
                  <span>Current Time : {weatherData.dt}</span>
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
                  <Divider />
                  <Button
                    onClick={tradeCall}
                    color="teal"
                    position="left"
                    fluid
                    size="small"
                  >
                    Call.
                  </Button>
                </Segment>
              </Form>
            </GridColumn>
            <GridColumn>
              <Form size="large">
                <Segment stacked>
                  <Image src="sunset.png" wrapped ui={false} />
                  <Divider />
                  <span>Country : {weatherData.sys.country}</span>
                  <Divider />
                  <span>CountryId : {weatherData.id}</span>
                  <Divider />
                  <span>City : {weatherData.name}</span>
                  <Divider />

                  <span> Current Temp : {weatherData.main.temp}</span>
                  <Divider />
                  <span>Current Time : {weatherData.dt}</span>
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
                  <Divider />
                  <Button
                    onClick={tradePut}
                    fluid
                    size="small"
                    color="red"
                    position="right"
                  >
                    Put.
                  </Button>
                </Segment>
              </Form>
            </GridColumn>
          </Grid>
        </>
      ) : (
        <div className="loading">
          <h3>Fetching data</h3>
        </div>
      )}
      <div className="relative rounded-xl overflow-auto">
        <div className="shadow-sm overflow-hidden my-8">
          <div className="table border-collapse table-auto w-full text-sm">
            <div className="table-header-group">
              <div className="table-row">
                <div className="table-cell border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 blue:text-slate-200 text-left">
                  Country
                </div>
                <div className="table-cell border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 blue:text-slate-200 text-left">
                  CountryId
                </div>
                <div className="table-cell border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 blue:text-slate-200 text-left">
                  Current Temperature
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
              </div>
            </div>
            <div className="table-row-group bg-white dark:bg-slate-800">
              {trades.map((Trade, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell border-b border-slate-100 p-4 pl-8 text-slate-500 dark:text-slate-400">
                    {Trade.Country}
                  </div>
                  <div className="table-cell border-b border-slate-100 p-4 pl-8 text-slate-500 dark:text-slate-400">
                    {Trade.CountryId}
                  </div>
                  <div className="table-cell border-b border-slate-100 p-4 pl-8 text-slate-500 dark:text-slate-400">
                    {Trade.CurrentTemp}
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
                </div>
              ))}
            </div>
          </div>
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
  );
};

export default AoHomeOne;
