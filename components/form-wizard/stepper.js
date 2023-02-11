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
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {
  selectFormDataState,
  setFormDataState,
} from "../../store/formDataSlice";
import styles from "../../styles/sign-up.module.css";
import {
  selectSubscriptionStatusState,
  setSubscriptionStatusState,
} from "../../store/subscriptionStatusSlice";
import { UserContext } from "../../magic/UserContext";

const steps = ["About You (The Author)", "About the Newsletter", "For nujen"];

const textInputSxLong = {
  backgroundColor: "white",
  marginBottom: "10px",
  width: "70%",
  minWidth: "300px",
  fontFamily: "Nunito Sans",
};

const textInputSx = {
  backgroundColor: "white",
  marginBottom: "10px",
  width: "30%",
  minWidth: "300px",
  fontFamily: "Nunito Sans",
};

const multiLineTextInputSx = {
  backgroundColor: "white",
  marginBottom: "10px",
  width: "70%",
  minWidth: "300px",
  fontFamily: "Nunito Sans",
};

export default function HorizontalLinearStepper() {
  // const [formData, updateFormData] = React.useState({});
  const [user, setUser] = React.useContext(UserContext);
  const [activeStep, setActiveStep] = React.useState(0);
  const [hashtagState, setHashtagState] = React.useState(false);
  const [mentionState, setMentionState] = React.useState(false);
  const [skipped, setSkipped] = React.useState(new Set());
  const [showCaptcha, updateShowCaptcha] = React.useState(false);
  const [showModal, updateShowModal] = React.useState(false);
  const [captchaPass, updateCaptchaPass] = React.useState(false);
  const router = useRouter();
  const captchaState = useSelector(selectCaptchaState);
  const formDataState = useSelector(selectFormDataState);
  const { freeTrial, subscription } = useSelector(
    selectSubscriptionStatusState
  );
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
        //router.push("/newsletter");
      }
      if (freeTrial === "noRecord") {
        fetch("/api/createFreeTrialRecord", {
          method: "POST",
          body: JSON.stringify({
            email: user?.email,
            handle: formDataState?.twitterHandle,
          }),
        });
      }
      router.push("/newsletter");
      //updateShowModal(true);
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
        <b>
          👋 We ask for your info (Twitter handle, email) and details about the
          newsletter so nujen can generate the 1st issue of your newsletter, but
          we won&apos;t share your info with anyone else.
        </b>
      </div>
      <br />
      <br />
      <Box sx={{ width: "100%" }}>
        {/*!captchaState && (
          <Modal open={showModal} onClose={handleClose}>
            <div className={styles.modalStyle}>
              <ReCAPTCHA
                sitekey={process.env.SITE_KEY}
                onChange={(value) => onChangeCaptcha(value)}
              />
            </div>
          </Modal>
        )*/}
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
                  variant="filled"
                  sx={textInputSx}
                  defaultValue={formDataState?.firstName || ""}
                />
                <TextField
                  onChange={onChange}
                  id="email"
                  label="Email"
                  placeholder="farza@gmail.com"
                  variant="filled"
                  sx={textInputSx}
                  defaultValue={formDataState?.email || ""}
                />
                <TextField
                  type="text"
                  onChange={onChange}
                  onKeyDown={(evt) => evt.key === "@" && evt.preventDefault()}
                  id="twitterHandle"
                  label="Your Twitter Handle (No @ symbol)"
                  placeholder="FarzaTV"
                  variant="filled"
                  sx={textInputSx}
                  defaultValue={formDataState?.twitterHandle || ""}
                />
                <TextField
                  onChange={onChange}
                  id="title"
                  label="Title"
                  placeholder="Founder"
                  variant="filled"
                  sx={textInputSx}
                  defaultValue={formDataState?.title || ""}
                />
                <TextField
                  onChange={onChange}
                  id="company"
                  label="Company Name"
                  placeholder="buildspace"
                  variant="filled"
                  sx={textInputSx}
                  defaultValue={formDataState?.company || ""}
                />
              </div>
            )}
            {activeStep === 1 && (
              <div className={styles.stepperContainer}>
                <div>
                  <h2>Who&apos;s the newsletter for?</h2>
                  Be very specific. For example:{" "}
                  <i>Members of Nights & Weekend Season 2.</i>
                  <br />
                  <br />
                  <TextField
                    onChange={onChange}
                    id="readers"
                    label="Very specific set of readers"
                    placeholder="Members of Nights & Weekend Season 2"
                    variant="filled"
                    rows={2}
                    multiline
                    sx={textInputSxLong}
                    defaultValue={formDataState?.readers || ""}
                  />
                  <br />
                  <h2>
                    What&apos;s the specific, unique and disputable purpose of
                    the newsletter?
                  </h2>
                  Find a purpose for your newsletter by zooming out and asking
                  WHY until you hit a belief or value. For example, a purpose
                  for a weekly digest could be:{" "}
                  <i>
                    To inspire n&w s2 members to keep building, launching,
                    measuring and learning - so that we can all win together.
                  </i>
                  <br />
                  <br />
                </div>
                <TextField
                  onChange={onChange}
                  id="purpose"
                  label="Specific, Unique & Disputable Purpose"
                  placeholder="To inspire n&w s2 members to keep building, launching, measuring and learning - so that we can all win together."
                  variant="filled"
                  rows={2}
                  multiline
                  sx={multiLineTextInputSx}
                  defaultValue={formDataState?.purpose || ""}
                />
                <br />
              </div>
            )}
            {activeStep === 2 && (
              <div className={styles.stepperContainer}>
                <h1>For nujen</h1>
                <br />
                <h2>How many tweets do you want nujen to inspect?</h2>
                <br />
                <b>Note: We recommend 1-10.</b>
                <br />
                <TextField
                  onChange={onChange}
                  id="numOfTweets"
                  label="# of Featured Tweets"
                  placeholder="10"
                  variant="filled"
                  sx={textInputSx}
                  defaultValue={formDataState?.numOfTweets || ""}
                />
                <br />
                <h2>How can nujen find these tweets?</h2>
                <br />
                <FormGroup
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => setHashtagState(!hashtagState)}
                      />
                    }
                    label="#hashtag"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => setMentionState(!mentionState)}
                      />
                    }
                    label="@mention"
                  />
                </FormGroup>
                <br />
                {mentionState && (
                  <TextField
                    onChange={onChange}
                    id="mention"
                    label="@mention"
                    placeholder="@_buildspace"
                    variant="filled"
                    sx={textInputSx}
                    defaultValue={formDataState?.mention || ""}
                  />
                )}
                {hashtagState && (
                  <TextField
                    onChange={onChange}
                    id="hashtag"
                    label="#hashtag"
                    placeholder="#nws2"
                    variant="filled"
                    sx={textInputSx}
                    defaultValue={formDataState?.hashtag || ""}
                  />
                )}
                <br />
                <p className={styles.okText}>
                  {mentionState &&
                    !hashtagState &&
                    `✽ OK, we'll look for tweets that mention ${
                      formDataState?.mention || "________"
                    }`}
                  {!mentionState &&
                    hashtagState &&
                    `✽ OK, we'll look for tweets that have hashtag ${
                      formDataState?.hashtag || "________"
                    }`}
                  {mentionState &&
                    hashtagState &&
                    ` ✽ OK, we'll look for tweets that mention ${
                      formDataState?.mention || "________"
                    } AND have hashtag ${formDataState?.hashtag || "________"}`}
                </p>
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
