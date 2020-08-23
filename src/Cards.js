import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import "./Cards.css";
import { Typography } from "@material-ui/core";

function Cards({ active, title, cases, isRed, totalCases, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`card ${
        isRed ? active && "card--selectedRed" : active && "card--selectedGreen"
      }`}
      variant0="outlined"
    >
      <CardContent className="card__content">
        {/* Title */}
        <Typography className="card__title" color="textSecondary">
          {title}
        </Typography>
        {/* Number of cases today */}
        <h2 className={`card__cases ${isRed ? "cases--Red" : "cases--Green"}`}>
          {cases}
        </h2>
        {/* Number of total cases */}
        <Typography className="card__totalCases" color="textSecondary">
          {totalCases} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Cards;
