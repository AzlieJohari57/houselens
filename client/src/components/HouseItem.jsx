import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const HouseItem = ({ item, loading }) => {
  return (
    <>
      <div
        className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="col-md-8 p-4 d-flex flex-column position-static">
          <strong className="d-inline-block mb-2 text-success">
            New Project
          </strong>
          <h4 className="mb-0">
            <b>{item.House_Name}</b>
          </h4>
          <hr />
          <Row>
            <Col md={12}>
              <div className="text-muted">
                <h6>{item.House_Address}</h6>
              </div>
            </Col>

            <Col md={12}>
              <div>
                <h6>
                  <b>RM {item.House_Price}</b>
                </h6>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className="d-flex flex-row text-muted">
                <div className="d-flex align-items-center text-muted me-3">
                  <img
                    src="./sqft_dark_icon.svg"
                    alt="Cost Icon"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "5px",
                    }}
                  />
                  {item.House_Sqft} Sqft
                </div>
                <div className="d-flex align-items-center text-muted me-3">
                  <img
                    src="./room_dark_icon.svg"
                    alt="Room Icon"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "5px",
                    }}
                  />
                  {item.House_Rooms} Rooms
                </div>
                <div className="d-flex align-items-center text-muted">
                  <img
                    src="./bathroom_dark_icon.svg"
                    alt="Bathroom Icon"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "5px",
                    }}
                  />
                  {item.House_Bathrooms} Bathrooms
                </div>
              </div>
            </Col>
            <div className="mt-3">
              <div >
                <a
                  href={item.House_Link}
                  className="btn btn-primary"
                  role="button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Details
                </a>
              </div>
            </div>
          </Row>
        </div>

        <div className="col-md-4 d-none d-lg-block">
          <img
            src={item.House_Picture}
            alt="Thumbnail"
            className="img-fluid"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default HouseItem;
