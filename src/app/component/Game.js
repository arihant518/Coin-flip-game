"use client";
import React, { useState } from "react";
import Web3 from "web3";

const Game = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [status, setStatus] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [animationClass, setAnimationClass] = useState("");
  const [userBet, setUserBet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [overallAmount, setOverallAmount] = useState(0);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      console.log("Ethereum provider found:", window.ethereum);
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setWalletAddress(accounts[0]);
        setStatus("Wallet connected successfully!");
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        setStatus("Failed to connect wallet. Please try again.");
      }
    } else {
      setStatus(
        "MetaMask is not installed. Please install it to use this feature."
      );
    }
  };

  const handleBet = (bet) => {
    if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
      setStatus("Please enter a valid bet amount.");
      return;
    }
    setUserBet(bet);
    setStatus(
      `You bet ${betAmount} ETH on ${bet.toUpperCase()}. Click "Flip the Coin" to see the result.`
    );
  };

  const flipCoin = () => {
    if (userBet === null) {
      setStatus("Please place a bet!");
      return;
    }

    setAnimationClass("");
    setTimeout(() => {
      const random = Math.random();
      const outcome = random < 0.5 ? "heads" : "tails";
      setAnimationClass(`animate-${outcome}`);
      setTimeout(() => {
        const outcomeText = outcome.toUpperCase();
        let transactionResult;
        let transactionAmount = parseFloat(betAmount);

        if (outcome === userBet) {
          transactionResult = "Win";
          transactionAmount *= 2;
          setOverallAmount((prev) => prev + transactionAmount);
          setStatus(`You win! You have earned ${transactionAmount} ETH.`);
        } else {
          transactionResult = "Lose";
          transactionAmount *= -1;
          setOverallAmount((prev) => prev + transactionAmount);
          setStatus(`You lose! You have lost ${betAmount} ETH.`);
        }

        // Record the transaction
        setTransactions((prevTransactions) => [
          ...prevTransactions,
          {
            bet: `${betAmount} ETH on ${userBet.toUpperCase()}`,
            outcome: outcomeText,
            result: transactionResult,
            amount: transactionAmount,
            timestamp: new Date().toLocaleString(),
          },
        ]);
      }, 2900);
    }, 100);
  };

  return (
    <div className="container">
    {!walletAddress ? (
      <>
        <button className="btn connect-wallet" onClick={connectWallet}>
          Connect Wallet
        </button>
        {status && (
          <div className="status-message">
            <p>{status}</p>
            {status ===
              "MetaMask is not installed. Please install it to use this feature." && (
              <a
                href="https://metamask.io/download.html"
                target="_blank"
                rel="noopener noreferrer"
                className="btn install-metamask"
              >
                Install MetaMask
              </a>
            )}
          </div>
        )}
      </>
    ) : (
      <div className="game-container">
        <div className="game-elements">
          <p className="wallet-address">Connected Wallet: {walletAddress}</p>
          <input
            type="text"
            placeholder="Enter bet amount in ETH"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="bet-input"
          />
          <div id="coin" className={`coin ${animationClass}`}>
            <div id="heads" className="heads"></div>
            <div id="tails" className="tails"></div>
          </div>
          <div className="bet-buttons">
            <button className="btn bet-btn" onClick={() => handleBet("heads")}>
              Bet on Heads
            </button>
            <button className="btn bet-btn" onClick={() => handleBet("tails")}>
              Bet on Tails
            </button>
          </div>
          <button id="flip" className="btn flip-btn" onClick={flipCoin}>
            Flip the Coin
          </button>
          <p className="status-message">
            <span id="status">{status}</span>
          </p>
        </div>

        {/* <------------ transaction ui html -------------> */}
  
        <div className="transaction-history">
          <h2 className="transaction-header">Transaction History</h2>
          <ul className="transaction-list">
            {transactions.map((tx, index) => (
              <li key={index} className="transaction-item">
                <strong>{tx.timestamp}:</strong> Bet {tx.bet} | Outcome:{" "}
                {tx.outcome} | Result: {tx.result} | Amount: {tx.amount} ETH
              </li>
            ))}
          </ul>
          <h3 className="overall-amount">
            Overall Amount: {overallAmount} ETH
          </h3>
        </div>
      </div>
    )}
  </div>
  
  );
};

export default Game;
