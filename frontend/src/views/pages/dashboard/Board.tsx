import React from "react";
import "./dashboard.css";

const testData = [
    { title: "TITLE_1", description: "DESCRIPTION_1" },
    { title: "TITLE_2", description: "DESCRIPTION_2" },
    { title: "TITLE_3", description: "DESCRIPTION_3" },
    { title: "TITLE_4", description: "DESCRIPTION_4" },
    { title: "TITLE_5", description: "DESCRIPTION_5" }
]

const Board = ({ title, flexDirection } : { title: string, flexDirection: string }) => {
    return <div className="board">
        <div className="board_title">{title}</div>
        <br />
        <div className={flexDirection === "column" ? "board_cards_column" : "board_cards_row"}>
            {testData.map((data, i) => {
                return <div className="board_card" key={i}>
                            <div>{data.title}</div>
                            <div>{data.description}</div>
                        </div>
            })}
        </div>
    </div>
}

export default Board;