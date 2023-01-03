import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import ReCAPTCHA from "react-google-recaptcha";
import { style } from '@mui/system';
import { useRouter } from 'next/router'
import styles from '../../styles/sign-up.module.css'


const isMobile = !!navigator.userAgent.match(/iphone|android|blackberry/ig) || false;
const steps = ['Personal Info', 'Newsletter', 'Last Stuff'];

const textInputSx = {
    backgroundColor: 'white',
    marginBottom: '10px',
    width: '30%',
    minWidth: '300px',

}

export default function HorizontalLinearStepper() {
  const [formData, updateFormData] = React.useState({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [showCaptcha, updateShowCaptcha] = React.useState(false);
  const [showModal, updateShowModal] = React.useState(false);
  const router = useRouter()

  const isStepOptional = (step) => {
    return step === 1;
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
    if (e.target.innerText === 'FINISH') {
      if (isMobile) {
        router.push('/newsletter')
      } else {
        updateShowModal(true)
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const onChange= (e) => {
    const newFormData = { ...formData, [e.target.id]: e.target.value }
    updateFormData(newFormData)
  }

  const onChangeCaptcha = (value) => {
      if (value) {
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
        { showModal && (
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
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            { activeStep === 0 &&  (
              <div className={styles.stepperContainer}>
                <TextField onChange={onChange} id="firstName" label="First Name" variant="outlined" sx={textInputSx}/>
                <TextField onChange={onChange} id="lastName" label="Last Name" variant="outlined" sx={textInputSx}/>
              </div>
            )}
            { activeStep === 1 &&  (
              <div className={styles.stepperContainer}>
                <TextField onChange={onChange} id="Other1" label="Other" variant="outlined" sx={textInputSx}/>
                <TextField onChange={onChange} id="Other2" label="Other" variant="outlined" sx={textInputSx}/>
              </div>
            )}
            { activeStep === 2 &&  (
              <div className={styles.stepperContainer}>
                <TextField onChange={onChange} id="End1" label="End" variant="outlined" sx={textInputSx}/>
                <TextField onChange={onChange} id="End2" label="End1" variant="outlined" sx={textInputSx}/>
              </div>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </>
  );
}