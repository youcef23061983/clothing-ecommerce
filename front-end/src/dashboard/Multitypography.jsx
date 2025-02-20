// *********************this mui tools course*******************

import React, { useState } from "react";
import {
  Button,
  Stack,
  IconButton,
  ToggleButtonGroup,
  ButtonGroup,
  TextField,
  ToggleButton,
  InputAdornment,
  Box,
  MenuItem,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormGroup,
  Switch,
  Rating,
  Autocomplete,
  Grid,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FavoriteBoderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Multitypography = () => {
  const [country, setCountry] = useState("");
  const [value, setValue] = useState("");
  const [check, setCheck] = useState(false);
  const [skills, setSkills] = useState({ html: "", css: "", javascript: "" });
  const [swit, setSwit] = useState(false);
  const [rate, setRate] = useState(false);
  const [front, setFront] = useState("");

  const frontend = ["html", "css", "javascript", "react"];

  const handle = (e) => {
    const { checked } = e.target;
    setSkills((prev) => ({
      ...prev,
      checked,
    }));
  };
  return (
    <div>
      <Stack spacing={2} direction="row" display="flex">
        <Button variant="disabled" color="error">
          blue
        </Button>
        <Button variant="text" href="https://google.com" color="error">
          google{" "}
        </Button>
        <Button variant="outlined" color="error" size="small">
          blue
        </Button>{" "}
        <Button variant="contained" color="success" size="large">
          blue
        </Button>{" "}
        <Button variant="disabled" color="primary">
          blue
        </Button>{" "}
        <Button
          variant="contained"
          color="info"
          startIcon={<SendRoundedIcon />}
        >
          send
        </Button>
        <IconButton>
          <SendRoundedIcon />
        </IconButton>
      </Stack>
      <Stack direction="row">
        <ButtonGroup variant="text" orientation="vertical" size="small">
          <Button color="error" onClick={() => alert("danger is on the left")}>
            left
          </Button>
          <Button color="success">center</Button>
          <Button color="secondary">right</Button>
        </ButtonGroup>
      </Stack>
      <Stack>
        <ToggleButtonGroup aria-label="text formatting">
          <ToggleButton value="italic">
            <FormatItalicIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Stack spacing={4}>
        <Stack direction="row" spacing={2}>
          <TextField label="name" variant="filled" type="password" disabled />
          <TextField label="name" variant="outlined" />
          <TextField
            label="name"
            variant="outlined"
            size="large"
            color="success"
            required
            helperText="do not share your info"
          />
          <TextField
            label="fill name"
            variant="standard"
            size="small"
            color="secondary"
          />
        </Stack>
      </Stack>
      <Stack spacing={4} direction="row">
        <TextField
          label="Amount"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">kg</InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="Amount"
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            },
          }}
          endAdornment={<InputAdornment position="end">kg</InputAdornment>}
        />
      </Stack>
      <Box width="300px">
        <TextField
          label="select country"
          select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          fullWidth
        >
          <MenuItem value="india">india</MenuItem>
          <MenuItem value="usa">usa</MenuItem>
          <MenuItem value="au">australia</MenuItem>
        </TextField>
      </Box>
      <Box>
        <FormControl>
          <FormLabel id="job-experience-group-label">
            years of experience
          </FormLabel>
          <RadioGroup
            name="job-experience-group"
            aria-labelledby="job-experience-group-label"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            <FormControlLabel control={<Radio />} label="0-2" value="0-2" />
            <FormControlLabel control={<Radio />} label="3-5" value="3-5" />
            <FormControlLabel control={<Radio />} label="6-10" value="6-10" />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box>
        <FormControlLabel
          label="i accept terms and conditions"
          control={
            <Checkbox
              checked={check}
              onChange={(e) => setCheck(e.target.checked)}
            />
          }
        />
      </Box>
      <Box>
        <FormControl>
          <FormLabel>skills</FormLabel>
          <FormGroup>
            <FormControlLabel
              label="Html"
              control={
                <Checkbox
                  value="html"
                  checked={skills.html}
                  onChange={handle}
                />
              }
            />
            <FormControlLabel
              label="CSS"
              control={
                <Checkbox value="css" checked={skills.css} onChange={handle} />
              }
            />
            <FormControlLabel
              label="JAVASCRIPT"
              control={
                <Checkbox
                  value="javascript"
                  checked={skills.javascript}
                  onChange={handle}
                />
              }
            />
          </FormGroup>
        </FormControl>
      </Box>
      <Box>
        <FormControlLabel
          label="dark mode"
          control={
            <Switch
              checked={swit}
              onChange={(e) => setSwit(e.target.checked)}
              size="small"
              color="success"
            />
          }
        />
      </Box>
      <Stack spacing={2}>
        <Rating
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          precision="0.5"
        />
        <Rating
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          precision="0.5"
          size="large"
          icon={<FavoriteIcon fontSize="inherit" color="error" />}
          emptyIcon={<FavoriteBoderIcon fontSize="inherit" />}
        />
      </Stack>
      <Stack>
        <Autocomplete
          options={frontend}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="skill" />}
          value={front}
          onChange={(e) => setFront(e.target.value)}
          freeSolo
        />
      </Stack>
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          height: "100px",
          width: "100px",
          padding: "2px",
          "&:hover": {
            backgroundColor: "primary.light",
          },
        }}
      >
        hi
      </Box>
      <Box
        display="flex"
        height="100px"
        width="100px"
        bgcolor="red"
        padding="2px"
      ></Box>
      <Grid></Grid>
    </div>
  );
};

export default Multitypography;
