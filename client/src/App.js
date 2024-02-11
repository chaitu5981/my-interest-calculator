import { useEffect, useState } from "react";
import { formatDate } from "./utils";
import DisplayResults from "./DisplayResults";
const defaultLoanInputs = {
  principal: "",
  interestRate: "",
  principalDate: "",
};
const defaultRepayment = {
  amount: "",
  date: "",
};

function App() {
  const [loanInputs, setLoanInputs] = useState({ ...defaultLoanInputs });
  const [endDate, setEndDate] = useState("");
  const [repayments, setRepayments] = useState([]);
  const [repayment, setRepayment] = useState({ ...defaultRepayment });
  const [finalResults, setFinalResults] = useState([]);
  // const [count, setCount] = useState(0);
  // const [count1, setCount1] = useState(0);
  const [showDisplayResults, setShowDisplayResults] = useState(false);
  const [warning, setWarning] = useState("");
  const { principal, interestRate, principalDate } = loanInputs;
  const { amount, date } = repayment;
  let results = [];
  let finalAmount;
  let interestAmounts = [];

  // useEffect(() => {
  //   const results = JSON.parse(localStorage.getItem("results"));
  //   const repayments1 = JSON.parse(localStorage.getItem("repayments"));
  //   if (results && repayments1) {
  //     setFinalResults([...results]);
  //     setRepayments([...repayments1]);
  //     setShowDisplayResults(true);
  //   }
  // }, []);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setLoanInputs({ ...loanInputs, [name]: value });
  };

  const handleChange1 = ({ target }) => {
    const { name, value } = target;
    setRepayment({ ...repayment, [name]: value });
  };

  const handleChange2 = ({ target }) => {
    const { value } = target;
    setEndDate(value);
  };

  const addRepayment = () => {
    let newRepayments;
    if (
      !repayment.amount ||
      parseInt(repayment.amount) <= 0 ||
      isNaN(repayment.amount)
    ) {
      updateWarning("Please enter valid Repayment amount");
      return;
    }
    if (!repayment.date) {
      updateWarning("Please enter Repayment date");
      return;
    }
    if (repayment.amount && repayment.date) {
      let flag = false;
      const newRepaymentDate = new Date(repayment.date);
      newRepayments = [...repayments];
      if (!newRepayments.length) newRepayments = [repayment];
      else {
        for (let i = 0; i < repayments.length; i++)
          if (
            newRepaymentDate <= new Date(repayments[i].date) &&
            flag === false
          ) {
            newRepayments.splice(i, 0, repayment);
            flag = true;
          }
        if (flag === false) newRepayments.push(repayment);
      }
      setRepayments([...newRepayments]);
      setRepayment({ ...defaultRepayment });
    }
  };

  const getNextYearDate = (oldDate) => {
    const newDate = new Date(oldDate);
    return new Date(newDate.setFullYear(newDate.getFullYear() + 1));
  };

  const getInterestbetweenDates = (
    oldDate,
    newDate,
    currentPrincipal,
    repaid
  ) => {
    if (!oldDate || !newDate) return;
    const daysGap =
      (newDate.getTime() - oldDate.getTime()) / (1000 * 60 * 60 * 24);
    const ir = parseFloat(interestRate);
    const interest = (daysGap * ((currentPrincipal * ir) / 100)) / 360;
    return {
      interest: Math.round(interest),
      daysGap,
      date: newDate?.toISOString()?.slice(0, 10),
      repaid,
      balance: currentPrincipal - repaid,
    };
  };

  const reset = () => {
    localStorage.removeItem("repayments");
    localStorage.removeItem("results");
    setFinalResults([]);
    setRepayments([]);
    setLoanInputs({ ...defaultLoanInputs });
    setEndDate("");
    setRepayment({ ...defaultRepayment });
  };

  const addEndDate = () => {
    if (!loanInputs.principal || loanInputs.principal <= 0)
      return updateWarning("Please enter Loan Princpal");
    if (!loanInputs.principalDate)
      return updateWarning("Please enter Loan Princpal Date");
    if (!loanInputs.interestRate || loanInputs.interestRate <= 0)
      return updateWarning("Please enter Loan Interest rate");
    if (!endDate) return updateWarning("Please enter the end Date");
    const lastEntry = {
      amount: 0,
      date: endDate,
    };
    if (!repayments.length) return setRepayments([...repayments, lastEntry]);
    if (
      new Date(repayments[repayments.length - 1].date).getTime() ===
      new Date(endDate).getTime()
    )
      return;
    const newRepayments = repayments;
    if (newRepayments[newRepayments.length - 1].amount == 0)
      newRepayments.splice(repayments.length - 1, 1, lastEntry);
    else newRepayments.push(lastEntry);
    setRepayments([...newRepayments]);
  };

  useEffect(() => {
    calculate();
  }, [repayments]);

  const updateWarning = (message) => {
    setWarning(message);
    setTimeout(() => {
      setWarning("");
    }, 2000);
  };

  const calculate = () => {
    if (!repayments) return;
    let initialDate = new Date(principalDate);
    let currentDate = new Date(initialDate);
    let newPrincipal = parseInt(principal);
    let nextYearDate = getNextYearDate(initialDate);
    let currentPrincipal = newPrincipal;
    let totalInterest;
    let finalDate;
    for (let i = 0; i < repayments.length; i++) {
      const repayment = repayments[i];
      let interestAmount;
      let repaymentDate = new Date(repayment.date);
      let repaid = parseInt(repayment.amount);
      if (repaymentDate < nextYearDate) {
        interestAmount = getInterestbetweenDates(
          currentDate,
          repaymentDate,
          currentPrincipal,
          repaid
        );
        interestAmounts.push(interestAmount);
        currentPrincipal -= repaid;
        currentDate = repaymentDate;
      } else {
        if (repaymentDate > nextYearDate)
          interestAmount = getInterestbetweenDates(
            currentDate,
            nextYearDate,
            currentPrincipal,
            0
          );
        else {
          interestAmount = getInterestbetweenDates(
            currentDate,
            nextYearDate,
            currentPrincipal,
            repaid
          );
          currentPrincipal -= repaid;
        }
        interestAmounts.push(interestAmount);
        if (interestAmounts.length) {
          totalInterest = interestAmounts.reduce((sum, x) => {
            return sum + x.interest;
          }, 0);

          results = [
            ...results,
            {
              initialDate,
              finalDate: nextYearDate,
              principal: newPrincipal,
              totalInterest,
              amount: currentPrincipal + totalInterest,
              interests: [...interestAmounts],
            },
          ];
          newPrincipal = currentPrincipal + totalInterest;
        }
        if (repaymentDate > nextYearDate) i--;
        currentPrincipal = newPrincipal;
        initialDate = new Date(nextYearDate);
        currentDate = new Date(initialDate);
        nextYearDate = getNextYearDate(currentDate);
        interestAmounts = [];
      }
    }
    if (interestAmounts.length) {
      totalInterest = interestAmounts.reduce((sum, x) => {
        return sum + x.interest;
      }, 0);
      finalAmount = currentPrincipal + totalInterest;

      results = [
        ...results,
        {
          initialDate,
          finalDate: repayments[repayments.length - 1].date,
          principal: newPrincipal,
          totalInterest,
          amount: finalAmount,
          interests: [...interestAmounts],
        },
      ];
    }
    // if (results.length) {
    //   localStorage.setItem("results", JSON.stringify(results));
    //   localStorage.setItem("repayments", JSON.stringify(repayments));
    // }
    setFinalResults([...results]);
    setShowDisplayResults(true);
  };

  return (
    <div className="bg-orange-200 min-h-screen p-3 pt-[2rem]">
      <div className="w-[50%] mb-2">
        <h1 className="text-2xl my-3 mx-auto w-full text-center">
          Loan Interest calculator with random repayments
        </h1>
        <p className="ml-3 my-2">
          We generally repay loan in fixed emi amounts and in fixed intervals
          when taken from a bank. But this app calculates interest when we take
          loan from a friend or money lender and repay loan with random amounts
          and at random dates.
        </p>
        <div className="w-full flex  items-center px-3 ">
          <label
            htmlFor="principal"
            className="px-2 basis-1/2 border-[2px]  border-black h-[52px] border-r-0 border-b-0 flex items-center"
          >
            Loan Amount :
          </label>
          <div className="basis-1/2 px-2 border-[2px]  border-black border-b-0">
            <span>Rs.</span>
            <input
              type="text"
              id="principal"
              name="principal"
              value={principal}
              onChange={handleChange}
              className="p-1 border-[1px] border-black m-2 rounded"
            />
          </div>
        </div>
        <div className="w-full flex  items-center  px-3 ">
          <label
            htmlFor="principalDate"
            className="px-2 basis-1/2 border-[2px]  border-black border-r-0 border-b-0 
            h-[54px] flex items-center"
          >
            Date of Loan :
          </label>
          <div className="basis-1/2 px-8 border-[2px]  border-black border-b-0">
            <input
              type="date"
              id="principalDate"
              name="principalDate"
              value={principalDate}
              onChange={handleChange}
              className="p-1 border-[1px] border-black m-2 rounded"
            />
          </div>
        </div>
        <div className="w-full flex  items-center  px-3 ">
          <label
            htmlFor="interestRate"
            className="px-2 basis-1/2 border-[2px]  border-black h-[54px] border-r-0 
             flex items-center"
          >
            Interest Rate :
          </label>
          <div className="basis-1/2 px-8 border-[2px]  border-black ">
            <input
              type="text"
              id="interestRate"
              name="interestRate"
              value={interestRate}
              onChange={handleChange}
              placeholder="Interest per annum"
              className="p-1 border-[1px] border-black m-2 rounded"
            />
            %
          </div>
        </div>
      </div>
      <div className="px-4 mt-5">
        Enter Repayments(You can add any number of repayments) :
      </div>
      <div className="w-[50%]  mt-2">
        <div className="w-full flex  items-center px-3 ">
          <label
            htmlFor="amount"
            className="px-2 basis-1/2 border-[2px]  border-black h-[52px] border-r-0 border-b-0 
            flex items-center"
          >
            Repayment Amount :
          </label>
          <div className="basis-1/2 px-2 border-[2px]  border-black border-b-0">
            <span>Rs.</span>
            <input
              type="text"
              id="amount"
              name="amount"
              value={amount}
              onChange={handleChange1}
              className="p-1 border-[1px] border-black m-2 rounded"
            />
          </div>
        </div>

        <div className="w-full flex  items-center  px-3 ">
          <label
            htmlFor="date"
            className="px-2 basis-1/2 border-[2px]  border-black border-r-0 
            h-[56px] flex items-center"
          >
            Date of Repayment :
          </label>
          <div className="basis-1/2 px-8 border-[2px]  border-black ">
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={handleChange1}
              className="p-1 border-[1px] border-black m-2 rounded"
            />
            <button
              type="button"
              className="border-[1px] bg-gray-500 text-white m-2 px-2  py-1 rounded"
              onClick={addRepayment}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <div className="w-[50%] flex  items-center  px-3 mt-5">
        <label
          htmlFor="endDate"
          className="px-2 basis-1/2 border-[2px]  border-black h-[56px] border-r-0  flex 
            items-center"
        >
          Enter the date upto which u want to calculate interest:
        </label>
        <div className="basis-1/2 px-8 border-[2px]  border-black">
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={endDate}
            onChange={handleChange2}
            className="p-1 border-[1px] border-black my-2 rounded"
          />
          <button
            type="button"
            onClick={addEndDate}
            className="border-[1px] bg-gray-500 text-white ml-7 px-2 py-1 rounded"
          >
            Submit
          </button>
        </div>
      </div>
      <div className="w-[50%] flex justify-center">
        <button
          type="button"
          onClick={reset}
          className="border-[1px] bg-gray-500 text-white  my-2 px-2 py-1 rounded"
        >
          Reset
        </button>
      </div>
      {/* <DisplayRepayments
        repayments={repayments}
        visible={showDisplayRepayments}
      /> */}

      <DisplayResults visible={showDisplayResults} results={finalResults} />
      <ShowWarning warning={warning} />
    </div>
  );
}

const ShowWarning = ({ warning }) => {
  if (!warning) return;
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 top-10 bg-red-500 rounded
     text-white px-2 py-1"
    >
      {warning}
    </div>
  );
};

export default App;
