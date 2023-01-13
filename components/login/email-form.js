import { useState } from 'react';
import Button from '@mui/material/Button';
import styles from '../../styles/login.module.css';
import TextField from "@mui/material/TextField";

const EmailForm = ({ onEmailSubmit, disabled }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    onEmailSubmit(email);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.emailForm}>
        <h3 className='form-header'>Login</h3>
        <div className='input-wrapper'>
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            placeholder="Enter your email"
            variant="outlined"
          />
        </div>
        <div>
          <Button
          sx={{
            padding: '10px'
          }}
            disabled={disabled}
            onClick={handleSubmit}
          >
            Send Magic Link
          </Button>
        </div>
      </form>
      <style jsx>{`
        form,
        label {
          display: flex;
          flex-flow: column;
          text-align: center;
        }
        .form-header {
          font-size: 22px;
          margin: 25px 0;
        }
        .input-wrapper {
          width: 80%;
          margin: 0 auto 20px;
        }
      `}</style>
    </>
  );
};

export default EmailForm;