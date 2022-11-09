import SideBar from './SideBar'

import MaterialTable from 'material-table'
import { ThemeProvider, createTheme } from '@mui/material';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Remove from '@material-ui/icons/Remove'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'
import { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import axios from 'axios'
import { useCookies } from 'react-cookie'

import * as React from 'react';
import TextField from '@mui/material/TextField';

import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

function Main() {

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
    }

    const now = new Date();

    // datetime
    function toLocaleDateString(date) {
        let newDate = date.toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' })
        let time = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        let result = newDate + ' เวลา ' + time + ' น.'
        return (result);
    }


    const [columns, setColumns] = useState([
        { title: 'เลขระเบียน', field: 'id', editable: 'never', hidden: true },
        {
            title: 'กิจกรรม', field: 'name', editComponent: props => (
                <TextField
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                    error={props.error}
                    helperText={props.helperText}
                />),
        },
        {
            title: 'วันเวลา', field: 'when', type: 'datetime', locale: 'th-TH',
            //DD Month YYYY
            render: rowData => rowData.when === undefined ? "" :
                toLocaleDateString(new Date(rowData.when)),
            // new Date(rowData.when).toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' ,hour: '2-digit', minute: '2-digit'}),

            /*  */
            editComponent: props => (

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {/* Th date picker */}
                    <TextField
                        id="datetime-local"
                        label="When"
                        type="datetime-local"
                        sx={{ width: 250 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={props.value === undefined ? now : props.value}
                        onChange={(newValue) => {
                            props.onChange(newValue.target.value);
                        }
                        }
                        renderInput={(params) =>
                            <TextField {...params}
                            />}

                    />
                    {/* < DateTimePicker
                        label="When"
                        locale="th-TH"
                        inputFormat="dd/MM/yyyy HH:mm"
                        pickerHeaderFormat="dd/MMMM/yyyy HH:mm"
                        value={props.value === undefined ? now : props.value}
                        onChange={(newValue) => {
                            props.onChange(newValue);
                        }
                        }
                        renderInput={(params) =>
                            <TextField {...params}
                            />}
                    />  */}
                </LocalizationProvider>
            )
        }
    ])

    const [data, setData] = useState([])
    const defaultMaterialTheme = createTheme()

    let [cookies] = useCookies(['token'])

    //snackbar
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const [openError, setOpenError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState("");
    const [openWarning, setOpenWarning] = React.useState(false);
    const [warningMessage, setWarningMessage] = React.useState("");
    const vertical = 'top';
    const horizontal = 'right';

    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenError(false);
    };
    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
    };
    const handleCloseWarning = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenWarning(false);
    };


    useEffect(() => {
        axios.get(
            'http://localhost:5000/activities',
            { headers: { Authorization: 'Bearer ' + cookies['token'] }, timeout: 10 * 1000 }
        ).then((response) => {
            setData(response.data)
        }).catch((error) => {
            if (error.code === 'ECONNABORTED') {
                console.log('timeout')
            } else {
                console.log(error.response.status)
            }
        })
    }, [])
    
    // font
    const themeFont = createTheme({
        typography: {
            fontFamily: [
                'Kanit',
                'sans-serif',
            ].join(','),
            fontSize: 16,
        },
    });

    return (

        <div id="outer-container">
            <SideBar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
            <Snackbar
                open={openError}
                autoHideDuration={5000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical, horizontal }}
            >
                <Alert
                    onClose={handleCloseError}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    {errorMessage}</Alert>
            </Snackbar>

            <Snackbar
                open={openSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical, horizontal }}
            >
                <Alert
                    onClose={handleCloseSuccess}
                    severity="success"
                    sx={{ width: '100%' }}>
                    {successMessage}</Alert>
            </Snackbar>

            <Snackbar
                open={openWarning}
                autoHideDuration={5000}
                onClose={handleCloseWarning}
                anchorOrigin={{ vertical, horizontal }}
            >
                <Alert
                    onClose={handleCloseWarning}
                    severity="warning"
                    sx={{ width: '100%' }}>
                    {warningMessage}</Alert>
            </Snackbar>
            <div id="page-wrap">
                <ThemeProvider theme={themeFont}>
                    <MaterialTable
                        icons={tableIcons}
                        title={<h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To Do</h1>}
                        columns={columns}
                        data={data}
                        options={{
                            rowStyle: {
                                // fontSize: 18,

                            }
                        }}
                        editable={{
                            onRowAddCancelled: rowData => { /* do nothing */ },
                            onRowUpdateCancelled: rowData => { /* do nothing */ },
                            onRowAdd: newData =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        if (newData.name === '' || newData.name === undefined || newData.when === undefined || newData.when === '' || newData.when === null) {
                                            setWarningMessage("กรุณากรอกข้อมูลให้ครบ")
                                            setOpenWarning(true)
                                            reject()
                                        }
                                        else {
                                            axios.post(
                                                'http://localhost:5000/activities',
                                                { name: newData.name, when: newData.when },
                                                { headers: { Authorization: 'Bearer ' + cookies['token'] }, timeout: 10 * 1000 }
                                            ).then((response) => {
                                                setSuccessMessage("เพิ่มข้อมูลสำเร็จ")
                                                setOpenSuccess(true)
                                                newData.id = response.data.id
                                                console.log(response)
                                                setData([...data, newData])
                                                resolve()
                                            }).catch((error) => {
                                                // if (error.code === 'ECONNABORTED') {
                                                //     console.log('timeout')
                                                // } else {
                                                //     console.log(error.response.status)
                                                // }
                                                setErrorMessage("เพิ่มข้อมูลไม่สำเร็จ")
                                                setOpenError(true)
                                                reject()
                                            })
                                            // resolve();
                                        }

                                    }, 1000);
                                }),
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        if (newData.name === '' || newData.name === undefined || newData.when === undefined || newData.when === '' || newData.when === null) {
                                            setWarningMessage("กรุณากรอกข้อมูลให้ครบ")
                                            setOpenWarning(true)
                                            reject()
                                        }
                                        else {
                                            axios.put(
                                                'http://localhost:5000/activities/' + oldData.id,
                                                { name: newData.name, when: newData.when },
                                                { headers: { Authorization: 'Bearer ' + cookies['token'] }, timeout: 10 * 1000 }
                                            ).then((response) => {
                                                const dataUpdate = [...data];
                                                const index = oldData.tableData.id;
                                                dataUpdate[index] = newData;
                                                setData([...dataUpdate]);
                                                setSuccessMessage("แก้ไขข้อมูลสำเร็จ")
                                                setOpenSuccess(true)
                                                setData([...dataUpdate]);
                                                resolve()
                                            }).catch((error) => {
                                                // if (error.code === 'ECONNABORTED') {
                                                //     console.log('timeout')
                                                // } else {
                                                //     console.log(error.response.status)
                                                // }
                                                setErrorMessage("ไม่สามารถแก้ไขข้อมูลได้")
                                                setOpenError(true)
                                                reject()
                                            })
                                            // resolve();
                                        }

                                    }, 1000);
                                }),
                            onRowDelete: oldData =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        axios.delete(
                                            'http://localhost:5000/activities/' + oldData.id,
                                            { headers: { Authorization: 'Bearer ' + cookies['token'] }, timeout: 10 * 1000 }
                                        ).then((response) => {
                                            const dataDelete = [...data];
                                            const index = oldData.tableData.id;
                                            dataDelete.splice(index, 1);
                                            setData([...dataDelete]);
                                            setOpenSuccess(true)
                                            setData([...dataDelete]);
                                            setSuccessMessage("ลบข้อมูลสำเร็จ")
                                            setOpenSuccess(true)
                                            resolve()
                                        }).catch((error) => {
                                            // if (error.code === 'ECONNABORTED') {
                                            //     console.log('timeout')
                                            // } else {
                                            //     console.log(error.response.status)
                                            // }
                                            setErrorMessage("ไม่สามารถลบข้อมูลได้")
                                            setOpenError(true)
                                            reject()
                                        })
                                        // resolve();
                                    }, 1000);
                                })
                        }}
                    />
                </ThemeProvider>
            </div>
        </div>
    )
}

export default Main