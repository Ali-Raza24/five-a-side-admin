import React, { Component } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import GridItem from "../../components/Grid/GridItem.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "../../components/CustomButtons/Button.jsx";
import InputLabel from "@material-ui/core/InputLabel";
import TextError from "./TextError";
import config from "../../config";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

class ImageCropper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      cropResult: null,
    };
    this.cropImage = this.cropImage.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    console.log(files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result, cropResult: null });
    };
    if (files[0]) {
      reader.readAsDataURL(files[0]);
    }
  }

  cropImage() {
    if (typeof this.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    let cropResult = this.cropper.getCroppedCanvas().toDataURL();
    this.setState(
      {
        cropResult: cropResult,
      },
      this.props.setImageInParentState(cropResult)
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <GridItem xs={12} sm={12} md={6}>
          <InputLabel style={{ color: "#AAAAAA" }}>Image</InputLabel>
          <div style={{ width: "100%" }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              className={classes.input}
              id="raised-button-file"
              onChange={this.onChange}
              type="file"
            />
            {this.props.edit &&
              this.props.image &&
              !this.state.src && (
                <img
                  src={`${config.IMAGE_URL}venues/${this.props.venueId}/${
                    this.props.image
                  }`}
                  style={{ maxWidth: "100%" }}
                  alt=""
                />
              )}
            <label htmlFor="raised-button-file" style={{ display: "block" }}>
              <Button
                component="span"
                color="primary"
                className={classes.button}
              >
                Upload
              </Button>
            </label>
            {this.state.src &&
              !this.state.cropResult && (
                <React.Fragment>
                  <InputLabel style={{ color: "#AAAAAA" }}>
                    Please crop your image
                  </InputLabel>
                  <Cropper
                    style={{ height: 200, width: "100%" }}
                    aspectRatio={16 / 9}
                    preview=".img-preview"
                    guides={false}
                    src={this.state.src}
                    ref={(cropper) => {
                      this.cropper = cropper;
                    }}
                    zoomOnWheel={false}
                  />
                  <Button onClick={this.cropImage} color="primary">
                    Crop Image
                  </Button>
                </React.Fragment>
              )}
            {this.state.cropResult && (
              <div style={{ width: 300, height: "auto" }}>
                <img
                  style={{ width: "100%" }}
                  src={this.state.cropResult}
                  alt="cropped"
                />
              </div>
            )}
          </div>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          {this.state.src &&
            !this.state.cropResult && (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="box" style={{ width: "100%" }}>
                  <InputLabel style={{ color: "#AAAAAA" }}>Preview:</InputLabel>
                  <div
                    className="img-preview"
                    style={{ width: "100%", height: 300, overflow: "hidden" }}
                  />
                </div>
              </div>
            )}
        </GridItem>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ImageCropper);
