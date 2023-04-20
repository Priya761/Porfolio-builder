import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Stats from "./Stats";
import BottomButton from "./BottomButton";
import MuiAccordion from "@mui/material/Accordion";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function ProjectDetails() {
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [values, setValues] = useState([{}]);

  const userData = useSelector((state) => state.user.resume.projects);

  console.log(userData, values);

  useEffect(() => {
    setValues(userData);
  }, [userData]);

  const handleAddNewInput = () => {
    setValues([...values, {}]);
  };

  const handleDeleteInput = (index) => {
    const updatedValues = [...values];
    updatedValues.splice(index, 1);
    setValues(updatedValues);
  };

  const handleInputChange = (index, event) => {
    console.log(values);
    const { name, value } = event.target;
    const updatedValues = [...values];
    updatedValues[index][name] = value;
    setValues(updatedValues);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios
        .post(
          "http://localhost:4000/projects",
          { projects: values },
          {
            headers: {
              authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAMTIzLmNvbSIsImlhdCI6MTY4MTU3NDQwMX0.lRN2u05joZT8ZKi6CYqvafxytZli-HdnVlvM_K0VGMU",
            },
          }
        )
        .then((response) => {
          console.log(`Welcome back, ${response}`);
          window.location.pathname = "/education";
        });
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Project details</Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider>
                <Typography variant="body2">Section 4</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "end" }}>
              {values.length < 5 && (
                <Button
                  onClick={handleAddNewInput}
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              )}
            </Grid>
            {values.map((data, idx) => (
              <Grid item xs={12} key={idx}>
                <Accordion
                  expanded={expanded === `panel${idx + 1}`}
                  onChange={handleChange(`panel${idx + 1}`)}
                >
                  <AccordionSummary
                    aria-controls={`panel${idx + 1}d-content`}
                    id={`panel${idx + 1}d-header`}
                  >
                    <Box sx={{ display: "flex", width: "100%" }}>
                      <Typography sx={{ flex: 1, alignSelf: "center" }}>
                        {`Project ${idx + 1}`}
                      </Typography>
                      {values.length > 1 && (
                        <IconButton onClick={() => handleDeleteInput(idx)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          name="name"
                          label="Title"
                          size="small"
                          fullWidth
                          value={data.name || ""}
                          onChange={(e) => handleInputChange(idx, e)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          name="from"
                          label="From"
                          size="small"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={data.from || ""}
                          onChange={(e) => handleInputChange(idx, e)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          name="to"
                          label="To"
                          size="small"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={data.to || ""}
                          onChange={(e) => handleInputChange(idx, e)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="description"
                          label="Description"
                          size="small"
                          fullWidth
                          multiline
                          rows={3}
                          value={data.description || ""}
                          onChange={(e) => handleInputChange(idx, e)}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}

            <Grid item xs={12}>
              <BottomButton
                nextSubmit={handleOnSubmit}
                prevLink="/experience"
                nextLink="/education"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
        <Stats value={60} />
      </Grid>
    </Container>
  );
}

export default ProjectDetails;
