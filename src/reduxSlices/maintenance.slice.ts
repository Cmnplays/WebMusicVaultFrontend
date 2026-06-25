import { StatusCode } from "@/constants/StatusCode";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Maintenance {
  isUnderMaintenance: boolean;
  message: string;
  code: StatusCode;
}

const initialState: Maintenance = {
  isUnderMaintenance: false,
  message: "",
  code: StatusCode.OK,
};

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    enableMaintenance: (state, action: PayloadAction<{ message: string }>) => {
      state.isUnderMaintenance = true;
      state.message = action.payload.message;
    },
    disableMaintenance: (state) => {
      state.isUnderMaintenance = false;
    },
  },
});

const { enableMaintenance, disableMaintenance } = maintenanceSlice.actions;
export { enableMaintenance, disableMaintenance };
export default maintenanceSlice.reducer;
