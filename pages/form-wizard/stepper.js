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
import styles from "../../styles/sign-up.module.css";

const steps = [
  "About You",
  "About the Author",
  "About the Company",
  "Intro to Nujen",
  "Foundations",
  "Community",
  "Learn & Celebrate",
];

const textInputSx = {
  backgroundColor: "white",
  marginBottom: "10px",
  width: "30%",
  minWidth: "300px",
};

export default function HorizontalLinearStepper() {
  const [formData, updateFormData] = React.useState({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [showCaptcha, updateShowCaptcha] = React.useState(false);
  const [showModal, updateShowModal] = React.useState(false);
  const [captchaPass, updateCaptchaPass] = React.useState(false);
  const router = useRouter();
  const captchaState = useSelector(selectCaptchaState);
  const dispatch = useDispatch();
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
    const newFormData = { ...formData, [e.target.id]: e.target.value };
    updateFormData(newFormData);
  };

  const onChangeCaptcha = async (value) => {
    const response = await fetch('/api/captchaVerify', {
      method: 'POST',
      body: JSON.stringify({
        value
      })
    }).then(res => res.json())
      if (response?.success === true) {
        dispatch(setCaptchaState(true))
        router.push('/newsletter')
      }
  }
  const handleClose = () => {
    updateShowModal(false);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
    <div className={styles.title}>
      Newsletter Generator
    </div>
      <Box sx={{ width: '100%' }}>
        { !captchaState && (
          <Modal
            open={showModal}
            onClose={handleClose}
          >
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
                <h1>About You</h1>
                <br />
                <TextField
                  onChange={onChange}
                  id="email"
                  label="Email"
                  variant="outlined"
                  sx={textInputSx}
                />
              </div>
            )}
            {activeStep === 1 && (
              <div className={styles.stepperContainer}>
                <h1>About the Author</h1>
                <br />
                <TextField
                  onChange={onChange}
                  id="firstName"
                  label="First Name"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="lastName"
                  label="Last Name"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="twitterHandle"
                  label="Twitter Handle"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="ethnicity"
                  label="Ethnicity"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="gender"
                  label="Gender"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="autobiography"
                  label="1-Paragraph Autobiography"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="obsessions"
                  label="1-2 Obsessions"
                  variant="outlined"
                  sx={textInputSx}
                />
              </div>
            )}
            {activeStep === 2 && (
              <div className={styles.stepperContainer}>
                <h1>About the Company</h1>
                <br />
                <TextField
                  onChange={onChange}
                  id="company"
                  label="Company Name"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="companyTwitterHandle"
                  label="Company Twitter Handle"
                  variant="outlined"
                  sx={textInputSx}
                />
              </div>
            )}
            {activeStep === 3 && (
              <div className={styles.stepperContainer}>
                <h1>Intro to Nujen</h1>
                <i>WHOO! You&apos;re almost there.</i>
                <br />
                Just a heads up - for now, the format of Nujen Newsletters is as
                follows:
                <br />
                <br />
                <b>1. Quick Letter from the Author</b>
                <b>2. Community updates</b>
                <b>3. 3-2-1 (Learn, Celebrate & do)</b>
                <br />
                The ability to customize the format is part of our roadmap 😌.
                <br />
                <br />
                Alrighty. Next, we&apos;re going to ask you questions to help us
                build your FIRST EVER Nujen Newsletter using this format. Lfg.
              </div>
            )}
            {activeStep === 4 && (
              <div className={styles.stepperContainer}>
                <div>
                  <h2>
                    What&apos;s the specific, unique and disputable purpose of the
                    newsletter?
                  </h2>
                  <br />
                  A specific, unique and disputable purpose can help you make
                  decisions about the newsletter.
                  <br />
                  <br />
                  To help you find it, first - <i>try zooming out</i>. Once you
                  find a high-level answer, keep asking WHY until you hit a belief or
                  value.
                  <br />
                  <br />
                  For example - I’m writing a newsletter for the WOMEN IN WEB3
                  brand community.
                  <br />
                  <br />
                  <b>Newsletter type:</b> Weekly Digest
                  <br />
                  <br />
                  <b>
                    Your purpose is a category (i.e., you don’t have a purpose):
                  </b>{" "}
                  To share updates.
                  <br />
                  <br />
                  🤔 <i>WHY share updates?</i>
                  <br />
                  <br />
                  <b>Basic, boring purpose, but at least you’re trying:</b> To
                  keep the community in the loop and engaged.
                  <br />
                  <br />
                  🤔 <i>WHY keep the community in the loop and engaged?</i>
                  <br />
                  <br />
                  <b>
                    Your purpose is specific, unique, and disputable (multiple
                    alternatives):
                  </b>{" "}
                  To use a weekly newsletter to bring web3 and WOMEN IN WEB3
                  updates to passionate members of the community in an
                  accessible way, so that women aren’t left behind in this
                  internet revolution.
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
                  variant="outlined"
                  sx={textInputSx}
                />
                <br />
                <h2>Who&apos;s the newsletter for?</h2>
                <br />
                <i>Be very specific.</i>
                <br />
                e.g. Prospective or existing members, partners, sponsors and
                allies of WOMEN IN WEB3.
                <br />
                <br />
                <TextField
                  onChange={onChange}
                  id="readers"
                  label="Readers"
                  variant="outlined"
                  sx={textInputSx}
                />
                <br />
                <h2>Share the newsletter&apos;s 1st topic.</h2>
                <br />
                e.g. Entrepreneurship
                <br />
                <br />
                <TextField
                  onChange={onChange}
                  id="topic1"
                  label="Topic #1"
                  variant="outlined"
                  sx={textInputSx}
                />
                <br />
                <h2>Share the newsletter&apos;s 2nd topic.</h2>
                <br />
                e.g. Venturing with Compassion
                <br />
                <br />
                <TextField
                  onChange={onChange}
                  id="topic2"
                  label="Topic #2"
                  variant="outlined"
                  sx={textInputSx}
                />
                <br />
                <h2>Share the newsletter&apos;s 3rd topic.</h2>
                <br />
                e.g. Web3
                <br />
                <br />
                <TextField
                  onChange={onChange}
                  id="topic3"
                  label="Topic #3"
                  variant="outlined"
                  sx={textInputSx}
                />
              </div>
            )}
            {activeStep === 5 && (
              <div className={styles.stepperContainer}>
                <h1>Community Updates</h1>
                Where you&apos;ll be sharing updates about the community. For
                example:
                <br />
                <br />
                <h3>Title 👇</h3>
                <i>Events</i>
                <br />
                <h3>Info 👇</h3>
                <i>
                  There are several events coming up! Tea Time is on Saturday,
                  January 14th, 2023 at 8am PT. Agenda: Warm-up, Q1 Roadmap, and
                  Open Floor. We&apos;ll be meeting on Discord. Podcast Club is on
                  Wednesday, January 11th, 2023 at 10am PT. We&apos;ll be discussing
                  a Seed Club episode. we&apos;ll also be meeting on Discord.
                </i>
                <br />
                <b>
                  Note: No need to worry too much about copy - we&apos;ll make it
                  enticing for your readers!
                </b>
                <br />
                <h2>Section 1</h2>
                <TextField
                  onChange={onChange}
                  id="communityS1Title"
                  label="Title"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="communityS1Info"
                  label="Info"
                  variant="outlined"
                  sx={textInputSx}
                />
                <br />
                <h2>Section 2</h2>
                <TextField
                  onChange={onChange}
                  id="communityS2Title"
                  label="Title"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="communityS2Info"
                  label="Info"
                  variant="outlined"
                  sx={textInputSx}
                />
                <br />
                <h2>Section 3</h2>
                <TextField
                  onChange={onChange}
                  id="communityS3Title"
                  label="Title"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="communityS3Info"
                  label="Info"
                  variant="outlined"
                  sx={textInputSx}
                />
                <br />
              </div>
            )}
            {activeStep === 6 && (
              <div className={styles.stepperContainer}>
                <h1>Learn & Celebrate</h1>
                <br />
                <h2>Learn</h2>
                <br />
                Share 3 articles related to your topics: {formData.topic1},{" "}
                {formData.topic2}, & {formData.topic3}.
                <br />
                <br />
                <h3>Article #1</h3>
                <TextField
                  onChange={onChange}
                  id="article1Title"
                  label="Title"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="article1Author"
                  label="Author"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="article1Link"
                  label="URL"
                  variant="outlined"
                  sx={textInputSx}
                />
                <br />
                <h3>Article #2</h3>
                <TextField
                  onChange={onChange}
                  id="article2Title"
                  label="Title"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="article2Author"
                  label="Author"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="article2Link"
                  label="URL"
                  variant="outlined"
                  sx={textInputSx}
                />
                <br />
                <h3>Article #3</h3>
                <TextField
                  onChange={onChange}
                  id="article3Title"
                  label="Title"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="article3Author"
                  label="Author"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="article3Link"
                  label="URL"
                  variant="outlined"
                  sx={textInputSx}
                />
                <br />
                <h2>Celebrate</h2>
                <br />
                Share two community members to acknowledge and celebrate.
                <br />
                <br />
                <h3>Member #1</h3>
                <TextField
                  onChange={onChange}
                  id="member1Name"
                  label="Member&apos;s First Name"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="member1TwitterHandle"
                  label="Member&apos;s Twitter Handle"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="member1Contribution"
                  label="Member&apos;s Contribution"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="member1Impact"
                  label="Member&apos;s Impact"
                  variant="outlined"
                  sx={textInputSx}
                />
                <br />
                <h3>Member #2</h3>
                <TextField
                  onChange={onChange}
                  id="member2Name"
                  label="Member&apos;s First Name"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="member2TwitterHandle"
                  label="Member&apos;s Twitter Handle"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="member2Contribution"
                  label="Member&apos;s Contribution"
                  variant="outlined"
                  sx={textInputSx}
                />
                <TextField
                  onChange={onChange}
                  id="member2Impact"
                  label="Member&apos;s Impact"
                  variant="outlined"
                  sx={textInputSx}
                />
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
