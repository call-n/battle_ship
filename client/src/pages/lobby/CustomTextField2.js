import {styled, TextField,} from "@mui/material";

const CustomTextField2 = styled(TextField)`

  label, p {
    color: #1976d2;
  }

  div {
    :before, :before:hover {
      border-bottom-color: white;
    }
    input {
      color: white;

    }
  }
`;




export  default CustomTextField2;