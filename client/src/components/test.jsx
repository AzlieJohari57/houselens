import React from "react";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";

const Test = () => {
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.get(
        "http://localhost:8800/fetch-data-from-python"
      );

      if (response) {
        console.log(response);
      }
    } catch (err) {
      // Handle errors if needed
    }
  };

  const handleSubmitsendData = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const { roomNum, area } = event.target.elements; // Access form elements

    try {
        const response = await axios.post(
            "http://localhost:8800/send-and-process-data",
            {
                roomNum: roomNum.value, // Access the value property
                area: area.value,       // Access the value property
            }
        );

        if (response.data.success) {
            console.log(response.data);
        }
    } catch (err) {
        // Handle errors if needed
    }
};

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <h3>Request Data from python API</h3>
            <form onSubmit={handleSubmit} className="signin-form mb-4">
              <div className="form-group">
                <button
                  type="submit"
                  className="form-control btn btn-primary rounded submit px-3 mt-4"
                >
                  Request Data
                </button>
              </div>
            </form>

            <h3>Send Data from python API</h3>
            <form onSubmit={handleSubmitsendData} className="signin-form mb-4">
              <div className="form-group">

                <input
                  type="text"
                  name="roomNum"
                  placeholder="Room Number"
                  className="form-control"
                />

                <input
                  type="text"
                  name="area"
                  placeholder="House Area"
                  className="form-control mt-3"
                />

                <button
                  type="submit"
                  className="form-control btn btn-success rounded submit px-3 mt-4"
                >
                  Send Data
                </button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Test;
