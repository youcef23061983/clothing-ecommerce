import { Box, Typography } from "@mui/material";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
            {title}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle progress={progress} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: "green" }}>
          {subtitle}
        </Typography>
        <Typography variant="h5" fontStyle="italic" sx={{ color: "green" }}>
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
