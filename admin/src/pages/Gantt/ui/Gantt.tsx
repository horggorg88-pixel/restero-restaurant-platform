import GanttTable from "@widgets/GanttTable";
import HeaderGantt from "@widgets/HeaderGantt";
import { useLayoutEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

export interface IHistory {
  created_at: string;
  administrator: string;
  histories: { created_at: string }[];
}

const Gantt = () => {
  const [searchRes, setSearchRes] = useState({});
  const [historyData, setHistoryData] = useState<IHistory | undefined>(
    undefined
  );

  useLayoutEffect(() => {
    const body = document.querySelector("body");

    if (body) {
      body.style.overflow = "hidden";
    }

    const html = document.querySelector("html");

    if (html) {
      html.style.overflow = "hidden";
    }

    return () => {
      if (body) {
        body.style.overflow = "";
      }
      if (html) {
        html.style.overflow = "";
      }
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Диаграмма бронирований</title>
      </Helmet>
      <div>
        <HeaderGantt
          setSearchRes={setSearchRes}
          setHistoryData={setHistoryData}
        />
        <GanttTable
          searchRes={searchRes}
          setHistoryData={setHistoryData}
          historyData={historyData}
        />
      </div>
    </>
  );
};

export default Gantt;
