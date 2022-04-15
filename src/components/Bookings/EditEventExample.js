{/*    <Card>*/}
{/*        <CardHeader color="primary">*/}
{/*            <h4>Edit booking details</h4>*/}
{/*            <EditEvent/>*/}
{/*        </CardHeader>*/}
{/*        <CardBody>*/}
{/*            <GridContainer>*/}
{/*                <GridItem xs={4} sm={4} md={6}>*/}
{/*                    <InputLabel style={{color: "#AAAAAA"}}>&nbsp;</InputLabel>*/}
{/*                    <MuiPickersUtilsProvider utils={DateFnsUtils}>*/}
{/*                        <DatePicker*/}
{/*                            // value={this.state.editableEvent.start}*/}
{/*                            // onChange={(e) => {e.stopPropagation(); this.handleDateSelect()}}*/}
{/*                            placeholder={"Select date"}*/}
{/*                            minDate={moment(new Date()).add(1, 'days')}*/}
{/*                        />*/}
{/*                    </MuiPickersUtilsProvider>*/}
{/*                </GridItem>*/}
{/*            </GridContainer>*/}
{/*            <GridContainer style={{paddingTop: '15px'}}>*/}
{/*                <GridItem xs={4} sm={4} md={6}>*/}
{/*                    <FormControl className={this.props.classes.formControl}>*/}
{/*                        <InputLabel style={{color: "#AAAAAA"}}>From</InputLabel>*/}
{/*                        <Select*/}
{/*                            value={this.state.from}*/}
{/*                            onChange={this.handleDropdownSelect}*/}
{/*                            inputProps={{*/}
{/*                                name: 'from',*/}
{/*                            }}*/}
{/*                        >*/}
{/*                            {this.state.workingHoursArray.map((hour, index) => {*/}

{/*                                if (this.state.workingHoursArray.length - 1 === index) {*/}
{/*                                    return;*/}
{/*                                }*/}
{/*                                return (*/}
{/*                                    <MenuItem key={index} value={hour}>{`${hour}:00`}</MenuItem>*/}
{/*                                )*/}

{/*                            })}*/}
{/*                        </Select>*/}
{/*                    </FormControl>*/}
{/*                </GridItem>*/}
{/*                <GridItem xs={4} sm={4} md={6}>*/}
{/*                    <FormControl className={classes.formControl}>*/}
{/*                        <InputLabel style={{color: "#AAAAAA"}}>To</InputLabel>*/}
{/*                        <Select*/}
{/*                            value={this.state.to}*/}
{/*                            onChange={this.handleDropdownSelect}*/}
{/*                            inputProps={{*/}
{/*                                name: 'to',*/}
{/*                                disabled: !this.state.from*/}
{/*                            }}*/}
{/*                        >*/}
{/*                            {formatTo.map((hour, index) => {*/}
{/*                                return (*/}
{/*                                    <MenuItem key={index} value={hour}>{`${hour}:00`}</MenuItem>*/}
{/*                                )*/}
{/*                            })}*/}
{/*                        </Select>*/}
{/*                    </FormControl>*/}
{/*                </GridItem>*/}
{/*            </GridContainer>*/}
{/*            <GridContainer style={{paddingTop: '15px'}}>*/}
{/*                <GridItem md={12}>*/}
{/*                    <TextField*/}
{/*                        fullWidth*/}
{/*                        margin="normal"*/}
{/*                        name='description'*/}
{/*                        label="Description"*/}
{/*                        variant="outlined"*/}
{/*                        placeholder="Description..."*/}
{/*                        multiline*/}
{/*                        rows="4"*/}
{/*                        InputLabelProps={{*/}
{/*                            shrink: true,*/}
{/*                        }}*/}
{/*                        value={this.state.editableEvent.note}*/}
{/*                        onChange={this.handleSelect}*/}
{/*                    >*/}
{/*                    </TextField>*/}
{/*                </GridItem>*/}
{/*            </GridContainer>*/}

{/*            {this.state.manualBookingSuccess &&*/}
{/*            <p style={{color: '#3592c8'}}>{this.state.manualBookingSuccess}</p>*/}
{/*            }*/}

{/*            {this.state.manualBookingError &&*/}
{/*            <p style={{color: 'red'}}>{this.state.manualBookingError}</p>*/}
{/*            }*/}

{/*            <Button color="primary"*/}
{/*                    // onClick={this.updateBooking}*/}
{/*            >*/}
{/*                Update Booking details*/}
{/*            </Button>*/}
{/*        </CardBody>*/}
{/*</Card>*/}