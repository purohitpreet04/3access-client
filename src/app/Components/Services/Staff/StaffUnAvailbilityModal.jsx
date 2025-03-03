import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { transferWork } from "@app/API/StaffAction";
import moment from "moment";

const TransferWorkDialog = ({ open, onClose, onSubmit, data }) => {
    const dispatch = useDispatch()
    const formik = useFormik({
        initialValues: {
            staffId: data?._id,
            newStaffId: "",
            status: "",
            unavailableFrom: "",
            unavailableTo: "",
            reason: "",
            taskDescription: "",
        },
        validationSchema: Yup.object({
            // staffId: Yup.string().required("Select the staff member"),
            newStaffId: Yup.string().required("Select the replacement staff"),
            status: Yup.string().oneOf(["holiday", "ill", "fired"]).required("Required"),
            unavailableFrom: Yup.date().required("Start date is required"),
            unavailableTo: Yup.date().required("End date is required"),
            reason: Yup.string().required("Provide a reason"),
            taskDescription: Yup.string().required("Task description is required"),
        }),
        onSubmit: async (values) => {
            let modifiedVal = {
                unavailableTo: moment(values?.unavailableTo).toISOString(),
                unavailableFrom: moment(values?.unavailableFrom).toISOString(),
                ...values
            }
            await dispatch(transferWork({ modifiedVal }))
        },
    });
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Transfer Staff Work</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    {/* Staff Selection */}
                    {/* <TextField
                        select
                        fullWidth
                        margin="dense"
                        label="Select Staff to Transfer Work From"
                        {...formik.getFieldProps("staffId")}
                        error={formik.touched.staffId && Boolean(formik.errors.staffId)}
                        helperText={formik.touched.staffId && formik.errors.staffId}
                    >
                        {data?.staffList.length > 0 && data?.staffList.map((staff) => (
                            <MenuItem key={staff._id} value={staff._id}>
                                {staff.fname} {staff.lname}
                            </MenuItem>
                        ))}
                    </TextField> */}

                    {/* New Staff Selection */}
                    <TextField
                        select
                        fullWidth
                        margin="dense"
                        label="Select Replacement Staff"
                        {...formik.getFieldProps("newStaffId")}
                        error={formik.touched.newStaffId && Boolean(formik.errors.newStaffId)}
                        helperText={formik.touched.newStaffId && formik.errors.newStaffId}
                    >
                        {data?.staffList.length > 0 && data?.staffList.map((staff) => (
                            <MenuItem key={staff._id} value={staff._id}>
                                {staff.fname} {staff.lname}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Status */}
                    <TextField
                        select
                        fullWidth
                        margin="dense"
                        label="Status"
                        {...formik.getFieldProps("status")}
                        error={formik.touched.status && Boolean(formik.errors.status)}
                        helperText={formik.touched.status && formik.errors.status}
                    >
                        {[{ val: "holiday", lab: 'Holiday' }, { val: "ill", lab: 'Illness' }, { val: "fired", lab: "Fired" }].map((status, i) => (
                            <MenuItem key={i} value={status?.val}>
                                {status?.lab}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Dates */}
                    {formik?.values?.status !== '' && formik?.values?.status !== 'fired' && <TextField
                        fullWidth
                        margin="dense"
                        label="Unavailable From"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        {...formik.getFieldProps("unavailableFrom")}
                        error={formik.touched.unavailableFrom && Boolean(formik.errors.unavailableFrom)}
                        helperText={formik.touched.unavailableFrom && formik.errors.unavailableFrom}
                    />}

                    {formik?.values?.status !== '' && formik?.values?.status !== 'fired' && <TextField
                        fullWidth
                        margin="dense"
                        label="Unavailable To"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        {...formik.getFieldProps("unavailableTo")}
                        error={formik.touched.unavailableTo && Boolean(formik.errors.unavailableTo)}
                        helperText={formik.touched.unavailableTo && formik.errors.unavailableTo}
                    />}

                    {/* Reason */}
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Reason"
                        multiline
                        rows={2}
                        {...formik.getFieldProps("reason")}
                        error={formik.touched.reason && Boolean(formik.errors.reason)}
                        helperText={formik.touched.reason && formik.errors.reason}
                    />

                    {/* Task Description */}
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Task Description"
                        multiline
                        rows={3}
                        {...formik.getFieldProps("taskDescription")}
                        error={formik.touched.taskDescription && Boolean(formik.errors.taskDescription)}
                        helperText={formik.touched.taskDescription && formik.errors.taskDescription}
                    />
                </form>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={formik.handleSubmit} color="primary" >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TransferWorkDialog;
