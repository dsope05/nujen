import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import ReCAPTCHA from "react-google-recaptcha";
import { style } from "@mui/system";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectCaptchaState, setCaptchaState } from "../../store/captchaSlice";
import {
  selectFormDataState,
  setFormDataState,
} from "../../store/formDataSlice";
import styles from "../../styles/sign-up.module.css";

const steps = ["About You (The Author)", "About the Newsletter", "For Nujen"];

const textInputSxLong = {
  backgroundColor: "white",
  marginBottom: "10px",
  width: "70%",
  minWidth: "300px",
};

const textInputSx = {
  backgroundColor: "white",
  marginBottom: "10px",
  width: "30%",
  minWidth: "300px",
};

const multiLineTextInputSx = {
  backgroundColor: "white",
  marginBottom: "10px",
  width: "70%",
  minWidth: "300px",
};

export default function HorizontalLinearStepper() {
  // const [formData, updateFormData] = React.useState({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [showCaptcha, updateShowCaptcha] = React.useState(false);
  const [showModal, updateShowModal] = React.useState(false);
  const [captchaPass, updateCaptchaPass] = React.useState(false);
  const router = useRouter();
  const captchaState = useSelector(selectCaptchaState);
  const formDataState = useSelector(selectFormDataState);
  console.log("formdata", formDataState);
  const dispatch = useDispatch();
  if (process.env.ENV === "dev") {
    //dispatch();
    //dispatch(setFormDataState(newFormData))
  }
  const isStepOptional = (step) => {
    //return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = (e) => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    if (e.target.innerText === "FINISH") {
      if (captchaState === true) {
        router.push("/newsletter");
      }
      updateShowModal(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone&apos;s actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const onChange = (e) => {
    const newFormData = { ...formDataState, [e.target.id]: e.target.value };
    dispatch(setFormDataState(newFormData));
  };

  const onChangeCaptcha = async (value) => {
    const response = await fetch("/api/captchaVerify", {
      method: "POST",
      body: JSON.stringify({
        value,
      }),
    }).then((res) => res.json());
    if (response?.success === true) {
      dispatch(setCaptchaState(true));
      router.push("/newsletter");
    }
  };
  const handleClose = () => {
    updateShowModal(false);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      <div className={styles.title}>Newsletter Generator</div>
      <div className={styles.tagline}>
        nujen v1 will generate a newsletter for your brand community, based on
        specific tweets you&apos;ve liked.
      </div>
      <br />
      <br />
      <Box sx={{ width: "100%" }}>
        {!captchaState && (
          <Modal open={showModal} onClose={handleClose}>
            <div className={styles.modalStyle}>
              <ReCAPTCHA
                sitekey={process.env.SITE_KEY}
                onChange={(value) => onChangeCaptcha(value)}
              />
            </div>
          </Modal>
        )}
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {activeStep === 0 && (
              <div className={styles.stepperContainer}>
                <h1>About the Author</h1>
                <br />
                <TextField
                  onChange={onChange}
                  id="firstName"
                  label="First Name"
                  placeholder="Farza"
                  variant="outlined"
                  sx={textInputSx}
                  defaultValue={formDataState?.firstName || ""}
                />
                <TextField
                  onChange={onChange}
                  id="email"
                  label="Email"
                  placeholder="farza@gmail.com"
                  variant="outlined"
                  sx={textInputSx}
                  defaultValue={formDataState?.email || ""}
                />
                <TextField
                  onChange={onChange}
                  id="twitterHandle"
                  label="Your Twitter Handle"
                  placeholder="FarzaTV"
                  variant="outlined"
                  sx={textInputSx}
                  defaultValue={formDataState?.twitterHandle || ""}
                />
                <TextField
                  onChange={onChange}
                  id="title"
                  label="Title"
                  placeholder="Founder"
                  variant="outlined"
                  sx={textInputSx}
                  defaultValue={formDataState?.title || ""}
                />
                <TextField
                  onChange={onChange}
                  id="company"
                  label="Company Name"
                  placeholder="buildspace"
                  variant="outlined"
                  sx={textInputSx}
                  defaultValue={formDataState?.company || ""}
                />
              </div>
            )}
            {activeStep === 1 && (
              <div className={styles.stepperContainer}>
                <div>
                  <h2>
                    What&apos;s the specific, unique and disputable purpose of
                    the newsletter?
                  </h2>
                  <br />
                  A specific, unique and disputable purpose can help you make
                  decisions about the newsletter.
                  <br />
                  <br />
                  To help you find it, first - <i>try zooming out</i>. Once you
                  find a high-level answer, keep asking WHY until you hit a
                  belief or value.
                  <br />
                  <br />
                  <b>For example</b> - let's say <u>Farza</u> is writing a newsletter.
                  <br />
                  <br />
                  <b>Newsletter type:</b> Weekly Digest
                  <br />
                  <br />
                  <b>
                    Your purpose is a category (i.e., you don’t have a purpose):
                  </b>{" "}
                  To help n&w s2 members learn about other members.
                  <br />
                  <br />
                  🤔 <i>WHY help members learn about one another?</i>
                  <br />
                  <br />
                  <b>Basic, boring purpose, but at least you’re trying: </b>
                  We want n&w s2 members to learn about projects, wins, learnings, or
                  opportunities that other members are experiencing.
                  <br />
                  <br />
                  🤔 <i>WHY do you want that?</i>
                  <br />
                  <br />
                  <b>
                    Your purpose is specific, unique, and disputable (multiple
                    alternatives):
                  </b>{" "}
                  To inspire n&w s2 members to keep building, launching,
                  measuring and learning - so that we can all win together.
                  <br />
                  <br />
                  <i>That&apos;s more like it. Now it&apos;s your turn!</i>
                  <br />
                  <br />
                </div>
                <TextField
                  onChange={onChange}
                  id="purpose"
                  label="Specific, Unique & Disputable Purpose"
                  placeholder="To inspire n&w s2 members to keep building, launching, measuring and learning - so that we can all win together."
                  variant="outlined"
                  rows={2}
                  multiline
                  sx={multiLineTextInputSx}
                  defaultValue={formDataState?.purpose || ""}
                />
                <br />
                <h2>Who&apos;s the newsletter for?</h2>
                <br />
                Be very specific.
                <br />
                <br />
                <TextField
                  onChange={onChange}
                  id="readers"
                  label="Very specific set of readers"
                  placeholder="Members of Nights & Weekend Season 2"
                  variant="outlined"
                  rows={2}
                  multiline
                  sx={textInputSxLong}
                  defaultValue={formDataState?.readers || ""}
                />
                <br />
              </div>
            )}
            {activeStep === 2 && (
              <div className={styles.stepperContainer}>
                <h1>For Nujen</h1>
                <br />
                <h2>How many tweets do you want to feature?</h2>
                <br />
                <TextField
                  onChange={onChange}
                  id="numOfTweets"
                  label="# of Featured Tweets"
                  placeholder="10"
                  variant="outlined"
                  sx={textInputSx}
                  defaultValue={formDataState?.numOfTweets || ""}
                />
                <br />
                <h2>Give a tagline for the list of featured tweets.</h2>
                <br />
                This tagline should include the # of tweets you want us to
                feature. e.g. Top 10 Builds
                <br />
                <br />
                <TextField
                  onChange={onChange}
                  id="tagline"
                  label="Tagline"
                  placeholder="Top 10 Builds"
                  variant="outlined"
                  sx={textInputSx}
                  defaultValue={formDataState?.tagline || ""}
                />
                <br />
                <h2>
                  Share the Twitter hashtag OR company handle that can help us
                  find members to feature.
                </h2>
                <br />
                (For now, you must give one or the other. E.g. #nws2 OR
                @_buildspace)
                <br />
                <br />
                <TextField
                  onChange={onChange}
                  id="keyword"
                  label="Hashtag OR Handle"
                  placeholder="@_buildspace"
                  variant="outlined"
                  sx={textInputSx}
                  defaultValue={formDataState?.keyword || ""}
                />
                <br />
              </div>
            )}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </>
  );
}
