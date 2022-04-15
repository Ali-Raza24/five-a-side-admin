import { FormControl } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import GridItem from "../../components/Grid/GridItem.jsx";
import React from "react";
import { TextValidator } from "react-material-ui-form-validator";

import SelectValidator from "./SelectValidator";

const PriceItem = (props) => {
  const {
    price,
    index,
    classes,
    workingHoursArray,
    handleHoursChange,
    setPrice,
    lastElement,
  } = props;
  return (
    <GridContainer style={{ paddingBottom: 20 }}>
      <GridItem xs={12} sm={12} md={4}>
        <FormControl fullWidth={true} style={{ position: "relative" }}>
          <SelectValidator
            disabled
            className={"my-input"}
            name="workFrom"
            label="From"
            validators={["required"]}
            errorMessages={["This field is required"]}
            value={price.from}
            onChange={this.handleInputChange}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
          >
            <MenuItem value={price.from} key={price.from}>{`${
              price.from
            }:00`}</MenuItem>
          </SelectValidator>
        </FormControl>
      </GridItem>
      <GridItem xs={12} sm={12} md={4}>
        <FormControl fullWidth={true} style={{ position: "relative" }}>
          <SelectValidator
            disabled={!lastElement}
            className={"my-input"}
            name="venue"
            label="To"
            validators={["required"]}
            errorMessages={["This field is required"]}
            value={price.to}
            onChange={(e) => {
              handleHoursChange(e, index);
            }}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
          >
            {workingHoursArray.map((hour) => {
              if (price.from < hour) {
                return (
                  <MenuItem value={hour} key={hour}>{`${hour}:00`}</MenuItem>
                );
              }
              return false;
            })}
          </SelectValidator>
        </FormControl>
      </GridItem>
      <GridItem xs={12} sm={12} md={4}>
        <TextValidator
          className="my-input"
          style={{ width: "100%" }}
          label="Price (credits)"
          onChange={(e) => setPrice(e, index)}
          name="price"
          type="number"
          value={price.price}
          validators={["required"]}
          errorMessages={["This field is required"]}
        />
      </GridItem>
    </GridContainer>
  );
};

export default PriceItem;
