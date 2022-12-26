import { Modal } from "@mui/material";
import React from "react";
const remote = window.require("@electron/remote") || null;

const About = ({ open, close }) => {
  return (
    <>
      <Modal open={open} onClose={() => close(false)} className="flex-reset">
        <div className="details-box">
          <h3 className="name">About</h3>
          <p className="descriptor">Made by:</p>
          <p className="raga-details content">Neerava Nagaraj</p>
          <p className="descriptor">Email:</p>
          <p className="raga-details content">neerava.nraj@gmail.com</p>
          {remote && (
            <div>
              <p className="descriptor">Swara version:</p>
              <p className="raga-details content">{remote.app.getVersion()}</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default About;
