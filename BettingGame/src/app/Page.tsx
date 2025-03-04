import { useState, useEffect } from "react";

export default function Home() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [roll, setRoll] = useState<number | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedBalance = localStorage.getItem("balance");
    if (savedBalance) setBalance(parseInt(savedBalance));
  }, []);

  const rollDice = async () => {
    if (bet <= 0 || bet > balance) {
      setMessage("Invalid bet amount!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/roll-dice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bet }),
      });

      const data = await res.json();
      setRoll(data.roll);

      let newBalance = balance - bet;
      if (data.roll >= 4) newBalance += bet * 2; 

      setBalance(newBalance);
      localStorage.setItem("balance", newBalance.toString());

      setMessage(
        data.roll >= 4
          ? `🎉 You rolled ${data.roll}! You won $${bet * 2}!`
          : `😢 You rolled ${data.roll}. You lost $${bet}.`
      );
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error rolling dice!");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-6xl font-bold mb-4">🎲 Provably Fair Dice Game 🎲</h1>
      <p className="text-3xl mb-2 pt-8">Current Player Balance: ${balance}</p>
    
      <div className='ml-0'>
        <label htmlFor="bet" className="text-3xl px-2 pt-4">
          Bet Amount: 
        </label>
        <input
        type="number"
        value={bet}
        onChange={(e) => setBet(parseInt(e.target.value))}
        className="text-black p-2 pt-2 rounded-md w-32 text-center bg-white text-black"
        min="1"
        max={balance}
      />
      </div>
      
      <button
        onClick={rollDice}
        disabled={loading}
        className="bg-blue-500 text-2xl text-white p-2 mt-8 rounded-md hover:bg-blue-700"
      >
        {loading ? "Rolling..." : "Roll Dice"}
      </button>

      {roll !== null && (
        <div className="mt-4">
          <p className="text-4xl">
            🎲 Rolled: {roll}
            {roll && Array.from({ length: roll }, (_, i) => (
              <span key={i}>🎲</span>
            ))}
          </p>
          <p className="mt-2 text-2xl">{message}</p>
        
        </div>
      )}
    </div>
  );
}
