import React from "react";
import { formatDate } from "./utils";
const DisplayResults = ({ visible, results }) => {
  if (!visible || !results.length) return;
  return (
    <div className="flex flex-col w-[70%] p-2 m-2 mb-[20rem]">
      <div className="flex border-[2px] border-gray-600 w-full ">
        <div className="p-2 border-gray-600  border-r-[2px] basis-[15%]">
          Principal
        </div>
        <div className="p-2 border-gray-600  border-r-[2px] basis-[15%]">
          Initial Date
        </div>
        <div className="border-r-[2px] border-gray-600 p-2 basis-[15%]">
          Repayment
        </div>
        <div className="border-r-[2px] border-gray-600 p-2 basis-[15.0%]">
          Balance
        </div>
        <div className="border-r-[2px] border-gray-600 p-2 basis-[17.5%]">
          Date of Repayment
        </div>
        <div className="border-r-[2px] border-gray-600 p-2 basis-[11.25%]">
          Days Gap
        </div>
        <div className="p-2 basis-[11.25%]">Interest</div>
      </div>
      {results.map((result, index) => (
        <>
          {/* <p className="w-full text-center">
            {`Interest Period : ${formatDate(
              new Date(result.initialDate)
            )} -  ${formatDate(new Date(result.finalDate))}`}
          </p> */}
          <div className="flex w-full border-l-[2px] border-[2px]  border-gray-600 mb-5">
            <div className="flex flex-col w-full">
              <div className="flex w-full border-gray-600 border-b-[2px]">
                <div className="basis-[15%] border-r-[2px] border-gray-600 p-2">
                  {result.principal}
                </div>
                <div className="basis-[15%] border-r-[2px] border-gray-600 p-2">
                  {formatDate(new Date(result.initialDate))}
                </div>
              </div>
              {result.interests.map((i) => (
                <div className="flex  border-gray-600 w-full ">
                  <div className="basis-[15%]"></div>
                  <div className="basis-[15%] border-r-[2px] border-gray-600"></div>
                  <div className="border-r-[2px] border-gray-600 p-2 basis-[15%]">
                    {i.repaid === 0 ? "-----" : i.repaid}
                  </div>
                  <div className="border-r-[2px] border-gray-600 p-2 basis-[15%]">
                    {i.balance}
                  </div>
                  <div className="border-r-[2px] border-gray-600 p-2 basis-[17.5%]">
                    {formatDate(new Date(i.date))}
                  </div>

                  <div className="border-r-[2px] border-gray-600 p-2 basis-[11.25%]">
                    {i.daysGap}
                  </div>
                  <div className="p-2 basis-[11.25%]">{i.interest}</div>
                </div>
              ))}
              <div className="flex  border-gray-600 w-full border-t-[2px] ">
                <div className="border-r-[2px] border-gray-600 p-2 basis-[77.5%]"></div>
                <p className="border-r-[2px] border-gray-600 p-2 basis-[11.25%] ">
                  Total
                </p>
                <div className="p-2 basis-[11.25%]">{result.totalInterest}</div>
              </div>
              <div className="flex  border-gray-600 w-full border-t-[2px]">
                <div className="basis-[30%]"></div>
                <div className="basis-[15%] p-2 border-r-[2px] border-gray-600">
                  {index === results.length - 1
                    ? "Final Amount"
                    : "New Principal"}
                </div>
                <div className="border-r-[2px] border-gray-600 p-2 basis-[15%]">
                  {result.amount}
                </div>
              </div>
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default DisplayResults;
